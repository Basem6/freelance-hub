"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { updateTechnicalData } from "@/app/lib/Features/technicalData";
import { useAppDispatch,useAppSelector  } from "@/app/lib/hooks";
import { useShowToast } from "@/app/hooks/showToast";
import api from "../../app/utils/api";

export default function Deletemodel({ setmodel, item }) {
const dispatch = useAppDispatch();
const technicalData= useAppSelector(state => state.technicalData);
const showToast = useShowToast();

const [loading, setLoading] = useState(false);

const handleCancel = () => {
    if (loading) return;
    setmodel(null);
};

const handleSubmit = async () => {
    if (!item?._id || loading) return;

    setLoading(true);

    try {
    const updatedPortfolio = technicalData.portfolio.filter(
        (i) => i._id !== item._id
    );

    const response = await fetch(
        "/api/backend/freelance/update/technical",
        {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            portfolio: updatedPortfolio,
        }),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
        data.message || "Failed to delete portfolio project"
        );
    }

    dispatch(
        updateTechnicalData({
        portfolio: data.freelancer.portfolio,
        })
    );

    showToast({
        message: "Portfolio project deleted successfully",
        type: "sucess",
    });

    setmodel(null);
    } catch (error) {
    console.error("Delete portfolio error:", error);

    showToast({
        message:
        error.message || "Failed to delete portfolio project",
        type: "error",
    });
    } finally {
    setLoading(false);
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
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-2xl font-semibold text-gray-900">
            Delete portfolio project
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
        <div className="min-h-40 px-6 py-8">
        <p className="text-sm leading-6 text-gray-700/90">
            This action will delete{" "}
            <span className="font-semibold text-gray-900">
            "{item?.title || "Project"}"
            </span>{" "}
            from your portfolio. Are you sure you want to delete this
            portfolio project?
        </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
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
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-500 px-5 py-2 font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
        </div>
    </motion.div>
    </div>
);
}

