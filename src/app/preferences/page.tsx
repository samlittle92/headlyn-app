"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { saveUserPreferences } from "@/app/actions/preferences";

const INTELLIGENCE_TARGETS = [
  "ASEAN Geopolitics",
  "Semiconductor Supply Chain",
  "AI Regulation",
  "Global Energy Markets",
  "Space Tech",
  "Quantum Computing",
  "Biotech Frontiers",
  "Venture Capital",
  "Arctic Sovereignty",
  "Federal Reserve Policy",
  "Cybersecurity",
  "Middle East Security",
] as const;

export default function PreferencesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (topic: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const handleChangeSelection = () => {
    setSelected(new Set());
    setSaved(false);
  };

  const handleGoToHeadlyns = async () => {
    if (selected.size < 3 || !user) return;
    setIsSubmitting(true);
    try {
      await saveUserPreferences(Array.from(selected));
      await user.reload();
      setSaved(true);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGo = selected.size >= 3;

  if (!isLoaded) return <div className="p-10 text-white/50">Initializing...</div>;

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-slate-clean">
      <div className="mx-auto max-w-4xl">
      <div className="border-b border-white/10 pb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Intelligence Profile
        </h1>
        <p className="mt-3 font-sans text-sm text-slate-clean/70">
          Select 3+ targets. Your briefing will be reconstructed based on these
          priorities.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest text-white/40 uppercase">
          {saved ? "SYSTEM READY: INTELLIGENCE PROFILE ACTIVE" : `Status: ${selected.size}/3 Selected`}
        </span>
        {selected.size > 0 && !isSubmitting && (
          <button
            type="button"
            onClick={handleChangeSelection}
            className="font-sans text-xs text-white/40 underline underline-offset-2 transition-colors hover:text-white/60"
          >
            Change Selection
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTELLIGENCE_TARGETS.map((topic) => {
          const isActive = selected.has(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggle(topic)}
              className={
                "rounded-sm border px-4 py-3 text-left font-sans text-sm transition-all " +
                (isActive
                  ? "border-signal-cobalt bg-signal-cobalt/20 text-slate-clean"
                  : "border-white/10 bg-white/2 text-slate-clean/80 hover:border-white/20")
              }
            >
              <span className="font-medium">{topic}</span>
              {isActive && <span className="ml-2 text-signal-cobalt">●</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-start gap-3 border-t border-white/10 pt-8">
        <button
          type="button"
          onClick={handleGoToHeadlyns}
          disabled={!canGo || isSubmitting}
          className={
            "inline-flex items-center gap-2 rounded-full border border-signal-cobalt/40 bg-signal-cobalt/10 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest transition-all " +
            (canGo && !isSubmitting
              ? "text-signal-cobalt hover:shadow-[0_0_20px_rgba(45,82,255,0.2)]"
              : "cursor-not-allowed text-white/20")
          }
        >
          {isSubmitting ? "CALIBRATING FEED...." : "GO TO YOUR HEADLYNS"}
        </button>
      </div>
      </div>
    </main>
  );
}