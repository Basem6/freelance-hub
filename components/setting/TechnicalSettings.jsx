import {skillSuggestions} from '@/app/utils/skillSuggestions'
import Loader from "../ui/Loader"
import { useShowToast } from '@/app/hooks/showToast';
import { useAppSelector , useAppDispatch } from '@/app/lib/hooks';
import { handleRemoveSkill } from '@/app/utils/Skills/removeskill';
import { handleAddSkill } from '@/app/utils/Skills/addskill';
import { updateTechnicalData } from '@/app/lib/Features/technicalData';
import { useState } from 'react';
import { specialtyOptions } from '../../app/lib/constants/specialtyOptions';
import OptionSelect from '@/components/ui/OptionSelect';
export default function TechnicalSettings() {
const showToast = useShowToast();
const [skillInput, setSkillInput] = useState('');
const dispatch = useAppDispatch();
const [loading , setloading] = useState(false)
const technicalData= useAppSelector(state => state.technicalData);

const filteredSuggestions = skillInput.trim()
    ? skillSuggestions.filter((skill) => {
        const lowered = skill.toLowerCase();
        return lowered.includes(skillInput.toLowerCase()) && !technicalData.skills.includes(skill);
    })
    : [];

const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter' && skillInput.trim()) {
    event.preventDefault();
    handleAddSkill(
        { skill,
        skills: technicalData.skills,
        dispatch,
        setSkillInput,
        showToast})}
};

const handleChange = (event) => {
    const { name, value } = event.target;

    dispatch(
    updateTechnicalData({
        [name]: value,
    })
    );
};

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!technicalData.major?.trim()) {
    showToast({ message: "select the major", type: "warning" });
    return;
    }

    if (!technicalData.skills || technicalData.skills.length === 0) {
    showToast({ message: "add one skill at least", type: "warning" });
    return;
    }
    setloading(true)
    try {
    const response = await fetch(
        `/api/backend/freelance/update/technical`,
        {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(technicalData),
        }
    );
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "فشل حفظ البيانات التقنية");
    }

    if (!data.success) {
        throw new Error(data.message || "فشل التحديث");
    }
    dispatch(updateTechnicalData(technicalData))

    showToast({
        message: "Technical settings is saved",
        type: "sucess",
    });

    } catch (error) {
    console.error(" Technical settings error:", error);

    showToast({
        message: error.message || "error in data",
        type: "error",
    });
    } finally {
    setloading(false)
    }
};
return (
    <div className="bg-white rounded-2xl border-gray-300/60 border  p-6 lg:px-8">
    <h2 className="text-xl font-bold text-[#111111] mb-6">Technical Profile</h2>

    <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Major</label>
            <input
            type="text"
            name="major"
            value={technicalData?.major}
            onChange={handleChange}
            placeholder="Computer Science"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white"
            />
        </div>

        <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">specialty</label>
                    <OptionSelect
                    value={technicalData?.specialty}
                    options={specialtyOptions}
                    placeholder="Select a specialty "
                    onChange={(specialty) =>
                    dispatch(updateTechnicalData({ specialty }))
                    }
                    />
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
            <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 max-h-55 no-scrollbar overflow-scroll">
                {filteredSuggestions.map((skill) => (
                <button
                    key={skill}
                    type="button"
                    onClick={() =>
                    handleAddSkill({
                    skill,
                    skills: technicalData?.skills,
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

        <div className="mt-3 flex flex-wrap gap-2">
            {technicalData?.skills.map((skill) => (
            <span key={skill} className="flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FFF4E8] px-3 py-1.5 text-sm font-medium text-[#FF7A00]">
                {skill}
                <button
                type="button"
                onClick={() =>
                handleRemoveSkill({
                    skill,
                    skills: technicalData?.skills,
                    dispatch,
                })
                }
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
            name="bio"
            value={technicalData?.bio}
            onChange={handleChange}
            placeholder="Write a short professional summary about the user..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white resize-none"
        />
        </div>

        <div className="flex items-center gap-4">
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
