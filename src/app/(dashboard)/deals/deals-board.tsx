"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DEAL_STAGES, isDealStage, type DealStage } from "@/lib/deal-stage";
import { moveDeal } from "./actions";
import { Column } from "./column";
import { DealCard, type BoardDeal } from "./deal-card";

type Board = Record<DealStage, BoardDeal[]>;

function groupByStage(deals: BoardDeal[]): Board {
  const board = Object.fromEntries(
    DEAL_STAGES.map((s) => [s, [] as BoardDeal[]]),
  ) as Board;
  for (const deal of deals) {
    const stage = isDealStage(deal.stage) ? deal.stage : "lead";
    board[stage].push(deal);
  }
  for (const stage of DEAL_STAGES) {
    board[stage].sort((a, b) => a.position - b.position);
  }
  return board;
}

export function DealsBoard({ deals }: { deals: BoardDeal[] }) {
  const [board, setBoard] = useState<Board>(() => groupByStage(deals));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeDeal = activeId
    ? Object.values(board)
        .flat()
        .find((d) => d.id === activeId) ?? null
    : null;

  // Which column does an id belong to? `id` may be a card id or a stage id.
  function findContainer(id: string): DealStage | null {
    if (isDealStage(id)) return id;
    for (const stage of DEAL_STAGES) {
      if (board[stage].some((d) => d.id === id)) return stage;
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  // Move the card into the hovered column as you drag, so it appears in place.
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id));
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setBoard((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((d) => d.id === active.id);
      if (activeIndex === -1) return prev;

      const overIsCard = !isDealStage(String(over.id));
      const overIndex = overIsCard
        ? overItems.findIndex((d) => d.id === over.id)
        : overItems.length;
      const insertAt = overIndex >= 0 ? overIndex : overItems.length;

      const moved = activeItems[activeIndex];
      return {
        ...prev,
        [activeContainer]: activeItems.filter((d) => d.id !== active.id),
        [overContainer]: [
          ...overItems.slice(0, insertAt),
          moved,
          ...overItems.slice(insertAt),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const container = findContainer(String(over.id));
    if (!container) return;

    let finalIndex = board[container].findIndex((d) => d.id === active.id);

    // Reorder within the same column when dropping onto another card.
    const overIsCard = !isDealStage(String(over.id));
    if (overIsCard) {
      const overIndex = board[container].findIndex((d) => d.id === over.id);
      if (finalIndex !== -1 && overIndex !== -1 && finalIndex !== overIndex) {
        setBoard((prev) => ({
          ...prev,
          [container]: arrayMove(prev[container], finalIndex, overIndex),
        }));
        finalIndex = overIndex;
      }
    }

    if (finalIndex === -1) finalIndex = board[container].length;

    startTransition(() => {
      moveDeal(String(active.id), container, finalIndex);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-4 overflow-x-auto px-6 pb-8 md:px-10">
        {DEAL_STAGES.map((stage) => (
          <Column key={stage} stage={stage} deals={board[stage]} />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.22,1,0.36,1)" }}>
        {activeDeal ? <DealCard deal={activeDeal} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
