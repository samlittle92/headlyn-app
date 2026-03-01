import BriefingCard from "@/components/BriefingCard";
import { getLatestBriefings } from "@/lib/intelligence";

export default function Home() {
  const briefings = getLatestBriefings();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-clean sm:text-5xl">
        Premium news, briefed.
      </h1>
      <p className="mt-6 max-w-lg text-slate-clean/80 leading-relaxed">
        Get the signal without the noise. Your briefings, your way—and when
        you’re ready, chat to go deeper.
      </p>

      <section className="mt-12" aria-label="Live intelligence feed">
        <h2 className="mb-6 font-serif text-2xl font-medium tracking-tight text-slate-clean sm:text-3xl">
          Live Intelligence Feed
        </h2>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {briefings.map((briefing) => (
            <li key={briefing.id}>
              <BriefingCard briefing={briefing} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
