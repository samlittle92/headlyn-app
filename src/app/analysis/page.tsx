export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="border-b border-white/10 pb-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-clean sm:text-4xl">
            Analysis
          </h1>
          <p className="mt-3 font-mono text-xs tracking-widest uppercase text-slate-clean/50">
            Agentic Reports
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center rounded-sm border border-white/10 bg-white/2 py-24 px-8 text-center">
          <div className="font-mono text-sm tracking-widest uppercase text-signal-cobalt/80">
            Decrypting...
          </div>
          <p className="mt-4 font-sans text-slate-clean/70">
            System under construction.
          </p>
          <p className="mt-6 font-mono text-xs text-slate-clean/50">
            V2: Agentic Intelligence Reports coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
