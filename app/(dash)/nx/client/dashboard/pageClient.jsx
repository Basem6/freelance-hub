"use client";
import Image from "next/image";
import { Search } from "lucide-react";
import BtnPost from "../../../../../components/ui/btnPostjob";
import ProjectCard from "../../../../../components/dashboard/ProjectCard";

export default function ProjectsList({ projects = [] }) {
    const hasProjects = Array.isArray(projects) && projects.length > 0;

    if (!hasProjects) {
        return (
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
                        className="my-2 border rounded-2xl items-center justify-center cursor-pointer gap-1.5 md:px-3 px-2 text-sm min-h-9 flex py-1 border-orange-500 text-orange-500/90 transition-colors hover:border-orange-400 hover:text-orange-500"
                    >
                        <div><Search size={20} strokeWidth={1} /></div>
                        <div>Find a talent</div>
                    </button>
                    <BtnPost />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 flex flex-col gap-4">
            {projects.map((project, index) => (
                <ProjectCard
                    key={project._id || project.id || `${project.title}-${index}`}
                    project={project}
                />
            ))}
        </div>
    );
}