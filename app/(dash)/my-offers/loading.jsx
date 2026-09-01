export default function Loading() {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center md:ml-64">
            <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#FF7A00] animate-spin" />
            <p className="text-gray-400 text-sm">Loading your offers...</p>
            </div>
        </div>
    )
}