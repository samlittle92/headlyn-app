"use client";

import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-carbon-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-tight text-slate-clean transition-opacity hover:opacity-90"
            aria-label="Headlyn home"
          >
            Headlyn
          </Link>
          <nav className="flex items-center gap-8" aria-label="Main">
            <Link
              href="/briefings"
              className="text-[13px] font-medium uppercase tracking-[0.12em] text-slate-clean/90 transition-colors hover:text-slate-clean"
            >
              BRIEFINGS
            </Link>
            <Link
              href="/analysis"
              className="text-[13px] font-medium uppercase tracking-[0.12em] text-slate-clean/90 transition-colors hover:text-slate-clean"
            >
              ANALYSIS
            </Link>
            <Link
              href="/settings"
              className="text-[13px] font-medium uppercase tracking-[0.12em] text-slate-clean/90 transition-colors hover:text-slate-clean"
            >
              SETTINGS
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="rounded-sm bg-signal-cobalt px-4 py-2.5 text-[13px] font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            BRIEF NOW
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-[13px] font-medium uppercase tracking-widest text-slate-clean/90 transition-colors hover:text-slate-clean"
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                variables: { colorBackground: "rgb(18 18 18)", colorText: "rgb(240 240 240)" },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
