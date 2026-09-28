"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import Loadingbtn from "../../components/ui/Loadingbtn";
import { skillSuggestions } from "@/app/utils/skillSuggestions";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { updateTechnicalData} from "@/app/lib/Features/technicalData";
import { useShowToast } from "@/app/hooks/showToast";
import { handleAddSkill } from "../../app/utils/Skills/addskill";
import { handleRemoveSkill } from "../../app/utils/Skills/removeskill";

export default function Skillsmodel({ setmodel }) {
const dispatch = useAppDispatch();
const showToast = useShowToast();

const technicalData = useAppSelector((state) => state.technicalData)
const user = useAppSelector((state) => state.auth.user);

const [skillInput, setSkillInput] = useState("");
const [loadingApi, setLoadingApi] = useState(false);

const filteredSuggestions = skillInput.trim()
    ? skillSuggestions.filter((skill) => {
        const search = skillInput.toLowerCase();

        return (
        skill.toLowerCase().includes(search) &&
        !technicalData.skills.includes(skill)
        );
    })
    : [];

const handleCancel = () => {
    dispatch(
    updateTechnicalData({
        skills: user?.skills || [],
    })
    );

    setSkillInput("");
    setmodel(null);
};

const handleSubmit = async () => {
    setLoadingApi(true);

    try {
    const payload = {
        major: technicalData.major?.trim() || "",
        specialty: technicalData.specialty?.trim() || "",
        skills: technicalData.skills.filter(
        (skill) => skill.trim()
        ),
        bio: technicalData.bio?.trim() || "",
    };

    const response = await fetch(
        "/api/backend/freelance/update/technical",
        {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
        data.message || "Failed to update technical data"
        );
    }

    // Keep Redux updated with the saved data
    dispatch(updateTechnicalData(payload));
    showToast({
        message: "Skills updated successfully",
        type: "sucess",
    });

    setmodel(null);
    } catch (error) {
    console.error(
        "Technical settings error:",
        error
    );

    showToast({
        message:
        error.message || "Failed to save technical data",
        type: "error",
    });
    } finally {
    setLoadingApi(false);
    }
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
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">
            Edit Skills
        </h2>

        <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            <X size={18} />
        </button>
        </div>

        {/* Content */}
        <div className="p-6">
        <h6 className="my-1 font-medium">
            Your skills
        </h6>

        <div className="space-y-1.5">
            <div className="relative">
            <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                setSkillInput(e.target.value)
                }
                placeholder="Search skills"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 transition-all focus:border-[#FF7A00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"
            />

            <div className="py-1.5 text-xs text-gray-600/90">
                Maximum 20 skills.
            </div>

            {filteredSuggestions.length > 0 && (
                <div className="no-scrollbar absolute z-50 mt-2 max-h-70 w-1/2 overflow-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {filteredSuggestions.map((skill) => (
                    <button
                    key={skill}
                    type="button"
                    onClick={() =>
                        handleAddSkill({
                            skill,
                            skills: technicalData.skills,
                            dispatch,
                            setSkillInput,
                            showToast,
                            })
                    }
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-[#FFF4E8] hover:text-[#FF7A00]"
                    >
                    {skill}
                    </button>
                ))}
                </div>
            )}
            </div>

            {/* Selected Skills */}
            <div className="mt-3 flex flex-wrap gap-2">
            {technicalData.skills.map((skill) => (
                <span
                key={skill}
                className="flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FFF4E8] px-3 py-1.5 text-sm font-medium text-[#FF7A00]"
                >
                {skill}

                <button
                    type="button"
                    onClick={() =>
                    handleRemoveSkill({
                        skill,
                        skills: technicalData.skills,
                        dispatch,
                    })
                    }
                    className="text-[#FF7A00] transition-opacity hover:opacity-70"
                >
                    <X size={14} />
                </button>
                </span>
            ))}
            </div>
        </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 px-6 py-4">
        <button
            type="button"
            onClick={handleCancel}
            disabled={loadingApi}
            className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            Cancel
        </button>

        <button
            type="button"
            disabled={loadingApi}
            onClick={handleSubmit}
            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loadingApi ? <Loadingbtn /> : "Save"}
        </button>
        </div>
    </motion.div>
    </div>
);
}