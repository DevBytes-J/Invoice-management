import type { InvoiceStatus } from "../types";

const styles: Record<InvoiceStatus, { dot: string; text: string; bg: string }> =
  {
    paid: {
      dot: "bg-[#33D69F]",
      text: "text-[#33D69F]",
      bg: "bg-[#33D69F]/10",
    },
    pending: {
      dot: "bg-[#FF8F00]",
      text: "text-[#FF8F00]",
      bg: "bg-[#FF8F00]/10",
    },
    draft: {
      dot: "bg-[#373B53] dark:bg-[#DFE3FA]",
      text: "text-[#373B53] dark:text-[#DFE3FA]",
      bg: "bg-[#373B53]/10 dark:bg-[#DFE3FA]/10",
    },
  };

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold capitalize min-w-[104px] justify-center ${s.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      <span className={s.text}>{status}</span>
    </span>
  );
}
