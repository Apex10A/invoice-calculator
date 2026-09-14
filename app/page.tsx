import { InvoiceWorkspace } from "@/components/InvoiceWorkspace";
import { BANK_DETAILS } from "@/lib/invoice";

export default function Home() {
  return (
    <div className="studio-shell relative min-h-full overflow-hidden pb-4 lg:pb-20">
      <div className="studio-glow pointer-events-none absolute inset-0" aria-hidden />
      <header className="relative mx-auto max-w-7xl px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-12 lg:pt-14 lg:pb-8">
        <div className="max-w-xl">
          <p className="text-[10px] tracking-[0.55em] text-[#b8956a] uppercase">
            GEM Collections
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2rem] leading-[0.95] text-[#faf6f0] lg:mt-3 lg:text-[clamp(2.5rem,4vw,3.75rem)]">
            Invoice
          </h1>
          {/* <p className="mt-2 hidden max-w-md text-[15px] leading-relaxed text-[#9c9083] sm:block lg:mt-4">
            Mobile-first for the owner — full layout on laptop when you need it.
          </p> */}
        </div>
        {/* <div className="mt-6 hidden shrink-0 border-l border-white/[0.08] pl-8 text-right lg:block">
          <p className="text-[10px] tracking-[0.35em] text-[#8a7d6e] uppercase">
            Payout details
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#c4b8aa]">
            {BANK_DETAILS.bank}
            <br />
            {BANK_DETAILS.account}
            <br />
            {BANK_DETAILS.name}
          </p>
        </div> */}
      </header>
      <InvoiceWorkspace />
    </div>
  );
}
