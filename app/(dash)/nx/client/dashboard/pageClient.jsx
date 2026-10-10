"use client";
import { useAppSelector } from "../../../../lib/hooks";
import Image from "next/image";
import { Search } from "lucide-react";
import BtnPost from "../../../../../components/ui/btnPostjob";

export default function ClientPage() {
const user = useAppSelector((state) => state.auth.user);
const greetingName = user?.fullName?.trim().split(/\s+/)[0] || "there";

return (
    <main className=" max-w-7xl px-4 w-auto md:min-w-300 py-10 ">
    <header className="flex    w-full justify-between gap-5  sm:flex-row sm:items-center">
        <div>
        <h1 className="mt-1 md:text-2xl tracking-tight text-gray-900">
            Welcome back, {greetingName}
        </h1>
        <p className="mt-2 md:block hidden max-w-2xl text-sm leading-6 text-gray-600">
            Keep hiring moving. Review your activity or find the right people for your next project.
        </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
        <BtnPost></BtnPost> 
        </div>
    </header>
    <section className="md:mt-30  mt-20">
        {/* Header */}
        <div className="flex min-w-full items-center justify-between">
            <h3 className="text-2xl text-[#111111] pb-4">
                Overview
            </h3>
        </div>
        <div className="rounded-2xl border border-gray-300/60 bg-white p-6">
        {false ? (
            <div className="mt-6 space-y-5">
                
            </div>
        ) : (
            /* Empty State */
            <div className="flex min-h-65 flex-col items-center justify-center">
                <div className="size-28">
                    <Image
                        src="/photoMeaning/no_data.svg"
                        alt="No data"
                        width={100}
                        height={100}
                        quality={10}
                        className="h-full w-full object-contain"
                    />
                </div>

                <div className="py-3">No job posts or contracts in progress right now</div>
                <div className="flex gap-4 items-center">
                    <button
                    type="button"
                        className="my-2 border rounded-2xl items-center justify-center cursor-pointer gap-1.5 px-3 flex py-1 border-orange-500 text-orange-500/90 transition-colors hover:border-orange-400 hover:text-orange-500"
                    >
                        <div><Search size={20} strokeWidth={1}></Search></div>
                        <div>Find a talent</div>
                    </button>
                    <BtnPost></BtnPost> 
                </div>
            </div>
        )}
    </div>
    </section>
    </main>
);
}
