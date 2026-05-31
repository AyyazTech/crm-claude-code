// SQLite has no enum support, so contact status is a String constrained to
// these values at the application layer.
export const CONTACT_STATUSES = ["lead", "active", "customer", "churned"] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const DEFAULT_STATUS: ContactStatus = "lead";

export function isContactStatus(value: unknown): value is ContactStatus {
  return (
    typeof value === "string" &&
    (CONTACT_STATUSES as readonly string[]).includes(value)
  );
}

type StatusMeta = {
  label: string;
  // Tailwind utility fragments for the pill + dot, kept here so the palette
  // stays consistent everywhere a status is shown.
  dot: string;
  pill: string;
};

export const STATUS_META: Record<ContactStatus, StatusMeta> = {
  lead: {
    label: "Lead",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  active: {
    label: "Active",
    dot: "bg-indigo-500",
    pill: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  },
  customer: {
    label: "Customer",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  churned: {
    label: "Churned",
    dot: "bg-zinc-400",
    pill: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
  },
};
