import { InvoiceWorkspace } from "@/components/InvoiceWorkspace";
import { BANK_DETAILS } from "@/lib/invoice";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-end justify-between gap-6 px-5 pt-8 pb-2 lg:px-10">
        <div>
          <p className="font-[family-name:var(--font-invoice)] text-[11px] tracking-[0.5em] text-[#c9a26d] uppercase">
            GEM Collections
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl leading-none text-[#f6eee4] sm:text-6xl">
            Atelier invoices
          </h1>
        </div>
        <p className="hidden max-w-xs pb-1 text-right text-sm leading-6 text-[#b9a894] sm:block">
          {BANK_DETAILS.bank} · {BANK_DETAILS.account}
          <br />
          {BANK_DETAILS.name}
        </p>
      </header>
      <InvoiceWorkspace />
    </div>
  );
}
