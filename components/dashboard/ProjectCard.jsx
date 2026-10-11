"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    ListTodo,
    SendHorizontal,
    Users,
    MessageSquare,
    RefreshCw,
    MoreHorizontal,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────
function timeAgo(date) {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
}

const STATUS_STYLES = {
    open: { label: "Open job post", className: "bg-blue-200/80 text-blue-900" },
    draft: { label: "Draft", className: "bg-yellow-100 text-yellow-800" },
    in_progress: { label: "In progress", className: "bg-green-100 text-green-800" },
    closed: { label: "Closed", className: "bg-gray-200 text-gray-700" },
};

function StatusBadge({ status = "open" }) {
    const key = String(status).toLowerCase().replace(/[\s-]+/g, "_");
    const { label, className } = STATUS_STYLES[key] || STATUS_STYLES.open;
    return (
        <span
            className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium ${className}`}
        >
            {label}
        </span>
    );
}

function Stat({ label, icon: Icon, children }) {
    return (
        <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm text-gray-800">{label}</span>
            <div className="flex items-center gap-1.5 text-gray-800">
                <Icon size={18} strokeWidth={1.5} className="shrink-0" />
                <span className="whitespace-nowrap">{children}</span>
            </div>
        </div>
    );
}

// ── Dropdown menu (⋯) ────────────────────────────────────────────────────
function MoreMenu({ project, onEdit, onClose }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const id = project._id || project.id;

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const itemClass =
        "block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100";

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-label="More actions"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-800 transition hover:bg-gray-50"
            >
                <MoreHorizontal size={20} />
            </button>

            {open && (
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <Link href={`/nx/projects/${id}`} className={itemClass}>
                        View job post
                    </Link>
                    <button
                        type="button"
                        className={itemClass}
                        onClick={() => {
                            setOpen(false);
                            onEdit?.(project);
                        }}
                    >
                        Edit job post
                    </button>
                    <button
                        type="button"
                        className={`${itemClass} text-red-600`}
                        onClick={() => {
                            setOpen(false);
                            onClose?.(project);
                        }}
                    >
                        Close job post
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Main card ────────────────────────────────────────────────────────────
export default function ProjectCard({ project, onEdit, onClose }) {
    const id = project._id || project.id;
    console.log(project)
    const proposals = project?.proposals?.length || 0;
    const invited = project.invitedCount ?? 0;
    const maxInvites = project.maxInvites ?? 30;
    const messaged = project.messagedCount ?? 0;
    const hired = project.hiredCount ?? 0;
    const hiresNeeded = project.hiresNeeded ?? 1;

    return (
    <article className="flex flex-col gap-5 md:rounded-3xl border-t md:border border-gray-300 bg-white p-5 transition hover:border-gray-400 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
        {/* Icon + title: عرض ثابت */}
        <div className="flex items-center gap-4 lg:w-[240px] lg:shrink-0">
            <div className="flex size-15 shrink-0 items-center justify-center rounded-full bg-slate-200 text-gray-500">
                <ListTodo size={28} strokeWidth={1.5} />
            </div>
            <h4 className="line-clamp-2 min-h-14 flex-1 content-center text-base leading-7 text-gray-900">
                {project.title || "Untitled project"}
            </h4>
        </div>

        {/* Status + created: عرض ثابت */}
        <div className="flex items-center gap-4 lg:w-[250px] lg:shrink-0 lg:gap-3">
            <StatusBadge status={project.status} />
            <p className="min-h-10 max-w-[110px] text-xs  text-gray-600">
                {project.createdAt ? `Created ${timeAgo(project.createdAt)}` : ""}
            </p>
        </div>

        {/* Stats: كل عمود بعرض ثابت */}
        <div className="grid grid-cols-4 gap-3 lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-4">
            <Stat label="Invited" icon={SendHorizontal}>
                {invited}/{maxInvites}
            </Stat>
            <Stat label="Proposals" icon={Users}>
                {proposals}
            </Stat>
            <Stat label="Messaged" icon={MessageSquare}>
                {messaged}
            </Stat>
            <Stat label="Hired" icon={RefreshCw}>
                {hired}/{hiresNeeded}
            </Stat>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:ml-auto lg:shrink-0">
            <Link
                href={`/nx/projects/${id}/proposals`}
                className="flex h-10 flex-1 items-center justify-center whitespace-nowrap text-sm rounded-full bg-orange-600/80 px-4 font-semibold text-white transition hover:bg-orange-700 lg:w-[140px] lg:flex-none"
            >
                Review proposals
            </Link>
            <MoreMenu project={project} onEdit={onEdit} onClose={onClose} />
        </div>
    </article>
);
}