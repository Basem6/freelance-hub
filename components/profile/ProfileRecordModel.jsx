"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { updateTechnicalData } from "@/app/lib/Features/technicalData";
import { useAppDispatch } from "@/app/lib/hooks";
import { useShowToast } from "@/app/hooks/showToast";
import Loadingbtn from "@/components/ui/Loadingbtn";
import { useAppSelector } from "../../app/lib/hooks";

const EMPTY_EDUCATION = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    description: "",
};

const EDUCATION_FIELDS = [
    {
        name: "school",
        label: "School",
        placeholder: "Enter school or institution",
    },
    {
        name: "degree",
        label: "Degree",
        placeholder: "Enter degree",
    },
    {
        name: "fieldOfStudy",
        label: "Field of study",
        placeholder: "Enter field of study",
    },
    {
        name: "startYear",
        label: "Start date",
        placeholder: "e.g. 2021",
    },
    {
        name: "endYear",
        label: "End date",
        placeholder: "e.g. 2025 or Present",
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Add details about your education (optional)",
        multiline: true,
    },
];

export default function EducationModal({ setmodel }) {
    const technicalData = useAppSelector((state) => state.technicalData)
    const dispatch = useAppDispatch();
    const showToast = useShowToast();

    const [form, setForm] = useState({ ...EMPTY_EDUCATION });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (isSaving) return;

        if (!form.school.trim()) {
            showToast({
                message: "Please enter a school or institution name.",
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
                        education: [...technicalData.education , form]
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to save education"
                );
            }
            console.log(data)
            dispatch(
                updateTechnicalData({
                    education: data.freelancer.education,
                })
            );

            showToast({
                message: "Education saved successfully.",
                type: "sucess",
            });
            if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
            setmodel(null);
        } catch (error) {
            console.error("Education update error:", error);

            showToast({
                message: error.message || "Failed to save education",
                type: "error",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {!isSaving && setmodel(null); if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}}}
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
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 className="text-2xl font-semibold">
                        Add education
                    </h2>

                    <button
                        type="button"
                        onClick={() => {setmodel(null);  if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}}}
                        disabled={isSaving}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave}>
                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                        {EDUCATION_FIELDS.map((field) => (
                            <label
                                key={field.name}
                                className={`block space-y-1.5 text-sm font-medium text-gray-700 ${
                                    field.multiline
                                        ? "sm:col-span-2"
                                        : ""
                                }`}
                            >
                                {field.label}

                                {field.multiline ? (
                                    <textarea
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        rows={3}
                                        disabled={isSaving}
                                        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-normal text-gray-900 focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        disabled={isSaving}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-normal text-gray-900 focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"
                                    />
                                )}
                            </label>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-5 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => {setmodel(null);  if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}}}
                            disabled={isSaving}
                            className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? <Loadingbtn /> : "Save"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}