"use client";

import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { updateTechnicalData } from "@/app/lib/Features/technicalData";
import { useAppDispatch, useAppSelector } from "../../app/lib/hooks";
import { useShowToast } from "../../app/hooks/showToast";

import OptionSelect from "@/components/ui/OptionSelect";
import { languageLevels, languages } from "@/app/lib/constants/languages";
import Loadingbtn from "../ui/Loadingbtn";
import { InputGroup } from "../ui/InputGroup";

export default function Languagesmodel({
setmodel,
newlanguage,
}) {
const dispatch = useAppDispatch();
const showToast = useShowToast();

const technicalData = useAppSelector(
    (state) => state.technicalData
);

const [loading, setLoading] = useState(false);

// Add
const [formData, setFormData] = useState({
    language: "",
    proficiency: "",
});

// Edit
const [editLanguages, setEditLanguages] = useState([]);

useEffect(() => {
    if (!newlanguage) {
    setEditLanguages(technicalData?.languages || []);
    }
}, [newlanguage, technicalData?.languages]);

const handleCancel = () => {
    setmodel(null);
    if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
};

const handleAddLanguage = async () => {
    if (!formData.language.trim()) {
    showToast({
        message: "Please select a language.",
        type: "warning",
    });
    return;
    }

    if (!formData.proficiency.trim()) {
    showToast({
        message: "Please select a proficiency level.",
        type: "warning",
    });
    return;
    }

    const alreadyExists = technicalData?.languages?.some(
    (item) =>
        item.language.toLowerCase() ===
        formData.language.toLowerCase()
    );

    if (alreadyExists) {
    showToast({
        message: "This language has already been added.",
        type: "warning",
    });
    return;
    }

    const updatedLanguages = [
    ...(technicalData?.languages || []),
    {
        language: formData.language,
        proficiency: formData.proficiency,
    },
    ];

    await saveLanguages(updatedLanguages);
};

const handleEditLanguages = async () => {
    const invalidLanguage = editLanguages.some(
    (item) =>
        !item.language?.trim() ||
        !item.proficiency?.trim()
    );

    if (invalidLanguage) {
    showToast({
        message: "Please complete all language fields.",
        type: "warning",
    });
    return;
    }

    await saveLanguages(editLanguages);
};

const handleDeleteLanguage = (index) => {
    setEditLanguages((current) =>
    current.filter((_, currentIndex) => currentIndex !== index)
    );
};

const saveLanguages = async (updatedLanguages) => {
    if (loading) return;

    setLoading(true);

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
            languages: updatedLanguages,
        }),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
        data.message || "Failed to update languages"
        );
    }

    dispatch(
        updateTechnicalData({
        languages: data.freelancer.languages,
        })
    );
    if(document.querySelector(".parent")){document.querySelector(".parent").classList.remove("noscrol")}
    showToast({
        message: newlanguage
        ? "Language added successfully"
        : "Languages updated successfully",
        type: "sucess",
    });

    setmodel(null);
    } catch (error) {
    showToast({
        message:
        error.message || "Something went wrong",
        type: "error",
    });
    } finally {
    setLoading(false);
    }
};

const handleProficiencyChange = (
    index,
    proficiency
) => {
    setEditLanguages((prev) =>
    prev.map((item, i) =>
        i === index
        ? {
            ...item,
            proficiency,
            }
        : item
    )
    );
};

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Overlay */}
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
        className="absolute inset-0 bg-black/15"
    />

    {/* Modal */}
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
        className="relative w-full max-w-3xl rounded-2xl bg-white"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">
            {newlanguage
            ? "Add language"
            : "Edit languages"}
        </h2>

        <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <X size={18} />
        </button>
        </div>

        {/* Content */}
        {newlanguage ? (
        /* ================= ADD ================= */
        <div className="flex min-h-110 w-full flex-col items-start gap-5 p-6 md:flex-row md:gap-2">
            {/* Language */}
            <div className="flex w-full flex-col gap-1 md:w-1/2">
            <label className="text-sm font-semibold text-gray-700">
                Language
            </label>

            <OptionSelect
                options={languages}
                placeholder="Search for a language"
                isSearch
                value={formData.language}
                onChange={(language) =>
                setFormData((prev) => ({
                    ...prev,
                    language,
                }))
                }
            />
            </div>

            {/* Proficiency */}
            <div className="flex w-full flex-col gap-1 md:w-1/2">
            <label className="text-sm font-semibold text-gray-700">
                Proficiency level
            </label>

            <OptionSelect
                options={languageLevels}
                placeholder="Select a proficiency level"
                value={formData.proficiency}
                isSearch={false}
                onChange={(proficiency) =>
                setFormData((prev) => ({
                    ...prev,
                    proficiency,
                }))
                }
            />
            </div>
        </div>
        ) : (
        /* ================= EDIT ================= */
        <div className="max-h-100 overflow-y-auto px-6 py-5">
        {/* Header */}
        <div className="mb-3 hidden grid-cols-[1fr_1fr_40px] items-center gap-3 md:grid">
            <label className="text-sm font-semibold text-gray-600">
            Language
            </label>

            <label className="text-sm font-semibold text-gray-600">
            Proficiency level
            </label>

            <span />
        </div>

        {/* Empty state */}
        {editLanguages.length === 0 ? (
           ""
        ) : (
            <div className="space-y-3">
            {editLanguages.map((item, index) => (
                <div
                key={`${item.language}-${index}`}
                className="grid grid-cols-1 items-end gap-3 rounded-xl border border-gray-100 p-3 md:grid-cols-[1fr_1fr_40px] md:border-0 md:p-0"
                >
                {/* Language */}
                <div className="flex min-w-0 flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 md:hidden">
                    Language
                    </label>

                    <InputGroup
                    space={false}
                    disabled
                    value={item.language}
                    />
                </div>

                {/* Proficiency */}
                <div className="flex min-w-0 flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500 md:hidden">
                    Proficiency level
                    </label>

                    <OptionSelect
                    options={languageLevels}
                    value={item.proficiency}
                    isSearch={false}
                    className="py-1"
                    onChange={(proficiency) =>
                        handleProficiencyChange(
                        index,
                        proficiency
                        )
                    }
                    />
                </div>

                {/* Delete */}
                <div className="flex  min-h-full items-center justify-end md:justify-center">
                    {index !== 0 && (
                    <button
                        type="button"
                        aria-label={`Remove ${item.language} from languages`}
                        title={`Remove ${item.language}`}
                        onClick={() =>
                        handleDeleteLanguage(index)
                        }
                        disabled={loading}
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition-all hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 size={17} />
                    </button>
                    )}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>

        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 border-t border-gray-100 px-6 py-4">
        <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            Cancel
        </button>

        <button
            type="button"
            disabled={loading}
            onClick={
            newlanguage
                ? handleAddLanguage
                : handleEditLanguages
            }
            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? <Loadingbtn /> : "Save"}
        </button>
        </div>
    </motion.div>
    </div>
);
}
