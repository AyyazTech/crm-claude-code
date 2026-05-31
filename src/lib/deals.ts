import { prisma } from "@/lib/prisma";

export function getDeals() {
  return prisma.deal.findMany({
    orderBy: [{ stage: "asc" }, { position: "asc" }],
    include: { contact: { select: { name: true } } },
  });
}

export type DealWithContact = Awaited<ReturnType<typeof getDeals>>[number];
