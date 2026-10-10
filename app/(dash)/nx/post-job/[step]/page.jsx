"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import BottomNav from "../../../../../components/landing/bottomNav";
import { skillSuggestions } from "@/app/utils/skillSuggestions";
import {
    JOB_POST_DRAFT_STORAGE_KEY,
    useJobPost,
} from "../JobPostContext";

const steps = ["title", "skills", "duration", "budget", "description"];

const stepContent = {
    title: {
        heading: "Let's start with a strong title.",
        paragraph:
            "This helps your job post stand out to the right candidates. It’s the first thing they’ll see, so make it count!",
    },
    skills: {
        heading: "What skills are required?",
        paragraph:
            "Add the skills freelancers need to successfully complete your project.",
    },
    duration: {
        heading: "How long will the project take?",
        paragraph:
            "Set expectations for the time commitment so freelancers can decide if the project is right for them.",
    },
    budget: {
        heading: "What is your budget?",
        paragraph:
            "Share the amount you plan to spend on this project. You can discuss the details with your freelancer later.",
    },
    description: {
        heading: "Describe your project.",
        paragraph:
            "Include the details freelancers need to understand the work and decide whether they’re a good fit.",
    },
};

const exampleTitles = [
    "Build responsive WordPress site with booking/payment functionality",
    "Graphic designer needed to design ad creative for multiple campaigns",
    "Facebook ad specialist needed for product launch",
];

const durations = [
    "Less than 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
];

function isStepValid(step, work) {
    switch (step) {
        case "title":
            return work.title.trim().length >= 10;
        case "skills":
            return work.skills.length >= 1;
        case "duration":
            return Boolean(work.duration);
        case "budget":
            return Number(work.budget) > 0;
        case "description":
            return work.description.trim().length >= 30;
        default:
            return false;
    }
}

export default function Page() {
    const { step } = useParams();
    const router = useRouter();
    const { work, update, storageError } = useJobPost();
    const [skillInput, setSkillInput] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const currentIndex = steps.indexOf(step);
    const filteredSuggestions = skillInput.trim()
        ? skillSuggestions
              .filter(
                  (skill) =>
                      skill.toLowerCase().includes(skillInput.trim().toLowerCase()) &&
                      !work.skills.some(
                          (selectedSkill) =>
                              selectedSkill.toLowerCase() === skill.toLowerCase()
                      )
              )
              .slice(0, 8)
        : [];

    if (currentIndex === -1) {
        notFound();
    }

    const isLastStep = currentIndex === steps.length - 1;
    const valid = isStepValid(step, work);
    const content = stepContent[step];

    function addSkill(event) {
        event.preventDefault();
        selectSkill(skillInput);
    }

    function selectSkill(skill) {
        const newSkill = skill.trim();

        if (
            newSkill &&
            !work.skills.some(
                (selectedSkill) =>
                    selectedSkill.toLowerCase() === newSkill.toLowerCase()
            )
        ) {
            update("skills", [...work.skills, newSkill]);
        }

        setSkillInput("");
    }

    function handleNext() {
        if (!valid) return;

        if (isLastStep) {
            try {
                let savedJobs;

                try {
                    savedJobs = JSON.parse(
                        window.localStorage.getItem("freelanceHub.jobPosts") || "[]"
                    );
                } catch {
                    throw new Error(
                        "Saved job data on this device is invalid. Clear this site's stored data and try again."
                    );
                }

                if (!Array.isArray(savedJobs)) {
                    throw new Error(
                        "Saved job data on this device is invalid. Clear this site's stored data and try again."
                    );
                }

                const postedJob = {
                    ...work,
                    budget: Number(work.budget),
                    id: `${Date.now()}`,
                    createdAt: new Date().toISOString(),
                };

                window.localStorage.setItem(
                    "freelanceHub.jobPosts",
                    JSON.stringify([...savedJobs, postedJob])
                );
                window.localStorage.removeItem(JOB_POST_DRAFT_STORAGE_KEY);
                setSubmitError("");
                setSubmitted(true);
            } catch {
                setSubmitError(
                    "Could not save this job on this device. Check your browser storage settings and try again."
                );
            }
            return;
        }

        router.push(`/nx/post-job/${steps[currentIndex + 1]}`);
    }

    if (submitted) {
        return (
            <main className="flex min-h-screen min-w-full items-center justify-center px-5 py-12">
                <section
                    className="flex w-full max-w-xl flex-col items-center text-center"
                    aria-live="polite"
                >
                    <div className="h-64 w-64">
                        <DotLottieReact
                            src="/photoMeaning/Congratulation%20_%20Success%20batch.lottie"
                            autoplay
                            loop
                            aria-label="Job post success animation"
                        />
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
                        Job post saved!
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                        Your job post is saved in this browser. It has not been
                        published online because this flow is not connected to a
                        server.
                    </p>
                    <div className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">
                        <h2 className="font-semibold text-gray-900">{work.title}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Budget: ${Number(work.budget).toLocaleString()} USD
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                            Skills: {work.skills.join(", ")}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/nx/client/dashboard")}
                        className="mt-6 rounded-md bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-600"
                    >
                        Go to dashboard
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen min-w-full pb-24">
            <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col items-center justify-center gap-10 px-5 py-12 md:flex-row md:gap-20">
                <div className="w-full max-w-md">
                    <p className="pb-2 text-sm text-gray-500">
                        <span className="pr-3">
                            {currentIndex + 1}/5
                        </span>
                        Job post
                    </p>
                    <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                        {content.heading}
                    </h1>
                    <p className="mt-4 text-sm leading-6 text-gray-500">
                        {content.paragraph}
                    </p>
                    {storageError && (
                        <p
                            role="alert"
                            className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        >
                            {storageError}
                        </p>
                    )}
                </div>

                <div className="mt-2 flex w-full max-w-lg flex-col gap-4">
                    {step === "title" && (
                        <>
                            <label
                                className="flex flex-col gap-2 text-sm font-medium text-gray-800"
                                htmlFor="job-title"
                            >
                                Write a title for your job post
                                <input
                                    id="job-title"
                                    type="text"
                                    value={work.title}
                                    onChange={(event) =>
                                        update("title", event.target.value)
                                    }
                                    placeholder="e.g. Build a website for my business"
                                    className="w-full rounded-md border border-gray-300 px-3 py-3 text-base font-normal outline-none transition focus:border-black/70 focus:ring-2 focus:ring-black/40"
                                />
                            </label>
                            <div>
                                <p className="py-2 font-medium">Example titles</p>
                                <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-gray-600">
                                    {exampleTitles.map((example) => (
                                        <li key={example}>{example}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {step === "skills" && (
                        <>
                            <form onSubmit={addSkill} className="relative">
                                <label
                                    className="mb-2 block text-sm font-medium text-gray-800"
                                    htmlFor="job-skill"
                                >
                                    Search skills or add a custom skill
                                </label>
                                <input
                                    id="job-skill"
                                    type="text"
                                    value={skillInput}
                                    onChange={(event) =>
                                        setSkillInput(event.target.value)
                                    }
                                    placeholder="e.g. React, UI/UX Design"
                                    autoComplete="off"
                                    aria-autocomplete="list"
                                    aria-controls="job-skill-suggestions"
                                    className="w-full rounded-md border border-gray-300 px-3 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                />
                                {skillInput.trim() && (
                                    <ul
                                        id="job-skill-suggestions"
                                        role="listbox"
                                        aria-label="Suggested skills"
                                        className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                                    >
                                        {filteredSuggestions.length > 0 ? (
                                            filteredSuggestions.map((skill) => (
                                                <li key={skill} role="option" aria-selected="false">
                                                    <button
                                                        type="button"
                                                        onClick={() => selectSkill(skill)}
                                                        className="w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                                                    >
                                                        {skill}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-3 py-2 text-sm text-gray-500">
                                                No matching suggestions. Press Enter to add “
                                                {skillInput.trim()}”.
                                            </li>
                                        )}
                                    </ul>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Choose a suggestion or press Enter to add your own.
                                </p>
                            </form>
                            <ul className="flex flex-wrap gap-2" aria-label="Selected skills">
                                {work.skills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-sm text-orange-800"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                update(
                                                    "skills",
                                                    work.skills.filter(
                                                        (item) => item !== skill
                                                    )
                                                )
                                            }
                                            aria-label={`Remove ${skill}`}
                                            className="font-semibold hover:text-orange-950"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {step === "duration" && (
                        <fieldset className="flex flex-col gap-3">
                            <legend className="mb-1 text-sm font-medium text-gray-800">
                                Select a project duration
                            </legend>
                            {durations.map((duration) => (
                                <label
                                    key={duration}
                                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-4 transition ${
                                        work.duration === duration
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="duration"
                                        value={duration}
                                        checked={work.duration === duration}
                                        onChange={() =>
                                            update("duration", duration)
                                        }
                                        className="accent-orange-400 size-4"
                                    />
                                    <span>{duration}</span>
                                </label>
                            ))}
                        </fieldset>
                    )}

                    {step === "budget" && (
                        <label
                            className="flex flex-col gap-2 text-sm font-medium text-gray-800"
                            htmlFor="job-budget"
                        >
                            Project budget (USD)
                            <div className="flex items-center rounded-md border border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
                                <span className="pl-3 text-gray-500">$</span>
                                <input
                                    id="job-budget"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={work.budget}
                                    onChange={(event) =>
                                        update("budget", event.target.value)
                                    }
                                    placeholder="0.00"
                                    className="w-full rounded-md px-2 py-3 font-normal outline-none"
                                />
                            </div>
                        </label>
                    )}

                    {step === "description" && (
                        <label
                            className="flex flex-col gap-2 text-sm font-medium text-gray-800"
                            htmlFor="job-description"
                        >
                            Project description
                            <textarea
                                id="job-description"
                                rows={8}
                                value={work.description}
                                onChange={(event) =>
                                    update("description", event.target.value)
                                }
                                placeholder="Describe the project, its goals, and what you need from a freelancer."
                                className="w-full resize-y rounded-md border border-gray-300 px-3 py-3 font-normal outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            />
                        </label>
                    )}
                </div>
            </section>

            {submitError && (
                <p
                    role="alert"
                    className="fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 shadow"
                >
                    {submitError}
                </p>
            )}
            <div className="fixed md:sticky min-w-full inset-x-0 bottom-0 z-50 bg-white">
                <BottomNav
                    progress={(currentIndex + 1) / steps.length}
                    onBack={() => router.push(`/nx/post-job/${steps[currentIndex - 1]}`)}
                    onNext={handleNext}
                    backDisabled={currentIndex === 0}
                    nextDisabled={!valid}
                    isLastStep={isLastStep}
                />
            </div>
        </main>
    );
}
