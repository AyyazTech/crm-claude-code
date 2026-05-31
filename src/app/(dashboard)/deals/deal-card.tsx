"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatCurrency } from "@/lib/deal-stage";

export type BoardDeal = {
  id: string;
  title: string;
  value: number;
  stage: string;
  position: number;
  company: string | null;
  contactName: string | null;
};

/** Static presentation, reused by the sortable card and the drag overlay. */
export function DealCard({
  deal,
  dragging,
  overlay,
}: {
  deal: BoardDeal;
  dragging?: boolean;
  overlay?: boolean;
}) {
  const subtitle = deal.company ?? deal.contactName;

  return (
    <div
      className={[
        "rounded-[10px] border border-border bg-surface p-3.5 select-none",
        overlay
          ? "rotate-[1.5deg] cursor-grabbing shadow-[var(--shadow-pop)] ring-1 ring-accent/30"
          : "cursor-grab shadow-[var(--shadow-card)] transition hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(16,18,27,0.08)] active:cursor-grabbing",
        dragging ? "opacity-40" : "",
      ].join(" ")}
    >
      <p className="text-sm leading-snug font-medium text-zinc-900">
        {deal.title}
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[13px] font-semibold tracking-tight text-zinc-900">
          {formatCurrency(deal.value)}
        </span>
        {subtitle ? (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-semibold text-zinc-600">
              {subtitle.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate">{subtitle}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SortableDealCard({ deal }: { deal: BoardDeal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <DealCard deal={deal} dragging={isDragging} />
    </div>
  );
}
