"use client";
import { useAppSelector } from "../../../../lib/hooks";
import Image from "next/image";
import { Search } from "lucide-react";
import BtnPost from "../../../../../components/ui/btnPostjob";

export default function ClientPage() {
const user = useAppSelector((state) => state.auth.user);
const greetingName = user?.fullName?.trim().split(/\s+/)[0] || "there";
const postedProjects = Array.isArray(user?.postedProjects)
    ? user.postedProjects
    : [];
return (
    <main className="min-w-full  md:max-w-7xl min-h-screen md:px-4 w-auto md:min-w-300 py-10 ">
    <header className="flex  px-2   w-full justify-between gap-5  sm:flex-row sm:items-center">
        <div>
        <h1 className="mt-1  md:text-2xl text-xl tracking-tight text-gray-900">
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
    <section className="md:mt-30   mt-20">
        {/* Header */}
        <div className="flex px-2  min-w-full items-center justify-between">
            <h3 className="text-2xl text-[#111111] pb-4">
                Overview
            </h3>
        </div>
        <div className="md:rounded-2xl md:border border-gray-300/60 bg-white md:p-6">
        {postedProjects.length > 0 ? (
            <div className="mt-6 flex flex-col space-y-5">
                {postedProjects.map((project, index) => (
                    <article
                        key={project._id || project.id || `${project.title}-${index}`}
                        className="md:rounded-xl px-2  border-y md:border border-gray-300 py-5 md:p-5 transition hover:border-orange-300"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {project.title || "Untitled project"}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                    {project.status || "open"}
                                </p>
                            </div>
                            {project.budget != null && (
                                <p className="font-semibold text-gray-900">
                                    Budget: ${Number(project.budget).toLocaleString()}
                                </p>
                            )}
                        </div>
                        {project.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                {project.description}
                            </p>
                        )}
                        {Array.isArray(project.skills) && project.skills.length > 0 && (
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {project.skills.map((skill, skillIndex) => (
                                    <li
                                        key={`${skill}-${skillIndex}`}
                                        className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
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
                        className="my-2 border  rounded-2xl items-center justify-center cursor-pointer gap-1.5 md:px-3 px-2 text-sm min-h-9 flex py-1 border-orange-500 text-orange-500/90 transition-colors hover:border-orange-400 hover:text-orange-500"
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
