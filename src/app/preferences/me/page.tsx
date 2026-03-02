import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PreferencesMePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const interests = (user.publicMetadata?.interests as string[] | undefined) ?? [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="border-b border-white/10 pb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-clean sm:text-4xl">
          Your intelligence profile
        </h1>
        <p className="mt-3 font-sans text-sm text-slate-clean/70">
          Briefings are tailored to these interests.
        </p>
      </div>

      {interests.length === 0 ? (
        <div className="mt-10 rounded-sm border border-white/10 bg-white/2 p-8 text-center">
          <p className="font-sans text-slate-clean/80">
            You haven’t selected any interests yet.
          </p>
          <Link
            href="/preferences"
            className="mt-4 inline-block rounded-sm bg-signal-cobalt px-4 py-2 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Choose interests
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {interests.map((interest) => (
            <li
              key={interest}
              className="rounded-sm border border-white/10 bg-white/2 px-4 py-3 font-sans text-sm font-medium text-slate-clean"
            >
              {interest}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-white/10 pt-8">
        <Link
          href="/preferences"
          className="text-sm font-medium text-signal-cobalt transition-opacity hover:opacity-90"
        >
          Edit interests
        </Link>
        <span className="mx-2 text-slate-clean/40">·</span>
        <Link
          href="/"
          className="text-sm font-medium text-signal-cobalt transition-opacity hover:opacity-90"
        >
          Back to feed
        </Link>
      </div>
    </main>
  );
}
