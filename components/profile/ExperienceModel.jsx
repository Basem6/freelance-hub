import { motion } from "framer-motion";
import { X } from "lucide-react";
import { updateTechnicalData} from "@/app/lib/Features/technicalData";
import { useAppDispatch, useAppSelector } from "../../app/lib/hooks";
import { useState } from "react";
import { InputGroup } from "../ui/InputGroup";
export default function Experiencemodel({setmodel }) {
const dispatch = useAppDispatch()
const user = useAppSelector((state) => state.auth.user);
const [formData, setFormData] = useState({subject:  "",description:  "",});
const handleCancel = () => {
    dispatch(
    updateTechnicalData({
        skills: user?.skills || [],
    })
    );
    setmodel(null);
};
const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
const handleSubmit = async () => { 
};
return(
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
        className="relative w-full  max-w-3xl rounded-2xl bg-white "
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-2xl font-semibold">
            Experience
        </h2>

        <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
            <X size={18} />
        </button>
        </div>
        <div className="p-6 flex flex-col  gap-5">
            <InputGroup label="Subject" name="subject"  value={formData.subject} placeholder={"Enter subject"} onChange={handleChange} />
            <textarea
                rows="6"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description about the experience..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all bg-gray-50 focus:bg-white resize-none"
            />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-5 px-6 py-4">
        <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-200 px-5 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            Cancel
        </button>

        <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
            { "Save"}
        </button>
        </div>
    </motion.div>
    </div>
)
}