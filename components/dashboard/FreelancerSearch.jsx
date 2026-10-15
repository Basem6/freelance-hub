import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../app/utils/api";

function useDebounce(value, delay = 300) {
const [debounced, setDebounced] = useState(value);

useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
}, [value, delay]);

return debounced;
}

export default function FreelancerSearch({nav2Ref , closeNav}) {
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const debouncedQuery = useDebounce(query);

useEffect(() => {
  const q = debouncedQuery.trim();

  // لو الخانة فاضية: نفضّي النتايج ومنبعتش request
  if (!q) {
    setResults([]);
    setLoading(false);
    setError("");
    return;
  }

  let cancelled = false;

  async function search() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/search/freelancers", {
        params: { q, limit: 5 },
      });
      if (!cancelled) setResults(res.data.freelancers || []);
    } catch (err) {
      console.error(err);
      if (!cancelled) {
        setResults([]);
        setError("Freelancer search is unavailable right now.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  search();
  return () => {
    cancelled = true;
  };
}, [debouncedQuery]);

return (
    <>
        <div className=" bg-white md:w-[50%] w-[90%] z-99999 fixed top-10 left-1/2 rounded-2xl  -translate-x-1/2  p-6 px-8">
        <input
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search freelancers"
            placeholder="Search freelancers..."
            className="w-full border-b  border-black py-2 outline-none"
        />

        {loading && <p className="mt-4 text-gray-500">Searching...</p>}

        <div className="mt-4 space-y-3">
            {results.map((hit) => (
            <Link
                key={hit.id}
                href={`/hire/${encodeURIComponent(hit.id)}`}
                onClick={() => closeNav(nav2Ref, "search")}
                className="block rounded-md px-2 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-200/60"
            >
                <span>{hit.name}</span>
                {hit.title && <span className="ml-2 font-normal">{hit.title}</span>}
            </Link>
            ))}

            {!loading && !error && results.length === 0 && (
            <p className="text-gray-500">No results found</p>
            )}
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <Link
                href="/nx/search"
                onClick={() => closeNav(nav2Ref, "search")}
                className="inline-block pt-2 text-sm font-semibold text-orange-700 hover:text-orange-800"
            >
                Browse jobs and freelancers
            </Link>
        </div>

        </div>
        <div onClick={()=>{closeNav(nav2Ref,"search")}} className="overlay  z-9999 fixed left-0 top-0 w-full h-screen bg-black/30">
        </div>
    </>
);
}