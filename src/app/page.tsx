import BriefingCard from "@/components/BriefingCard";
import type { Briefing } from "@/types/intell";

const MOCK_BRIEFINGS: Briefing[] = [
  {
    id: "1",
    timestamp: "2025-03-01T14:32:00Z",
    source: "Reuters",
    category: "GEOPOLITICAL",
    title: "Central bank signals shift in rate outlook amid inflation data",
    summary: "Officials indicated a more cautious stance on further tightening as latest figures showed cooling in core measures. Markets priced in a quarter-point cut by mid-year.",
    verificationScore: 94,
    isVoiceReady: true,
  },
  {
    id: "2",
    timestamp: "2025-03-01T12:15:00Z",
    source: "X-Intelligence",
    category: "TECH",
    title: "Major cloud provider reports outage in European region",
    summary: "Services were restored within two hours. Root cause is under investigation; initial reports point to a network configuration change.",
    verificationScore: 78,
    isVoiceReady: true,
  },
  {
    id: "3",
    timestamp: "2025-03-01T09:00:00Z",
    source: "Internal",
    category: "SECURITY",
    title: "New advisory on supply chain and software attestation",
    summary: "Agency recommends signed SBOMs and verification steps for critical dependencies. Compliance window set for next quarter.",
    verificationScore: 92,
    isVoiceReady: false,
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-clean sm:text-5xl">
        Premium news, briefed.
      </h1>
      <p className="mt-6 max-w-lg text-slate-clean/80 leading-relaxed">
        Get the signal without the noise. Your briefings, your way—and when
        you’re ready, chat to go deeper.
      </p>

      <section className="mt-12" aria-label="Latest briefings">
        <h2 className="mb-4 font-sans text-sm font-medium uppercase tracking-widest text-slate-clean/60">
          Latest
        </h2>
        <ul className="flex flex-col gap-4">
          {MOCK_BRIEFINGS.map((briefing) => (
            <li key={briefing.id}>
              <BriefingCard briefing={briefing} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
