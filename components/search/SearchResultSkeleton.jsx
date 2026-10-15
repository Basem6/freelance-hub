function SkeletonBlock({ className = "" }) {
    return <div aria-hidden="true" className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

function FreelancerResultSkeleton() {
    return (
        <div className="border-b border-gray-200 bg-white p-5" aria-hidden="true">
            <div className="flex items-start gap-4">
                <SkeletonBlock className="size-12 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2 pt-1">
                    <SkeletonBlock className="h-4 w-40 max-w-full" />
                    <SkeletonBlock className="h-3.5 w-56 max-w-full" />
                </div>
                <SkeletonBlock className="h-4 w-16 shrink-0" />
            </div>
            <div className="mt-4 space-y-2">
                <SkeletonBlock className="h-3.5 w-full" />
                <SkeletonBlock className="h-3.5 w-4/5 max-w-full" />
            </div>
            <div className="mt-4 flex gap-2">
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-14 rounded-full" />
            </div>
        </div>
    );
}

function JobResultSkeleton() {
    return (
        <div className="border-b border-gray-400/60 bg-white px-1 py-2" aria-hidden="true">
            <div className="space-y-3 pb-2">
                <SkeletonBlock className="h-5 w-16 rounded-sm" />
                <div className="flex gap-3">
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="h-3 w-20" />
                </div>
                <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-2/3 max-w-full" />
                    <SkeletonBlock className="h-3.5 w-full" />
                    <SkeletonBlock className="h-3.5 w-4/5 max-w-full" />
                </div>
                <div className="flex gap-1.5">
                    <SkeletonBlock className="h-6 w-16 rounded-sm" />
                    <SkeletonBlock className="h-6 w-20 rounded-sm" />
                    <SkeletonBlock className="h-6 w-14 rounded-sm" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <SkeletonBlock className="size-8 rounded-full" />
                    <SkeletonBlock className="h-3.5 w-28" />
                    <SkeletonBlock className="h-3.5 w-20" />
                </div>
            </div>
        </div>
    );
}

export default function SearchResultSkeleton({ type = "jobs", count = 5 }) {
    const ResultSkeleton = type === "freelancers"
        ? FreelancerResultSkeleton
        : JobResultSkeleton;

    return (
        <div
            role="status"
            aria-label={`Loading ${type === "freelancers" ? "freelancers" : "jobs"}`}
            aria-busy="true"
            className="space-y-3"
        >
            <span className="sr-only">
                Searching {type === "freelancers" ? "freelancers" : "jobs"}…
            </span>
            {Array.from({ length: count }, (_, index) => (
                <ResultSkeleton key={index} />
            ))}
        </div>
    );
}
