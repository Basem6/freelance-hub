import { Suspense } from "react";
import { redirect } from "next/navigation";
import { serverFetch } from "../../../../../lib/server-auth"
import ProposalsClient from "./ProposalsClient";
import ProposalsSkeleton from "./ProposalsSkeleton";

async function Proposals({ id }) {
    const { ok, status, data } = await serverFetch(`/projects/${id}/allproposal`);

    if (status === 401) redirect("/login");

    const proposals = ok ? (data?.proposals ?? data?.data ?? data ?? []) : [];
    return <ProposalsClient projectId={id} initialProposals={proposals} />;
}

export default async function Page({ params }) {
    const { id } = await params;

    return (
        <div>
            <Suspense fallback={<ProposalsSkeleton />}>
                <Proposals id={id} />
            </Suspense>
        </div>
    );
}