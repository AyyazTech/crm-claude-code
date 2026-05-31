import { prisma } from "@/lib/prisma";
import { DEAL_STAGES, type DealStage } from "@/lib/deal-stage";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type StageSummary = {
  stage: DealStage;
  count: number;
  value: number;
};

export type MonthRevenue = {
  key: string; // YYYY-MM
  label: string; // e.g. "Mar"
  total: number;
};

export type DashboardStats = {
  totalContacts: number;
  totalDeals: number;
  byStage: StageSummary[];
  pipelineValue: number; // open stages only (lead/contacted/proposal)
  wonValue: number;
  revenueByMonth: MonthRevenue[];
};

const OPEN_STAGES: DealStage[] = ["lead", "contacted", "proposal"];

export async function getDashboardStats(months = 6): Promise<DashboardStats> {
  const [totalContacts, grouped, wonDeals] = await Promise.all([
    prisma.contact.count(),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: { _all: true },
      _sum: { value: true },
    }),
    prisma.deal.findMany({
      where: { stage: "won", closedAt: { not: null } },
      select: { value: true, closedAt: true },
    }),
  ]);

  const groupMap = new Map(grouped.map((g) => [g.stage, g]));
  const byStage: StageSummary[] = DEAL_STAGES.map((stage) => {
    const g = groupMap.get(stage);
    return {
      stage,
      count: g?._count._all ?? 0,
      value: g?._sum.value ?? 0,
    };
  });

  const valueOf = (s: DealStage) =>
    byStage.find((b) => b.stage === s)?.value ?? 0;

  const pipelineValue = OPEN_STAGES.reduce((sum, s) => sum + valueOf(s), 0);
  const wonValue = valueOf("won");
  const totalDeals = byStage.reduce((sum, b) => sum + b.count, 0);

  // Build the last `months` monthly buckets ending with the current month.
  const now = new Date();
  const buckets: MonthRevenue[] = [];
  const indexByKey = new Map<string, number>();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    indexByKey.set(key, buckets.length);
    buckets.push({ key, label: MONTH_LABELS[d.getMonth()], total: 0 });
  }

  for (const deal of wonDeals) {
    if (!deal.closedAt) continue;
    const d = deal.closedAt;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const idx = indexByKey.get(key);
    if (idx !== undefined) buckets[idx].total += deal.value;
  }

  return {
    totalContacts,
    totalDeals,
    byStage,
    pipelineValue,
    wonValue,
    revenueByMonth: buckets,
  };
}
