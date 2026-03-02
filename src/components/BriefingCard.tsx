"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import type { Briefing } from "@/types/intelligence";

function ListenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export interface BriefingCardProps {
  briefing: Briefing;
}

export default function BriefingCard({ briefing }: BriefingCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isVerified = briefing.verificationScore > 90;

  const handlePlayAudio = useCallback(async () => {
    if (isPlaying) return;
    const text = `${briefing.title}. ${briefing.summary}`.trim();
    if (!text) return;

    setIsPlaying(true);
    try {
      const res = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Audio fetch failed:", data.error ?? res.statusText);
        setIsPlaying(false);
        return;
      }

      const blob = await res.blob();
      if (blob.size === 0) {
        console.error("Audio response was empty");
        setIsPlaying(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
      };

      await audio.play().catch((e) => {
        console.error("Play failed:", e);
        URL.revokeObjectURL(url);
        setIsPlaying(false);
      });
    } catch (e) {
      console.error("Play failed:", e);
      setIsPlaying(false);
    }
  }, [briefing.title, briefing.summary, isPlaying]);

  return (
    <article
      className="rounded-sm border border-white/10 bg-white/2 p-4 transition-colors hover:bg-white/4"
      data-briefing-id={briefing.id}
    >
      {/* Top row: category pill + timestamp */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-signal-cobalt/15 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-signal-cobalt">
          {briefing.category}
        </span>
        <time
          className="text-xs text-slate-clean/50"
          dateTime={briefing.timestamp}
        >
          {briefing.timestamp}
        </time>
      </div>

      {/* Middle: title + 2-line summary */}
      <div className="mb-3">
        <h3 className="font-sans text-base font-bold leading-snug text-slate-clean">
          {briefing.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 font-sans text-sm leading-relaxed text-slate-clean/80">
          {briefing.summary}
        </p>
      </div>

      {/* Bottom: VERIFIED badge + Listen button */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          {isVerified && (
            <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-amber-glow/90 ring-1 ring-amber-glow/30">
              VERIFIED
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="flex shrink-0 items-center justify-center rounded-sm p-2 text-slate-clean/70 transition-colors hover:bg-white/10 hover:text-slate-clean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-carbon-black disabled:opacity-50 disabled:hover:bg-transparent"
          aria-label={isPlaying ? "Generating audio" : "Listen"}
        >
          {isPlaying ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ListenIcon className="size-5" />
          )}
        </button>
      </div>
    </article>
  );
}
