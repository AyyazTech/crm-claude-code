"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDealStage } from "@/lib/deal-stage";

/**
 * Move a deal to `toStage`, inserting it at `toIndex` among the cards already in
 * that stage. The new `position` is the midpoint between its neighbours (or just
 * beyond the edge), so no other rows need re-indexing.
 */
export async function moveDeal(
  dealId: string,
  toStage: string,
  toIndex: number,
) {
  if (!isDealStage(toStage)) return;

  // Cards currently in the target stage, excluding the one being moved.
  const siblings = await prisma.deal.findMany({
    where: { stage: toStage, id: { not: dealId } },
    orderBy: { position: "asc" },
    select: { position: true },
  });

  const index = Math.max(0, Math.min(toIndex, siblings.length));

  let position: number;
  if (siblings.length === 0) {
    position = 0;
  } else if (index <= 0) {
    position = siblings[0].position - 1;
  } else if (index >= siblings.length) {
    position = siblings[siblings.length - 1].position + 1;
  } else {
    position = (siblings[index - 1].position + siblings[index].position) / 2;
  }

  // Stamp the close date when a deal is won (so it shows in revenue-by-month);
  // clear it if the deal moves back out of "won".
  const current = await prisma.deal.findUnique({
    where: { id: dealId },
    select: { closedAt: true },
  });
  const closedAt =
    toStage === "won" ? (current?.closedAt ?? new Date()) : null;

  await prisma.deal.update({
    where: { id: dealId },
    data: { stage: toStage, position, closedAt },
  });

  revalidatePath("/deals");
  revalidatePath("/dashboard");
}
