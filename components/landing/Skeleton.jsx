
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            {/* Accent */}
            <div className="h-1 bg-gray-100" />

            <div className="p-6 space-y-4">

                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="size-8 rounded-full bg-gray-200 shrink-0" />

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-6 bg-gray-100 rounded-full w-24" />
                        </div>

                        <div className="h-3 bg-gray-100 rounded w-28" />

                        <div className="flex items-center gap-2">
                            <div className="h-3 bg-gray-200 rounded w-3" />
                            <div className="h-3 bg-gray-100 rounded w-8" />
                            <div className="h-3 bg-gray-100 rounded w-16" />
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>

                {/* Skills */}
                <div className="flex gap-2">
                    <div className="h-7 w-16 bg-gray-100 rounded-full" />
                    <div className="h-7 w-20 bg-gray-100 rounded-full" />
                    <div className="h-7 w-16 bg-gray-100 rounded-full" />
                    <div className="h-7 w-12 bg-gray-100 rounded-full" />
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-4">
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                        <div className="h-3 w-14 bg-gray-100 rounded" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                    </div>

                    <div className="h-9 w-28 bg-gray-100 rounded-xl" />
                </div>

            </div>
        </div>
    );
}
export function SkeletonSidebar() {
    return (
        <aside className="hidden lg:block w-56 shrink-0 mt-15">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-10 bg-gray-100 rounded" />
                </div>

                {/* Category */}
                <div className="space-y-3 mb-7">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-4" />

                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <div className="w-4 h-4 bg-gray-100 rounded" />
                            <div
                                className="h-3 bg-gray-100 rounded"
                                style={{
                                    width: `${60 + (item % 3) * 15}px`
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Experience */}
                <div className="space-y-3 mb-7">
                    <div className="h-3 w-32 bg-gray-200 rounded mb-4" />

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <div className="w-4 h-4 bg-gray-100 rounded" />
                            <div className="h-3 w-24 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>

                {/* Rating */}
                <div className="space-y-3">
                    <div className="h-3 w-28 bg-gray-200 rounded mb-4" />

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <div className="w-4 h-4 bg-gray-100 rounded-full" />
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>

            </div>
        </aside>
    );
}