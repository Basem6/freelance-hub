"use client";

import { createContext, useContext, useEffect, useState } from "react";

const JobPostContext = createContext(null);
export const JOB_POST_DRAFT_STORAGE_KEY = "freelanceHub.jobPostDraft";

const initialWork = {
    title: "",
    skills: [],
    duration: "",
    budget: "",
    description: "",
};

export function JobPostProvider({ children }) {
    const [work, setWork] = useState(initialWork);
    const [isHydrated, setIsHydrated] = useState(false);
    const [storageError, setStorageError] = useState("");

    useEffect(() => {
        try {
            const savedDraft = window.localStorage.getItem(
                JOB_POST_DRAFT_STORAGE_KEY
            );

            if (savedDraft) {
                const parsedDraft = JSON.parse(savedDraft);

                if (
                    !parsedDraft ||
                    typeof parsedDraft !== "object" ||
                    !Array.isArray(parsedDraft.skills)
                ) {
                    throw new Error("Saved job draft has an invalid format.");
                }

                setWork({
                    title:
                        typeof parsedDraft.title === "string"
                            ? parsedDraft.title
                            : "",
                    skills: parsedDraft.skills.filter(
                        (skill) => typeof skill === "string"
                    ),
                    duration:
                        typeof parsedDraft.duration === "string"
                            ? parsedDraft.duration
                            : "",
                    budget:
                        typeof parsedDraft.budget === "string" ||
                        typeof parsedDraft.budget === "number"
                            ? String(parsedDraft.budget)
                            : "",
                    description:
                        typeof parsedDraft.description === "string"
                            ? parsedDraft.description
                            : "",
                });
            }
        } catch {
            setStorageError(
                "Your saved job draft could not be restored. Check this site's browser storage."
            );
        } finally {
            setIsHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!isHydrated || storageError) return;

        try {
            window.localStorage.setItem(
                JOB_POST_DRAFT_STORAGE_KEY,
                JSON.stringify(work)
            );
        } catch {
            setStorageError(
                "Your job draft cannot be saved in this browser. Refreshing may discard your changes."
            );
        }
    }, [isHydrated, storageError, work]);

    function update(field, value) {
        setWork((currentWork) => ({ ...currentWork, [field]: value }));
    }

    return (
        <JobPostContext.Provider value={{ work, update, storageError }}>
            {children}
        </JobPostContext.Provider>
    );
}

export function useJobPost() {
    const context = useContext(JobPostContext);

    if (!context) {
        throw new Error("useJobPost must be used within a JobPostProvider");
    }

    return context;
}
