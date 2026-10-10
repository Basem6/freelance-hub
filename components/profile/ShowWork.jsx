"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ExternalLink, Link as LinkIcon } from "lucide-react";

export default function ShowWork({
setmodel,
selectedPortfolioItem,
setSelectedPortfolioItem,
}) {
const item = selectedPortfolioItem;

const closeModal = () => {
    setmodel(null);
    setSelectedPortfolioItem?.(null);

    document.querySelector(".parent")?.classList.remove("noscrol");
};

useEffect(() => {
    const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
}, []);

if (!item) return null;

return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-8">
    {/* Overlay */}
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
    />

    {/* Modal */}
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-title"
        className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl md:h-[88vh] md:max-w-6xl md:rounded-3xl"
    >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-5 md:px-7">
        <h2
            id="work-title"
            className="min-w-0 truncate text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
        >
            {item.title}
        </h2>

        <button
            type="button"
            onClick={closeModal}
            aria-label="Close project"
            className="ml-4 shrink-0 rounded-full p-2 text-gray-700 transition hover:bg-gray-100"
        >
            <X size={24} strokeWidth={1.5} />
        </button>
        </header>

        {/* Content */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)] md:overflow-hidden">
        {/* Left: Project information */}
        <aside className="order-2 border-gray-100 bg-white p-5 md:order-1 md:overflow-y-auto md:border-r md:p-7">
            {/* Role */}
            {item.roleOwn && (
            <section className="mb-7">
                <p className="mb-1 text-sm text-gray-500">My role</p>
                <p className="text-base font-medium text-gray-800">
                {item.roleOwn}
                </p>
            </section>
            )}

            {/* Description */}
            {item.description && (
            <section className="mb-7">
                <h3 className="mb-3 text-sm font-medium text-gray-500">
                Project description
                </h3>

                <p className="whitespace-pre-line text-[15px] leading-6 text-gray-800">
                {item.description}
                </p>
            </section>
            )}

            {/* Category */}
            {item.category && (
            <section className="mb-6">
                <p className="mb-2 text-sm text-gray-500">Category</p>

                <span className="inline-flex rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                {item.category}
                </span>
            </section>
            )}

            {/* Skills */}
            {item.skills?.length > 0 && (
            <section className="mb-7">
                <h3 className="mb-3 text-sm font-medium text-gray-500">
                Skills and deliverables
                </h3>

                <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                    <span
                    key={`${skill}-${index}`}
                    className="rounded-md bg-[#E4EBEF] px-3 py-1.5 text-sm text-gray-800"
                    >
                    {skill}
                    </span>
                ))}
                </div>
            </section>
            )}

            {/* Live project */}
            {item.liveUrl && (
            <section className="mb-7">
                <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100"
                >
                <div className="min-w-0">
                    <p className="mb-1 truncate text-sm font-medium text-gray-800 underline underline-offset-2">
                    {item.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                    View live project
                    </p>
                </div>

                <ExternalLink
                    size={21}
                    strokeWidth={1.5}
                    className="shrink-0 text-gray-500 transition group-hover:text-gray-900"
                />
                </a>
            </section>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
            <button
                type="button"
                onClick={closeModal}
                className="text-sm font-medium text-gray-600 underline underline-offset-2 transition hover:text-gray-900"
            >
                Close project details
            </button>
            </div>
        </aside>

        {/* Right: Project preview */}
        <main className="order-1 min-w-0 bg-white p-4 md:order-2 md:overflow-y-auto md:p-6">
            {/* Live website card */}
            {item.liveUrl && (
            <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-4 transition hover:bg-gray-100"
            >
                <div className="flex min-w-0 items-center gap-3">
                

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800 underline underline-offset-2">
                    {item.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                    Open in a new tab
                    </p>
                </div>
                </div>

                <ExternalLink
                size={21}
                strokeWidth={1.5}
                className="shrink-0 text-gray-500"
                />
            </a>
            )}

            {/* Cover image */}
            {item.coverImage ? (
            <a
                href={item.liveUrl || item.coverImage}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden border border-gray-100 bg-gray-50"
            >
                <img
                src={item.coverImage}
                alt={`${item.title} project preview`}
                className="h-auto w-full object-cover object-top transition duration-500 group-hover:scale-[1.01]"
                />
            </a>
            ) : (
            <div className="flex min-h-72 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
                No project preview available
            </div>
            )}
        </main>
        </div>
    </motion.div>
    </div>
);
}