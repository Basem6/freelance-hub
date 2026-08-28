"use client";

import  {useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import Image from "next/image";
import { 
Briefcase, 
MapPin, 
Star, 
CheckCircle, 
Download, 
Clock, 
Eye, 
Users, 
Share2, 
Bookmark, 
Shield,
ArrowRight
} from 'lucide-react';

// Animations
const fadeInUp = {
hidden: { opacity: 0, y: 20 },
visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
hidden: { opacity: 0 },
visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
}
};

const slideInRight = {
hidden: { opacity: 0, x: 20 },
visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function ProjectDetailsClient({project}) {
const user = useAppSelector(state => state.auth.user);
const [isBookmarked, setIsBookmarked] = useState(false);
return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans text-[#111111] pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
            >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF7A00] to-orange-400"></div>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">Open</span>
                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">Urgent</span>
                <span className="px-3 py-1 bg-orange-50 text-[#FF7A00] text-xs font-semibold rounded-full border border-orange-200">Featured</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                {project?.title ?? 'Project details'}
            </motion.h1>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {project?.createdAt ?? 'Posted recently'}</div>
                    <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {project?.views ?? '—'} Views</div>
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {project?.proposals ?? '—'} Proposals</div>
                </div>
                
                <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-full hover:bg-gray-50 border border-gray-200 text-gray-600 transition-all hover:border-gray-300">
                    <Share2 className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2.5 rounded-full border transition-all ${isBookmarked ? 'bg-orange-50 border-orange-200 text-[#FF7A00]' : 'hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                    <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>
                </div>
            </motion.div>

            {/* Client Info inline card */}
            <motion.div variants={fadeInUp} className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                <div className="size-16 rounded-full overflow-hidden">
                            <Image
                            src={project.clientId?.image || "/avatars/avatar-1.png"}
                            alt={project.clientId?.fullName || "Client"}
                            width={16}
                            height={16}
                            className="w-full h-full object-cover"
                            />
                </div>
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                    {project?.client?.name ?? project?.clientId.fullName ?? 'Client'} 
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 gap-3 mt-1">
                    {project?.client?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project.client.location}</span>}
                    {project?.client?.rating && <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /> {project.client.rating}</span>}
                    </div>
                </div>
                </div>
                
                <div className="flex gap-4 text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <div className="text-center px-3 border-r border-gray-200 last:border-0">
                    <div className="text-gray-500 text-xs mb-1">Member since</div>
                    <div className="font-semibold">2021</div>
                </div>
                <div className="text-center px-3 border-r border-gray-200 last:border-0">
                    <div className="text-gray-500 text-xs mb-1">Total Spent</div>
                    <div className="font-semibold">$240k+</div>
                </div>
                <div className="text-center px-3 flex flex-col items-center justify-center">
                    <div className="text-gray-500 text-xs mb-1">Hire Rate</div>
                    <div className="font-semibold text-green-600">82%</div>
                </div>
                </div>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium">Payment Verified</span>
            </motion.div>
            </motion.div>

            {/* Project Description */}
            <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
            <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
            <div className="prose max-w-none text-gray-600 space-y-4">
                <p>{project?.description ?? 'No description provided.'}</p>
                {project?.responsibilities && (
                <>
                    <h3 className="text-lg font-semibold text-gray-900 mt-6">Key Responsibilities:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                    {Array.isArray(project.responsibilities) ? project.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                    )) : <li>{project.responsibilities}</li>}
                    </ul>
                </>
                )}
                <p className="mt-4">{project?.notes ?? ''}</p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                {(project?.skills && project.skills.length > 0 ? project.skills : ['No skills listed']).map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors cursor-default">
                    {skill}
                    </span>
                ))}
                </div>
            </div>
            </motion.div>


            {/* Applicants */}
            <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold">Top Proposals (12)</h2>
                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#FF7A00] focus:border-[#FF7A00] block p-2.5 outline-none">
                <option>Best Match</option>
                <option>Newest</option>
                <option>Lowest Price</option>
                <option>Highest Rating</option>
                </select>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
                {[
                { name: "Alex Rivera", title: "Senior Full-Stack Engineer", loc: "Berlin, DE", rate: "$65/hr", score: "98%", excerpt: "I've built 3 similar e-commerce platforms using Next.js and Stripe over the past year. I can architect this for maximum scalability...", avatar: "from-blue-400 to-indigo-500" },
                { name: "Sarah Chen", title: "React/Next.js Expert", loc: "Toronto, CA", rate: "$55/hr", score: "95%", excerpt: "My team specializes in high-performance Next.js applications. We've reviewed your requirements and have a clear 7-week plan...", avatar: "from-pink-400 to-rose-500" },
                { name: "David Kim", title: "AWS & Node.js Specialist", loc: "Seoul, KR", rate: "$7,500 fixed", score: "92%", excerpt: "I can handle the entire backend infrastructure, ensuring the PostgreSQL and Redis setup handles your expected traffic spikes seamlessly...", avatar: "from-emerald-400 to-teal-500" },
                { name: "Elena Volkov", title: "Full-Stack Developer", loc: "London, UK", rate: "$50/hr", score: "87%", excerpt: "I have deep experience with the exact stack you mentioned. I am available to start immediately and can commit 40hrs/week...", avatar: "from-amber-400 to-[#FF7A00]" },
                ].map((applicant, i) => (
                <motion.div key={i} variants={fadeInUp} className="group p-5 border border-gray-100 hover:border-orange-200 rounded-xl hover:shadow-md transition-all bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                    <span className="bg-orange-50 text-[#FF7A00] text-xs font-bold px-2.5 py-1 rounded-full border border-orange-100 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {applicant.score} Match
                    </span>
                    </div>
                    
                    <div className="flex items-start gap-4 sm:gap-5">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${applicant.avatar} flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}>
                        {applicant.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0 pr-16 sm:pr-24">
                        <h4 className="font-bold text-gray-900 text-lg truncate">{applicant.name}</h4>
                        <p className="text-sm font-medium text-gray-600 truncate">{applicant.title}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {applicant.loc}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-current" /> 5.0 (40+ jobs)</span>
                        <span className="font-semibold text-gray-900">{applicant.rate}</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        "{applicant.excerpt}"
                        </p>
                        <button className="mt-4 text-[#FF7A00] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                        View Profile <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                </motion.div>
                ))}
            </motion.div>
            </motion.div>
        </div>

        {/* Right Sidebar Column (1/3) */}
        <div className="lg:col-span-1 ">
            <div className="sticky top-8 space-y-6">
            
            {/* Action Card */}
            <motion.div 
                variants={slideInRight} initial="hidden" animate="visible"
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-200/40"
            >
                <div className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-1">Budget</div>
                <div className="text-3xl font-bold text-[#FF7A00] tracking-tight">{project?.budget ?? '$0'}</div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">{project?.type ?? 'Fixed Price'}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {project?.collaborationType ?? 'Long-term collaboration'}</span>
                </div>
                </div>
                {user?.role==="freelancer"?
                <div className="mb-8 pt-6 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-3">Timeline</div>
                <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-gray-900 text-lg">{project?.timeline ?? 'TBD'}</span>
                    <span className="text-xs font-semibold text-[#FF7A00]">{project?.progress ?? '0% Planned'}</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                    <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: project?.progress ? project.progress : '5%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-[#FF7A00] to-orange-400 h-2 rounded-full"
                    ></motion.div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {project?.startDate ?? 'ASAP'}</span>
                    <span>Estimated End: {project?.endDate ?? 'TBD'}</span>
                </div>
                </div>
                :""}

                <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-bold text-base shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                {user?.role==="freelancer" ?"Submit a Proposal":"Sent a Message "}
                </motion.button>
                
            </motion.div>

            {/* Stats Card */}
            <motion.div 
                variants={slideInRight} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
                <h3 className="font-bold text-gray-900 mb-4">Project Stats</h3>
                <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Activity</span>
                    <span className="font-semibold">12 proposals, 89 views</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last viewed</span>
                    <span className="font-semibold">2 hours ago</span>
                </div>
                </div>
            </motion.div>

            {/* Safety Card */}
            <motion.div 
                variants={slideInRight} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
                className="bg-orange-50 rounded-2xl p-6 border border-orange-100"
            >
                <div className="flex items-center gap-2 text-orange-800 font-bold mb-4">
                <Shield className="w-5 h-5" /> Safety Tips
                </div>
                <ul className="space-y-3 text-sm text-orange-900/80">
                <li className="flex gap-2.5">
                    <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-[#FF7A00]" /></div>
                    <span>Never pay a fee to bid on or accept a job.</span>
                </li>
                <li className="flex gap-2.5">
                    <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-[#FF7A00]" /></div>
                    <span>Keep all communications and payments on FreelanceHub.</span>
                </li>
                <li className="flex gap-2.5">
                    <div className="mt-0.5"><CheckCircle className="w-4 h-4 text-[#FF7A00]" /></div>
                    <span>Report suspicious activity or requests for personal info.</span>
                </li>
                </ul>
            </motion.div>

            </div>
        </div>

        </div>
    </div>
    
    {/* Global CSS for hiding scrollbar in related projects */}
    <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
        display: none;
        }
        .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
        }
    `}} />
    </div>
);
}
