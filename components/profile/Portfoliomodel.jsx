"use client";
import { useState } from "react";
import { motion } from "framer-motion";

//reduxs 
import { updateTechnicalData } from '@/app/lib/Features/technicalData';
import { useAppDispatch, useAppSelector } from "../../app/lib/hooks";

//utils
import api from "../../app/utils/api";
import { compressImage } from "@/app/utils/compressImage";
import {skillSuggestions} from "@/app/utils/skillSuggestions";

// UI
import { InputGroup } from "../ui/InputGroup";
import { Image, Link2, X , SquareArrowOutUpRight, Trash} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useShowToast } from "../../app/hooks/showToast";

const isValidUrl = (value) => {
    try {
        const url = new URL(value.trim());

        return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            Boolean(url.hostname)
        );
    } catch {
        return false;
    }
};

export default function Portfoliomodel({ setmodel, selectedPortfolioItem }) {
    const initialWork = {
        title: selectedPortfolioItem?.title || "",
        category:selectedPortfolioItem?.category || "",
        roleOwn: selectedPortfolioItem?.roleOwn || "",
        description:    selectedPortfolioItem?.description || "",
        liveUrl: selectedPortfolioItem?.liveUrl || "",
        coverImage: selectedPortfolioItem?.coverImage || "",
        skills:selectedPortfolioItem?.skills || [],
    };
    const showToast = useShowToast();
    const technicalData= useAppSelector(state => state.technicalData);
    const dispatch = useAppDispatch()
    const [over , setover] = useState("")
    const [loading , setloading] = useState(false)
    const [coverImagePreview, setCoverImagePreview] = useState(selectedPortfolioItem?.coverImage || "");
    const [LinkPreview, setLinkPreview] = useState(selectedPortfolioItem?.liveUrl || "");
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [skillInput, setSkillInput] = useState("");
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
    const [newWork, setNewWork] = useState(initialWork);
    const [text, setText] = useState("Add content");
    const filteredSkills = skillSuggestions.filter((skill) => {
        const query = skillInput.trim().toLowerCase();

        if (!query) {
            return !newWork.skills.includes(skill);
        }

        return (
            !newWork.skills.includes(skill) &&
            skill.toLowerCase().includes(query)
        );
    });

    const handleCancel = () => {
        setmodel(null);
        if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
    };
    const handleCancelOver = () => {
        setover(null);
    };

    const handleSaveLink = () => {
        const trimmedUrl = newWork.liveUrl.trim();

        if (!isValidUrl(trimmedUrl)) {
            showToast({
                message: "Please enter a valid URL starting with http:// or https://.",
                type: "warning",
            });
            return;
        }
        setLinkPreview(trimmedUrl);
        setNewWork((prev) => ({
            ...prev,
            liveUrl: trimmedUrl,
        }));
        handleCancelOver();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setNewWork((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSkillInputChange = (event) => {
        const value = event.target.value;
        setSkillInput(value);
        setIsSkillDropdownOpen(true);
    };

    const handleSkillSelect = (skill) => {
        const nextSkill = skill.trim();

        if (!nextSkill || newWork.skills.includes(nextSkill)) {
            return;
        }

        setNewWork((prev) => ({
            ...prev,
            skills: [...prev.skills, nextSkill],
        }));
        setSkillInput("");
        setIsSkillDropdownOpen(false);
    };

    const handleSkillRemove = (skillToRemove) => {
        setNewWork((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleSkillBlur = () => {
        window.setTimeout(() => {
            setIsSkillDropdownOpen(false);
        }, 120);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // Create preview immediately
        const previewUrl = URL.createObjectURL(file);

        setCoverImagePreview(previewUrl);
        setIsUploadingCover(true);
        setUploadProgress(0);
        setloading(true)
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
            setloading(false)
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
            setloading(false)

            event.target.value = "";
        }
    };
    const handleAddWork = async () => {
    if (!newWork.title.trim() || !newWork.description.trim()) {
        showToast({
            message: "Please add a title and description before saving your work.",
            type: "warning",
        });
        return;
    }

    const payload = {
        ...newWork,
        skills: Array.isArray(newWork.skills)
            ? newWork.skills
            : [],
    };

    console.log("Sending portfolio:", payload);

    try {
        const response = await api.post(
            "/freelancer/work",
            payload
        );

        console.log("Portfolio response:", response.data);

        setCoverImagePreview("");
        setNewWork(initialWork);
        
        showToast({
            message: "Portfolio project added successfully.",
            type: "sucess",
        });
        const portfolio = response.data.freelancer.portfolio || [];
        dispatch(
            updateTechnicalData({
                portfolio,
            })
        );
        console.log(technicalData.portfolio)
        setmodel(null);

    } catch (error) {
        console.error(
            "Error adding work:",
            error?.response?.data || error
        );

        showToast({
            message:
                error?.response?.data?.message ||
                "Unable to add work. Please try again.",
            type: "error",
        });
    }
    };
    const handleEditWork= async () => {}
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
                        className="rounded-xl p-2 font-thin text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={34} strokeWidth={1} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 ">
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
                        <div className="w-120">
                            <div className="flex flex-col gap-6">
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

                                <div className="space-y-2">
                                    <InputGroup
                                        label="Skills *"
                                        type="text"
                                        name="skills"
                                        value={skillInput}
                                        onChange={handleSkillInputChange}
                                        onFocus={() => setIsSkillDropdownOpen(true)}
                                        onBlur={handleSkillBlur}
                                        placeholder="Add skills relevant to this project"
                                        autoComplete="off"
                                    />

                                    {isSkillDropdownOpen && (
                                        <div className="absolute z-20">
                                            <div className="max-h-40 w-67  overflow-y-auto rounded-xl border border-gray-200 bg-white ">
                                                {filteredSkills.length > 0 ? (
                                                    filteredSkills.map((skill) => (
                                                        <button
                                                            key={skill}
                                                            type="button"
                                                            onMouseDown={(event) =>
                                                                event.preventDefault()
                                                            }
                                                            onClick={() =>
                                                                handleSkillSelect(skill)
                                                            }
                                                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                                                        >
                                                            <span>{skill}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-xs text-gray-500">
                                                        No skills found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {newWork.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {newWork.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSkillRemove(skill)
                                                        }
                                                        className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-orange-700 transition-colors hover:bg-orange-200"
                                                        aria-label={`Remove ${skill}`}
                                                    >
                                                        <X size={11} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col gap-5 grow    w-140">
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
                                className="relative border-2 border-orange-400  order-1  min-w-full  overflow-hidden rounded-xl">
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
                                    <div className=" absolute right-2.5 top-2.5 flex items-center  justify-center rounded-full bg-gray-100 size-9">
                                    <Trash
                                    className="text-gray-600 hover:text-orange-300 transition-colors duration-200 cursor-pointer"
                                    onClick={() => {
                                        setCoverImagePreview("");
                                        setNewWork((prev) => ({
                                            ...prev,
                                            coverImage: "",
                                        }));
                                    }}
                                    size={18}
                                    strokeWidth={1}
                                />
                                    </div>
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
                            {LinkPreview && (
                                <motion.div 
                                    initial={{
                                        opacity: 0,
                                        scale: 0.90,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.90,
                                        y: 20,
                                    }}
                                    className="relative order-1 h-50 w-full flex  border-2 border-orange-400  items-center justify-between gap-4   border-dashe  rounded-xl">
                                    
                                        <div className="flex  items-center justify-between w-full gap-2 p-7">
                                            <a href={LinkPreview} target="_blank" rel="noopener noreferrer" className="text-sm border-b border-black/90 hover:opacity-75 text-gray-700">
                                                {LinkPreview}
                                            </a>
                                            <SquareArrowOutUpRight size={20}  strokeWidth={1.2} />
                                        </div>                          
                                        <div className=" absolute right-2.5 top-2.5 flex items-center  justify-center rounded-full bg-gray-100 size-9">
                                        <Trash
                                        className="text-gray-600 hover:text-orange-300 transition-colors duration-200 cursor-pointer"
                                        onClick={() => {
                                            setLinkPreview("");
                                            setNewWork((prev) => ({
                                                ...prev,
                                                liveUrl: "",
                                            }));
                                        }}
                                        size={18}
                                        strokeWidth={1}
                                    />
                                        </div>
                                
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
                        className="rounded-xl cursor-pointer hover:opacity-80 border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={selectedPortfolioItem?handleEditWork:handleAddWork}
                        className={`rounded-xl  ${loading?"opacity-40  hover:opacity-40 cursor-no-drop":"opacity-100   hover:opacity-80 cursor-pointer"}  bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white`}
                    >
                        {selectedPortfolioItem ? "Edit" : "Save"}
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
                                <InputGroup
                                    label="Paste a web link to an article or website"
                                    placeholder="add a website link"
                                    type="url"
                                    name="liveUrl"
                                    value={newWork.liveUrl}
                                    onChange={handleChange}
                                />
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
                                onClick={handleSaveLink}
                                className={`rounded-xl bg-gradient-to-r  from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60`}
                            >
                                Save
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
