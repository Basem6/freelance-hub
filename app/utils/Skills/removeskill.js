import { updateTechnicalData } from "../../lib/Features/technicalData";

export const handleRemoveSkill = ({
skill,
skills,
dispatch,
}) => {
dispatch(
    updateTechnicalData({
    skills: skills.filter((item) => item !== skill),
    })
);
};