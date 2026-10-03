"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { updateTechnicalData } from "@/app/lib/Features/technicalData";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useShowToast } from "@/app/hooks/showToast";
import Loadingbtn from "@/components/ui/Loadingbtn";

const RECORD_FIELDS = {
    education: [
        { name: "school", label: "School", placeholder: "Enter school or institution" },
        { name: "degree", label: "Degree", placeholder: "Enter degree" },
        { name: "fieldOfStudy", label: "Field of study", placeholder: "Enter field of study" },
        { name: "startDate", label: "Start date", placeholder: "e.g. 2021" },
        { name: "endDate", label: "End date", placeholder: "e.g. 2025 or Present" },
        { name: "description", label: "Description", multiline: true, placeholder: "Add details (optional)" },
    ],
    experience: [
        { name: "company", label: "Company", placeholder: "Enter company name" },
        { name: "position", label: "Position", placeholder: "Enter your position" },
        { name: "startDate", label: "Start date", placeholder: "e.g. 2021" },
        { name: "endDate", label: "End date", placeholder: "e.g. 2025 or Present" },
        { name: "description", label: "Description", multiline: true, placeholder: "Add details (optional)" },
    ],
};

const EMPTY_RECORD = {
    education: { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" },
    experience: { company: "", position: "", startDate: "", endDate: "", description: "" },
};

function recordLabel(type, record) {
    if (!record || typeof record !== "object") return type === "education" ? "Education" : "Experience";
    if (type === "education") {
        return record.school || record.institution || record.degree || "Education";
    }
    return record.position || record.role || record.company || "Experience";
}

export default function ProfileRecordModel({ type, setmodel }) {
    const dispatch = useAppDispatch();
    const showToast = useShowToast();
    const records = useAppSelector((state) => state.technicalData?.[type]);
    const savedRecords = Array.isArray(records) ? records : [];
    const [editingIndex, setEditingIndex] = useState(null);
    const [form, setForm] = useState({ ...EMPTY_RECORD[type] });
    const [isSaving, setIsSaving] = useState(false);
    const fields = RECORD_FIELDS[type];
    const sectionLabel = type === "education" ? "education" : "experience";

    const startNewRecord = () => {
        setEditingIndex(null);
        setForm({ ...EMPTY_RECORD[type] });
    };

    const editRecord = (index) => {
        setEditingIndex(index);
        setForm({ ...EMPTY_RECORD[type], ...(savedRecords[index] || {}) });
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (isSaving) return;

        const primaryField = type === "education" ? "school" : "company";
        if (!form[primaryField]?.trim()) {
            showToast({
                message: `Please enter a ${type === "education" ? "school" : "company"} name.`,
                type: "warning",
            });
            return;
        }

        const updatedRecords = [...savedRecords];
        const record = {
            ...(editingIndex === null ? {} : (savedRecords[editingIndex] || {})),
            ...form,
        };

        if (editingIndex === null) {
            updatedRecords.push(record);
        } else {
            updatedRecords[editingIndex] = record;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/backend/freelance/update/technical", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [type]: updatedRecords }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `Failed to update ${sectionLabel}`);
            }

            dispatch(updateTechnicalData({ [type]: updatedRecords }));
            showToast({
                message: `${type === "education" ? "Education" : "Experience"} saved successfully.`,
                type: "sucess",
            });
            setmodel(null);
        } catch (error) {
            console.error(`Profile ${sectionLabel} update error:`, error);
            showToast({
                message: error.message || `Failed to save ${sectionLabel}`,
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
                exit={{ opacity: 0 }}
                onClick={() => !isSaving && setmodel(null)}
                disabled={isSaving}
                className="absolute inset-0 bg-black/15"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-record-title"
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 id="profile-record-title" className="text-2xl font-semibold capitalize">
                        {editingIndex === null ? `Add ${sectionLabel}` : `Edit ${sectionLabel}`}
                    </h2>
                    <button
                        type="button"
                        aria-label="Close editor"
                        onClick={() => setmodel(null)}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {savedRecords.length > 0 && (
                    <div className="space-y-2 border-b border-gray-100 px-6 py-4">
                        <h3 className="text-sm font-semibold text-gray-700">Existing {sectionLabel}</h3>
                        <div className="flex flex-wrap gap-2">
                            {savedRecords.map((record, index) => (
                                <button
                                    key={record._id || `${type}-${index}`}
                                    type="button"
                                    onClick={() => editRecord(index)}
                                    aria-pressed={editingIndex === index}
                                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                                        editingIndex === index
                                            ? "border-[#FF7A00] bg-[#FFF4E8] text-[#FF7A00]"
                                            : "border-gray-200 text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                                    }`}
                                >
                                    {recordLabel(type, record)}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={startNewRecord}
                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50"
                            >
                                Add new
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <div className="grid gap-4 p-6 sm:grid-cols-2">
                        {fields.map((field) => (
                            <label
                                key={field.name}
                                className={`block space-y-1.5 text-sm font-medium text-gray-700 ${
                                    field.multiline ? "sm:col-span-2" : ""
                                }`}
                            >
                                {field.label}
                                {field.multiline ? (
                                    <textarea
                                        value={form[field.name] || ""}
                                        onChange={(event) => setForm((current) => ({
                                            ...current,
                                            [field.name]: event.target.value,
                                        }))}
                                        placeholder={field.placeholder}
                                        rows={3}
                                        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-normal text-gray-900 transition-all focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={form[field.name] || ""}
                                        onChange={(event) => setForm((current) => ({
                                            ...current,
                                            [field.name]: event.target.value,
                                        }))}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-normal text-gray-900 transition-all focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"
                                    />
                                )}
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-5 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setmodel(null)}
                            disabled={isSaving}
                            className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? <Loadingbtn /> : "Save"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
