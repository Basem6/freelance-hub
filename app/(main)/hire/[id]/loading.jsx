export default function loading() {
return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20 animate-pulse">
            <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden mb-6">
            <div className="relative w-full h-[120px] bg-white" />
            <div className="relative px-6 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div className="flex flex-col md:flex-row md:items-end flex-1">
                    <div className="relative -mt-16 z-10 w-32 h-32 md:mr-6 mb-4 md:mb-0 rounded-full border-4 border-white bg-gray-200 shadow-md" />
                    <div className="flex flex-col pb-2 w-full md:w-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-52 bg-gray-200 rounded-md" />
                        <div className="h-6 w-6 bg-gray-200 rounded-full" />
                        <div className="h-5 w-24 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-5 w-72 bg-gray-200 rounded-md mb-3" />
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="h-4 w-28 bg-gray-200 rounded-md" />
                        <div className="h-4 w-32 bg-gray-200 rounded-md" />
                        <div className="h-4 w-20 bg-gray-200 rounded-md" />
                    </div>
                    </div>
                </div>
    
                <div className="flex items-center gap-3 mt-6 md:mt-0 pb-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="h-12 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-12 w-32 bg-[#F4F4F5] rounded-lg" />
                </div>
                </div>
    
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-y-4 justify-between md:justify-start md:gap-12">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex flex-col gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-md" />
                    <div className="h-4 w-24 bg-gray-200 rounded-md" />
                    </div>
                ))}
                </div>
            </div>
            </div>
    
            <div className="px-4 lg:px-8 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                    <div className="h-6 w-28 bg-gray-200 rounded-md mb-4" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded-md" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
                        <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
                    </div>
                    </div>
                ))}
                </div>
                <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                    <div className="h-6 w-40 bg-gray-200 rounded-md mb-4" />
                    <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((tag) => (
                        <div key={tag} className="h-8 w-20 bg-gray-200 rounded-full" />
                    ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                    <div className="h-6 w-36 bg-gray-200 rounded-md mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((card) => (
                        <div key={card} className="h-24 bg-gray-200 rounded-xl" />
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
)
}
