"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ARROW =
    "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%,22px_50%)]";
const FIRST =
    "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_50%,calc(100%-22px)_100%,0_100%)]";
const LAST =
    "[clip-path:polygon(0_0,calc(100%-22px)_0,calc(100%)_0,100%_100%,0_100%,22px_50%)]";

export default function ProjectSteps({ projectId, proposalsCount, shortlisted, hired }) {
    const pathname = usePathname();
    const base = `/nx/projects/${projectId}`;
    const steps = [
        { first: "VIEW", rest: "JOB POST", href: `${base}/job-details` },
        { first: "INVITE", rest: "FREELANCERS", href: `${base}/suggested` },
        {
            first: "REVIEW",
            rest: "PROPOSALS",
            count: proposalsCount,
            sub: `Shortlisted (${shortlisted})`,
            href: `${base}/proposals`,
        },
        { first: "HIRE", count: hired, href: `${base}/hired` },
    ];

    return (
        <nav
            aria-label="Project steps"
            className="mt-8 flex overflow-hidden rounded-full border border-gray-300 bg-white"
        >
            {steps.map((step, index) => {
                const active = pathname === step.href || pathname.startsWith(`${step.href}/`);
                const fullLabel = [
                    step.first,
                    step.rest,
                    step.count != null && `(${step.count})`,
                ]
                    .filter(Boolean)
                    .join(" ");

                return (
                    <Link
                        key={step.first}
                        href={step.href}
                        aria-label={fullLabel}
                        aria-current={active ? "step" : undefined}
                        className={`relative flex h-10 flex-1 flex-col items-center justify-center px-3 text-center text-sm transition md:h-17
                            ${index === 0 ? FIRST : index === steps.length - 1 ? LAST : ARROW}
                            ${index > 0 ? "-ml-[20px]" : ""}
                            ${active ? "bg-orange-600/90 text-white" : "bg-white text-gray-800 hover:bg-gray-50"}`}
                    >
                        <span className="max-sm:text-xs">
                            {step.first}
                            {step.rest && <span className="max-sm:hidden"> {step.rest}</span>}
                            {step.count != null && (
                                <span className="max-sm:hidden"> ({step.count})</span>
                            )}
                        </span>
                        {step.sub && (
                            <span className={`text-xs max-sm:hidden ${active ? "text-orange-100" : "text-gray-500"}`}>
                                {step.sub}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
