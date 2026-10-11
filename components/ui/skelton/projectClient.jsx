export function ProjectCardSkeleton() {
    return (
        <div className="flex flex-col gap-5 rounded-3xl border border-gray-300 bg-white p-5 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
            {/* Icon + title */}
            <div className="flex items-center gap-4 lg:w-[22%] lg:shrink-0">
                <div className="size-15 shrink-0 rounded-full bg-gray-200" />
                {/* leading-7 × 2 lines = 56px، نفس line-clamp-2 */}
                <div className="flex h-14 flex-1 flex-col justify-center gap-2">
                    <div className="h-3.5 w-full rounded bg-gray-200" />
                    <div className="h-3.5 w-3/4 rounded bg-gray-200" />
                </div>
            </div>

            {/* Status + created */}
            <div className="flex items-center gap-4 lg:gap-3">
                {/* py-1 + text-sm (20px) = 28px + border = 32px تقريباً */}
                <div className="h-8 w-28 shrink-0 rounded-md bg-gray-200" />
                <div className="max-w-[110px] space-y-1.5">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="h-3 w-14 rounded bg-gray-200" />
                </div>
            </div>

            {/* Stats: label 20px + gap 4px + value 24px = 48px */}
            <div className="grid grid-cols-4 gap-3 lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-8">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex h-12 flex-col items-center justify-between">
                        <div className="h-4 w-14 rounded bg-gray-200" />
                        <div className="h-5 w-16 rounded bg-gray-200" />
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 lg:ml-auto">
                <div className="h-10 flex-1 rounded-full bg-gray-200 lg:w-[140px] lg:flex-none" />
                <div className="size-10 shrink-0 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}