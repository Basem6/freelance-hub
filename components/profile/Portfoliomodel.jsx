"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { compressImage } from "@/app/utils/compressImage";

// UI
import { InputGroup } from "../ui/InputGroup";
import { Image, Link2, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Portfoliomodel({ setmodel }) {
    const initialWork = {
        title: "",
        category: "",
        roleOwn: "",
        description: "",
        coverImage: "",
        skills: [],
    };
    const [over , setover] = useState("")
    const [coverImagePreview, setCoverImagePreview] = useState("");
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [newWork, setNewWork] = useState(initialWork);
    const [text, setText] = useState("Add content");

    const handleCancel = () => {
        setmodel(null);
    };
    const handleCancelOver = () => {
        setover(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewWork((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Create preview immediately
        const previewUrl = URL.createObjectURL(file);

        setCoverImagePreview(previewUrl);
        setIsUploadingCover(true);
        setUploadProgress(0);

        try {
            // Compress image
            const compressedImage = await compressImage(file);

            const formData = new FormData();

            formData.append("file", compressedImage);

            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            );

            const cloudinaryUrl =
                `https://api.cloudinary.com/v1_1/` +
                `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}` +
                `/image/upload`;

            // XMLHttpRequest for upload progress
            const cloudinaryData = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open("POST", cloudinaryUrl);

                // Upload progress
                xhr.upload.onprogress = (event) => {
                    if (!event.lengthComputable) return;

                    const percent = Math.round(
                        (event.loaded / event.total) * 100
                    );

                    setUploadProgress(percent);
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            resolve(JSON.parse(xhr.responseText));
                        } catch {
                            reject(
                                new Error("Invalid Cloudinary response")
                            );
                        }
                    } else {
                        reject(
                            new Error("Cloudinary upload failed")
                        );
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Network error"));
                };

                xhr.send(formData);
            });

            const imageUrl = cloudinaryData.secure_url;

            // Save Cloudinary URL
            setNewWork((prev) => ({
                ...prev,
                coverImage: imageUrl,
            }));

            // Replace local preview with Cloudinary image
            setCoverImagePreview(imageUrl);

            // Make sure progress reaches 100%
            setUploadProgress(100);

        } catch (error) {
            console.error("Cover image upload error:", error);

            setCoverImagePreview("");
            setNewWork((prev) => ({
                ...prev,
                coverImage: "",
            }));

            alert(
                "Unable to upload image to Cloudinary. Please try another image."
            );

        } finally {
            // Keep 100% visible for a moment
            setTimeout(() => {
                setIsUploadingCover(false);
                setUploadProgress(0);
            }, 400);

            event.target.value = "";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.92,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.92,
                    y: 20,
                }}
                className="relative flex min-h-screen max-h-screen w-full flex-col overflow-y-auto bg-white px-2 md:px-18"
            >
                {/* Header */}
                <div className="flex items-start md:items-center justify-between border-b border-gray-100 p-10">
                    <div>
                        <h2 className="md:text-4xl ">
                            Add a new portfolio project
                        </h2>

                        <p className="py-1 text-xs  md:text-sm text-gray-700/80">
                            All fields are required unless otherwise indicated.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 pb-24">
                    <InputGroup
                        label="Project title *"
                        type="text"
                        name="title"
                        value={newWork.title}
                        onChange={handleChange}
                        placeholder="Enter a title project"
                    />

                    <div className="my-10 flex flex-wrap justify-between gap-15">
                        {/* Left */}
                        <div className="w-170">
                            <div className="flex flex-col gap-10">
                                <InputGroup
                                    label="Your role"
                                    type="text"
                                    name="roleOwn"
                                    value={newWork.roleOwn}
                                    onChange={handleChange}
                                    placeholder="eg., Frontend Engineer, UI/UX"
                                />

                                <InputGroup
                                    label="Project description *"
                                    type="text"
                                    name="description"
                                    value={newWork.description}
                                    onChange={handleChange}
                                    placeholder="Enter a description for the project"
                                />

                                <InputGroup
                                    label="Skills *"
                                    type="text"
                                    name="skills"
                                    value={newWork.skills}
                                    onChange={handleChange}
                                    placeholder="Add skills relevant to this project"
                                />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col gap-6   w-130">
                            {/* Upload Box */}
                            <div className="order-2 flex h-50 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-orange-400">
                                <div className="flex gap-4">
                                    {/* Image Upload */}
                                    <label
                                        onMouseEnter={() =>
                                            setText("Upload Image")
                                        }
                                        onMouseLeave={() =>
                                            setText("Add content")
                                        }
                                        className="group flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-700/50 transition-colors duration-200 hover:border-none hover:bg-amber-600"
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />

                                        <Image
                                            className="transition-colors duration-200 group-hover:text-white"
                                            size={19}
                                            strokeWidth={1}
                                        />
                                    </label>

                                    {/* Web Link */}
                                    <button
                                        onClick={()=>{setover("link")}}
                                        type="button"
                                        onMouseEnter={() =>
                                            setText("Add a Web link")
                                        }
                                        onMouseLeave={() =>
                                            setText("Add content")
                                        }
                                        className="group flex size-10 items-center justify-center rounded-full border border-gray-700/50 transition-colors duration-200 hover:border-none hover:bg-amber-600"
                                    >
                                        <Link2
                                            className="transition-colors duration-200 group-hover:text-white"
                                            size={19}
                                            strokeWidth={1}
                                        />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {isUploadingCover
                                        ? `Uploading ${uploadProgress}%`
                                        : text}
                                </div>
                            </div>

                            {/* Image Preview */}
                            {coverImagePreview && (
                                <motion.div 
                                    initial={{
                                        opacity: 0,
                                        scale: 0.92,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.92,
                                        y: 20,
                                    }}
                                className="relative border-2 border-orange-400 order-1 h-50 w-full overflow-hidden rounded-xl">
                                    <img
                                        src={coverImagePreview}
                                        alt="Work cover preview"
                                        className={`
                                            h-full
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-200
                                            md:object-cover
                                            object-contain
                                            transition-all
                                            duration-500
                                            ${
                                                isUploadingCover
                                                    ? "opacity-40"
                                                    : "opacity-100"
                                            }
                                        `}
                                    />

                                    {/* Upload Overlay */}
                                    {isUploadingCover && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
                                            <span className="mb-3 text-sm font-medium text-white drop-shadow">
                                                Uploading {uploadProgress}%
                                            </span>

                                            {/* Progress Bar */}
                                            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/40">
                                                <div
                                                    className="h-full rounded-full bg-white transition-all duration-200"
                                                    style={{
                                                        width: `${uploadProgress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 mt-auto flex w-full items-center justify-end gap-5 border-t border-gray-100 bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
            <AnimatePresence>
                {over==="link"&&(
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCancelOver}
                            className="absolute inset-0 bg-black/15"
                        />
                    
                        <motion.div
                            initial={{
                            opacity: 0,
                            scale: 0.92,
                            y: 20,
                            }}
                            animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            }}
                            exit={{
                            opacity: 0,
                            scale: 0.92,
                            y: 20,
                            }}
                            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 p-6">
                                <div> 
                                    <h2 className="text-2xl font-semibold">
                                        Add a Web link
                                    </h2>
                                    <h6 className="py-2 text-sm text-gray-500">
                                        Only one link can be added at a time.
                                    </h6>
                                </div>
                            <button
                                type="button"
                                onClick={handleCancelOver}
                                className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                            </div>
                    
                            
                            {/* {content} */}
                            <div className="p-6">
                                <InputGroup label={"Paste a web link to an article or website"} placeholder={"add a website link"} type="text"></InputGroup>
                            </div>
                            {/* Footer */}
                            <div className="flex items-center justify-end gap-5 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleCancelOver}
                                className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                    
                            <button
                                type="button"
                                
                                className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {"Save"}
                            </button>
                            </div>
                        </motion.div>
                    </div>
                )
                    }
            </AnimatePresence>
        </div>
    );
}

