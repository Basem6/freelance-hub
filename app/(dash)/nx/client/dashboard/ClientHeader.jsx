"use client";
import { useAppSelector } from "../../../../lib/hooks";
import BtnPost from "../../../../../components/ui/btnPostjob";

export default function ClientHeader() {
    const user = useAppSelector((state) => state.auth.user);
    const greetingName = user?.fullName?.trim().split(/\s+/)[0] || "there";

    return (
        <header className="md:flex hidden px-2 w-full justify-between gap-5 sm:flex-row sm:items-center">
            <div>
                <h1 className="mt-1 md:text-2xl text-xl tracking-tight text-gray-900">
                    Welcome back, {greetingName}
                </h1>
                <p className="mt-2 md:block hidden max-w-2xl text-sm leading-6 text-gray-600">
                    Keep hiring moving. Review your activity or find the right people for your next project.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <BtnPost />
            </div>
        </header>
    );
}