import {
  INVOICE_TABLE_GRID,
  OVERLAY,
  TEMPLATE,
  formatIssuedDate,
  formatNaira,
  invoiceTotal,
  itemAmount,
  type Invoice,
} from "@/lib/invoice";

const tableRowStyle = {
  gridTemplateColumns: INVOICE_TABLE_GRID,
} as const;

type InvoiceDocumentProps = {
  invoice: Invoice;
};

export function InvoiceDocument({ invoice }: InvoiceDocumentProps) {
  const layout = OVERLAY[invoice.theme];
  const src = invoice.theme === "dark" ? TEMPLATE.dark : TEMPLATE.light;
  const filledItems = invoice.items.filter((item) => item.description.trim());
  const title = invoice.orderTitle.trim();
  const total = invoiceTotal(filledItems);
  const rowSpacing = 20;
  const itemOpacity = 0.78;

  return (
    <div
      data-invoice-root
      className="invoice-sheet relative overflow-hidden bg-black"
      style={{
        width: TEMPLATE.width,
        height: TEMPLATE.height,
        fontFamily: "var(--font-invoice)",
        fontSize: "21pt",
        fontWeight: 400,
        color: layout.text,
        lineHeight: 1.15,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={TEMPLATE.width}
        height={TEMPLATE.height}
        className="absolute inset-0 h-full w-full select-none"
        draggable={false}
      />

      <div
        className="absolute text-4xl font-thin"
        style={{ left: layout.contentLeft, top: layout.dateTop, width: 520 }}
      >
        {formatIssuedDate(invoice.dateIssued)}
      </div>

      <div
        className="absolute text-4xl"
        style={{ left: layout.clientLeft, top: layout.dateTop, width: 280 }}
      >
        {invoice.client.trim()}
      </div>

      <div
        className="absolute"
        style={{
          left: layout.contentLeft,
          top: layout.itemsTop,
          width: layout.tableWidth,
        }}
      >
        {title ? (
          <div style={{ marginBottom: 18 }} className="text-4xl font-thin">
            {title}
          </div>
        ) : null}

        {filledItems.map((item) => (
          <div
            key={item.id}
            className="grid items-start leading-tight"
            style={{
              ...tableRowStyle,
              paddingBottom: rowSpacing,
              opacity: itemOpacity,
            }}
          >
            <span>
              {title ? <span className="pr-[0.55em]">•</span> : null}
              {item.description.trim()}
            </span>
            <span className="text-center tabular-nums ">{item.qty || ""}</span>
            <span className="text-left tabular-nums">
              {formatNaira(Number(item.rate) || 0)}
            </span>
            <span className="text-right tabular-nums">
              {formatNaira(itemAmount(item))}
            </span>
          </div>
        ))}

        {filledItems.length > 0 ? (
          <div
            className="mt-2"
            style={{
              borderTop: `2px solid ${layout.mutedLine}`,
              paddingTop: 18,
            }}
          >
            <div className="grid font-semibold" style={tableRowStyle}>
              <span>Total</span>
              <span />
              <span />
              <span className="text-right tabular-nums">{formatNaira(total)}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="absolute"
        style={{ left: layout.clientLeft, top: layout.deliveryTop, width: 280 }}
      >
        {invoice.delivery.trim()}
      </div>
    </div>
  );
}
