'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout , setLoading , updateUser } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, CheckCircle2,
} from 'lucide-react';
import Loader from "../../../components/ui/Loader"
import  {compressImage} from "../../utils/compressImage"
import { hideShow, setShow } from '../../lib/Features/showSlice';
import axios from 'axios';
import OptionSelect from '@/components/ui/OptionSelect';

export default function SettingsPage() {
  const LoadingUser = useAppSelector(state => state.auth.loading);
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [settingsType, setSettingsType] = useState('personal');

  // Auth Check Pattern
  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => {
        if (!res.data.success) { dispatch(logout()); router.push('/login'); }
      })
      .catch(() => { dispatch(logout()); router.push('/login'); })
      .finally(() => setLoading(false));
  }, [dispatch, router]);

  const [saveFlash, setSaveFlash] = useState(false);

  const handleSaveVisual = (e) => {
    e.preventDefault();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex md:ml-64">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white/90 p-2 shadow-sm backdrop-blur">
              <button
                type="button"
                onClick={() => setSettingsType('personal')}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all sm:w-auto ${settingsType === 'personal'
                  ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-500/20'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#111111]'}`}
              >
                Personal Settings
              </button>
              {user.role==="freelancer"?
              <button
                type="button"
                onClick={() => setSettingsType('technical')}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all sm:w-auto ${settingsType === 'technical'
                  ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-500/20'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#111111]'}`}
              >
                Technical Settings
              </button>:""
}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={settingsType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {settingsType === 'personal' ? (
                  <ProfileTab loading={LoadingUser} user={user} onSave={handleSaveVisual} saveFlash={saveFlash} />
                ) : (
                  <TechnicalSettings />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- TAB COMPONENTS ---

function ProfileTab({ user, onSave, saveFlash , loading }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useAppDispatch();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.image ||"/avatars/avatar-1.png");
  const [show, setshow] = useState(null);
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
  const countryOptions = ['USA', 'UK', 'Canada', 'UAE', 'Saudi Arabia', 'Egypt'];

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleUpload = async () => {
  if (!image) return;

  try {
    // =========================
    // 1. Start blocking UI
    // =========================
    setIsUploading(true);
    setUploadProgress(0);

    // =========================
    // 2. Compress image
    // =========================
    const compressedImage = await compressImage(image);

    console.log("Original size:", image.size);
    console.log("Compressed size:", compressedImage.size);

    // =========================
    // 3. Prepare Cloudinary FormData
    // =========================
    const cloudinaryFormData = new FormData();

    cloudinaryFormData.append("file", compressedImage);

    cloudinaryFormData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // =========================
    // 4. Upload to Cloudinary
    // =========================
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

    // =========================
    // 5. Update backend
    // =========================
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

    // =========================
    // 6. Update Redux
    // =========================
    dispatch(
      updateUser({
        image: imageUrl,
      })
    );

    // =========================
    // 7. Reset states
    // =========================
    setImage(null);
    setPreview(null);

    // =========================
    // 8. Complete progress
    // =========================
    setUploadProgress(100);

    // =========================
    // 9. Success message
    // =========================
    setshow("تم تحديث الصورة بنجاح ✅");

    setTimeout(() => {
      setshow(null);
    }, 2000);

    console.log("Upload completed:", imageUrl);

  } catch (error) {
    console.error("Upload failed:", error);

    setUploadProgress(0);

    setshow(
      error?.message ||
        "حدث خطأ أثناء رفع الصورة ❌"
    );

    setTimeout(() => {
      setshow(null);
    }, 3000);

  } finally {
    // =========================
    // Unlock UI
    // =========================
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

    console.log("STATUS:", res.status);
    console.log("RESULT:", result);

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

    setshow("تم تحديث البيانات بنجاح ✅");

  } catch (error) {
    console.error("Update error:", error);
    setshow("خطأ: " + error.message);
  }
};
  const onsubmit = async (event) => {
  event.preventDefault();

  dispatch(setLoading(true));

  try {
    if (image) {
      await handleUpload();
    }

    await updateUserProfile(formData);

  } catch (error) {
    console.error("Submit error:", error);
  } finally {
    dispatch(setLoading(false));
  }
};
  const handleImage = (e) => {  
    setImage(e.target.files[0])
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);;
  };
  console.log(loading)
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8  max-w-full">
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
      
      <form onSubmit={onSave} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-100 md:justify-start  justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF7A00] to-orange-300 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user ? (
                <img src={preview?preview:user?.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.fullName?.charAt(0) || 'U'
              )}
            </div>
            < label htmlFor="profile-photo" className="cursor-pointer absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-[#FF7A00] transition-colors">
              
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
          {show&&
          <AnimatePresence>
            { (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-600 font-medium"
              >
                <CheckCircle2 size={18} />
                <span>Saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
          }
        </div>
      </form>
    </div>
  );
}
function TechnicalSettings() {
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useAppSelector(state => state.auth.user);
  const [loading , setloading] = useState(false)
  const [technicalData, setTechnicalData] = useState({
    major: user?.major ||'',
    specialty: user?.specialty ||'',
    skills:user?.skills || [],
    summary: user?.bio ||'',
  });
   // Auth Check Pattern
  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => {
        if (!res.data.success) { dispatch(logout()); router.push('/login'); }
      })
      .catch(() => { dispatch(logout()); router.push('/login'); })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch, router]);

  function showToast(message){
  dispatch(setShow(message))
  setTimeout(() => {
      dispatch(hideShow())
  }, 3000);
  } 

  const specialtyOptions = ['Development', 'Design', 'Translation', 'Marketing', 'Writing', 'Data', 'Video Editing', 'Consulting'];

  const skillSuggestions = [
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'MySQL',
    'UI/UX',
    'Tailwind CSS',
    'Redux',
    'Figma',
  ];

  const filteredSuggestions = skillInput.trim()
    ? skillSuggestions.filter((skill) => {
        const lowered = skill.toLowerCase();
        return lowered.includes(skillInput.toLowerCase()) && !technicalData.skills.includes(skill);
      })
    : [];

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill || technicalData.skills.includes(trimmedSkill)) return;

    setTechnicalData((prev) => ({ ...prev, skills: [...prev.skills, trimmedSkill] }));
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setTechnicalData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter' && skillInput.trim()) {
      event.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTechnicalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ✅ Validation
    if (!technicalData.major?.trim()) {
      showToast({ message: "من فضلك أدخل التخصص الرئيسي", type: "warning" });
      return;
    }

    if (!technicalData.skills || technicalData.skills.length === 0) {
      showToast({ message: "من فضلك أضف مهارة واحدة على الأقل", type: "warning" });
      return;
    }
    setloading(true)
    try {
      const payload = {
        major: technicalData.major.trim(),
        specialty: technicalData.specialty?.trim() || "",
        skills: technicalData.skills.filter(skill => skill.trim()), // ✅ تنظيف
        bio: technicalData.summary?.trim() || "",
      };

      console.log("Sending payload:", payload);

      const response = await fetch(
        `/api/backend/freelance/update/technical`, // ✅ استخدم env
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // ✅ معالجة الـ response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل حفظ البيانات التقنية");
      }

      if (!data.success) {
        throw new Error(data.message || "فشل التحديث");
      }

      // ✅ Update Redux
      dispatch(
        updateUser({
          major: payload.major,
          specialty: payload.specialty,
          skills: payload.skills,
          bio: payload.bio,
        })
      );

      console.log("✅ Technical settings saved:", data.user);

      showToast({
        message: "✅ تم حفظ البيانات التقنية بنجاح",
        type: "sucess",
      });

    } catch (error) {
      console.error("❌ Technical settings error:", error);

      showToast({
        message: error.message || "حدث خطأ في حفظ البيانات",
        type: "error",
      });
    } finally {
      setloading(false)
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
      <h2 className="text-xl font-bold text-[#111111] mb-6">Technical Profile</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Major</label>
            <input
              type="text"
              name="major"
              value={technicalData.major}
              onChange={handleChange}
              placeholder="Computer Science"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Specialty</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSpecialtyOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-[#FF7A00] hover:bg-white"
              >
                <span>{technicalData.specialty || 'Select a specialty'}</span>
                <span className="text-gray-400">▾</span>
              </button>

              {isSpecialtyOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-orange-500/10">
                  {specialtyOptions.map((option) => {
                    const isActive = technicalData.specialty === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setTechnicalData((prev) => ({ ...prev, specialty: option }));
                          setIsSpecialtyOpen(false);
                        }}
                        className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-all ${isActive
                          ? 'bg-[#FFF4E8] text-[#FF7A00]'
                          : 'text-gray-700 hover:bg-[#FFF4E8] hover:text-[#FF7A00]'}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Skills</label>
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Search skills like React, MongoDB or UI/UX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
            />

            {filteredSuggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {filteredSuggestions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-[#FFF4E8] hover:text-[#FF7A00]"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {technicalData.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FFF4E8] px-3 py-1.5 text-sm font-medium text-[#FF7A00]">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-[#FF7A00] transition-opacity hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Summary</label>
          <textarea
            rows="6"
            name="summary"
            value={technicalData.summary}
            onChange={handleChange}
            placeholder="Write a short professional summary about the user..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white resize-none"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button  onClick={(e)=>handleSubmit(e)} className={`px-8 py-3 flex  gap-4 items-center bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:opacity-65 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all  md:w-auto`+`${loading?"pointer-events-none opacity-80 md:w-auto cursor-not-allowed":"cursor-pointer opacity-100 pointer-events-auto"}`}>
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

function InputGroup({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
      />
    </div>
  );
}