const HIGHLIGHT_PATTERN = /(\[\[hl\]\].*?\[\[\/hl\]\])/g;
const HIGHLIGHT_MARKERS = /\[\[hl\]\]|\[\[\/hl\]\]/g;

export default function Highlight({ text, maxLength = Infinity }) {
    if (text == null) return null;

    const value = String(text);
    const parts = value.split(HIGHLIGHT_PATTERN);
    const plainTextLength = value.replace(HIGHLIGHT_MARKERS, "").length;
    const shouldTruncate = plainTextLength > maxLength;
    let remaining = maxLength;
    let truncated = false;

    const renderedParts = [];

    for (const [index, part] of parts.entries()) {
        const isHighlighted = part.startsWith("[[hl]]") && part.endsWith("[[/hl]]");
        const content = isHighlighted
            ? part.slice("[[hl]]".length, -"[[/hl]]".length)
            : part;
        const visibleContent = Array.from(content);

        if (visibleContent.length > remaining) {
            visibleContent.length = Math.max(0, remaining);
            truncated = true;
        }

        const displayedContent = visibleContent.join("");
        remaining -= visibleContent.length;

        if (displayedContent) {
            renderedParts.push(
                isHighlighted ? (
                    <mark
                        key={index}
                        className="rounded bg-yellow-200 px-0.5 text-inherit"
                    >
                        {displayedContent}
                    </mark>
                ) : (
                    <span key={index}>{displayedContent}</span>
                )
            );
        }

        if (truncated) break;
    }

    if (shouldTruncate) renderedParts.push("…");

    return renderedParts;
}
