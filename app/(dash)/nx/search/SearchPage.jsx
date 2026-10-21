"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {  Funnel, Search} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks";
import { clearSearchResults, searchDirectory } from "../../../lib/Features/searchSlice";
import { specialtyOptions } from "../../../lib/constants/specialtyOptions";
import Highlight from "../../../../components/Highlight";
import SearchResultSkeleton from "../../../../components/search/SearchResultSkeleton";
import Image from "next/image";
import { timeAgo } from "../../../utils/handletime";

const PAGE_SIZE = 10;
const STATUS_LABELS = {
    open: "Open",
    in_progress: "In Progress",
    closed: "Closed",
};

function useDebouncedValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debouncedValue;
}

function FreelancerCard({ freelancer }) {
    const id = freelancer.id || freelancer._id;
    const name = freelancer.name || freelancer.fullName || "Freelancer";
    const formattedName = freelancer._formatted?.name ?? name;
    const formattedTitle = freelancer._formatted?.title ?? freelancer.title ?? "Freelancer";
    const skills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
    const formattedSkills = Array.isArray(freelancer._formatted?.skills)
        ? freelancer._formatted.skills
        : skills;
    const initials = name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <article className=" border-b border-gray-200 bg-white p-5 transition">
            <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                    {freelancer.image ? (
                        <img src={freelancer.image} alt="" className="size-full object-cover" />
                    ) : initials}
                </div>
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/hire/${encodeURIComponent(id)}`}
                        className="font-semibold text-gray-900 hover:text-orange-700"
                    >
                        <Highlight text={formattedName} />
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">
                        <Highlight text={formattedTitle} />
                    </p>
                </div>
                {Number.isFinite(freelancer.rate) && (
                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                        ${freelancer.rate}/hr
                    </p>
                )}
            </div>

            {freelancer.bio && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                    {freelancer.bio}
                </p>
            )}
            {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {formattedSkills.map((skill, index) => (
                        <span
                            key={`${skills[index] ?? index}-${index}`}
                            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                        >
                            <Highlight text={skill ?? skills[index]} />
                        </span>
                    ))}
                </div>
            )}
        </article>
    );
}

function JobCard({ job }) {
    const id = job.id || job._id;
    const skills = Array.isArray(job.skills) ? job.skills : [];
    const shownSkills = skills.slice(0, 5);
    const formattedSkills = (Array.isArray(job._formatted?.skills)
        ? job._formatted.skills
        : skills
    ).slice(0, 5);
    const title = job.title || "Untitled job";
    const formattedTitle = job._formatted?.title ?? title;
    const description = job._formatted?.description ?? job.description;
    const status = String(job.status || "open").toLowerCase().replace(/[\s-]+/g, "_");
    const statusClass = status === "open"
        ? "border-green-200 bg-green-300/40 text-green-900"
        : status === "in_progress"
            ? "border-blue-200 bg-blue-300/40 text-blue-900"
            : "border-gray-200 bg-gray-300/40 text-gray-800";

    return (
        <Link href={`/findworks/${encodeURIComponent(id)}`} className="block">
            <motion.article
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden   border-b border-gray-400/60 bg-white px-1 py-2 transition-colors duration-200 hover:bg-gray-200/60"
            >
                <div className="space-y-2 pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-sm border px-2.5 py-0.5 text-xs ${statusClass}`}>
                            {STATUS_LABELS[status] || job.status || "Open"}
                        </span>

                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {job.createdAt && <span>Posted {timeAgo(job.createdAt)}</span>}
                        {job.createdAt && <span aria-hidden="true">|</span>}
                        <span>{job.proposals?.length || 0} proposals</span>
                    </div>

                    <div>
                        <h2 className="mb-1 w-fit border-b-2 border-transparent text-base leading-6 text-[#111111] hover:border-gray-800">
                            <Highlight text={formattedTitle} />
                        </h2>
                        {description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                                <Highlight text={description} maxLength={300} />
                            </p>
                        )}
                    </div>

                    {shownSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {shownSkills.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="rounded-sm bg-gray-300/60 px-2.5 py-1 text-xs font-medium text-gray-600"
                                >
                                    <Highlight text={formattedSkills[index] ?? skill} />
                                </span>
                            ))}
                            {skills.length > 5 && (
                                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                                    +{skills.length - 5}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </motion.article>
        </Link>
    );
}

export default function SearchPage({ initialType = "freelancers" }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const paramsKey = searchParams.toString();
    const dispatch = useAppDispatch();
    const { results, page: currentPage, total, totalPages, status, error } = useAppSelector(
        (state) => state.search
    );
    const paramsRef = useRef(new URLSearchParams(paramsKey));
    const requestedType = searchParams.get("type");
    const type = requestedType === "jobs" || requestedType === "freelancers"
        ? requestedType
        : initialType;
    const defaultSort = type === "freelancers" ? "rate:asc" : "createdAt:desc";
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const skills = searchParams.get("skills") || "";
    const minAmount = searchParams.get(type === "freelancers" ? "minRate" : "minBudget") || "";
    const maxAmount = searchParams.get(type === "freelancers" ? "maxRate" : "maxBudget") || "";
    const sort = searchParams.get("sort") || defaultSort;
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
    const debouncedQuery = useDebouncedValue(query, 300);
    const debouncedSearchQuery = [debouncedQuery, category].filter(Boolean).join(" ");
    const isFreelancerSearch = type === "freelancers";

    useEffect(() => {
        paramsRef.current = new URLSearchParams(paramsKey);
    }, [paramsKey]);

    function updateParams(updates, resetPage = false) {
        const params = new URLSearchParams(paramsRef.current);
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === "") params.delete(key);
            else params.set(key, value);
        }
        if (resetPage) params.set("page", "1");

        paramsRef.current = params;
        const search = params.toString();
        router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    }

    useEffect(() => {
        const params = new URLSearchParams(paramsKey);
        const urlType = params.get("type");
        const urlPage = Number.parseInt(params.get("page") || "", 10);
        const hasValidPage = Number.isInteger(urlPage) && urlPage > 0;

        if (
            urlType === type &&
            params.get("sort") === sort &&
            hasValidPage
        ) {
            return;
        }

        params.set("type", type);
        params.set("sort", sort);
        if (!hasValidPage) params.set("page", "1");

        paramsRef.current = params;
        const search = params.toString();
        router.replace(`${pathname}?${search}`, { scroll: false });
    }, [paramsKey, pathname, router, sort, type]);

    useEffect(() => {
        if (debouncedQuery !== query) return;

        const params = {
            q: debouncedSearchQuery,
            page,
            limit: PAGE_SIZE,
            sort,
        };
        if (skills.trim()) params.skills = skills.trim();
        if (minAmount !== "") params[isFreelancerSearch ? "minRate" : "minBudget"] = minAmount;
        if (maxAmount !== "") params[isFreelancerSearch ? "maxRate" : "maxBudget"] = maxAmount;

        const request = dispatch(searchDirectory({ type, params }));
        return () => request.abort();
    }, [dispatch, type, query, debouncedQuery, debouncedSearchQuery, skills, minAmount, maxAmount, sort, page, isFreelancerSearch]);

    useEffect(() => () => {
        dispatch(clearSearchResults());
    }, [dispatch]);

    function changeType(nextType) {
        updateParams({
            type: nextType,
            sort: nextType === "freelancers" ? "rate:asc" : "createdAt:desc",
            minRate: null,
            maxRate: null,
            minBudget: null,
            maxBudget: null,
        }, true);
    }

    return (
        <main className="mx-auto w-full md:pt-15   max-w-7xl p-4 sm:px-6 lg:px-8">

            <section className="mb-6 md:p-4 px-1  flex items-center  gap-4">
                <div className="relative md:w-120 md:grow-0 grow">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/90"
                        size={20}
                        strokeWidth={1}
                    />
                    <input
                        id="marketplace-search"
                        type="search"
                        value={query}
                        onChange={(event) => {
                            updateParams({ q: event.target.value }, true);
                        }}
                        placeholder={isFreelancerSearch
                            ? "Search"
                            : "Search"}
                        className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black/500 focus:ring-2 focus:ring-black/30"
                    />
                </div>
                <button className="md:hidden  size-10 flex justify-center items-center rounded-full border border-orange-500">
                        <Funnel strokeWidth={1} size={23} className="text-orange-500"/>
                </button>

            </section>

            <div className="grid  pb-5 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
                <aside className="h-fit md:block hidden rounded-2xl   bg-white p-5">
                    <h2 className="mb-4 text-base  text-gray-900">
                        Categories
                    </h2>
                    <nav aria-label="Filter results by category" className="space-y-1">
                        <button
                            type="button"
                            aria-pressed={!category}
                            onClick={() => updateParams({ category: null }, true)}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                !category
                                    ? "bg-gray-100 font-semibold text-gray-950"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                            }`}
                        >
                            All categories
                        </button>
                        {specialtyOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                aria-pressed={category === option}
                                onClick={() => updateParams({ category: option }, true)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                                    category === option
                                        ? "bg-gray-100 font-semibold text-gray-950"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0">
                    <section aria-live="polite">
                        {status === "loading" && (
                            <SearchResultSkeleton
                                type={type}
                                count={5}
                            />
                        )}
                        {status === "failed" && (
                            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
                                {error || "Search failed. Please try again."}
                            </div>
                        )}
                        {status === "succeeded" && results.length === 0 && (
                            <div className="rounded-xl  flex flex-col justify-center items-center bg-white p-8 text-center">
                                <div className="overflow-hidden size-55">
                                    <Image  width={55} height={55} alt="notfound"  className="w-full h-full"  src={"/photoMeaning/not_found.svg"}/>
                                </div>
                                <p className="text-gray-700">No results found</p>
                            </div>
                        )}
                        {status === "succeeded" && results.length > 0 && (
                            <div className="space-y-3">
                                {results.map((result, index) => {
                                    
                                    const id = result.id || result._id || `${result.title}-${index}`;
                                    return isFreelancerSearch ? (
                                        <FreelancerCard key={id} freelancer={result} />
                                    ) : (
                                        <JobCard key={id} job={result} />
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {status === "succeeded" && totalPages > 1 && (
                        <nav aria-label="Search result pages" className="mt-6 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                disabled={currentPage <= 1 || status === "loading"}
                                onClick={() => updateParams({ page: String(Math.max(1, currentPage - 1)) })}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={currentPage >= totalPages || status === "loading"}
                                onClick={() => updateParams({ page: String(currentPage + 1) })}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </main>
    );
}
