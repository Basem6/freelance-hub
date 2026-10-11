function RowSkeleton() {
    return (
        <div className="grid gap-5 border-b border-gray-300 px-6 py-6 last:border-b-0 lg:grid-cols-[1.3fr_1fr_1.6fr_1.6fr] lg:gap-6">
            <div className="flex gap-4">
                <div className="size-[75px] shrink-0 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="mt-4 flex gap-3">
                        <div className="size-12 rounded-full bg-gray-200" />
                        <div className="size-12 rounded-full bg-gray-200" />
                        <div className="h-12 w-28 rounded-full bg-gray-200" />
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-5 w-36 rounded bg-gray-200" />
                <div className="h-5 w-28 rounded bg-gray-200" />
            </div>
            <div className="space-y-3">
                <div className="h-5 w-48 rounded bg-gray-200" />
                <div className="flex flex-wrap gap-2">
                    {[20, 24, 16, 28].map((w, i) => (
                        <div key={i} className="h-8 rounded-lg bg-gray-200" style={{ width: w * 4 }} />
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-6 w-24 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-11/12 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
            </div>
        </div>
    );
}

export default function ProposalsSkeleton() {
    return (
        <div className="mt-10 animate-pulse" aria-busy="true" aria-label="Loading proposals">
            <div className="flex gap-6 border-b border-gray-300 pb-3">
                <div className="h-6 w-36 rounded bg-gray-200" />
                <div className="h-6 w-28 rounded bg-gray-200" />
                <div className="h-6 w-28 rounded bg-gray-200" />
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-300 bg-white">
                <RowSkeleton />
                <RowSkeleton />
            </div>
        </div>
    );
}