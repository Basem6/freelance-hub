    'use client'

    import React, { useMemo, useState } from 'react'
    import { motion, AnimatePresence } from 'framer-motion'
    import {
    SlidersHorizontal,
    X,
    Star,
    Clock,
    Users,
    DollarSign,
    ArrowRight,
    Bookmark,
    AlertCircle,
    TrendingUp,
    } from 'lucide-react'
    import Link from 'next/link'
    import Image from 'next/image'

    // ─── Constants ────────────────────────────────────────────────────────────────

    const CATEGORIES = [
    'All',
    'Web Development',
    'UI/UX Design',
    'Mobile Apps',
    'AI & Machine Learning',
    'Digital Marketing',
    'Content Writing',
    'Data Analysis',
    'Graphic Design',
    ]

    const EXPERIENCE_LABELS = {
    entry: 'Entry Level',
    intermediate: 'Intermediate',
    expert: 'Expert',
    }

    const STATUS_LABELS = {
    open: 'Open',
    closed: 'Closed',
    }

    const BUDGET_LABELS = {
    fixed: 'Fixed Price',
    hourly: 'Hourly Rate',
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────────

    function timeAgo(date: string) {
    const seconds = Math.floor(
        (Date.now() - new Date(date).getTime()) / 1000
    )

    if (seconds < 60) {
        return `${seconds} seconds ago`
    }

    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
        return `${minutes} minutes ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours} hours ago`
    }

    const days = Math.floor(hours / 24)

    if (days < 30) {
        return `${days} days ago`
    }

    const months = Math.floor(days / 30)

    if (months < 12) {
        return `${months} months ago`
    }

    const years = Math.floor(months / 12)

    return `${years} years ago`
    }

    // ─── Project Card ─────────────────────────────────────────────────────────────

    function ProjectCard({ project: p }: { project: any }) {
    const [bookmarked, setBookmarked] = useState(false)
    const skills = p.skills || []
    const shown = skills.slice(0, 5)

    return (
        <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
        <div className="h-1 w-full bg-gradient-to-r from-[#FF7A00] to-orange-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="space-y-4 p-6">

            {/* Badges + Bookmark */}

            <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">

                <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    p.status === 'open'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-100 text-gray-500'
                }`}
                >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                    p.status === 'open'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                />

                {STATUS_LABELS[p.status as keyof typeof STATUS_LABELS] ||
                    p.status}
                </span>

                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-[#FF7A00]">
                {p.category}
                </span>

                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                {BUDGET_LABELS[p.budgetType as keyof typeof BUDGET_LABELS] ||
                    'Fixed Price'}
                </span>
            </div>

            <button
                type="button"
                onClick={() => setBookmarked((v) => !v)}
                className={`shrink-0 rounded-full border p-1.5 transition-all ${
                bookmarked
                    ? 'border-orange-200 bg-orange-50 text-[#FF7A00]'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
                aria-label="Bookmark project"
            >
                <Bookmark
                className="h-4 w-4"
                fill={bookmarked ? 'currentColor' : 'none'}
                />
            </button>
            </div>

            {/* Title + Description */}

            <div>
            <h3 className="mb-1.5 line-clamp-2 text-base font-bold leading-snug text-[#111111] transition-colors group-hover:text-[#FF7A00]">
                {p.title}
            </h3>

            <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                {p.description}
            </p>
            </div>

            {/* Skills */}

            <div className="flex flex-wrap gap-1.5">
            {shown.map((skill: string, index: number) => (
                <span
                key={`${skill}-${index}`}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-[#FF7A00] hover:text-[#FF7A00]"
                >
                {skill}
                </span>
            ))}

            {skills.length > 5 && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500">
                +{skills.length - 5}
                </span>
            )}
            </div>

            {/* Client */}

            <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <Image
                src={p.clientId?.image || '/avatars/avatar-1.png'}
                alt={p.clientId?.fullName || 'Client'}
                fill
                sizes="32px"
                className="object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                <span className="truncate text-sm font-semibold text-gray-800">
                    {p.clientId?.fullName || 'Unknown Client'}
                </span>
                </div>
            </div>
            </div>

            {/* Footer */}

            <div className="flex flex-col justify-between gap-3 border-t border-gray-100 pt-1 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">

                <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-[#FF7A00]" />

                <span className="font-semibold text-gray-800">
                    {p.budget}
                </span>
                </span>

                <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {p?.proposals?.filter(
                    (proposal: any) => proposal.status !== "withdrawn"
                ).length || 0}{" "}
                proposals
                </span>

                <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(p.createdAt)}
                </span>

                {p.experience && (
                <span className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />

                    {EXPERIENCE_LABELS[
                    p.experience as keyof typeof EXPERIENCE_LABELS
                    ] || p.experience}
                </span>
                )}
            </div>

            <Link
                href={`/findworks/${p._id}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-400 px-4 py-2 text-xs font-bold text-white shadow shadow-orange-400/30 transition-all hover:shadow-md hover:shadow-orange-400/40"
            >
                View Project

                <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            </div>
        </div>
        </motion.article>
    )
    }

    // ─── Filters Panel ────────────────────────────────────────────────────────────

    function FiltersPanel({
    filters,
    setFilters,
    }: {
    filters: any
    setFilters: React.Dispatch<React.SetStateAction<any>>
    }) {
    const toggle = (key: string, value: string) => {
        setFilters((prev: any) => {
        const arr = prev[key] || []

        return {
            ...prev,
            [key]: arr.includes(value)
            ? arr.filter((v: string) => v !== value)
            : [...arr, value],
        }
        })
    }

    const CheckRow = ({
        id,
        label,
        checked,
        onChange,
    }: {
        id: string
        label: string
        checked: boolean
        onChange: () => void
    }) => (
        <label
        htmlFor={id}
        className="group flex cursor-pointer items-center gap-2 py-0.5"
        >
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 cursor-pointer accent-[#FF7A00]"
        />

        <span className="text-sm text-gray-600 transition-colors group-hover:text-[#FF7A00]">
            {label}
        </span>
        </label>
    )

    return (
        <div className="space-y-7">

        {/* Category */}

        <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Category
            </p>

            <div className="space-y-1">
            {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <CheckRow
                key={cat}
                id={`cat-${cat}`}
                label={cat}
                checked={(filters.categories || []).includes(cat)}
                onChange={() => toggle('categories', cat)}
                />
            ))}
            </div>
        </div>

        {/* Project Type */}


        {/* Status */}

        <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Status
            </p>

            <div className="space-y-1">
            {(Object.keys(STATUS_LABELS) as Array<
                keyof typeof STATUS_LABELS
            >).map((status) => (
                <CheckRow
                key={status}
                id={`status-${status}`}
                label={STATUS_LABELS[status]}
                checked={(filters.statuses || []).includes(status)}
                onChange={() => toggle('statuses', status)}
                />
            ))}
            </div>
        </div>

        {/* Budget */}

        <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Budget ($)
            </p>

            <div className="space-y-2">
            {[
                ['Min', 'budgetMin', '0'],
                ['Max', 'budgetMax', '50,000'],
            ].map(([label, key, placeholder]) => (
                <div key={key}>
                <label className="mb-1 block text-xs text-gray-500">
                    {label}
                </label>

                <input
                    type="number"
                    placeholder={placeholder}
                    value={filters[key] ?? ''}
                    onChange={(e) =>
                    setFilters((prev: any) => ({
                        ...prev,
                        [key]: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-all focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
                />
                </div>
            ))}
            </div>
        </div>
        </div>
    )
    }

    // ─── Page ─────────────────────────────────────────────────────────────────────

    export default function ProjectsClient({
    projects,
    }: {
    projects: any[]
    }) {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [filters, setFilters] = useState<any>({})
    const [sort, setSort] = useState('newest')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [visibleCount, setVisibleCount] = useState(6)

    const filtered = useMemo(() => {
        let result = [...projects]

        // Search

        if (search.trim()) {
        const query = search.toLowerCase().trim()

        result = result.filter((project) => {
            const title =
            project.title?.toLowerCase() || ''

            const description =
            project.description?.toLowerCase() || ''

            const category =
            project.category?.toLowerCase() || ''

            const skills =
            project.skills?.some((skill: string) =>
                skill.toLowerCase().includes(query)
            ) || false

            return (
            title.includes(query) ||
            description.includes(query) ||
            category.includes(query) ||
            skills
            )
        })
        }

        // Category

        if (activeCategory !== 'All') {
        result = result.filter(
            (project) => project.category === activeCategory
        )
        }

        // Categories filter

        if (filters.categories?.length) {
        result = result.filter((project) =>
            filters.categories.includes(project.category)
        )
        }

        // Budget type

        if (filters.budgetTypes?.length) {
        result = result.filter((project) =>
            filters.budgetTypes.includes(project.budgetType)
        )
        }

        // Experience

        if (filters.experience?.length) {
        result = result.filter((project) =>
            filters.experience.includes(project.experience)
        )
        }

        // Status

        if (filters.statuses?.length) {
        result = result.filter((project) =>
            filters.statuses.includes(project.status)
        )
        }

        // Min budget

        if (filters.budgetMin !== undefined) {
        result = result.filter(
            (project) =>
            Number(project.budget) >= Number(filters.budgetMin)
        )
        }

        // Max budget

        if (filters.budgetMax !== undefined) {
        result = result.filter(
            (project) =>
            Number(project.budget) <= Number(filters.budgetMax)
        )
        }

        // Sorting

        result.sort((a, b) => {
        switch (sort) {
            case 'newest':
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )

            case 'oldest':
            return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )

            case 'budget_high':
            return Number(b.budget) - Number(a.budget)

            case 'budget_low':
            return Number(a.budget) - Number(b.budget)

            case 'proposals_low':
            return (a.proposals || 0) - (b.proposals || 0)

            default:
            return 0
        }
        })

        return result
    }, [projects, search, activeCategory, filters, sort])

    const activeFilterCount =
        (filters.categories?.length || 0) +
        (filters.budgetTypes?.length || 0) +
        (filters.experience?.length || 0) +
        (filters.statuses?.length || 0) +
        (filters.budgetMin !== undefined ? 1 : 0) +
        (filters.budgetMax !== undefined ? 1 : 0)

    const hasFilters = activeFilterCount > 0

    const visible = filtered.slice(0, visibleCount)

    const hasMore = visibleCount < filtered.length

    const resetFilters = () => {
        setSearch('')
        setActiveCategory('All')
        setFilters({})
        setSort('newest')
        setVisibleCount(6)
    }

    return (
        <div className="min-h-screen">

        {/* Main */}

        <div className="px-4 py-8 sm:px-6">
            <div className="flex gap-7">

            {/* Sidebar */}

            <aside className="mt-15 hidden lg:block">
                <div className="sticky top-1 rounded-2xl border bg-white p-5 shadow-sm">

                <div className="mb-5 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                    <SlidersHorizontal className="h-4 w-4 text-[#FF7A00]" />
                    Filters
                    </h3>

                    {hasFilters && (
                    <button
                        type="button"
                        onClick={() => setFilters({})}
                        className="text-xs font-medium text-red-400 transition-colors hover:text-red-600"
                    >
                        Clear
                    </button>
                    )}
                </div>

                <FiltersPanel
                    filters={filters}
                    setFilters={setFilters}
                />
                </div>
            </aside>

            {/* Content */}

            <div className="mt-15 min-w-0 flex-1">

                {/* Search */}

                <div className="mb-6 flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">
                    <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setVisibleCount(6)
                    }}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                    />

                    <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                    />
                    </svg>
                </div>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#FF7A00]"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="budget_high">Highest Budget</option>
                    <option value="budget_low">Lowest Budget</option>
                    <option value="proposals_low">
                    Fewest Proposals
                    </option>
                </select>

                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm lg:hidden"
                >
                    <SlidersHorizontal className="inline-block h-4 w-4" />
                    <span className="ml-2">Filters</span>

                    {hasFilters && (
                    <span className="ml-2 rounded-full bg-[#FF7A00] px-2 py-0.5 text-xs text-white">
                        {activeFilterCount}
                    </span>
                    )}
                </button>
                </div>

                {/* Active category */}

                <div className="mb-4 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                    <button
                    key={category}
                    type="button"
                    onClick={() => {
                        setActiveCategory(category)
                        setVisibleCount(6)
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                        activeCategory === category
                        ? 'bg-[#FF7A00] text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-[#FF7A00] hover:text-[#FF7A00]'
                    }`}
                    >
                    {category}
                    </button>
                ))}
                </div>

                {/* Result count */}

                <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">
                    {filtered.length}
                    </span>{' '}
                    projects found
                </p>

                {hasFilters && (
                    <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-medium text-gray-400 underline hover:text-red-500"
                    >
                    Clear all
                    </button>
                )}
                </div>

                {/* Cards */}

                {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-28 text-center"
                >
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                    <AlertCircle className="h-10 w-10 text-[#FF7A00]" />
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-[#111111]">
                    No projects found
                    </h3>

                    <p className="mb-6 max-w-xs text-sm text-gray-500">
                    Try adjusting your search or filters to find what
                    you're looking for.
                    </p>

                    <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow shadow-orange-400/30 transition-all hover:shadow-md"
                    >
                    Reset Filters
                    </button>
                </motion.div>
                ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {visible.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                        />
                        ))}
                    </AnimatePresence>
                    </div>

                    {hasMore && (
                    <div className="mt-8 text-center">
                        <button
                        type="button"
                        onClick={() =>
                            setVisibleCount((value) => value + 6)
                        }
                        className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-[#FF7A00] hover:text-[#FF7A00]"
                        >
                        Load More (
                        {filtered.length - visibleCount} remaining)
                        </button>
                    </div>
                    )}
                </>
                )}
            </div>
            </div>
        </div>

        {/* Mobile Drawer */}

        <AnimatePresence>
            {drawerOpen && (
            <>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                />

                <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                    type: 'spring',
                    damping: 28,
                    stiffness: 320,
                }}
                className="fixed bottom-0 left-0 top-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
                >
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-5">
                    <h3 className="flex items-center gap-2 font-bold text-[#111111]">
                    <SlidersHorizontal className="h-4 w-4 text-[#FF7A00]" />
                    Filters
                    </h3>

                    <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
                    >
                    <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    <FiltersPanel
                    filters={filters}
                    setFilters={setFilters}
                    />
                </div>

                <div className="shrink-0 space-y-2 border-t border-gray-100 p-5">
                    <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="w-full rounded-xl bg-gradient-to-r from-[#FF7A00] to-orange-400 py-3 text-sm font-bold text-white shadow shadow-orange-400/30"
                    >
                    Show {filtered.length} Results
                    </button>

                    {hasFilters && (
                    <button
                        type="button"
                        onClick={() => setFilters({})}
                        className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-red-300 hover:text-red-500"
                    >
                        Clear All Filters
                    </button>
                    )}
                </div>
                </motion.div>
            </>
            )}
        </AnimatePresence>
        </div>
    )
    }