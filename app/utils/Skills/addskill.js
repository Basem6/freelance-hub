import { updateTechnicalData } from "../../lib/Features/technicalData";

export const handleAddSkill = ({
skill,
skills,
dispatch,
setSkillInput,
showToast,
}) => {
const newSkill = skill.trim();

if (!newSkill) return;

if (skills.includes(newSkill)) {
    setSkillInput("");
    return;
}

if (skills.length >= 20) {
    showToast({
    message: "Maximum 20 skills allowed",
    type: "warning",
    });
    return;
}

dispatch(
    updateTechnicalData({
    skills: [...skills, newSkill],
    })
);

setSkillInput("");
};