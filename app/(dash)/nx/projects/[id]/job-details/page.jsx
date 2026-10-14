import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    DollarSign,
    MapPin,
    MessageSquareText,
    UsersRound,
} from "lucide-react";
import { serverFetch } from "../../../../../lib/server-auth";

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function formatBudget(value) {
    if (value == null || value === "") return "Not specified";
    if (typeof value === "string" && /[a-z$]/i.test(value)) return value;
    const amount = Number(value);
    if (!Number.isFinite(amount)) return String(value);
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatLabel(value) {
    if (!value) return null;
    return String(value)
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function DetailItem({ icon: Icon, label, value }) {
    if (value == null || value === "") return null;

    return (
        <div className="flex items-start gap-3">
            <Icon size={19} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gray-500" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-0.5 font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const statusKey = String(status || "open").toLowerCase().replace(/[\s-]+/g, "_");
    const styles = {
        open: "bg-green-50 text-green-700 ring-green-200",
        in_progress: "bg-blue-50 text-blue-700 ring-blue-200",
        closed: "bg-gray-100 text-gray-700 ring-gray-200",
        draft: "bg-amber-50 text-amber-700 ring-amber-200",
    };
    const label = formatLabel(statusKey) || "Open";

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                styles[statusKey] || styles.open
            }`}
        >
            {label}
        </span>
    );
}

async function getProject(id) {
    const { ok, status, data } = await serverFetch(`/projects/${id}`);
    if (status === 401) redirect("/login");
    if (status === 404 || status === 400) notFound();

    const project = ok ? data?.project ?? data?.data ?? data : null;
    if (!project || typeof project !== "object") notFound();
    return project;
}

export default async function Page({ params }) {
    const { id } = await params;
    const project = await getProject(id);
    const client = project.clientId || project.client || {};
    const clientId = client._id || client.id;
    const projectDate = formatDate(project.createdAt);
    const proposalCount = Array.isArray(project.proposals)
        ? project.proposals.length
        : Number(project.proposalCount ?? 0);
    const skills = Array.isArray(project.skills) ? project.skills : [];
    const budget = formatBudget(project.budget);
    const workType = formatLabel(project.budgetType || project.type) || "Fixed price";
    const duration = project.duration || project.estimatedDuration || project.deliveryTime;
    const status = project.status || "open";

    return (
        <section className="pb-16">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-w-0 space-y-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status={status} />
                            {projectDate && (
                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <CalendarDays size={16} strokeWidth={1.6} />
                                    Posted {projectDate}
                                </span>
                            )}
                        </div>

                        <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                            {project.title || "Untitled project"}
                        </h2>

                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gray-100 pb-6 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-2">
                                <MessageSquareText size={17} strokeWidth={1.6} />
                                {proposalCount} {proposalCount === 1 ? "proposal" : "proposals"}
                            </span>
                            {project.category && (
                                <span className="inline-flex items-center gap-2">
                                    <BriefcaseBusiness size={17} strokeWidth={1.6} />
                                    {project.category}
                                </span>
                            )}
                            {client.country && (
                                <span className="inline-flex items-center gap-2">
                                    <MapPin size={17} strokeWidth={1.6} />
                                    {client.country}
                                </span>
                            )}
                        </div>

                        <div className="pt-6">
                            <h3 className="text-lg font-semibold text-gray-900">About this project</h3>
                            <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-gray-700">
                                {project.description || "No project description was provided."}
                            </p>
                            {project.responsibilities && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-gray-900">Key responsibilities</h4>
                                    {Array.isArray(project.responsibilities) ? (
                                        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-gray-700">
                                            {project.responsibilities.map((item, index) => (
                                                <li key={`${item}-${index}`}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-gray-700">
                                            {project.responsibilities}
                                        </p>
                                    )}
                                </div>
                            )}
                            {project.notes && (
                                <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-gray-700">
                                    {project.notes}
                                </p>
                            )}
                        </div>

                        <div className="mt-7 border-t border-gray-100 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900">Skills and expertise</h3>
                            {skills.length ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={`${skill}-${index}`}
                                            className="rounded-full bg-gray-100 px-3.5 py-2 text-sm font-medium text-gray-700"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-gray-500">No skills listed.</p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                        <h3 className="text-lg font-semibold text-gray-900">Project details</h3>
                        <div className="mt-5 grid gap-6 sm:grid-cols-2">
                            <DetailItem icon={DollarSign} label="Budget" value={budget} />
                            <DetailItem icon={BriefcaseBusiness} label="Contract type" value={workType} />
                            <DetailItem icon={Clock3} label="Project duration" value={duration} />
                            <DetailItem
                                icon={UsersRound}
                                label="Freelancers needed"
                                value={project.hiresNeeded}
                            />
                            <DetailItem
                                icon={BriefcaseBusiness}
                                label="Experience level"
                                value={formatLabel(project.experienceLevel || project.experience)}
                            />
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Project budget</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {budget}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{workType}</p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Proposals</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">{proposalCount}</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">Hired</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {project.hiredCount ?? 0}
                                    {project.hiresNeeded ? ` / ${project.hiresNeeded}` : ""}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/nx/projects/${id}/proposals`}
                            className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-orange-700"
                        >
                            Review proposals
                        </Link>
                        <Link
                            href={`/nx/projects/${id}/suggested`}
                            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-gray-300 px-5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                            Invite freelancers
                        </Link>
                    </section>
                </aside>
            </div>
        </section>
    );
}
