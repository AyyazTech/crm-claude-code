// SQLite has no enum support, so a deal's stage is a String constrained to these
// values at the application layer. Order here defines the left-to-right order of
// the Kanban columns.
export const DEAL_STAGES = [
  "lead",
  "contacted",
  "proposal",
  "won",
  "lost",
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

export const DEFAULT_STAGE: DealStage = "lead";

export function isDealStage(value: unknown): value is DealStage {
  return (
    typeof value === "string" &&
    (DEAL_STAGES as readonly string[]).includes(value)
  );
}

type StageMeta = {
  label: string;
  // The accent rail/tint for each column header + card edge.
  accent: string; // text + dot color
  bar: string; // top rail of the column
  soft: string; // soft tint background for the count chip
};

export const STAGE_META: Record<DealStage, StageMeta> = {
  lead: {
    label: "Lead",
    accent: "text-slate-600",
    bar: "bg-slate-400",
    soft: "bg-slate-100 text-slate-600",
  },
  contacted: {
    label: "Contacted",
    accent: "text-sky-600",
    bar: "bg-sky-400",
    soft: "bg-sky-50 text-sky-700",
  },
  proposal: {
    label: "Proposal",
    accent: "text-indigo-600",
    bar: "bg-indigo-500",
    soft: "bg-indigo-50 text-indigo-700",
  },
  won: {
    label: "Won",
    accent: "text-emerald-600",
    bar: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700",
  },
  lost: {
    label: "Lost",
    accent: "text-rose-600",
    bar: "bg-rose-400",
    soft: "bg-rose-50 text-rose-700",
  },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
