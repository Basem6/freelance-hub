export default function BottomNav({
    progress = 1 / 3,
    onBack,
    onNext,
    backDisabled = false,
    nextDisabled = false,
    isLastStep = false,
}) {
    return (
        <nav
            aria-label="Job post navigation"
            className="relative flex min-h-20 w-full items-center justify-between border-t border-gray-200 bg-white px-5"
        >
            <div
                className="absolute left-0 top-0 h-1 w-full bg-black/10"
                aria-hidden="true"
            />
            <div
                className="absolute left-0 top-0 h-1 bg-black transition-[width]"
                style={{ width: `${progress * 100}%` }}
                aria-hidden="true"
            />
            <button
                type="button"
                onClick={onBack}
                disabled={backDisabled}
                className="rounded-md border border-orange-400/80 px-4 py-2 text-orange-500 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Back
            </button>
            <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className="rounded-md border border-orange-400/80 bg-orange-400 px-4 py-2 text-gray-50 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLastStep ? "Post job" : "Next"}
            </button>
        </nav>
    );
}