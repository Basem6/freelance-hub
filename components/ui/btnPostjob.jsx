import { Plus } from "lucide-react";
import Link from "next/link";

export default function BtnPost() {
    return (
        <Link
            href="/nx/post-job/title"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-2 md:px-4 text-xs md:text-sm md:font-semibold text-white transition hover:bg-orange-600"
        >
            <Plus size={17} aria-hidden="true" />
            Post a Job
        </Link>
    );
}