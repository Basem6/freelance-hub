
export default function Loading() {
return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans text-[#111111] pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

            {/* Project Header */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden animate-pulse">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-100" />

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 w-14 bg-gray-200 rounded-full" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-3 mb-6">
                <div className="h-10 bg-gray-200 rounded-lg w-4/5" />
                <div className="h-10 bg-gray-200 rounded-lg w-2/5" />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex flex-wrap gap-6">
                <div className="h-5 w-28 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-28 bg-gray-200 rounded" />
                </div>

                <div className="flex gap-3">
                <div className="w-11 h-11 bg-gray-200 rounded-full" />
                <div className="w-11 h-11 bg-gray-200 rounded-full" />
                </div>
            </div>

            {/* Client */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />

                <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded" />

                    <div className="flex gap-3">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                </div>
                </div>

                {/* Client Stats */}
                <div className="flex gap-4 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <div className="px-3 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                </div>

                <div className="px-3 border-r border-gray-200 space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-14 bg-gray-200 rounded" />
                </div>

                <div className="px-3 space-y-2">
                    <div className="h-3 w-14 bg-gray-200 rounded" />
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                </div>
                </div>
            </div>

            {/* Payment */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="h-5 w-36 bg-gray-200 rounded" />
            </div>
            </div>


            {/* Project Overview */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse">

            <div className="h-8 w-56 bg-gray-200 rounded-lg mb-6" />

            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-11/12" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>

            <div className="mt-8 space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded" />

                <div className="space-y-3 pl-5">
                <div className="h-4 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
            </div>

            {/* Skills */}
            <div className="mt-8 pt-8 border-t border-gray-100">

                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />

                <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                    key={item}
                    className="h-10 bg-gray-200 rounded-full"
                    style={{
                        width: `${70 + item * 15}px`,
                    }}
                    />
                ))}
                </div>

            </div>
            </div>


            {/* Applicants */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="h-7 w-48 bg-gray-200 rounded" />
                <div className="h-11 w-36 bg-gray-200 rounded-lg" />
            </div>

            <div className="space-y-4">

                {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="p-5 border border-gray-100 rounded-xl"
                >
                    <div className="flex items-start gap-4 sm:gap-5">

                    {/* Avatar */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 shrink-0" />

                    <div className="flex-1 space-y-3">

                        {/* Match */}
                        <div className="flex justify-between">
                        <div className="space-y-2">
                            <div className="h-5 w-32 bg-gray-200 rounded" />
                            <div className="h-4 w-44 bg-gray-200 rounded" />
                        </div>

                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                        </div>

                        {/* Info */}
                        <div className="flex gap-4">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-3 w-28 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-3 bg-gray-200 rounded w-4/5" />
                        </div>

                        <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                    </div>
                </div>
                ))}

            </div>
            </div>

        </div>


        {/* Sidebar */}
        <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">

            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">

                <div className="mb-6">
                <div className="h-4 w-16 bg-gray-200 rounded mb-3" />
                <div className="h-9 w-32 bg-gray-200 rounded-lg" />

                <div className="flex gap-2 mt-3">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-36 bg-gray-200 rounded" />
                </div>
                </div>

                {/* Timeline */}
                <div className="mb-8 pt-6 border-t border-gray-100">

                <div className="h-4 w-20 bg-gray-200 rounded mb-4" />

                <div className="flex justify-between mb-3">
                    <div className="h-6 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4" />

                <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                </div>

                </div>

                {/* Button */}
                <div className="w-full h-14 bg-gray-200 rounded-xl" />

            </div>


            {/* Project Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">

                <div className="h-5 w-32 bg-gray-200 rounded mb-5" />

                <div className="space-y-5">
                <div className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>

                <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                </div>

            </div>


            {/* Safety */}
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 animate-pulse">

                <div className="h-6 w-28 bg-orange-100 rounded mb-5" />

                <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="w-4 h-4 bg-orange-100 rounded-full shrink-0" />
                    <div className="h-4 bg-orange-100 rounded w-full" />
                </div>

                <div className="flex gap-3">
                    <div className="w-4 h-4 bg-orange-100 rounded-full shrink-0" />
                    <div className="h-4 bg-orange-100 rounded w-11/12" />
                </div>

                <div className="flex gap-3">
                    <div className="w-4 h-4 bg-orange-100 rounded-full shrink-0" />
                    <div className="h-4 bg-orange-100 rounded w-full" />
                </div>
                </div>

            </div>

            </div>
        </div>

        </div>
    </div>
    </div>
);
}
