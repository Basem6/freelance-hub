"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import api from "../../app/utils/api";

function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

function getSearchUrl(type, query = "") {
    const params = new URLSearchParams({
        type,
        sort: type === "jobs" ? "createdAt:desc" : "rate:asc",
        page: "1",
    });
    if (query.trim()) params.set("q", query.trim());
    return `/nx/search?${params.toString()}`;
}

export default function FreelancerSearch({ nav2Ref, closeNav }) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("jobs");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedQuery = useDebounce(query);

    useEffect(() => {
        const q = debouncedQuery.trim();

        if (!q) {
            setResults([]);
            setLoading(false);
            setError("");
            return undefined;
        }

        let cancelled = false;

        async function search() {
            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/api/search/${type}`, {
                    params: { q, limit: 5 },
                });
                if (!cancelled) setResults(res.data[type] || []);
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setResults([]);
                    setError(`${type === "jobs" ? "Jobs" : "Freelancers"} search is unavailable right now.`);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        search();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, type]);

    function closeSearch() {
        closeNav?.(nav2Ref, "search");
    }

    function getResultText(result) {
        if (type === "jobs") return result.title || "Untitled job";
        return result.name || result.fullName || result.title || "Freelancer";
    }

    function getResultSubtitle(result) {
        if (type === "jobs") return "";
        const name = result.name || result.fullName;
        return result.title && result.title !== name ? result.title : "";
    }

    return (
        <>
            <section
                aria-label="Search jobs or freelancers"
                className="fixed left-1/2 top-10 z-[60] w-[90%] -translate-x-1/2 rounded-2xl bg-white p-5 shadow-xl md:w-[50%] md:p-6"
            >
                <div className="mb-4 flex gap-2" role="group" aria-label="Search for">
                    {["jobs", "freelancers"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={type === option}
                            onClick={() => setType(option)}
                            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                                type === option
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 border-b border-gray-300">
                    <Search aria-hidden="true" size={19} className="shrink-0 text-gray-500" />
                    <input
                        value={query}
                        autoFocus
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label={`Search ${type}`}
                        placeholder={`Search ${type}...`}
                        className="min-w-0 flex-1 py-3 outline-none"
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X aria-hidden="true" size={18} />
                        </button>
                    )}
                    <Link
                        href={getSearchUrl(type, query)}
                        onClick={closeSearch}
                        aria-label={`Search all ${type}`}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-700"
                    >
                        <ArrowRight aria-hidden="true" size={20} />
                    </Link>
                </div>

                {loading && <p className="mt-4 text-sm text-gray-500">Searching...</p>}

                <div className="mt-3 space-y-1">
                    {results.map((result, index) => {
                        const label = getResultText(result);
                        const subtitle = getResultSubtitle(result);
                        const id = result.id || result._id || `${label}-${index}`;

                        return (
                            <Link
                                key={id}
                                href={getSearchUrl(type, label)}
                                onClick={closeSearch}
                                className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <span className="block font-medium">{label}</span>
                                {subtitle && <span className="mt-0.5 block text-xs text-gray-500">{subtitle}</span>}
                            </Link>
                        );
                    })}

                    {!loading && !error && query.trim() && results.length === 0 && (
                        <p className="px-3 py-2 text-sm text-gray-500">No results found</p>
                    )}
                    {error && <p role="alert" className="px-3 py-2 text-sm text-red-700">{error}</p>}
                </div>
            </section>
            <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="overlay fixed inset-0 z-[59] h-screen w-full bg-black/30"
            />
        </>
    );
}
