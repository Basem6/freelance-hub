import { useState } from "react";

const INTERVAL = 3000; // ms per slide

/* Each icon is an inline SVG that visually explains the project type */
const icons = {
cart: (
    <img  className="h-full w-full" src={'/avatars/undraw_annotated_1zxd.svg'}>
    </img>
),
users: (
    <img  className="h-full w-full" src={'/avatars/undraw_mail-sent_dagx.svg'}>
    </img>
),
sparkle: (
    <img  className="h-full w-full" src={'/avatars/undraw_done_erdp.svg'}>
    </img>
),
};

const projects = [
{ title: "TimeVault", desc: "Luxury watch store built with React + Tailwind", tag: "E-commerce", icon: "cart" },
{ title: "Freelance Platform", desc: "Marketplace with client / freelancer accounts", tag: "Web App", icon: "users" },
{ title: "Portfolio", desc: "GSAP animations, ScrollSmoother and custom cursor", tag: "Portfolio", icon: "sparkle" },
];

export default function AutoSlider() {
const [index, setIndex] = useState(0);
const [paused, setPaused] = useState(false);

const next = () => setIndex((prev) => (prev + 1) % projects.length);

return (
    <div
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    className="relative bg-black/85 backdrop-blur-md h-64 rounded-2xl overflow-hidden text-white border border-white/10"
    >
    {/* keyframes for the progress bar */}
    <style>{`
        @keyframes slider-fill { from { width: 0% } to { width: 100% } }
    `}</style>

    {/* Slides */}
    {projects.map((p, i) => (
        <div
        key={p.title}
        className={`absolute inset-0 px-8 pb-10 flex justify-between items-center gap-4 transition-all duration-700 ${
            i === index
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-8 pointer-events-none"
        }`}
        >
        

        <div className="flex flex-col gap-1">
            <span className="text-2xl font-semibold">{p.tag}</span>
            <h3 className="text-2xl font-semibold">{p.title}</h3>
            <p className=" text-white/70">{p.desc}</p>
        </div>
        <div className="w-30">
            {icons[p.icon]}
        </div>
        </div>
    ))}

    {/* Progress bars: one per item (like Instagram stories) */}
    <div className="absolute bottom-4 left-6 right-6 flex gap-2">
        {projects.map((p, i) => (
        <button
            key={p.title}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${p.title}`}
            className="group flex-1 py-2 cursor-pointer"
        >
            <div className="h-1 rounded-full bg-white/20 overflow-hidden group-hover:bg-white/30 transition-colors">
            <div
                key={i === index ? `active-${index}` : `idle-${i}`} // restarts animation on slide change
                className="h-full bg-gray-200 rounded-full"
                style={
                i < index
                    ? { width: "100%" } // already seen
                    : i === index
                    ? {
                        animation: `slider-fill ${INTERVAL}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                    }
                    : { width: "0%" } // upcoming
                }
                onAnimationEnd={i === index ? next : undefined} // bar finished -> next slide
            />
            </div>
        </button>
        ))}
    </div>
    </div>
);
}