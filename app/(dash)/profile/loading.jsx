export default function Loading(){
    <div className="flex min-h-screen min-w-full bg-white">
        <div className="min-w-full  border-gray-200 hidden md:block animate-pulse" />
        <div className="flex-1  overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
            </div>
            </div>
        </div>
    </div>
}