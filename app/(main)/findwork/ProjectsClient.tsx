'use client'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Bookmark,AlertCircle, MapPin, Clock} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { specialtyOptions } from '@/app/lib/constants/specialtyOptions';
import OptionSelect from '@/components/ui/OptionSelect'
import AutoSlide from '@/components/ui/AutoSlide'
import Radio from "@/components/ui/rating"
import {timeAgo} from "@/app/utils/handletime"
import FindWorkAside from "@/app/(dash)/nx/findwork/FindWorkAside"

const STATUS_LABELS = {
open: 'Open',
in_progress: 'In Progress',
closed: 'Closed',
}

function ProjectCard({ project: p }: { project: any }) {
const [bookmarked, setBookmarked] = useState(false)
const skills = p.skills || []
const shown = skills.slice(0, 5)
return (
    <Link
            href={`/findworks/${p._id}`}
        >
    <motion.article
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ duration: 0.25 }}
    className="overflow-hidden hover:bg-gray-200/60 duration-200 transition-colors  border-b bg-white border-gray-400/60 "
    >

    <div className="space-y-2 py-2 px-1">

        <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">

            <span
            className={`inline-flex items-center gap-1  rounded-sm  border px-2.5 py-0.5 text-xs  ${
                p.status === 'open'
                ? 'border-green-200 bg-green-300/40 text-green-900'
                : p.status === 'in_progress' 
                ? 'border-blue-200 bg-blue-300/40 text-blue-900'
                : 'border-gray-200 bg-gray-300/40 text-gray-800'
            }`}
            >
        
            {STATUS_LABELS[p.status as keyof typeof STATUS_LABELS] ||
                p.status}
            </span>

        </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
            Posted {timeAgo(p.createdAt)}
            </span>
            <span>
                |
            </span>
            <span className="flex items-center gap-1">
            
            {p?.proposals?.filter(
                (proposal: any) => proposal.status !== "withdrawn"
            ).length || 0}{" "}
            proposals
            </span>


        </div>

        {/* Title + Description */}

        <div>
        <div className="mb-0.5 hover:border-gray-800 text-lg w-fit border-b border-gray-800/0 -2 text-base  font-Inter leading-snug text-[#111111]">
            {p.title}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {p.description}
        </p>
        </div>

        {/* Skills */}

        <div className="flex flex-wrap gap-1.5">
        {shown.map((skill: string, index: number) => (
            <span
            key={`${skill}-${index}`}
            className="rounded-sm border-gray-400/20 bg-gray-300/60 px-2.5 py-1 text-xs font-medium text-gray-600 "
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
        <div className="flex items-center gap-6 ">
            <div className='flex items-center gap-2.5 rounded-xl py-3'>
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
                    <span className="truncate w-19 text-sm font-semibold text-gray-800">
                        {p.clientId?.fullName || 'Unknown Client'}
                    </span>
                    </div>
                </div>
            </div>
            <div className="rating">   
                <Radio></Radio>
            </div>
            <div className='min-w-30 h-10 flex gap-2 items-center '>
                    <MapPin size={15}  strokeWidth={1}/>
                    <div className='text-sm text-gray-700'>{p.clientId?.country|| "Unknown"}</div>
                
            </div>
            
        </div>
    </div>
    </motion.article>
    </Link>
    
)
}
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
    <div className="flex flex-col overflow-hidden  h-fit  md:py-8 max-w-7xl mx-auto  gap-3.5 ">

    {/* Main */}

    <div className="px-4  sm:px-6 gap-10 flex w-full ">
        <div className="flex gap-7 w-3/4 flex-col">
            <AutoSlide></AutoSlide>
            <div className="w-full">

                {/* Search */}

                <div className="mb-6 flex flex-col gap-3 sm:flex-row">

                <div className="relative md:w-1/2 grow">
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
                <div className='grow'>
                <OptionSelect value={sort} options={[{ value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }, { value: 'budget_high', label: 'Highest Budget' }, { value: 'budget_low', label: 'Lowest Budget' }, { value: 'proposals_low', label: 'Fewest Proposals' }]} onChange={setSort} buttonClassName="bg-white w-full  px-4 py-3" />
                </div>
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="rounded-xl grow border border-gray-200 bg-white px-4 py-3 text-sm lg:hidden"
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
                    <div className="w-full flex flex-col gap-2 ">
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
        <div className='w-1/4'>
        <FindWorkAside></FindWorkAside>
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