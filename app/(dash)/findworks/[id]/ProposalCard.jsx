import { AnimatePresence, motion } from "framer-motion";
import { Flag, Eye, MapPin, MoreHorizontal, Pencil, Star, UserCheck } from "lucide-react";
import Image from "next/image";
import { timeAgo } from "../../../utils/handletime";

export function ProposalCard({ proposal, project, user, isMenuOpen, onToggleMenu, onAction }) {
  const freelancer = proposal?.freelancer;
  const isOwnProposal = user?.role === "freelancer" && String(user?._id) === String(freelancer?._id);
  const canReport =
  user && !isOwnProposal;

  return (
    <motion.div
      
      className="group md:p-5 p-2 border border-gray-100 hover:border-orange-200 rounded-xl hover:shadow-md  transition-all bg-white relative"
    >

      {/* Match */}
      <div className="absolute top-0 right-0 flex items-center gap-2 p-4" data-proposal-menu>

        <span className=" text-gray-500 text-xs  px-2.5 py-1 rounded-full flex items-center gap-1">
          {timeAgo(proposal?.createdAt) || "Recently"} 
        </span>
        
        <div className="relative">
          <button type="button" aria-label={`Actions for ${freelancer?.fullName || "freelancer"}`} aria-expanded={isMenuOpen} aria-haspopup="menu" onClick={onToggleMenu} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          <AnimatePresence>
            {isMenuOpen && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} role="menu" className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg shadow-gray-200/60">
              {user?.role === "client"&& user?._id === project.clientId._id && <ProposalMenuItem icon={Eye} label="View Full Proposal" onClick={() => onAction("details")} />}
              {user?.role === "client" && user?._id === project.clientId._id && <ProposalMenuItem icon={UserCheck} label="Select Freelancer" onClick={() => onAction("select")} disabled={proposal?.status === "accepted"} />}
              {isOwnProposal && <ProposalMenuItem icon={Pencil} label="Edit Proposal" onClick={() => onAction("edit")} />}
              {canReport && <ProposalMenuItem icon={Flag} label="Report Proposal" onClick={() => onAction("report")} destructive />}
            </motion.div>}
          </AnimatePresence>
        </div>
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
          <a href={`/hire/${freelancer._id}`}>
          <h4 className="font-bold hover:text-gray-900/60 transtion-all duration-300 w-fit   text-gray-900 text-lg truncate">

            {freelancer?.fullName ||
              "Freelancer"}

          </h4>
          </a>

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

            
          </div>

          {/* Cover Letter */}
          <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-line">
          "{proposal?.coverLetter || "No cover letter"}"
        </p>

        </div>

      </div>

    </motion.div>
  );
}

function ProposalMenuItem({ icon: Icon, label, onClick, disabled, destructive }) {
  return <button type="button" role="menuitem" onClick={onClick} disabled={disabled} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${destructive ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-orange-50 hover:text-[#FF7A00]"} disabled:cursor-not-allowed disabled:opacity-40`}><Icon className="h-4 w-4" />{label}</button>;
}

