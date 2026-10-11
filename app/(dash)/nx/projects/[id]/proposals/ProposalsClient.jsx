"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import api from "../../../../../utils/api"; // عدّل المسار
import ProposalRow from "./ProposalRow";

const TABS = [
    { key: "all", label: "All proposals" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "messaged", label: "Messaged" },
    { key: "archived", label: "Archived" },
];

const SORTS = [
    { key: "best", label: "Best match" },
    { key: "newest", label: "Newest" },
    { key: "lowest", label: "Lowest bid" },
    { key: "highest", label: "Highest bid" },
];

const getId = (p) => p._id || p.id;
const getBid = (p) => Number(p.bid ?? p.amount ?? 0);

export default function ProposalsClient({ projectId, initialProposals = [] }) {
    const [proposals, setProposals] = useState(initialProposals);
    const [tab, setTab] = useState("all");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("best");
    const [error, setError] = useState("");

    const counts = useMemo(() => {
        const c = { all: 0, shortlisted: 0, messaged: 0, archived: 0 };
        proposals.forEach((p) => {
            const s = p.status || "active";
            if (s !== "archived") c.all++;
            if (c[s] !== undefined) c[s]++;
        });
        return c;
    }, [proposals]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();

        let list = proposals.filter((p) => {
            const s = p.status || "active";
            if (tab === "all" ? s === "archived" : s !== tab) return false;
            if (!q) return true;
            const f = p.freelancer || {};
            return [f.fullName, f.title, p.coverLetter, ...(f.skills || [])]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });

        if (sort === "newest")
            list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sort === "lowest") list = [...list].sort((a, b) => getBid(a) - getBid(b));
        if (sort === "highest") list = [...list].sort((a, b) => getBid(b) - getBid(a));

        return list;
    }, [proposals, tab, query, sort]);

    async function setStatus(proposal, status) {
        const id = getId(proposal);
        const previous = proposals;
        setError("");
        setProposals((list) => list.map((p) => (getId(p) === id ? { ...p, status } : p)));

        try {
            await api.patch(`/api/my-projects/${projectId}/proposals/${id}`, { status });
        } catch (err) {
            setProposals(previous);
            setError(err.response?.data?.message || "Unable to update this proposal.");
        }
    }

    return (
        <section className="mt-10 pb-15">
            {/* Tabs */}
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden border-b border-gray-300">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 pb-3 text-lg transition
                            ${tab === t.key
                                ? "border-orange-600 font-medium text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-800"}`}
                    >
                        {t.label} ({counts[t.key]})
                    </button>
                ))}
            </div>

            {/* Search / Sort / Filters */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3 md:max-w-sm">
                    <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-gray-300 px-4 focus-within:border-orange-500">
                        <Search size={20} strokeWidth={1.5} className="text-gray-600" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-transparent outline-none"
                        />
                    </label>
                </div>

                <div className="flex items-center gap-3 md:ml-auto">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        Sort:
                        <span className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="h-12 cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white pl-4 pr-10 text-base text-gray-900 outline-none focus:border-orange-500"
                            >
                                {SORTS.map((s) => (
                                    <option key={s.key} value={s.key}>{s.label}</option>
                                ))}
                            </select>
                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                            />
                        </span>
                    </label>

                    <button
                        type="button"
                        className="flex h-12 cursor-pointer items-center gap-2 rounded-full border border-gray-400 px-5 font-medium text-gray-900 transition hover:bg-gray-50"
                    >
                        <SlidersHorizontal size={18} strokeWidth={1.5} />
                        Filters
                    </button>
                </div>
            </div>

            {error && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            {/* Table */}
            <div className="mt-6 overflow-hidden md:rounded-3xl border-t md:border border-gray-300 bg-white">
                <div className="hidden grid-cols-[1.3fr_1fr_1.6fr_1.6fr] gap-6 border-b border-gray-300 px-1 md:px-6 py-5 font-medium text-gray-900 lg:grid">
                    <span />
                    <span>Stats</span>
                    <span>Qualifications</span>
                    <span>Details</span>
                </div>

                {visible.length === 0 ? (
                    <p className="px-6 py-16 text-center text-gray-500">
                        No proposals in this tab yet.
                    </p>
                ) : (
                    visible.map((proposal) => (
                        <ProposalRow
                            key={getId(proposal)}
                            proposal={proposal}
                            projectId={projectId}
                            onShortlist={() =>
                                setStatus(
                                    proposal,
                                    proposal.status === "shortlisted" ? "active" : "shortlisted"
                                )
                            }
                            onArchive={() =>
                                setStatus(
                                    proposal,
                                    proposal.status === "archived" ? "active" : "archived"
                                )
                            }
                        />
                    ))
                )}
            </div>
        </section>
    );
}