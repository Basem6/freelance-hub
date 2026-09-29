//core
import { useEffect,useState } from 'react';
//redux
import { updateUser } from '@/app/lib/Features/authSlice';
import { useAppDispatch } from '@/app/lib/hooks';
//utils
import axios from 'axios';
import  {compressImage} from "@/app/utils/compressImage";
//ui
import {Camera} from 'lucide-react'
import { InputGroup } from '@/components/ui/InputGroup';
import Loader from "@/components/ui/Loader"
import OptionSelect from '@/components/ui/OptionSelect';
import { countryOptions } from '@/app/lib/constants/countryOptions';

export default function ProfileTab({ user }) {
const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const dispatch = useAppDispatch();
const [loading  , setloading] = useState(false)
const [image, setImage] = useState(null);
const [preview, setPreview] = useState(user.image ||"/avatars/avatar-1.png");
const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    age: user?.age || '',
    password: user?.password || '',
    country: user?.country||'USA',
    phone: user?.phone||'',
});
useEffect(() => {
    if (isUploading) {
    document.body.style.overflow = "hidden";
    } else {
    document.body.style.overflow = "";
    }

    return () => {
    document.body.style.overflow = "";
    };
}, [isUploading]);

const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
const handleUpload = async () => {
if (!image) return;

try {
    setIsUploading(true);
    setUploadProgress(0);
    const compressedImage = await compressImage(image);

    console.log("Original size:", image.size);
    console.log("Compressed size:", compressedImage.size);
    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append("file", compressedImage);

    cloudinaryFormData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    cloudinaryFormData,
    {
        onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
            (progressEvent.loaded * 100) /
            progressEvent.total
        );

        setUploadProgress(percent);
        },
    }
    );

    const imageUrl = response.data.secure_url;
    if(user?.image ===imageUrl ){
    return;
    }
    console.log("Cloudinary uploaded:", imageUrl);

    const apiRes = await fetch(
    "/api/backend/api/auth/profile/image",
    {
        method: "PATCH",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        image: imageUrl,
        }),
    }
    );

    const apiText = await apiRes.text();

    let result;

    try {
    result = JSON.parse(apiText);
    } catch {
    throw new Error("استجابة السيرفر غير صحيحة");
    }

    console.log("Image API response:", result);

    if (!apiRes.ok) {
    throw new Error(
        result?.message ||
        `Backend error: ${apiRes.status}`
    );
    }

    if (!result.success) {
    throw new Error(
        result.message ||
        "فشل تحديث الصورة"
    );
    }

    dispatch(
    updateUser({
        image: imageUrl,
    })
    );

    setImage(null);
    setPreview(null);

    setUploadProgress(100);
    console.log("Upload completed:", imageUrl);

} catch (error) {
    console.error("Upload failed:", error);

    setUploadProgress(0);

} finally {
    setIsUploading(false);
}
};
const updateUserProfile = async (updatedData) => {
console.log("FORM DATA:", updatedData);

try {
    if (!updatedData.fullName?.trim()) {
    throw new Error("الاسم مطلوب");
    }

    const age = updatedData.age
    ? Number(updatedData.age)
    : undefined;

    console.log("AGE:", age, typeof age);

    if (
    age !== undefined &&
    (!Number.isInteger(age) || age < 13 || age > 120)
    ) {
    throw new Error("العمر غير صحيح");
    }

    if (updatedData.password && updatedData.password.length < 6) {
    throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    const payload = {
    fullName: updatedData.fullName.trim(),
    age,
    phone: updatedData.phone,
    country: updatedData.country,
    email: updatedData.email,
    };

    if (updatedData.password) {
    payload.password = updatedData.password;
    }

    console.log("PAYLOAD:", payload);

    const res = await fetch("api/backend/ubdate/personal", {
    method: "PATCH",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (!res.ok) {
    throw new Error(
        result.message || `خطأ الخادم: ${res.status}`
    );
    }

    if (!result.success) {
    throw new Error(result.message || "فشل تحديث البيانات");
    }

    dispatch(
    updateUser({
        fullName: updatedData.fullName,
        age,
        phone: updatedData.phone,
        country: updatedData.country,
        email: updatedData.email,
    })
    );

} catch (error) {
    console.error("Update error:", error);
}
};
const onsubmit = async (event) => {
event.preventDefault();
setloading(true)
try {
    if (image) {
    await handleUpload();
    }

    await updateUserProfile(formData);

} catch (error) {
    console.error("Submit error:", error);
    setloading(false)
} finally {
    setloading(false)
}
};
const handleImage = (e) => {  
    setImage(e.target.files[0])
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);;
};
return (
    <div className="bg-white rounded-2xl border-gray-300/60 border p-6 lg:p-8  max-w-full">
    {isUploading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-[90%] max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            <div className="mb-5 text-center">
            <p className="text-lg font-semibold text-gray-900">
                Uploading image
            </p>

            <p className="mt-1 text-sm text-gray-500">
                Please wait while your image is being uploaded...
            </p>
            </div>

            {/* Percentage */}
            <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
                Upload progress
            </span>

            <span className="text-sm font-bold text-orange-500">
                {uploadProgress}%
            </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
                className="h-full rounded-full bg-orange-500 transition-all duration-200"
                style={{
                width: `${uploadProgress}%`,
                }}
            />
            </div>

            {/* Status */}
            <p className="mt-4 text-center text-xs text-gray-400">
            Do not close this page.
            </p>
        </div>
        </div>
    )}
    <h2 className="text-xl font-bold text-[#111111] mb-6">Profile Information</h2>
    
    <form  className="space-y-1">
        {/* Photo Upload */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100 md:justify-start  justify-center">
        <div className="relative ">
            <div className="size-35 rounded-full  overflow-hi">
                <img src={preview?preview:user?.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            < label htmlFor="profile-photo" className="cursor-pointer absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-100 text-gray-600 hover:text-[#FF7A00] transition-colors">
            
            <Camera size={16} />
            
            </label>
        </div>
        
        <div className='hidden md:block'>
            <h3 className="font-semibold text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
            <input type="file" id="profile-photo"  accept="image/*" onChange={handleImage}  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"/>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
        <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
        <InputGroup label="Age" type="number" name="age" value={formData.age} onChange={handleChange} />
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Country</label>
            <OptionSelect
            value={formData.country}
            options={countryOptions}
            placeholder="Select a country"
            onChange={(country) => setFormData((prev) => ({ ...prev, country }))}
            />
        </div>
        
        <InputGroup label="phone" name="phone" type='number' value={formData.phone} onChange={handleChange} />
        </div>
        <div className="pt-4 flex items-center gap-4">
        <button disabled={loading}  onClick={onsubmit} className={`px-8 py-3 flex  gap-4 items-center bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:opacity-65 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all  md:w-auto`+`${loading?"pointer-events-none opacity-80 md:w-auto cursor-not-allowed":"cursor-pointer opacity-100 pointer-events-auto"}`}>
        <span>Save Changes</span>
        {loading&&
        <span><Loader></Loader></span>
        }
        </button>
        
        </div>
    </form>
    </div>
);
}