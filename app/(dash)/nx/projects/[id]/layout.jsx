import { notFound, redirect } from "next/navigation";
import { serverFetch } from "../../../../lib/server-auth";
import ProjectSteps from "./ProjectSteps";

export default async function ProjectLayout({ children, params }) {
    const { id } = await params;
    const { ok, status, data } = await serverFetch(`/projects/${id}`);

    if (status === 401) redirect("/login");
    if (status === 404 || status === 400) notFound();

    const project = ok ? (data?.project ?? data?.data ?? data) : null;
    if (!project) notFound();

    return (
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10">
            <header>
                <h1 className="max-w-3xl text-2xl font-medium leading-tight tracking-tight text-gray-900 md:text-4xl">
                    {project.title}
                </h1>
            </header>
            <ProjectSteps
                projectId={id}
                proposalsCount={Array.isArray(project.proposals) ? project.proposals.length : 0}
                shortlisted={project.shortlistedCount ?? 0}
                hired={project.hiredCount ?? 0}
            />
            <div className="mt-8">{children}</div>
        </main>
    );
}
