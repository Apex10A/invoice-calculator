import { InvoiceWorkspace } from "@/components/InvoiceWorkspace";

export default function Home() {
  return (
    <div className="studio-shell relative min-h-full overflow-hidden pb-4 lg:pb-20">
      <div className="studio-glow pointer-events-none absolute inset-0" aria-hidden />
      <header className="relative mx-auto max-w-6xl px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 lg:px-10 lg:pt-16 lg:pb-6">
        <div className="max-w-xl">
          <p className="text-[10px] tracking-[0.55em] text-[#b8956a] uppercase">
            GEM Collections
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2rem] leading-[0.95] text-[#faf6f0] lg:mt-3 lg:text-[clamp(2.25rem,5vw,3.75rem)]">
            Invoice
          </h1>
          <p className="mt-2 hidden max-w-md text-[15px] leading-relaxed text-[#9c9083] sm:block lg:mt-4">
            Add the client, check the invoice, download when it looks right.
          </p>
        </div>
      </header>
      <InvoiceWorkspace />
    </div>
  );
}
