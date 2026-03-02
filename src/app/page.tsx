import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import BriefingCard from "@/components/BriefingCard";
import { getLiveBriefings } from "@/lib/intelligence";

function formatInterestsSubtitle(interests: string[]): string {
  if (interests.length === 0) return "Sourcing intelligence across your priorities.";
  if (interests.length === 1) return `Sourcing intelligence for ${interests[0]}.`;
  if (interests.length === 2) return `Sourcing intelligence for ${interests[0]} and ${interests[1]}.`;
  const rest = interests.slice(0, -1).join(", ");
  const last = interests[interests.length - 1];
  return `Sourcing intelligence for ${rest}, and ${last}.`;
}

export default async function Home() {
  const [user, briefings] = await Promise.all([
    currentUser(),
    getLiveBriefings(),
  ]);
  const interests = (user?.publicMetadata?.interests as string[] | undefined) ?? [];
  const subtitle = formatInterestsSubtitle(interests);

  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-clean sm:text-5xl">
        YOUR HEADLYNS
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-slate-clean/80 leading-relaxed">
        {subtitle}
      </p>

      <div className="mt-8">
        <Link
          href="/preferences/me"
          className="inline-flex items-center gap-2 rounded-sm border border-signal-cobalt/40 bg-signal-cobalt/10 px-4 py-2 font-sans text-sm font-medium text-signal-cobalt transition-colors hover:bg-signal-cobalt/20 hover:shadow-[0_0_20px_rgba(45,82,255,0.15)]"
        >
          View your interests
        </Link>
      </div>

      <section className="mt-12" aria-label="Your Headlyns feed">
        <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-medium tracking-tight text-slate-clean sm:text-3xl">
          Your Headlyns
          <span className="flex items-center gap-1.5 text-sm font-sans font-medium uppercase tracking-widest text-red-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            LIVE
          </span>
        </h2>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {briefings.map((briefing) => (
            <li key={briefing.id}>
              <BriefingCard briefing={briefing} />
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
