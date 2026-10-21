"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

// غيّر المسارات دي بملفاتك (جوه فولدر public)
const IMAGE_SRC = "/photos/pexels-alphatradezone-5831517.jpg";
const VIDEO_POSTER = "/photos/pexels-pixabay-221043.jpg";

const POINTS = [
"Post a job in minutes and get proposals fast",
"Work with verified freelancers worldwide",
"Pay securely, only when you're happy",
];

export default function Promote() {
const rootRef = useRef(null);

useEffect(() => {
    let ctx;
    let cancelled = false;
    const splits = [];

    // Wait for fonts so SplitText measures lines correctly
    document.fonts.ready.then(() => {
    if (cancelled || !rootRef.current) return;

    ctx = gsap.context(() => {
        // Headings: line-by-line mask reveal
        gsap.utils.toArray(".promote-title").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        splits.push(split);
        gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
        });
        });

        // Fade-up groups
        gsap.utils.toArray(".promote-group").forEach((group) => {
        gsap.from(group.querySelectorAll(".promote-fade"), {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 80%" },
        });
        });

        // Image: wipe reveal + slow zoom out
        gsap.fromTo(
        ".promote-image",
        { clipPath: "inset(0 100% 0 0)" },
        {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".promote-image", start: "top 80%" },
        }
        );
        gsap.fromTo(
        ".promote-image img",
        { scale: 1.3 },
        {
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: ".promote-image", start: "top 80%" },
        }
        );

        // Video card: grows to full width while scrolling
        gsap.fromTo(
        ".promote-video",
        { scale: 0.88, borderRadius: 48 },
        {
            scale: 1,
            borderRadius: 24,
            ease: "none",
            scrollTrigger: {
            trigger: ".promote-video",
            start: "top 90%",
            end: "top 35%",
            scrub: true,
            },
        }
        );
    }, rootRef);
    });

    return () => {
    cancelled = true;
    ctx?.revert();
    splits.forEach((s) => s.revert());
    };
}, []);

return (
    <div ref={rootRef} className="bg-white text-black">
    <section className="px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="promote-video relative mx-auto aspect-3/4 w-full max-w-7xl overflow-hidden bg-black sm:aspect-video">
        <video
            className="absolute inset-0 size-full object-cover"
            src={"https://res.cloudinary.com/dhmk6ap4o/video/upload/v1792582093/5271732-hd_1920_1080_25fps_hac6ha.mp4"}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="promote-group absolute inset-0 flex flex-col justify-end gap-5 p-6 text-white sm:p-12 lg:max-w-3xl">
            <h2 className="promote-title font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Work without limits
            </h2>
            <p className="promote-fade max-w-xl text-base text-white/85 sm:text-lg">
            Hire, collaborate and pay in one place. Your next great
            collaboration is one conversation away.
            </p>
            <div className="promote-fade">
            <Link
                href="/login"
                className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-black transition-opacity duration-300 hover:opacity-80"
            >
                Join now
            </Link>
            </div>
        </div>
        </div>
    </section>
    
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="promote-image relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-200">
        <Image
            src={IMAGE_SRC}
            alt="Freelancer working with a client"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
        />
        </div>

        <div className="promote-group flex flex-col gap-6">
        <span className="promote-fade text-sm font-semibold uppercase tracking-widest text-black/60">
            Why FreelanceHub
        </span>

        <h2 className="promote-title font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Find the right talent for every project
        </h2>

        <p className="promote-fade max-w-xl text-lg text-black/70">
            From quick tasks to long-term teams, connect with skilled
            freelancers and get great work done on your schedule.
        </p>

        <ul className="flex flex-col gap-3">
            {POINTS.map((point) => (
            <li key={point} className="promote-fade flex items-start gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-black" />
                <span className="text-base text-black/80">{point}</span>
            </li>
            ))}
        </ul>

        <div className="promote-fade">
            <Link
            href="/choose-role"
            className="inline-block rounded-full bg-black px-8 py-3 font-semibold text-white transition-opacity duration-300 hover:opacity-80"
            >
            Get started
            </Link>
        </div>
        </div>
    </section>
    
    </div>
);
}