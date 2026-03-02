"use client";

import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { triggerAudioBriefing } from "@/app/actions/audio";

export default function Header() {
  const [isBriefing, setIsBriefing] = useState(false);

  const handleBriefNow = async () => {
    setIsBriefing(true);
    try {
      const result = await triggerAudioBriefing();
      if (result.success) {
        const audio = new Audio(result.dataUri);
        await audio.play();
      } else {
        console.error("Audio briefing:", result.error);
      }
    } catch (e) {
      console.error("Audio briefing failed:", e);
    } finally {
      setIsBriefing(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Left Section: Logo & Main Nav */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="font-serif text-2xl font-medium tracking-tighter text-white transition-opacity hover:opacity-90"
            aria-label="Headlyn home"
          >
            Headlyn
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main Intelligence Navigation">
  <Link
    href="/"
    className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-signal-cobalt"
  >
    Headlyns
  </Link>
  
  <Link
    href="/analysis"
    className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-signal-cobalt"
  >
    Analysis
  </Link>

  {/* IMPORTANT: Ensure this matches your [[...rest]] folder structure */}
  <Link
    href="/settings"
    className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-signal-cobalt"
  >
    Settings
  </Link>
  
  <SignedIn>
    <Link
      href="/preferences"
      className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-signal-cobalt"
    >
      Your Interests
    </Link>
  </SignedIn>
</nav>
        </div>

        {/* Right Section: Actions & Auth */}
        <div className="flex items-center gap-6">
          
          <SignedIn>
            <button
              onClick={handleBriefNow}
              disabled={isBriefing}
              className="group flex items-center gap-2 rounded-sm bg-signal-cobalt px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:bg-signal-cobalt/90 active:scale-95 disabled:opacity-50"
            >
              {isBriefing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3 fill-current" />
              )}
              {isBriefing ? "Generating..." : "Brief Now"}
            </button>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
              >
                Identify
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  variables: { 
                    colorBackground: "#000000", 
                    colorText: "#FFFFFF",
                    colorPrimary: "#2D52FF",
                    borderRadius: "2px"
                  },
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 border border-white/10"
                  }
                }}
              />
            </div>
          </SignedIn>
          
        </div>
      </div>
    </header>
  );
}