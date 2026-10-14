"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Search, UsersRound } from "lucide-react";

function getFreelancer(record) {
    return record?.freelancer || record?.user || record || {};
}

function getRecordId(record, index) {
    const freelancer = getFreelancer(record);
    return record?._id || record?.id || freelancer?._id || freelancer?.id || index;
}

function getSkills(freelancer) {
    return Array.isArray(freelancer?.skills) ? freelancer.skills : [];
}

function PersonRow({ record, kind }) {
    const freelancer = getFreelancer(record);
    const id = freelancer._id || freelancer.id;
    const skills = getSkills(freelancer);
    const shownSkills = skills.slice(0, 5);
    const extraSkills = skills.length - shownSkills.length;
    const name = freelancer.fullName || freelancer.name || "Freelancer";
    const bid = Number(record?.bidAmount ?? record?.bid ?? 0);
    const profileHref = id ? `/hire/${id}` : null;

    return (
        <article className="grid gap-5 border-b border-gray-300 px-3 py-6 last:border-b-0 md:px-6 lg:grid-cols-[1.3fr_1fr_1.6fr_1.6fr] lg:gap-6">
            <div className="flex min-w-0 flex-col">
                <div className="flex items-start gap-4">
                    <Image
                        src={freelancer.image || "/avatars/avatar-1.png"}
                        alt=""
                        width={62}
                        height={62}
                        className="size-15.5 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <h3 className="text-xl text-gray-900">{name}</h3>
                        <p className="text-xs text-gray-700">{freelancer.country || "Worldwide"}</p>
                        <p className="mt-1 text-gray-900">{freelancer.title || "Freelancer"}</p>
                        {freelancer.avgResponse && (
                            <p className="mt-2 text-sm text-gray-800">
                                Avg. response: {freelancer.avgResponse}
                            </p>
                        )}
                    </div>
                </div>
                {profileHref && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            href={`/messages?userId=${id}`}
                            className="flex h-9 items-center rounded-full border border-orange-600 px-4 font-semibold text-orange-600 transition hover:bg-orange-50"
                        >
                            Message
                        </Link>
                        {kind === "invites" && (
                            <Link
                                href={profileHref}
                                className="flex h-9 items-center rounded-full bg-orange-600/90 px-4 font-semibold text-white transition hover:bg-orange-700"
                            >
                                View profile
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="min-w-0 space-y-4 text-gray-900">
                <p>{freelancer.completedJobs ?? 0} completed jobs</p>
                <p>{freelancer.totalHours ?? 0} total hours</p>
            </div>

            <div className="min-w-0">
                {freelancer.highlightedItems > 0 && (
                    <p className="mb-2 text-sm text-gray-800">
                        <b className="font-medium text-orange-600">{freelancer.highlightedItems} profile items</b>
                        {" "}highlighted
                    </p>
                )}
                <p className="text-sm text-gray-800">{skills.length} skills on their profile</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                    {shownSkills.map((skill, skillIndex) => (
                        <li
                            key={`${skill}-${skillIndex}`}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800"
                        >
                            {skill}
                        </li>
                    ))}
                    {extraSkills > 0 && (
                        <li className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-800">
                            +{extraSkills}
                        </li>
                    )}
                </ul>
            </div>

            <div className="min-w-0">
                {kind === "hires" ? (
                    <>
                        <p className="text-xl text-gray-900">
                            ${bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        {record?.deliveryTime && (
                            <p className="mt-2 text-sm text-gray-700">
                                Delivery: {record.deliveryTime}
                            </p>
                        )}
                        {record?.coverLetter && (
                            <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                                {record.coverLetter}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-sm leading-7 text-gray-700">
                        {freelancer.overview || freelancer.bio || "Review this freelancer’s profile and skills."}
                    </p>
                )}
            </div>
        </article>
    );
}

function EmptyState({ kind }) {
    if (kind === "hires") {
        return (
            <div className="flex flex-col items-center px-6 py-12 text-center md:py-16">
                <Image
                    src="/photoMeaning/no_hires.svg"
                    alt=""
                    width={300}
                    height={225}
                    className="mb-6 h-auto w-full max-w-72"
                />
                <h2 className="text-xl font-medium text-gray-900">No hires yet</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                    Once you hire a freelancer for this project, they’ll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <UsersRound size={30} strokeWidth={1.5} />
            </span>
            <h2 className="mt-5 text-xl font-medium text-gray-900">No freelancer suggestions yet</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                Suggested freelancers for this project will appear here when they’re available.
            </p>
        </div>
    );
}

export default function ProjectPeopleClient({
    kind,
    initialRecords = [],
    error = "",
}) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const title = kind === "hires" ? "All hires" : "Suggested freelancers";

    const visibleRecords = useMemo(() => {
        const search = query.trim().toLowerCase();
        let records = initialRecords.filter((record) => {
            if (!search) return true;
            const freelancer = getFreelancer(record);
            return [
                freelancer.fullName,
                freelancer.name,
                freelancer.title,
                freelancer.country,
                freelancer.overview,
                freelancer.bio,
                ...getSkills(freelancer),
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(search));
        });

        if (sort === "name") {
            records = [...records].sort((a, b) =>
                String(getFreelancer(a).fullName || getFreelancer(a).name || "").localeCompare(
                    String(getFreelancer(b).fullName || getFreelancer(b).name || "")
                )
            );
        } else if (sort === "lowest" && kind === "hires") {
            records = [...records].sort(
                (a, b) => Number(a.bidAmount ?? a.bid ?? 0) - Number(b.bidAmount ?? b.bid ?? 0)
            );
        } else if (sort === "highest" && kind === "hires") {
            records = [...records].sort(
                (a, b) => Number(b.bidAmount ?? b.bid ?? 0) - Number(a.bidAmount ?? a.bid ?? 0)
            );
        } else {
            records = [...records].sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );
        }
        return records;
    }, [initialRecords, kind, query, sort]);

    return (
        <section className="mt-10 pb-15">
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-gray-300">
                <h2 className="-mb-px border-b-3 border-black/90 pb-3 text-lg text-gray-900">
                    {title} ({initialRecords.length})
                </h2>
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
                <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-gray-300 px-4 focus-within:border-orange-500 md:max-w-sm">
                    <Search size={20} strokeWidth={1.5} className="text-gray-600" />
                    <input
                        aria-label={`Search ${title.toLowerCase()}`}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search"
                        className="w-full bg-transparent outline-none"
                    />
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 md:ml-auto">
                    Sort:
                    <span className="relative">
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="h-12 cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white pl-4 pr-10 text-base text-gray-900 outline-none focus:border-orange-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="name">Name</option>
                            {kind === "hires" && (
                                <>
                                    <option value="lowest">Lowest bid</option>
                                    <option value="highest">Highest bid</option>
                                </>
                            )}
                        </select>
                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        />
                    </span>
                </label>
            </div>

            {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="mt-6 overflow-hidden border-t border-gray-300 bg-white md:rounded-3xl md:border">
                <div className="hidden grid-cols-[1.3fr_1fr_1.6fr_1.6fr] gap-6 border-b border-gray-300 px-6 py-5 font-medium text-gray-900 lg:grid">
                    <span>Freelancer</span>
                    <span>Stats</span>
                    <span>Qualifications</span>
                    <span>Details</span>
                </div>
                {error ? null : visibleRecords.length === 0 ? (
                    query ? (
                        <p className="px-6 py-16 text-center text-gray-500">
                            No {kind === "hires" ? "hires" : "freelancers"} match your search.
                        </p>
                    ) : (
                        <EmptyState kind={kind} />
                    )
                ) : (
                    visibleRecords.map((record, index) => (
                        <PersonRow
                            key={getRecordId(record, index)}
                            record={record}
                            kind={kind}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
