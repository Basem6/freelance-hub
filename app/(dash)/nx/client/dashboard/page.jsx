import { Suspense } from "react";
import { redirect } from "next/navigation";
import { serverFetch } from "../../../../lib/server-auth";
import ClientHeader from "./ClientHeader";
import ProjectsList from "./pageClient";
import { ProjectCardSkeleton } from "../../../../../components/ui/skelton/projectClient";
import BtnPost from "../../../../../components/ui/btnPostjob";

async function Projects() {
    const { ok, status, data } = await serverFetch("/my-projects")

    if (status === 401) {
        redirect("/login");
    }

    const projects = ok ? (data?.projects ?? data?.data ?? data ?? []) : [];

    return <ProjectsList projects={projects} />;
}

export default function Page() {
    return (
        <main className="min-w-full md:max-w-7xl min-h-screen md:px-4 w-auto md:min-w-300 py-10">
            <ClientHeader />

            <section className="md:mt-30">
                <div className="flex px-2 min-w-full pb-4 items-center justify-between">
                    <h3 className="text-2xl text-[#111111] ">Overview</h3>
                    <div className="md:hidden block"><BtnPost /></div>
                </div>

                <div className=" border-gray-300/60 bg-white min-w-full pb-15">
                    <Suspense fallback={<div className="mt-6 flex flex-col space-y-5 min-w-full"><ProjectCardSkeleton /> <ProjectCardSkeleton /> <ProjectCardSkeleton /></div>}>
                        <Projects />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}