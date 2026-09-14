import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const invoice = Outfit({
  subsets: ["latin"],
  variable: "--font-invoice",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "GEM Collections — Invoices",
  description: "Create GEM Collections invoices from a client form.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${invoice.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
