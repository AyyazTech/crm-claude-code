"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { STAGE_META, formatCurrency, type DealStage } from "@/lib/deal-stage";
import { SortableDealCard, type BoardDeal } from "./deal-card";

export function Column({
  stage,
  deals,
}: {
  stage: DealStage;
  deals: BoardDeal[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const meta = STAGE_META[stage];
  const total = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="flex w-72 shrink-0 flex-col">
      {/* Column header */}
      <div className="mb-3 px-1">
        <span className={`block h-1 w-9 rounded-full ${meta.bar}`} />
        <div className="mt-2.5 flex items-center gap-2">
          <h2 className={`text-sm font-semibold ${meta.accent}`}>
            {meta.label}
          </h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.soft}`}
          >
            {deals.length}
          </span>
          <span className="ml-auto font-mono text-xs text-muted">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Drop area */}
      <div
        ref={setNodeRef}
        className={[
          "flex min-h-32 flex-1 flex-col gap-2.5 rounded-[12px] border border-dashed p-2.5 transition-colors",
          isOver
            ? "border-accent/40 bg-accent/[0.04]"
            : "border-transparent bg-zinc-500/[0.03]",
        ].join(" ")}
      >
        <SortableContext
          items={deals.map((d) => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <p className="flex flex-1 items-center justify-center py-6 text-xs text-zinc-400 select-none">
            Drop deals here
          </p>
        )}
      </div>
    </section>
  );
}
