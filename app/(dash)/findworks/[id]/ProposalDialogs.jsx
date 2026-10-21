import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import OptionSelect from "@/components/ui/OptionSelect";

export function ProposalDetailsModal({ proposal, user, onClose, onMessage }) {
  const freelancer = proposal?.freelancer || {};
  return <ProposalDialog title="Full Proposal" onClose={onClose}>
    <div className="flex items-center gap-3 border-b border-gray-100 pb-5"><Image src={freelancer.image || "/avatars/avatar-1.png"} alt={freelancer.fullName || "Freelancer"} width={48} height={48} className="h-12 w-12 rounded-full object-cover" /><div><a href={`/hire/${freelancer._id}`}>
          <h3 className="font-bold hover:text-gray-900/60 transtion-all duration-300 w-fit   text-gray-900 text-lg truncate">

            {freelancer?.fullName ||
              "Freelancer"}

          </h3>
          </a><p className="text-sm text-gray-500">{freelancer.major || "Independent freelancer"}</p></div></div>
    <div className="grid grid-cols-2 gap-3 py-5 text-sm"><ProposalStat label="Proposed price" value={`$${proposal?.bidAmount ?? 0}`} /><ProposalStat label="Delivery time" value={`${proposal?.deliveryTime ?? 0} days`} /><ProposalStat label="Rating" value={freelancer.rating ? `${freelancer.rating} / 5` : "Not rated"} /><ProposalStat label="Location" value={freelancer.country || freelancer.location || "Not provided"} /></div>
    <div className="space-y-2"><h3 className="text-sm font-semibold text-gray-900">Proposal message</h3><p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">{proposal?.coverLetter || "No proposal message provided."}</p></div>
    {(proposal?.additionalDetails || freelancer.bio || freelancer.skills?.length) && <div className="mt-5 space-y-2"><h3 className="text-sm font-semibold text-gray-900">Additional details</h3><p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{proposal?.additionalDetails || freelancer.bio || freelancer.skills?.join(", ")}</p></div>}
    {user?.role === "client" && freelancer?._id && <button type="button" onClick={onMessage} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF7A00] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30"><MessageCircle className="h-4 w-4" />Message Freelancer</button>}
  </ProposalDialog>;
}

function ProposalStat({ label, value }) {
  return <div className="rounded-xl border border-gray-100 bg-white p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 font-semibold text-gray-900">{value}</p></div>;
}

export function ConfirmationModal({ proposal, isLoading, onClose, onConfirm }) {
  return <ProposalDialog title="Select freelancer" onClose={onClose}><div className="flex gap-3 rounded-xl bg-orange-50 p-4 text-sm text-orange-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7A00]" /><p>Select <strong>{proposal?.freelancer?.fullName || "this freelancer"}</strong> for this project? This will update the proposal status.</p></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={isLoading} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">Cancel</button><button type="button" onClick={onConfirm} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60">{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}{isLoading ? "Selecting..." : "Select freelancer"}</button></div></ProposalDialog>;
}

export function ReportModal({ proposal, isLoading, onClose, onSubmit }) {
  const [reason, setReason] = useState("Misleading or inaccurate information");
  const [details, setDetails] = useState("");
  return <ProposalDialog title="Report proposal" onClose={onClose}><p className="text-sm text-gray-600">Help us understand what is wrong with this proposal.</p><label className="mt-5 block text-sm font-semibold text-gray-700">Reason<OptionSelect value={reason} onChange={setReason} options={["Misleading or inaccurate information", "Spam or solicitation", "Inappropriate content", "Other"]} className="mt-2" buttonClassName="bg-white font-normal text-gray-900" /></label><label className="mt-4 block text-sm font-semibold text-gray-700">Additional details <span className="font-normal text-gray-400">(optional)</span><textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={4} placeholder="Tell us a little more" className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20" /></label><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={isLoading} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">Cancel</button><button type="button" onClick={() => onSubmit(proposal, reason, details)} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}{isLoading ? "Reporting..." : "Submit report"}</button></div></ProposalDialog>;
}

function ProposalDialog({ title, onClose, children }) {
  useEffect(() => { const closeOnEscape = (event) => event.key === "Escape" && onClose(); document.addEventListener("keydown", closeOnEscape); return () => document.removeEventListener("keydown", closeOnEscape); }, [onClose]);
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50  flex items-end justify-center bg-gray-900/40 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="max-h-[90vh] w-full max-w-lg overflow-auto hide-scrollbar bg-white rounded-t-2xl  p-6 shadow-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="proposal-dialog-title"><div className="flex items-center justify-between gap-4"><h2 id="proposal-dialog-title" className="text-xl font-bold text-gray-900">{title}</h2><button type="button" aria-label="Close dialog" onClick={onClose} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"><X className="h-5 w-5" /></button></div><div className="mt-5">{children}</div></motion.div></motion.div>;
}

export function ProposalModal({ project, proposal, isEditing = false, onClose  , showToast , setProposals}) {
  const [coverLetter, setCoverLetter] = useState(proposal?.coverLetter || "");
  const [bidAmount, setBidAmount] = useState(proposal?.bidAmount?.toString() || "");
  const [deliveryTime, setDeliveryTime] = useState(proposal?.deliveryTime?.toString() || "");
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
        isEditing ? `/api/backend/freelancer/updateProposal/${proposal._id}` : `/api/backend/projects/${project._id}/addproposal`,
        {
          method: isEditing ? "PATCH" : "POST",
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
      setProposals((prev) => isEditing
        ? prev.map((item) => item._id === proposal._id ? { ...item, ...data.proposal } : item)
        : [data.proposal, ...prev]);
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
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-99999 bg-black/50 backdrop-blur-sm"
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
        className="relative bg-white z-99999 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Proposal" : "Submit a Proposal"}
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
                ? (isEditing ? "Saving..." : "Submitting...")
                : (isEditing ? "Save Changes" : "Submit Proposal")}
            </button>

          </div>

        </form>

      </motion.div>

    </div>
  );
}