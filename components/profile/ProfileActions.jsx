"use client";
import { useRouter } from "next/navigation";

export default function ProfileActions({ person }) {
const router = useRouter();

return (
    <div className="flex items-center gap-3 mt-6 md:mt-0 pb-2">

    <button
        onClick={() =>
        router.push(`/messages?userId=${person?._id}`)
        }
        disabled={!person?._id}
        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
    >
        Message
    </button>

    <a
        href={`mailto:${person?.email}`}
        className="inline-block px-8 py-3 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-lg transition-colors shadow-md"
    >
        Hire Me
    </a>

    </div>
);
}
