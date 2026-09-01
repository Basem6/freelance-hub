"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/app/lib/hooks";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Users,
  Share2,
  Bookmark,
  Shield,
  ArrowRight,
  X,
} from "lucide-react";
import { hideShow, setShow } from "../../../lib/Features/showSlice";
import { useAppDispatch } from "../../../lib/hooks";
import Link from "next/link";

// ======================================================
// Animations
// ======================================================
let monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
function timeAgo(date) {
    const seconds = Math.floor(
        (Date.now() - new Date(date).getTime()) / 1000
    )

    if (seconds < 60) {
        return `${seconds} seconds ago`
    }

    const minutes = Math.floor(seconds / 60)

    if (minutes < 60) {
        return `${minutes} minutes ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours} hours ago`
    }

    const days = Math.floor(hours / 24)

    if (days < 30) {
        return `${days} days ago`
    }

    const months = Math.floor(days / 30)

    if (months < 12) {
        return `${months} months ago`
    }

    const years = Math.floor(months / 12)

    return `${years} years ago`
}
const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// ======================================================
// Main Component
// ======================================================

export default function ProjectDetailsClient({ project  , proposals: initialProposals }) {
  const dispatch = useAppDispatch()
  const [proposals, setProposals] = useState(initialProposals || []);
  const user = useAppSelector((state) => state.auth.user);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  // Get client info - handle both data structures
  const clientInfo = project?.clientId || project?.client || {};
  const clientName = clientInfo?.fullName || clientInfo?.name || "Client";
  const clientImage = clientInfo?.image || "/avatars/avatar-1.png";
  function showToast(message){
  dispatch(setShow(message))
  setTimeout(() => {
      dispatch(hideShow())
  }, 3000);
  } 
  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans text-[#111111] pb-24">

      {/* ==================================================
          Proposal Modal
      ================================================== */}

      <AnimatePresence>
        {showProposal && (
          <ProposalModal
            project={project}
            onClose={() => setShowProposal(false)}
            showToast={showToast}
            setProposals={setProposals}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ==================================================
              Main Column
          ================================================== */}

          <div className="lg:col-span-2 space-y-8">

            {/* ==================================================
                Project Header
            ================================================== */}

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF7A00] to-orange-400" />

              {/* Status */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-2 mb-4"
              >
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  Open
                </span>

                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                  Urgent
                </span>

                <span className="px-3 py-1 bg-orange-50 text-[#FF7A00] text-xs font-semibold rounded-full border border-orange-200">
                  Featured
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
                    className="p-2.5 rounded-full hover:bg-gray-50 border border-gray-200 text-gray-600 transition-all hover:border-gray-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

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

                      {clientInfo?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {clientInfo.location}
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


            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
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

            {/* ==================================================
                Applicants
            ================================================== */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <h2 className="text-xl font-bold">
                  Top Proposals ({proposals.length ?? 0})
                </h2>

              </div>

              {/* Real proposals */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >

                {proposals?.length > 0 ? (

                  proposals.map((proposal) => (

                    <ProposalCard
                      key={proposal._id}
                      proposal={proposal}
                    />

                  ))

                ) : (

                  <div className="py-10 text-center text-gray-400">
                    No proposals yet.
                  </div>

                )}

              </motion.div>

            </motion.div>

          </div>

          {/* ==================================================
              Sidebar
          ================================================== */}

          <div className="lg:col-span-1">

            <div className="sticky top-8 space-y-6">

              {/* ==================================================
                  Action Card
              ================================================== */}

              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg shadow-gray-200/40"
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
                {user?.role === "freelancer" ? (

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProposal(true)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-bold text-base shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    Submit a Proposal
                  </motion.button>

                ) : (

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7A00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white rounded-xl font-bold text-base shadow-lg shadow-orange-500/30 transition-all"
                  >
                    Send a Message
                  </motion.button>

                )}

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

                  <div className="flex justify-between items-center text-sm">

                    <span className="text-gray-500">
                      Last viewed
                    </span>

                    <span className="font-semibold">
                      {project?.lastViewed ?? "Recently"}
                    </span>

                  </div>

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

        </div>

      </div>

    </div>
  );
}

function ProposalCard({ proposal }) {
  const freelancer = proposal?.freelancer;

  return (
    <motion.div
      variants={fadeInUp}
      className="group p-5 border border-gray-100 hover:border-orange-200 rounded-xl hover:shadow-md transition-all bg-white relative overflow-hidden"
    >

      {/* Match */}
      <div className="absolute top-0 right-0 p-4">

        <span className=" text-gray-500 text-xs  px-2.5 py-1 rounded-full flex items-center gap-1">


          {timeAgo(proposal?.createdAt) || "Recently"} ago

        </span>

      </div>

      <div className="flex items-start gap-4 sm:gap-5">

        {/* Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">

          <Image
            src={
              freelancer?.image ||
              "/avatars/avatar-1.png"
            }
            alt={
              freelancer?.fullName ||
              "Freelancer"
            }
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />

        </div>

        <div className="flex-1 min-w-0 pr-16 sm:pr-24">

          <h4 className="font-bold text-gray-900 text-lg truncate">

            {freelancer?.fullName ||
              "Freelancer"}

          </h4>

          <p className="text-xs  text-gray-600 truncate">

            {freelancer?.major ||
              ""}

          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">

            {freelancer?.country && (
              <span className="flex items-center gap-1">

                <MapPin className="w-3 h-3" />

                {freelancer?.country || freelancer?.location || "Unknown"}

              </span>
            )}

            {freelancer && (
              <span className="flex items-center gap-1">

                <Star className="w-3 h-3 text-yellow-500 fill-current" />

                {freelancer?.rating || 0}

              </span>
            )}

            <span className="font-semibold text-gray-900">

              ${proposal?.bidAmount ?? 0}

            </span>

            <span>

              {proposal?.deliveryTime ?? 0} days

            </span>

          </div>

          {/* Cover Letter */}
          <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">

            "{proposal?.coverLetter || "No cover letter"}"

          </p>
          <Link href={`/hire/${freelancer?._id}`} className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6">
          <button className="mt-4 text-[#FF7A00] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">

            View Profile

            <ArrowRight className="w-4 h-4" />

          </button>
          </Link>

        </div>

      </div>

    </motion.div>
  );
}

function ProposalModal({ project, onClose  , showToast , setProposals}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!coverLetter.trim()) {
      setError("Please write a cover letter.");
      return;
    }

    if (!bidAmount || Number(bidAmount) <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }

    if (!deliveryTime || Number(deliveryTime) <= 0) {
      setError("Please enter a valid delivery time.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/backend/projects/${project._id}/addproposal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            coverLetter: coverLetter.trim(),
            bidAmount: Number(bidAmount),
            deliveryTime: Number(deliveryTime),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit proposal"
        );
      }
      setProposals((prev) => [data.proposal, ...prev]);
      console.log("Proposal submitted:", data);
      showToast({ message: data.message, type: "sucess" });
      onClose();
      
    } catch (error) {
      console.error("Submit proposal error:", error);

      setError(
        error?.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
          y: 20,
        }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Submit a Proposal
            </h2>

            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {project?.title}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Bid */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Bid
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                $
              </span>

              <input
                type="number"
                value={bidAmount}
                onChange={(e) =>
                  setBidAmount(e.target.value)
                }
                placeholder="Enter your price"
                min="1"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00]"
              />

            </div>

            {project?.budget && (
              <p className="text-xs text-gray-400 mt-1.5">
                Project budget: {project.budget}
              </p>
            )}

          </div>

          {/* Delivery Time */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Time
            </label>

            <div className="relative">

              <input
                type="number"
                value={deliveryTime}
                onChange={(e) =>
                  setDeliveryTime(e.target.value)
                }
                placeholder="e.g. 14"
                min="1"
                required
                className="w-full px-4 pr-16 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00]"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                days
              </span>

            </div>

          </div>

          {/* Cover Letter */}
          <div>

            <div className="flex justify-between items-center mb-2">

              <label className="block text-sm font-semibold text-gray-700">
                Cover Letter
              </label>

              <span className="text-xs text-gray-400">
                {coverLetter.length}/2000
              </span>

            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => {

                if (e.target.value.length <= 2000) {
                  setCoverLetter(e.target.value);
                }

              }}
              rows={6}
              required
              placeholder="Explain why you're the right person for this project..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00]"
            />

          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Proposal"}
            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
}