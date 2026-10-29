"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { useShowToast } from "../../../hooks/showToast";
import {
  ConfirmationModal,
  ProposalDetailsModal,
  ProposalModal,
  ReportModal,
} from "./ProposalDialogs";
import {
  ProjectDetailsSidebar,
  ProjectOverview,
  ProjectProposalList,
  ProjectSummaryCard,
} from "./ProjectDetailsSections";


export default function ProjectDetailsClient({ project }) {
  const router = useRouter();
  const showToast = useShowToast()
  const [proposals, setProposals] = useState(project?.proposals || []);
  const user = useAppSelector((state) => state.auth.user);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [openProposalMenu, setOpenProposalMenu] = useState(null);
  const [proposalDialog, setProposalDialog] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const clientInfo = project?.clientId || project?.client || {};
  const clientName = clientInfo?.fullName || clientInfo?.name || "Client";
  const clientImage = clientInfo?.image || "/avatars/avatar-1.png";
  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest('[data-proposal-menu]')) setOpenProposalMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenProposalMenu(null);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const handleSelectFreelancer = async (proposal) => {
    try {
      setSelectedProposal(proposal._id);
      const response = await fetch(`/api/backend/projects/${proposal._id}/choosefreelancer`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to select this freelancer.");
      setProposals((current) => current.map((item) => item._id === proposal._id ? { ...item, status: "accepted" } : item));
      setProposalDialog(null);
      showToast({ message: data.message || "Freelancer selected successfully.", type: "sucess" });
    } catch (error) {
      showToast({ message: error.message || "Unable to select this freelancer.", type: "error" });
    } finally {
      setSelectedProposal(null);
    }
  };

  const handleReportProposal = async (proposal, reason, details) => {
    try {
      setSelectedProposal(proposal._id);
      const response = await fetch(`/api/backend/projects/${proposal._id}/report`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, details }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to report this proposal.");
      setProposalDialog(null);
      showToast({ message: data.message || "Proposal reported. Thank you for helping keep FreelanceHub safe.", type: "sucess" });
    } catch (error) {
      showToast({ message: error.message || "Unable to report this proposal.", type: "error" });
    } finally {
      setSelectedProposal(null);
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans text-[#111111] pb-24">

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

      <AnimatePresence>
        {proposalDialog?.type === "edit" && <ProposalModal project={project} proposal={proposalDialog.proposal} isEditing onClose={() => setProposalDialog(null)} showToast={showToast} setProposals={setProposals} />}
        {proposalDialog?.type === "details" && (
          <ProposalDetailsModal
            proposal={proposalDialog.proposal}
            user={user}
            onClose={() => setProposalDialog(null)}
            onMessage={() => {
              setProposalDialog(null);
              router.push(`/messages?userId=${proposalDialog.proposal?.freelancer?._id}`);
            }}
          />
        )}
        {proposalDialog?.type === "select" && (
          <ConfirmationModal
            proposal={proposalDialog.proposal}
            isLoading={selectedProposal === proposalDialog.proposal._id}
            onClose={() => setProposalDialog(null)}
            onConfirm={() => handleSelectFreelancer(proposalDialog.proposal)}
          />
        )}
        {proposalDialog?.type === "report" && (
          <ReportModal
            proposal={proposalDialog.proposal}
            isLoading={selectedProposal === proposalDialog.proposal._id}
            onClose={() => setProposalDialog(null)}
            on
            ={handleReportProposal}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 ">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 space-y-8">

            <ProjectSummaryCard
              project={project}
              proposals={proposals}
              clientInfo={clientInfo}
              clientImage={clientImage}
              clientName={clientName}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
            />
            <ProjectOverview project={project} />
            <ProjectProposalList
              project={project}
              proposals={proposals}
              user={user}
              openProposalMenu={openProposalMenu}
              setOpenProposalMenu={setOpenProposalMenu}
              setProposalDialog={setProposalDialog}
            />
          </div>

          {/* ==================================================
              Sidebar
          ================================================== */}

          <ProjectDetailsSidebar
            project={project}
            user={user}
            proposals={proposals}
            setShowProposal={setShowProposal}
            router={router}
          />

        </div>

      </div>

    </div>
  );
}
