import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import BriefingCard from "@/components/BriefingCard";
import { getLiveBriefings } from "@/lib/intelligence";

export default async function Home() {
  const user = await currentUser();
  const interests = (user?.publicMetadata?.interests as string[] | undefined) ?? [];

  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 border-b border-white/10 pb-10">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-clean sm:text-5xl uppercase">
            Your Headlyns
          </h1>
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Intelligence Profile Active
          </p>
        </header>

        {/* Wrap in Suspense so the page doesn't stay blank while fetching */}
        <Suspense fallback={<div className="text-white/20 font-mono text-xs">SCANNING FREQUENCIES...</div>}>
          <FeedGrid />
        </Suspense>
      </div>
    </main>
  );
}

async function FeedGrid() {
  const briefings = await getLiveBriefings();

  if (!briefings || briefings.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-white/10">
        <p className="text-white/20 font-mono text-xs uppercase">No Active Briefings Found</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {briefings.map((briefing) => (
        <li key={briefing.id}>
          <BriefingCard briefing={briefing} />
        </li>
      ))}
    </ul>
  );
}