import SearchPage from "./SearchPage";
import { Suspense } from "react";

export default function DirectorySearchPage() {
    return (
        <Suspense fallback={<p className="p-8 text-sm text-gray-600">Loading search…</p>}>
            <SearchPage />
        </Suspense>
    );
}
