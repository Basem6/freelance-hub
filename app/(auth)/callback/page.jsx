"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "../../lib/hooks";
import { setUser } from "../../lib/Features/authSlice";

// ─── tiny spinner ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "1.25rem",
      background: "var(--background, #fff)",
      color: "var(--foreground, #111)",
      fontFamily: "var(--font-geist-sans, Inter, sans-serif)",
    }}>
      <svg
        width="48" height="48" viewBox="0 0 48 48"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "spin 0.9s linear infinite" }}
      >
        <circle cx="24" cy="24" r="20" stroke="#e5e5e5" strokeWidth="4" />
        <path
          d="M44 24a20 20 0 0 0-20-20"
          stroke="oklch(75.812% 0.15293 65.883)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <p style={{ fontSize: "0.95rem", color: "#6b7280", margin: 0 }}>
        Signing you in…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      gap: "1rem",
      padding: "1.5rem",
      textAlign: "center",
      fontFamily: "var(--font-geist-sans, Inter, sans-serif)",
    }}>
      <span style={{ fontSize: "2.5rem" }}>⚠️</span>
      <p style={{ fontSize: "1rem", color: "#ef4444", maxWidth: 360, margin: 0 }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          marginTop: "0.5rem",
          padding: "0.6rem 1.6rem",
          borderRadius: "8px",
          border: "none",
          background: "oklch(75.812% 0.15293 65.883)",
          color: "#fff",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        Try again
      </button>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────
export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [errorMsg, setErrorMsg] = useState(null);
  const calledRef = useRef(false); // guard against StrictMode double-invoke

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    // ── Google returned an error (e.g. user cancelled) ──────────────────────
    if (errorParam) {
      console.warn("[Callback] Google returned error:", errorParam);
      setErrorMsg("Google login was cancelled or failed. Please try again.");
      return;
    }

    if (!code) {
      console.warn("[Callback] No code in URL");
      setErrorMsg("No authorisation code received from Google.");
      return;
    }

    // ── The redirect_uri must match exactly what was sent to Google ──────────
    const redirectUri = `${window.location.origin}/callback`;

    console.log("[Callback] Exchanging code with backend…");

    async function exchangeCode() {
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          credentials: "include", // so Set-Cookie is honoured
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirectUri }),
        });

        const data = await res.json();

        console.log("[Callback] Backend response:", {
          status: res.status,
          ok: res.ok,
          isNewUser: data?.isNewUser,
          success: data?.success,
        });

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Authentication failed");
        }

        // ── New user — needs to choose a role ───────────────────────────────
        if (data.isNewUser) {
          sessionStorage.setItem("googleData", JSON.stringify(data.googleData));
          // Clean the URL & navigate (replace so Back button skips callback)
          router.replace("/choose-role");
          return;
        }

        // ── Returning user — cookie already set by proxy ─────────────────────
        // Dispatch user to Redux (cookie is HttpOnly, token not in data.token)
        dispatch(setUser(data.user));

        // Hard redirect so the browser commits the Set-Cookie before the next
        // page load reads it.
        window.location.replace("/");
      } catch (err) {
        console.error("[Callback] Error:", err);
        setErrorMsg(err.message || "Google sign-in failed. Please try again.");
      }
    }

    exchangeCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  if (errorMsg) {
    return (
      <ErrorView
        message={errorMsg}
        onRetry={() => (window.location.href = "/login")}
      />
    );
  }

  return <Spinner />;
}
