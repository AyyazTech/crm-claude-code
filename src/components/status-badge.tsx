import { isContactStatus, STATUS_META } from "@/lib/contact-status";

export function StatusBadge({ status }: { status: string }) {
  const meta = isContactStatus(status)
    ? STATUS_META[status]
    : { label: status, dot: "bg-zinc-400", pill: "bg-zinc-100 text-zinc-600 ring-zinc-500/20" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
