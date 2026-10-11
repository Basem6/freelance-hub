"use client";
import { useState } from "react";
import Link from "next/link";
import { Briefcase, Clock, ThumbsUp, ThumbsDown, Zap, ListChecks, Settings2 } from "lucide-react";

function Avatar({ freelancer }) {
    const name = freelancer?.fullName || "?";
    return(
    <img src={freelancer?.image||"/avatars/avatar-1.png"} alt={name} className="size-15.5 rounded-full object-cover" />
    )
}

function IconButton({ active, label, onClick, children }) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={onClick}
            className={`flex size-8 cursor-pointer items-center justify-center rounded-full border transition
                ${active
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-400 text-gray-800 hover:bg-gray-50"}`}
        >
            {children}
        </button>
    );
}

export default function ProposalRow({ proposal, onShortlist, onArchive }) {
    const [expanded, setExpanded] = useState(false);

    const f = proposal.freelancer || {};
    const skills = f.skills || [];
    const shownSkills = skills.slice(0, 5);
    const extra = skills.length - shownSkills.length;
    const bid = Number(proposal.bidAmount ?? proposal.bid ?? 0);
    const cover = proposal.coverLetter || "";
    const longCover = cover.length > 220;

    return (
        <article className="grid gap-5 border-b border-gray-300 px-3 md:px-6 py-6 last:border-b-0 lg:grid-cols-[1.3fr_1fr_1.6fr_1.6fr] lg:gap-6">
            {/* Freelancer */}
            <div className="flex flex-col min-w-full ">
                <div className="flex gap-4 items-start">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                        <Avatar freelancer={f} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xl text-gray-900">{f?.fullName || "Freelancer"}</h3>
                        <p className="text-gray-700 text-xs">{f?.country||"Worldwide"}</p>
                        <p className="mt-1 text-gray-900">{f?.title||"Freelancer"}</p>
                        <p className="mt-2 text-sm text-gray-800">Avg. response: {f?.avgResponse||0}</p>
                    </div>
                    
                </div>
                <div className="mt-4 h-10  w-70 justify-center flex flex-nowrap items-center gap-3">
                        <IconButton
                            label="Shortlist"
                            active={proposal.status === "shortlisted"}
                            onClick={onShortlist}
                        >
                            <ThumbsUp size={17} strokeWidth={1.5} />
                        </IconButton>
                        <IconButton
                            label="Archive"
                            active={proposal.status === "archived"}
                            onClick={onArchive}
                        >
                            <ThumbsDown size={17} strokeWidth={1.5} />
                        </IconButton>
                        <Link
                            href={`/messages?userId=${f._id || f.id ||""}`}
                            className="flex h-8 items-center rounded-full border border-orange-600 px-3 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            Message
                        </Link>
                        <Link
                            href={`/nx/hire/${proposal._id || proposal.id}`}
                            className="flex h-8 items-center rounded-full bg-orange-600/90 px-3 font-semibold text-white transition hover:bg-orange-700"
                        >
                            Hire
                        </Link>
                </div>
            </div>
            {/* Stats */}
            <div className="space-y-4 min-w-full text-gray-900">
                <p className="flex items-center gap-2">
                    <Briefcase size={18} strokeWidth={1.5} />
                    {f.completedJobs ?? 0} completed jobs
                </p>
                <p className="flex items-center gap-2">
                    <Clock size={18} strokeWidth={1.5} />
                    {f.totalHours ?? 0} total hours
                </p>
            </div>

            {/* Qualifications */}
            <div className="min-w-full">
                {f.highlightedItems > 0 && (
                    <p className="flex items-center gap-2">
                        <ListChecks size={18} strokeWidth={1.5} />
                        <span><b className="font-medium text-orange-600">{f.highlightedItems} profile items</b> highlighted</span>
                    </p>
                )}
                <p className="mt-2 flex items-center gap-2">
                    <Settings2 size={18} strokeWidth={1.5} />
                    {skills.length} skills on their profile
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                    {shownSkills.map((skill, i) => (
                        <li key={`${skill}-${i}`} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800">
                            {skill}
                        </li>
                    ))}
                    {extra > 0 && (
                        <li className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800">+{extra}</li>
                    )}
                </ul>
            </div>

            {/* Details */}
            <div className="min-w-full">
                <div className="flex items-center gap-4 min-w-90">
                    <span className="text-xl text-gray-900">
                        ${bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {proposal.boosted && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Zap size={16} strokeWidth={1.5} /> Boosted
                        </span>
                    )}
                </div>

                {cover && (
                    <div className="mt-3 text-sm text-gray-700">
                        <p className={`whitespace-pre-line leading-7 ${expanded ? "" : "line-clamp-4"}`}>
                            {cover}
                        </p>
                        {longCover && (
                            <button
                                type="button"
                                onClick={() => setExpanded((v) => !v)}
                                className="mt-1 cursor-pointer text-gray-900 underline"
                            >
                                {expanded ? "View less" : "View more"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}