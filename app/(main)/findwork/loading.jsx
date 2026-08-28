import { SkeletonCard, SkeletonSidebar } from "../../../components/landing/Skeleton";
export default function Loading() {
    return (
        <div className="min-h-screen bg-[#F8F8F8]">

            <div className="px-4 sm:px-6 py-8">

                <div className="flex gap-7">

                    {/* Sidebar */}
                    <SkeletonSidebar />

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 mt-15">

                        {/* Freelancer Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <SkeletonCard key={item} />
                            ))}

                        </div>

                    </main>

                </div>

            </div>

        </div>
    );
}
