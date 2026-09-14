"use client";

import { InvoiceDocument } from "@/components/InvoiceDocument";
import {
  TEMPLATE,
  createItem,
  invoiceFileSlug,
  invoiceTotal,
  resizeItems,
  todayInputValue,
  type Invoice,
  type InvoiceTheme,
} from "@/lib/invoice";
import { toJpeg } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";

function downloadBlob(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function InvoiceWorkspace() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"jpeg" | "pdf" | null>(null);
  const [previewScale, setPreviewScale] = useState(560 / TEMPLATE.width);
  const [invoice, setInvoice] = useState<Invoice>(() => ({
    theme: "light",
    client: "",
    dateIssued: todayInputValue(),
    delivery: "",
    orderTitle: "",
    items: [createItem()],
  }));
  const [itemCountText, setItemCountText] = useState("1");
  const itemCountFocused = useRef(false);

  const total = useMemo(() => invoiceTotal(invoice.items), [invoice.items]);

  useEffect(() => {
    if (!itemCountFocused.current) {
      setItemCountText(String(invoice.items.length));
    }
  }, [invoice.items.length]);

  function commitItemCount(raw: string) {
    const n = Math.max(1, Math.min(12, Math.floor(Number(raw)) || 1));
    setItemCountText(String(n));
    setInvoice((current) => ({
      ...current,
      items: resizeItems(current.items, n),
    }));
  }

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const syncScale = () => {
      setPreviewScale(frame.clientWidth / TEMPLATE.width);
    };
    syncScale();
    const observer = new ResizeObserver(syncScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  function patch(next: Partial<Invoice>) {
    setInvoice((current) => ({ ...current, ...next }));
  }

  function updateItem(
    id: string,
    field: "description" | "qty" | "rate",
    value: string,
  ) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => {
        if (item.id !== id) return item;
        if (field === "description") return { ...item, description: value };
        const numeric = value === "" ? 0 : Number(value);
        return { ...item, [field]: Number.isFinite(numeric) ? numeric : 0 };
      }),
    }));
  }

  async function captureJpeg() {
    const node = invoiceRef.current;
    if (!node) throw new Error("Invoice preview is not ready.");
    await document.fonts.ready;
    return toJpeg(node, {
      quality: 0.95,
      pixelRatio: 1,
      width: TEMPLATE.width,
      height: TEMPLATE.height,
      canvasWidth: TEMPLATE.width,
      canvasHeight: TEMPLATE.height,
      cacheBust: true,
    });
  }

  async function handleDownload(kind: "jpeg" | "pdf") {
    setBusy(kind);
    try {
      const dataUrl = await captureJpeg();
      const slug = invoiceFileSlug(invoice);
      if (kind === "jpeg") {
        downloadBlob(dataUrl, `${slug}.jpeg`);
        return;
      }

      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([595.28, 841.89]);
      const jpeg = Uint8Array.from(
        atob(dataUrl.split(",")[1] ?? ""),
        (char) => char.charCodeAt(0),
      );
      const image = await pdf.embedJpg(jpeg);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
      const pdfBytes = await pdf.save();
      const url = URL.createObjectURL(
        new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
      );
      downloadBlob(url, `${slug}.pdf`);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      window.alert("Could not export the invoice. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto grid min-h-full w-full max-w-[1440px] gap-8 px-5 py-8 lg:grid-cols-[minmax(320px,440px)_minmax(0,1fr)] lg:items-start lg:px-10 lg:py-10">
      <section className="rounded-[28px] border border-[rgba(201,162,109,0.28)] bg-[#f6eee4] p-6 text-[#1c1917] shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8">
        <p className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.38em] text-[#9a7043] uppercase">
          New invoice
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-none text-[#171412]">
          Client details
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#5c534b]">
          Add the client and the number of pieces. The GEM invoice fills itself
          — no new design for each order.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-2 rounded-full bg-[#eadccb] p-1">
          {(["light", "dark"] as InvoiceTheme[]).map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => patch({ theme })}
              className={`rounded-full px-4 py-2.5 text-sm tracking-[0.14em] uppercase transition ${
                invoice.theme === theme
                  ? "bg-[#171412] text-[#f6eee4]"
                  : "text-[#6b6258] hover:text-[#171412]"
              }`}
            >
              {theme} mode
            </button>
          ))}
        </div>

        <label className="mt-7 block">
          <span className="text-[11px] tracking-[0.22em] text-[#9a7043] uppercase">
            Client
          </span>
          <input
            value={invoice.client}
            onChange={(event) => patch({ client: event.target.value })}
            placeholder="Hope"
            className="mt-2 w-full border-0 border-b border-[#c9a26d] bg-transparent pb-2 text-xl outline-none placeholder:text-[#c3b7aa]"
          />
        </label>

        <div className="mt-6 grid grid-cols-2 gap-5">
          <label>
            <span className="text-[11px] tracking-[0.22em] text-[#9a7043] uppercase">
              Date issued
            </span>
            <input
              type="date"
              value={invoice.dateIssued}
              onChange={(event) => patch({ dateIssued: event.target.value })}
              className="mt-2 w-full border-0 border-b border-[#c9a26d] bg-transparent pb-2 text-base outline-none"
            />
          </label>
          <label>
            <span className="text-[11px] tracking-[0.22em] text-[#9a7043] uppercase">
              Delivery date
            </span>
            <input
              value={invoice.delivery}
              onChange={(event) => patch({ delivery: event.target.value })}
              placeholder="2 weeks"
              className="mt-2 w-full border-0 border-b border-[#c9a26d] bg-transparent pb-2 text-base outline-none placeholder:text-[#c3b7aa]"
            />
          </label>
        </div>

        <label className="mt-6 block">
          <span className="text-[11px] tracking-[0.22em] text-[#9a7043] uppercase">
            Order title
          </span>
          <input
            value={invoice.orderTitle}
            onChange={(event) => patch({ orderTitle: event.target.value })}
            placeholder="Optional — Back to School Dress"
            className="mt-2 w-full border-0 border-b border-[#c9a26d] bg-transparent pb-2 text-base outline-none placeholder:text-[#c3b7aa]"
          />
        </label>

        <div className="mt-8 flex items-end justify-between gap-4">
          <label className="flex-1">
            <span className="text-[11px] tracking-[0.22em] text-[#9a7043] uppercase">
              Number of items
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={itemCountText}
              onFocus={() => {
                itemCountFocused.current = true;
              }}
              onBlur={() => {
                itemCountFocused.current = false;
                commitItemCount(itemCountText);
              }}
              onChange={(event) => {
                const next = event.target.value;
                if (!/^\d*$/.test(next)) return;
                setItemCountText(next);
                if (next === "") return;
                const n = Number(next);
                if (n >= 1 && n <= 12) {
                  patch({ items: resizeItems(invoice.items, n) });
                }
              }}
              className="mt-2 w-full border-0 border-b border-[#c9a26d] bg-transparent pb-2 text-2xl outline-none"
            />
          </label>
          <p className="pb-2 text-sm tracking-[0.08em] text-[#9a7043] uppercase">
            Total {`N${total.toLocaleString("en-NG")}`}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[rgba(201,162,109,0.35)] bg-[rgba(255,255,255,0.35)] p-4"
            >
              <p className="text-[11px] tracking-[0.2em] text-[#9a7043] uppercase">
                Item {index + 1}
              </p>
              <input
                value={item.description}
                onChange={(event) =>
                  updateItem(item.id, "description", event.target.value)
                }
                placeholder="Shirt"
                className="mt-2 w-full border-0 bg-transparent text-lg outline-none placeholder:text-[#c3b7aa]"
              />
              <div className="mt-3 grid grid-cols-2 gap-4">
                <label>
                  <span className="text-[10px] tracking-[0.18em] text-[#8a7d70] uppercase">
                    Qty
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(event) =>
                      updateItem(item.id, "qty", event.target.value)
                    }
                    className="mt-1 w-full border-0 border-b border-[#d7c4ae] bg-transparent pb-1 outline-none"
                  />
                </label>
                <label>
                  <span className="text-[10px] tracking-[0.18em] text-[#8a7d70] uppercase">
                    Rate (₦)
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={item.rate || ""}
                    onChange={(event) =>
                      updateItem(item.id, "rate", event.target.value)
                    }
                    className="mt-1 w-full border-0 border-b border-[#d7c4ae] bg-transparent pb-1 outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => handleDownload("jpeg")}
            className="rounded-full bg-[#171412] px-5 py-3 text-sm tracking-[0.16em] text-[#f6eee4] uppercase disabled:opacity-60"
          >
            {busy === "jpeg" ? "Saving…" : "Download JPEG"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => handleDownload("pdf")}
            className="rounded-full border border-[#171412] px-5 py-3 text-sm tracking-[0.16em] text-[#171412] uppercase disabled:opacity-60"
          >
            {busy === "pdf" ? "Saving…" : "Download PDF"}
          </button>
        </div>
      </section>

      <section className="lg:sticky lg:top-8">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#f3ebe1]">
            Preview
          </h2>
          <p className="text-xs tracking-[0.22em] text-[#c9a26d] uppercase">
            {invoice.theme} template
          </p>
        </div>
        <div
          ref={frameRef}
          className="relative max-w-[560px] overflow-hidden rounded-[24px] shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
          style={{
            width: "100%",
            aspectRatio: `${TEMPLATE.width} / ${TEMPLATE.height}`,
          }}
        >
          <div
            style={{
              width: TEMPLATE.width,
              height: TEMPLATE.height,
              transform: `scale(${previewScale})`,
              transformOrigin: "top left",
            }}
          >
            <div ref={invoiceRef}>
              <InvoiceDocument invoice={invoice} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
