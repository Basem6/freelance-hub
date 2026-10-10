"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { updateTechnicalData } from "@/app/lib/Features/technicalData";
import { useAppDispatch, useAppSelector } from "../../app/lib/hooks";
import { useState } from "react";
import { InputGroup } from "../ui/InputGroup";
import { useShowToast } from "@/app/hooks/showToast";
import Loadingbtn from "@/components/ui/Loadingbtn";
import gsap from "gsap";
import { useEffect } from "react";

export default function Experiencemodel({ setmodel }) {
    const technicalData = useAppSelector((state) => state.technicalData);
    const dispatch = useAppDispatch();
    const showToast = useShowToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleCancel = () => {
        if (isSaving) return;
        setmodel(null);
        if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
    };

    const handleChange = (e) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (isSaving) return;

        if (!formData.title.trim()) {
            showToast({
                message: "Please enter an experience title.",
                type: "warning",
            });
            return;
        }

        if (!formData.description.trim()) {
            showToast({
                message: "Please enter a description.",
                type: "warning",
            });
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(
                "/api/backend/freelance/update/technical",
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        experience: [...technicalData.experience , formData],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to save experience"
                );
            }

            dispatch(
                updateTechnicalData({
                    experience: data.freelancer.experience,
                })
            );
            if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
            showToast({
                message: "Experience saved successfully.",
                type: "sucess",
            });

            setmodel(null);
        } catch (error) {
            console.error("Experience update error:", error);

            showToast({
                message:
                    error.message || "Failed to save experience",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };
useEffect(()=>{
    if(document.querySelector(".mobile-nav")){
        gsap.to(".mobile-nav",{
            bottom:0,
            duration:0.3
        })
    }
},[setmodel])
    return (
        <div className="fixed inset-0  z-9999 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCancel}
                className="absolute inset-0  z-9998 bg-black/15"
            />

            {/* Modal */}
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: 20,
                }}
                className={`${window.matchMedia("(max-width: 767px)").matches ? "mobile-nav" : "desktop-nav"}  md:relative  absolute md:bottom-auto -bottom-1/3  rounded-t-2xl w-full  z-9999 max-w-3xl md:rounded-2xl bg-white shadow-2xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 className="text-2xl font-semibold">
                        Add Experience
                    </h2>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-5 p-6">
                    <InputGroup
                        label="Subject"
                        name="title"
                        value={formData.title}
                        placeholder="Enter experience title"
                        onChange={handleChange}
                    />

                    <textarea
                        rows="6"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={isSaving}
                        placeholder="Write a short description about the experience..."
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-5 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? <Loadingbtn /> : "Save"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}