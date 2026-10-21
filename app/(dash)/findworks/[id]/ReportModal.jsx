import OptionSelect from "@/components/ui/OptionSelect";
export function ReportModal({
proposal,
isLoading,
onClose,
onSubmit,
}) {
const [reason, setReason] = useState(
    "Misleading or inaccurate information"
);
const [details, setDetails] = useState("");

const reportReasons = [
    "Misleading or inaccurate information",
    "Spam or solicitation",
    "Inappropriate content",
    "Other",
];

const handleSubmit = () => {
    onSubmit(proposal, reason, details);
};

return (
    <ProposalDialog title="Report proposal" onClose={onClose}>
    <p className="text-sm text-gray-600">
        Help us understand what is wrong with this proposal.
    </p>

    {/* Report reason */}
    <label className="mt-5 block text-sm font-semibold text-gray-700">
        Reason

        <OptionSelect
        value={reason}
        onChange={setReason}
        options={reportReasons}
        className="mt-2"
        buttonClassName="bg-white font-normal text-gray-900"
        />
    </label>

    {/* Additional details */}
    <label className="mt-4 block text-sm font-semibold text-gray-700">
        Additional details{" "}
        <span className="font-normal text-gray-400">
        (optional)
        </span>

        <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        rows={4}
        placeholder="Tell us a little more"
        className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
        />
    </label>

    {/* Actions */}
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
        Cancel
        </button>

        <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
        {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {isLoading ? "Reporting..." : "Submit report"}
        </button>
    </div>
    </ProposalDialog>
);
}
