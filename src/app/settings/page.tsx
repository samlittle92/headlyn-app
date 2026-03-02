import Link from "next/link";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-clean sm:text-4xl">
            Settings
          </h1>
          <Link
            href="/preferences"
            className="inline-flex w-fit font-mono text-xs tracking-widest uppercase text-signal-cobalt transition-colors hover:text-signal-cobalt/80"
          >
            RECALIBRATE INTELLIGENCE PROFILE
          </Link>
        </div>

        <div className="[&_.clerk-userProfile]:rounded-sm">
          <UserProfile
            appearance={{
              variables: {
                colorBackground: "#000000",
                colorText: "#F0F0F0",
                colorPrimary: "#2E5BFF",
                borderRadius: "2px",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
