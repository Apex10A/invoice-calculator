export type InvoiceTheme = "light" | "dark";

export type InvoiceItem = {
  id: string;
  description: string;
  qty: number;
  rate: number;
};

export type Invoice = {
  theme: InvoiceTheme;
  client: string;
  dateIssued: string;
  delivery: string;
  orderTitle: string;
  items: InvoiceItem[];
};

export const TEMPLATE = {
  width: 2016,
  height: 2833,
  light: "/template_light_mode.jpeg",
  dark: "/template_dark_mode.jpeg",
} as const;

export const BANK_DETAILS = {
  account: "9137896443",
  bank: "Palmpay Bank",
  name: "Eunice Moyosoreoluwa",
} as const;

/** Column widths (px) aligned to template header positions at 2016×2833. */
export const INVOICE_TABLE_GRID =
  "578px 171px 253px 142px" as const;

type OverlayLayout = {
  contentLeft: number;
  tableWidth: number;
  dateTop: number;
  clientLeft: number;
  /** Y where item text begins — equal gap below template top rule and above bottom rule. */
  itemsContentTop: number;
  itemsLineGap: number;
  deliveryLeft: number;
  deliveryValueTop: number;
  text: string;
  mutedLine: string;
};

export const OVERLAY: Record<InvoiceTheme, OverlayLayout> = {
  light: {
    contentLeft: 418,
    tableWidth: 1144,
    dateTop: 848,
    clientLeft: 1304,
    itemsContentTop: 1176,
    itemsLineGap: 28,
    deliveryLeft: 1352,
    deliveryValueTop: 2368,
    text: "#1a1816",
    mutedLine: "rgb(118, 113, 107)",
  },
  dark: {
    contentLeft: 418,
    tableWidth: 1144,
    dateTop: 908,
    clientLeft: 1304,
    itemsContentTop: 1238,
    itemsLineGap: 28,
    deliveryLeft: 1352,
    deliveryValueTop: 2604,
    text: "#f6f6f6",
    mutedLine: "rgb(180, 180, 180)",
  },
};

export function createItem(): InvoiceItem {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    description: "",
    qty: 1,
    rate: 0,
  };
}

export function todayInputValue(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatIssuedDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function formatNaira(value: number): string {
  const amount = Number.isFinite(value) ? Math.round(value) : 0;
  return `N${amount.toLocaleString("en-NG")}`;
}

export function parseFormattedInteger(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export function formatIntegerInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return Math.round(value).toLocaleString("en-NG");
}

export function itemAmount(item: InvoiceItem): number {
  const qty = Number(item.qty) || 0;
  const rate = Number(item.rate) || 0;
  return qty * rate;
}

export function invoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + itemAmount(item), 0);
}

export function resizeItems(items: InvoiceItem[], count: number): InvoiceItem[] {
  const next = Math.max(1, Math.min(12, Math.floor(count) || 1));
  if (next === items.length) return items;
  if (next < items.length) return items.slice(0, next);
  return [...items, ...Array.from({ length: next - items.length }, () => createItem())];
}

export function invoiceFileSlug(invoice: Invoice): string {
  const client = invoice.client.trim().replace(/[^a-zA-Z0-9]+/g, "-") || "client";
  const date = invoice.dateIssued || todayInputValue();
  return `GEM-Invoice-${client}-${date}`;
}
