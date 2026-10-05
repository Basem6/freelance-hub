'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ArrowRight,
    BriefcaseBusiness,
    CircleUserRound,
    Eye,
    LockKeyhole,
    Settings,
} from 'lucide-react'; 
import Avatar from "@/components/ui/Avatar"
import { useAppSelector } from '@/app/lib/hooks';

export default function FindWorkAside() {
    const user = useAppSelector((state) => state.auth.user);
    const technicalData = useAppSelector((state) => state.technicalData);
    const [visibility, setVisibility] = useState(
        user?.profileVisibility === 'private' ? 'private' : 'public'
    );

    if (user?.role !== 'freelancer') return null;

    const checklist = [
        { label: 'Add a profile photo', complete: Boolean(user.image) },
        { label: 'Set your professional title', complete: Boolean(technicalData.major?.trim()) },
        { label: 'Write your bio', complete: Boolean(technicalData.bio?.trim()) },
        { label: 'Add skills', complete: technicalData.skills?.length > 0 },
        { label: 'Add work experience', complete: technicalData.experience?.length > 0 },
        { label: 'Add portfolio work', complete: technicalData.portfolio?.length > 0 },
    ];
    const completedItems = checklist.filter((item) => item.complete).length;
    const completion = Math.round((completedItems / checklist.length) * 100);

    return (
        <div className="flex flex-col  overflow-hidden  h-fit  md:py-0   gap-3.5 ">
                <section className="rounded-2xl bg-gray-100/60  p-5">
                
                <div className="flex flex-row gap-5 md:px-0 relative px-5 items-center  mb-2">
                        <div className='size-16 overflow-hidden'>
                            <Avatar user={user} ></Avatar>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl w-25 truncate text-[#111111]">{user?.fullName || 'User Name'}</h2>
                            <h2 className="text-sm   text-gray-700/80">{user?.major || 'Freelnacer'}</h2>
                        
                        </div>
                </div>
                <div className="flex items-start justify-between gap-3 py-2">
                    <div>
                        <h2 className="text-base  text-gray-900">Complete your profile</h2>
                        
                    </div>
                    <span className="text-sm font-semibold text-black">{completion}%</span>
                </div>

                <div
                    className="mt-4 h-1 overflow-hidden rounded-full bg-orange-50"
                    role="progressbar"
                    aria-label="Profile completion"
                    aria-valuenow={completion}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-black/90 transition-[width] duration-500"
                        style={{ width: `${completion}%` }}
                    />
                </div>
            </section>

            <section className="rounded-2xl bg-gray-100/60 p-5">
                <div className="flex items-center gap-2">
                    <Eye size={17} className="text-black/80" aria-hidden="true" />
                    <h2 className="text-base font-semibold text-gray-900">Profile visibility</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Choose how you want your profile to appear.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
                    <button
                        type="button"
                        aria-pressed={visibility === 'public'}
                        onClick={() => setVisibility('public')}
                        className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                            visibility === 'public'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <CircleUserRound size={15} aria-hidden="true" />
                        Public
                    </button>
                    <button
                        type="button"
                        aria-pressed={visibility === 'private'}
                        onClick={() => setVisibility('private')}
                        className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
                            visibility === 'private'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <LockKeyhole size={14} aria-hidden="true" />
                        Private
                    </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-amber-700">
                    Preview only: visibility changes are not saved to your account yet.
                </p>

                <Link
                    href="/settings"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-orange-600"
                >
                    <Settings size={15} aria-hidden="true" />
                    Account settings
                    <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </section>

            <section className="rounded-2xl bg-gray-100/60 p-5">
                <div className="flex items-start gap-3">
                    <BriefcaseBusiness size={18} className="mt-0.5 shrink-0 text-black/90" aria-hidden="true" />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Stand out to clients</h2>
                        <p className="mt-1 text-sm leading-relaxed text-gray-600">
                            A detailed profile helps clients understand what you do best.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
