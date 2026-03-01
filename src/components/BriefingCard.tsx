import type { Briefing } from "@/types/intell";

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
  const isVerified = briefing.verificationScore > 90;

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
          className="flex shrink-0 items-center justify-center rounded-sm p-2 text-slate-clean/70 transition-colors hover:bg-white/10 hover:text-slate-clean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-carbon-black"
          aria-label="Listen"
          disabled={!briefing.isVoiceReady}
        >
          <ListenIcon className="size-5" />
        </button>
      </div>
    </article>
  );
}
