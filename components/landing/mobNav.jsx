"use client";

import { NAV_LINKS } from "@/app/lib/constants/NavItems";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(SplitText);

export default function MobNav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const bar1 = useRef(null);
  const bar2 = useRef(null);
  const btn1 = useRef(null);
  const btn2 = useRef(null);
  const tlRef = useRef(null);
  const router = useRouter();

  const go = (path) => {
    setOpen(false);
    router.push(path);
  };

  // Build the timeline ONCE. Opening plays it, closing reverses it.
  useEffect(() => {
    const menu = menuRef.current;
    const nav = navRef.current;
    if (!menu || !nav) return;

    let split;
    const ctx = gsap.context(() => {
      split = SplitText.create(nav.querySelectorAll(".mobile-link"), {
        type: "lines",
      });

      gsap.set(menu, { clipPath: "inset(0 0 0 100%)", visibility: "hidden" });

      tlRef.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => gsap.set(menu, { visibility: "hidden" }),
        })
        .set(menu, { visibility: "visible" }, 0)
        .fromTo(
          menu,
          { clipPath: "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0 0 0%)", duration: 0.9, ease: "power3.inOut" },
          0
        )
        .to(bar1.current, { y: 4, duration: 0.3, ease: "power2.out" }, 0)
        .to(bar2.current, { y: -4, duration: 0.3, ease: "power2.out" }, 0)
        .to(bar1.current, { rotate: 45, duration: 0.3, ease: "power2.out" }, 0.3)
        .to(bar2.current, { rotate: -45, duration: 0.3, ease: "power2.out" }, 0.3)
        .from(
          split.lines,
          { xPercent: 50, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
          0.45
        )
        .to(
          btn1.current,
          { y: 2, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.6
        )
        .to(
          btn2.current,
          { y: 2, opacity: 1, duration: 0.7, ease: "power3.out" },
          "<"
        );
    }, menu);

    return () => {
      ctx.revert();
      split?.revert();
      tlRef.current = null;
    };
  }, []);

  // Play / reverse + scroll lock
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (open) {
      document.body.classList.add("noscroll");
      tl.timeScale(1).play();
    } else {
      document.body.classList.remove("noscroll");
      tl.timeScale(1.6).reverse();
    }

    return () => document.body.classList.remove("noscroll");
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative bottom-1 z-50 flex items-center lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <div className="z-50 flex size-9 flex-col items-center justify-center gap-1.5 rounded-full bg-white">
          <div ref={bar1} className="h-0.5 w-5 bg-black" />
          <div ref={bar2} className="h-0.5 w-5 bg-black" />
        </div>
      </button>

      <div
        ref={menuRef}
        className="fixed inset-0 z-10 min-h-screen w-full overflow-hidden bg-white lg:hidden"
        style={{ clipPath: "inset(0 0 0 100%)", visibility: "hidden" }}
      >
        <nav ref={navRef} className="fixed flex flex-col gap-7 px-8 pt-22 text-3xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="mobile-link text-black transition-opacity duration-300 hover:opacity-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="btns absolute bottom-15 left-1/2 mt-4 flex w-3/4 -translate-x-1/2 flex-col items-center justify-center gap-2">
          <button
            ref={btn1}
            type="button"
            onClick={() => go("/login")}
            className="min-w-full opacity-0  rounded-full bg-black px-7 py-3 font-semibold text-white"
          >
            Log in
          </button>
          <button
            ref={btn2}
            type="button"
            onClick={() => go("/choose-role")}
            className="min-w-full opacity-0 rounded-full bg-black px-7 py-3 font-semibold text-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}