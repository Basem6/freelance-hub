"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
Search,
SlidersHorizontal,
X,
Star,
DollarSign,
ChevronDown,
CheckCircle,
AlertCircle,
ArrowRight,
Users,
Globe,
Filter,
} from "lucide-react";
import Link from "next/link";

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES = ['All','Development', 'Design', 'Translation', 'Marketing', 'Writing', 'Data', 'Video Editing', 'Consulting']

const AVAILABILITY_LABELS = {
available: "Available Now",
busy: "Unavailable",
};

const SORT_OPTIONS = [
{ value: "rating", label: "Top Rated" },
{ value: "rate_low", label: "Lowest Rate" },
{ value: "rate_high", label: "Highest Rate" },
{ value: "projects", label: "Most Projects" },
];

// ─── Freelancer Card ─────────────────────────────────────────────────────────

function FreelancerCard({ freelancer: f }) {
const skills = Array.isArray(f?.skills) ? f.skills : [];

const shown = skills.slice(0, 4);
const extra = Math.max(0, skills.length - 4);

const isAvailable = f?.online === true;

return (
    <motion.article
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ duration: 0.25 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
    >
    {/* Hover accent */}
    <div className="h-1 w-full bg-gradient-to-r from-[#FF7A00] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

    <div className="p-6 space-y-4">

        {/* Header */}
        <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="relative shrink-0">
            <div className="size-16 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
            <Image
                src={f?.image || "/avatars/avatar-1.png"}
                alt={f?.fullName || "Freelancer"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
            />
            </div>

            {/* Online indicator */}
            <span
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                isAvailable ? "bg-green-500" : "bg-gray-400"
            }`}
            />
        </div>

        {/* Name + title */}
        <div className="flex-1 min-w-0">

            <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[#111111] truncate group-hover:text-[#FF7A00] transition-colors">
                {f?.fullName || "Unknown Freelancer"}
            </h3>

            <span
                className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isAvailable
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
            >
                <span
                className={`w-1.5 h-1.5 rounded-full ${
                    isAvailable
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-400"
                }`}
                />

                {isAvailable
                ? AVAILABILITY_LABELS.available
                : AVAILABILITY_LABELS.busy}
            </span>
            </div>

            <p className="text-sm text-gray-500 truncate mb-1.5">
            {f?.major || "Software Engineer"}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />

            <span className="text-sm font-semibold text-[#111111]">
                {f?.rating ?? 0}
            </span>

            <span className="text-xs text-gray-400">
                ({f?.reviews ?? 0} reviews)
            </span>
            </div>
        </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {f?.bio || "Frontend developer specialized in building modern web applications."}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
        {shown.map((skill, index) => (
            <span
            key={`${String(skill)}-${index}`}
            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
            >
            {skill}
            </span>
        ))}

        {extra > 0 && (
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-400">
            +{extra}
            </span>
        )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 gap-3 flex-wrap">

        <div className="flex items-center gap-4 text-xs text-gray-500">

            {/* Jobs */}
            <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />

            <span className="font-semibold text-gray-800">
                {f?.completedProjects ?? 0}
            </span>

            jobs
            </span>

            {/* Rate */}
            <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#FF7A00]" />

            <span className="font-bold text-[#FF7A00]">
                ${f?.hourlyRate ?? 0}
            </span>

            /hr
            </span>

            {/* Language */}
            <span className="hidden sm:flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />

            {Array.isArray(f?.languages) && f.languages.length > 0
                ? f.languages[0]
                : "English"}
            </span>
        </div>

        {/* Profile */}
        <Link
            href={`/hire/${f?._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-xs font-bold rounded-xl shadow shadow-orange-400/30 hover:shadow-md hover:shadow-orange-400/40 transition-all shrink-0"
        >
            View Profile

            <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        </div>
    </div>
    </motion.article>
);
}

// ─── Filters Panel ───────────────────────────────────────────────────────────

function FiltersPanel({
filters,
setFilters,
freelancers,
}) {

const toggle = (key, value) => {
    setFilters((prev) => {
    const arr = prev[key] || [];

    return {
        ...prev,
        [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    };
    });
};

const CheckRow = ({
    id,
    label,
    checked,
    onChange,
}) => (
    <label
    htmlFor={id}
    className="flex items-center gap-2 cursor-pointer group py-0.5"
    >
    <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#FF7A00] rounded cursor-pointer"
    />

    <span className="text-sm text-gray-600 group-hover:text-[#FF7A00] transition-colors">
        {label}
    </span>
    </label>
);

return (
    <div className="space-y-7">

    {/* Category */}
    <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Category
        </p>

        <div className="space-y-1">
        {CATEGORIES.filter((c) => c !== "All").map((category) => (
            <CheckRow
            key={category}
            id={`fc-${category}`}
            label={category}
            checked={(filters.categories || []).includes(category)}
            onChange={() =>
                toggle("categories", category)
            }
            />
        ))}
        </div>
    </div>


    {/* Availability */}
    <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Availability
        </p>

        <div className="space-y-1">
        {Object.keys(AVAILABILITY_LABELS).map((availability) => (
            <CheckRow
            key={availability}
            id={`fa-${availability}`}
            label={AVAILABILITY_LABELS[availability]}
            checked={(filters.availability || []).includes(
                availability
            )}
            onChange={() =>
                toggle("availability", availability)
            }
            />
        ))}
        </div>
    </div>

    {/* Rating */}
    <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Minimum Rating
        </p>

        <div className="space-y-1">
        {[4.5, 4, 3.5].map((rating) => (
            <label
            key={rating}
            htmlFor={`fr-${rating}`}
            className="flex items-center gap-2 cursor-pointer group py-0.5"
            >
            <input
                id={`fr-${rating}`}
                type="radio"
                name="minRating"
                checked={filters.minRating === rating}
                onChange={() =>
                setFilters((prev) => ({
                    ...prev,
                    minRating: rating,
                }))
                }
                className="w-4 h-4 accent-[#FF7A00] cursor-pointer"
            />

            <span className="text-sm text-gray-600 group-hover:text-[#FF7A00] transition-colors flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />

                {rating}+ stars
            </span>
            </label>
        ))}

        {filters.minRating !== undefined && (
            <button
            onClick={() =>
                setFilters((prev) => ({
                ...prev,
                minRating: undefined,
                }))
            }
            className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
            >
            Clear rating filter
            </button>
        )}
        </div>
    </div>
    </div>
);
}

// ─── Active Chips ─────────────────────────────────────────────────────────────

function ActiveChips({
filters,
setFilters,
}) {
const chips = [
    ...(filters.categories || []).map((category) => ({
    label: category,
    remove: () =>
        setFilters((prev) => ({
        ...prev,
        categories: prev.categories.filter(
            (value) => value !== category
        ),
        })),
    })),


    ...(filters.availability || []).map((availability) => ({
    label: AVAILABILITY_LABELS[availability],
    remove: () =>
        setFilters((prev) => ({
        ...prev,
        availability: prev.availability.filter(
            (value) => value !== availability
        ),
        })),
    })),


    ...(filters.rateMin !== undefined
    ? [
        {
            label: `Min $${filters.rateMin}/hr`,
            remove: () =>
            setFilters((prev) => ({
                ...prev,
                rateMin: undefined,
            })),
        },
        ]
    : []),

    ...(filters.rateMax !== undefined
    ? [
        {
            label: `Max $${filters.rateMax}/hr`,
            remove: () =>
            setFilters((prev) => ({
                ...prev,
                rateMax: undefined,
            })),
        },
        ]
    : []),

    ...(filters.minRating !== undefined
    ? [
        {
            label: `${filters.minRating}+ stars`,
            remove: () =>
            setFilters((prev) => ({
                ...prev,
                minRating: undefined,
            })),
        },
        ]
    : []),
];

if (!chips.length) return null;

return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
    {chips.map((chip, index) => (
        <span
        key={`${chip.label}-${index}`}
        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-orange-50 border border-orange-200 text-[#FF7A00] text-xs font-semibold rounded-full"
        >
        {chip.label}

        <button
            onClick={chip.remove}
            className="hover:text-orange-800 transition-colors"
        >
            <X className="w-3 h-3" />
        </button>
        </span>
    ))}

    <button
        onClick={() => setFilters({})}
        className="text-xs text-gray-400 hover:text-red-500 font-medium underline underline-offset-2 transition-colors"
    >
        Clear all
    </button>
    </div>
);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FreelancersClient({
freelancers: initialFreelancers = [],
}) {
const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
const [filters, setFilters] = useState({});
const [sort, setSort] = useState("rating");
const [drawerOpen, setDrawerOpen] = useState(false);
const [visibleCount, setVisibleCount] = useState(6);

// Make sure freelancers is always an array
const freelancers = Array.isArray(initialFreelancers)
    ? initialFreelancers
    : [];

// ─── Filter + Search + Sort ────────────────────────────────────────────────

const filtered = useMemo(() => {
    let result = [...freelancers];

    // Search
    if (search.trim()) {
    const query = search.toLowerCase().trim();

    result = result.filter((f) => {
        const name = String(f?.fullName || "").toLowerCase();
        const major = String(f?.major || "").toLowerCase();
        const title = String(f?.title || "").toLowerCase();
        const bio = String(f?.bio || "").toLowerCase();

        const skills = Array.isArray(f?.skills)
        ? f.skills.map((skill) =>
            String(skill).toLowerCase()
            )
        : [];

        return (
        name.includes(query) ||
        major.includes(query) ||
        title.includes(query) ||
        bio.includes(query) ||
        skills.some((skill) =>
            skill.includes(query)
        )
        );
    });
    }

    // Active category
    if (activeCategory !== "All") {
    result = result.filter(
        (f) => f?.specialty === activeCategory
    );
    }

    // Categories
    if (filters.categories?.length) {
    result = result.filter((f) =>
        filters.categories.includes(f?.specialty)
    );
    }


    // Availability
    if (filters.availability?.length) {
    result = result.filter((f) => {
        const isOnline = f?.online === true || f?.online === "true";

        return filters.availability.some((availability) =>
        availability === "available" ? isOnline : !isOnline
        );
    });
    }
    // Min rate
    if (filters.rateMin !== undefined) {
    result = result.filter(
        (f) =>
        Number(f?.hourlyRate || 0) >=
        Number(filters.rateMin)
    );
    }

    // Max rate
    if (filters.rateMax !== undefined) {
    result = result.filter(
        (f) =>
        Number(f?.hourlyRate || 0) <=
        Number(filters.rateMax)
    );
    }

    // Rating
    if (filters.minRating !== undefined) {
    result = result.filter(
        (f) =>
        Number(f?.rating || 0) >=
        Number(filters.minRating)
    );
    }

    // Sort
    result.sort((a, b) => {
    if (sort === "rating") {
        return (
        Number(b?.rating || 0) -
        Number(a?.rating || 0)
        );
    }

    if (sort === "rate_low") {
        return (
        Number(a?.hourlyRate || 0) -
        Number(b?.hourlyRate || 0)
        );
    }

    if (sort === "rate_high") {
        return (
        Number(b?.hourlyRate || 0) -
        Number(a?.hourlyRate || 0)
        );
    }

    if (sort === "projects") {
        return (
        Number(b?.completedProjects || 0) -
        Number(a?.completedProjects || 0)
        );
    }

    return 0;
    });

    return result;
}, [
    freelancers,
    search,
    activeCategory,
    filters,
    sort,
]);

// Reset pagination when filtering
useEffect(() => {
    setVisibleCount(6);
}, [
    search,
    activeCategory,
    filters,
    sort,
]);

// ─── Filter Count ──────────────────────────────────────────────────────────

const activeFilterCount =
    (filters.categories?.length || 0) +
    (filters.experience?.length || 0) +
    (filters.availability?.length || 0) +
    (filters.languages?.length || 0) +
    (filters.rateMin !== undefined ? 1 : 0) +
    (filters.rateMax !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0);

const hasFilters = activeFilterCount > 0;

const visible = filtered.slice(
    0,
    visibleCount
);

const hasMore =
    visibleCount < filtered.length;

// ─── Reset ─────────────────────────────────────────────────────────────────

const resetFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setFilters({});
    setSort("rating");
    setVisibleCount(6);
};

return (
    <div className="min-h-screen bg-[#F8F8F8]">

    <div className="px-4 sm:px-6 py-8">

        <div className="flex gap-7">

        {/* ───────────────── Desktop Sidebar ───────────────── */}

        <aside className="hidden lg:block w-56 shrink-0 mt-15">
            <div className="sticky top-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />

                Filters

                {hasFilters && (
                    <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-orange-100 text-[#FF7A00] rounded-full text-[10px]">
                    {activeFilterCount}
                    </span>
                )}
                </h3>

                {hasFilters && (
                <button
                    onClick={() =>
                    setFilters({})
                    }
                    className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                >
                    Clear
                </button>
                )}
            </div>

            <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                freelancers={freelancers}
            />
            </div>
        </aside>

        {/* ───────────────── Main ───────────────── */}

        <main className="flex-1 min-w-0 mt-15">

            {/* Toolbar */}
            <div className="mb-6">

            <div className="flex flex-col md:flex-row gap-3">

                {/* Search */}
                <div className="relative flex-1">

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                    setSearch(e.target.value)
                    }
                    placeholder="Search freelancers, skills..."
                    className="w-full h-11 pl-11 pr-10 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-orange-100 transition-all"
                />

                {search && (
                    <button
                    onClick={() =>
                        setSearch("")
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                    <X className="w-4 h-4" />
                    </button>
                )}
                </div>

                {/* Sort */}
                <div className="relative">

                <select
                    value={sort}
                    onChange={(e) =>
                    setSort(e.target.value)
                    }
                    className="appearance-none w-full md:w-48 h-11 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-[#FF7A00] cursor-pointer"
                >
                    {SORT_OPTIONS.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                    ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Mobile Filters */}
                <button
                onClick={() =>
                    setDrawerOpen(true)
                }
                className="lg:hidden h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
                >
                <Filter className="w-4 h-4 text-[#FF7A00]" />

                Filters

                {hasFilters && (
                    <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-[#FF7A00] rounded-full text-[10px]">
                    {activeFilterCount}
                    </span>
                )}
                </button>
            </div>

            {/* Category buttons */}
            <div className="flex gap-2 overflow-x-auto mt-4 pb-1 hide-scrollbar">

                {CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => {
                    setActiveCategory(category);

                    if (category === "All") {
                        setFilters((prev) => ({
                        ...prev,
                        categories: [],
                        }));
                    } else {
                        setFilters((prev) => ({
                        ...prev,
                        categories: [category],
                        }));
                    }
                    }}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    activeCategory === category
                        ? "bg-[#FF7A00] text-white border-[#FF7A00]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#FF7A00] hover:text-[#FF7A00]"
                    }`}
                >
                    {category}
                </button>
                ))}
            </div>

            {/* Active filters */}
            <ActiveChips
                filters={filters}
                setFilters={setFilters}
            />
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />

                <span>
                <span className="font-bold text-gray-800">
                    {filtered.length}
                </span>{" "}
                freelancers found
                </span>
            </div>

            {(search || hasFilters) && (
                <button
                onClick={resetFilters}
                className="text-xs font-semibold text-gray-400 hover:text-red-500"
                >
                Reset
                </button>
            )}
            </div>

            {/* ───────────────── Grid ───────────────── */}

            {filtered.length === 0 ? (

            <motion.div
                initial={{
                opacity: 0,
                scale: 0.97,
                }}
                animate={{
                opacity: 1,
                scale: 1,
                }}
                className="flex flex-col items-center justify-center py-28 text-center"
            >
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                <AlertCircle className="w-10 h-10 text-[#FF7A00]" />
                </div>

                <h3 className="text-xl font-bold text-[#111111] mb-2">
                No freelancers found
                </h3>

                <p className="text-gray-500 text-sm max-w-xs mb-6">
                Try adjusting your search or filters to find what you're looking for.
                </p>

                <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-sm font-bold rounded-xl shadow shadow-orange-400/30 hover:shadow-md transition-all"
                >
                Reset Filters
                </button>
            </motion.div>

            ) : (

            <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                <AnimatePresence mode="popLayout">
                    {visible.map((freelancer) => (
                    <FreelancerCard
                        key={freelancer?._id}
                        freelancer={freelancer}
                    />
                    ))}
                </AnimatePresence>

                </div>

                {/* Load More */}
                {hasMore && (
                <div className="mt-8 text-center">

                    <button
                    onClick={() =>
                        setVisibleCount(
                        (count) => count + 6
                        )
                    }
                    className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#FF7A00] hover:text-[#FF7A00] shadow-sm transition-all"
                    >
                    Load More (
                    {filtered.length -
                        visibleCount}{" "}
                    remaining)
                    </button>

                </div>
                )}
            </>
            )}
        </main>
        </div>
    </div>

    {/* ───────────────── Mobile Drawer ───────────────── */}

    <AnimatePresence>
        {drawerOpen && (
        <>
            {/* Overlay */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
                setDrawerOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
                type: "spring",
                damping: 28,
                stiffness: 320,
            }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col"
            >

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">

                <h3 className="font-bold text-[#111111] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />

                Filters

                {hasFilters && (
                    <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-[#FF7A00] rounded-full text-[10px]">
                    {activeFilterCount}
                    </span>
                )}
                </h3>

                <button
                onClick={() =>
                    setDrawerOpen(false)
                }
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">

                <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                freelancers={freelancers}
                />

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 space-y-2 shrink-0">

                <button
                onClick={() =>
                    setDrawerOpen(false)
                }
                className="w-full py-3 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-sm font-bold rounded-xl shadow shadow-orange-400/30"
                >
                Show {filtered.length} Results
                </button>

                {hasFilters && (
                <button
                    onClick={() =>
                    setFilters({})
                    }
                    className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-red-300 hover:text-red-500 transition-all"
                >
                    Clear All Filters
                </button>
                )}

            </div>
            </motion.div>
        </>
        )}
    </AnimatePresence>

    {/* Hide scrollbar */}
    <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
        display: none;
        }

        .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
        }
    `}</style>

    </div>
);
}