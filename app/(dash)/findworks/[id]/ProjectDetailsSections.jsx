import { motion } from "framer-motion";
import {
  Briefcase,
  Bookmark,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import { monthNames } from "../../../lib/constants/MonthName";
import { fadeInUp, slideInRight, staggerContainer } from "../../../lib/constants/animations";
import { ProposalCard } from "./ProposalCard";

export function ProjectSummaryCard({
  project,
  proposals,
  clientInfo,
  clientImage,
  clientName,
  isBookmarked,
  setIsBookmarked,
}) {
  return (
            <motion.div
              variants={staggerContainer}
              
              className="bg-white rounded-2xl p-8 border border-gray-100  relative overflow-hidden"
            >
              {/* Status */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 mb-4"
              >
                <span className={`px-3 py-1 ${project?.status === 'open' ? 'bg-green-50' : project?.status === 'in_progress' ? 'bg-blue-50' : 'bg-gray-50'} text-${project?.status === 'open' ? 'green-700' : project?.status === 'in_progress' ? 'blue-700' : 'gray-700'} text-xs font-semibold rounded-full border border-${project?.status === 'open' ? 'green-200' : project?.status === 'in_progress' ? 'blue-200' : 'gray-200'}`}>
                  {project?.status}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold mb-6 leading-tight"
              >
                {project?.title ?? "Project details"}
              </motion.h1>

              {/* Meta */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6"
              >
                <div className="flex items-center gap-6 text-sm text-gray-500">

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {project?.createdAt
                      ? new Date(project.createdAt).toLocaleDateString()
                      : "Posted recently"}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {proposals.length ?? 0} Proposals
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2.5 rounded-full border transition-all ${
                      isBookmarked
                        ? "bg-orange-50 border-orange-200 text-[#FF7A00]"
                        : "hover:bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Bookmark
                      className="w-5 h-5"
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>

                </div>
              </motion.div>

              {/* ==================================================
                  Client Info
              ================================================== */}

              <motion.div
                variants={fadeInUp}
                className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >

                <div className="flex items-center gap-4">

                  <div className="size-16 rounded-full overflow-hidden">

                    <Image
                      src={clientImage}
                      alt={clientName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {clientName}
                    </h3>

                    <div className="flex items-center text-sm text-gray-600 gap-3 mt-1">

                      {clientInfo?.country && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {clientInfo.country}
                        </span>
                      )}

                      {clientInfo?.rating && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {clientInfo.rating}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* Client Stats */}
                <div className="flex gap-4 text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">

                  <div className="text-center px-3 border-r border-gray-200">
                    <div className="text-gray-500 text-xs mb-1">
                      Member since
                    </div>

                    <div className="font-semibold">
                      {clientInfo?.createdAt
                        ? new Date(
                          clientInfo.createdAt
                        ).getFullYear()+ " - "  + monthNames[new Date(clientInfo.createdAt).getMonth()]
                        : "2021"}
                    </div>
                  </div>

                  <div className="text-center px-3 border-r border-gray-200">
                    <div className="text-gray-500 text-xs mb-1">
                      Total Spent
                    </div>

                    <div className="font-semibold">
                      {clientInfo?.totalSpent ?? "$0"}
                    </div>
                  </div>

                  <div className="text-center px-3 flex flex-col items-center justify-center">
                    <div className="text-gray-500 text-xs mb-1">
                      Hire Rate
                    </div>

                    <div className="font-semibold text-green-600">
                      {clientInfo?.hireRate ?? "0%"}
                    </div>
                  </div>

                </div>

              </motion.div>

              {/* Payment */}
              <motion.div
                variants={fadeInUp}
                className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />

                <span className="font-medium">
                  Payment Verified
                </span>
              </motion.div>

            </motion.div>
  );
}

export function ProjectOverview({ project }) {
  return (
            <motion.div
              
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-gray-100"
            >

              <h2 className="text-2xl font-bold mb-6">
                Project Overview
              </h2>

              <div className="prose max-w-none text-gray-600 space-y-4">

                <p>
                  {project?.description ||
                    "No description provided."}
                </p>

                {project?.responsibilities && (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mt-6">
                      Key Responsibilities:
                    </h3>

                    <ul className="list-disc pl-5 space-y-2">

                      {Array.isArray(project.responsibilities) ? (
                        project.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index}>
                              {responsibility}
                            </li>
                          )
                        )
                      ) : (
                        <li>
                          {project.responsibilities}
                        </li>
                      )}

                    </ul>
                  </>
                )}

                {project?.notes && (
                  <p className="mt-4">
                    {project.notes}
                  </p>
                )}

              </div>

              {/* Skills */}
              <div className="mt-8 pt-8 border-t border-gray-100">

                <h3 className="text-lg font-bold mb-4">
                  Required Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {project?.skills?.length > 0 ? (
                    project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No skills listed
                    </span>
                  )}

                </div>

              </div>

            </motion.div>
  );
}

export function ProjectProposalList({
  project,
  proposals,
  user,
  openProposalMenu,
  setOpenProposalMenu,
  setProposalDialog,
}) {
  return (
            <motion.div
            
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-2xl md:p-8 p-2 py-5 border border-gray-100 "
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <h2 className="text-xl font-bold px-2">
                  Top Proposals ({proposals.length ?? 0})
                </h2>

              </div>

              {/* Real proposals */}
              <motion.div
                variants={staggerContainer}
              
                className="space-y-4"
              >

                {proposals?.length > 0 ? (

                  proposals.map((proposal) => (

                    <ProposalCard
                      key={proposal._id}
                      proposal={proposal}
                      user={user}
                      project={project}
                      isMenuOpen={openProposalMenu === proposal._id}
                      onToggleMenu={() => setOpenProposalMenu((current) => current === proposal._id ? null : proposal._id)}
                      onAction={(type) => {
                        setOpenProposalMenu(null);
                        setProposalDialog({ type, proposal });
                      }}
                    />

                  ))

                ) : (

                  <div className="py-10 text-center text-gray-400">
                    No proposals yet.
                  </div>

                )}

              </motion.div>

            </motion.div>
  );
}

export function ProjectDetailsSidebar({
  project,
  user,
  proposals,
  setShowProposal,
  router,
}) {
  return (
          <div className="lg:col-span-1">

            <div className="sticky top-8 space-y-6">

              {/* ==================================================
                  Action Card
              ================================================== */}

              <motion.div
               
                
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >

                {/* Budget */}
                <div className="mb-6">

                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Budget
                  </div>

                  <div className="text-3xl font-bold text-[#FF7A00] tracking-tight">
                    {project?.budget ?? "$0"}
                  </div>

                  <div className="flex items-center gap-2 mt-2">

                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {project?.type ?? "Fixed Price"}
                    </span>

                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />

                      {project?.collaborationType ??
                        "Long-term collaboration"}
                    </span>

                  </div>

                </div>


                {/* Main Button */}
                
                {user?.role === "freelancer"  ? (

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProposal(true)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#da710f] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-bold text-base  transition-all flex items-center justify-center gap-2"
                  >
                    Submit a Proposal
                  </motion.button>

                ) : user?.role === "client" && user._id != project?.clientId._id ? (

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/messages?userId=${project?.clientId._id|| project?.client?._id}`)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-bold text-base  transition-all"
                  >
                    Send a Message
                  </motion.button>

                ):""}

              </motion.div>

              {/* ==================================================
                  Stats
              ================================================== */}

              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >

                <h3 className="font-bold text-gray-900 mb-4">
                  Project Stats
                </h3>

                <div className="space-y-4">

                  <div className="flex justify-between items-center text-sm">

                    <span className="text-gray-500">
                      Activity
                    </span>

                    <span className="font-semibold">
                      {proposals.length ?? 0} proposals
                    </span>

                  </div>

                  
                  {project?.freelancerId &&
                  <div className="flex justify-between items-center text-sm">

                    <span className="text-gray-500">
                      freelancer assigned
                    </span>

                  <div className="flex items-center gap-3 ">
                     {/* Avatar */}
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0">

                      <Image
                        src={
                          project?.freelancerId?.image ||
                          "/avatars/avatar-1.png"
                        }
                        alt={
                          project?.freelancerId?.fullName ||
                          "Freelancer"
                        }
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />

                    </div>
                    <div className="flex flex-col items-center justify-center   overflow-hidden ">
                      <div className="text-sm  text-center text-gray-900">
                        {project.freelancerId?.fullName || "Freelancer"}
                      </div>
                      <div className="text-xs  text-center text-gray-900/70">
                        {project.freelancerId?.major || "Backend developer"}
                      </div>
                    </div>
                        
                    
                  </div>

                  </div>
                  }

                </div>

              </motion.div>

              {/* ==================================================
                  Safety Card
              ================================================== */}

              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="bg-orange-50 rounded-2xl p-6 border border-orange-100"
              >

                <div className="flex items-center gap-2 text-orange-800 font-bold mb-4">

                  <Shield className="w-5 h-5" />

                  Safety Tips

                </div>

                <ul className="space-y-3 text-sm text-orange-900/80">

                  <li className="flex gap-2.5">

                    <CheckCircle className="w-4 h-4 text-[#FF7A00] mt-0.5" />

                    <span>
                      Never pay a fee to bid on or accept a job.
                    </span>

                  </li>

                  <li className="flex gap-2.5">

                    <CheckCircle className="w-4 h-4 text-[#FF7A00] mt-0.5" />

                    <span>
                      Keep all communications and payments on FreelanceHub.
                    </span>

                  </li>

                  <li className="flex gap-2.5">

                    <CheckCircle className="w-4 h-4 text-[#FF7A00] mt-0.5" />

                    <span>
                      Report suspicious activity or requests for personal info.
                    </span>

                  </li>

                </ul>

              </motion.div>

            </div>

          </div>
  );
}
