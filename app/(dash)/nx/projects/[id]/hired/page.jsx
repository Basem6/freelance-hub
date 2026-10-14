import { Suspense } from "react";
import { redirect } from "next/navigation";
import { serverFetch } from "../../../../../lib/server-auth";
import ProjectPeopleClient from "../ProjectPeopleClient";
import ProposalsSkeleton from "../proposals/ProposalsSkeleton";

async function Hires({ projectId }) {
    const { ok, status, data } = await serverFetch(`/projects/${projectId}/allproposal`);

    if (status === 401) redirect("/login");

    if (!ok) {
        return (
            <ProjectPeopleClient
                kind="hires"
                error="Unable to load hires for this project. Please try again later."
            />
        );
    }

    const result = data?.proposals ?? data?.data?.proposals ?? data?.data ?? data;
    const proposals = Array.isArray(result) ? result : [];
    const hires = proposals.filter(
        (proposal) => String(proposal.status || "").toLowerCase() === "accepted"
    );

    return <ProjectPeopleClient kind="hires" initialRecords={hires} />;
}

export default async function Page({ params }) {
    const { id } = await params;

    return (
        <Suspense fallback={<ProposalsSkeleton />}>
            <Hires projectId={id} />
        </Suspense>
    );
}
