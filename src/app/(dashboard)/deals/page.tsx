import { getDeals } from "@/lib/deals";
import { formatCurrency } from "@/lib/deal-stage";
import { DealsBoard } from "./deals-board";
import type { BoardDeal } from "./deal-card";

// Live view of the pipeline; read fresh each request and refresh via
// revalidatePath() after a card is moved.
export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const deals = await getDeals();

  const cards: BoardDeal[] = deals.map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    stage: d.stage,
    position: d.position,
    company: d.company,
    contactName: d.contact?.name ?? null,
  }));

  // Open pipeline = everything not yet won or lost.
  const openValue = cards
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);
  const wonValue = cards
    .filter((d) => d.stage === "won")
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <header className="sticky top-14 z-10 border-b border-border bg-background/80 px-6 py-5 backdrop-blur md:top-0 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
              Deals
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {cards.length} {cards.length === 1 ? "deal" : "deals"} in the
              pipeline · drag cards between stages
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Open pipeline" value={formatCurrency(openValue)} />
            <span className="h-9 w-px bg-border" />
            <Stat label="Won" value={formatCurrency(wonValue)} accent />
          </div>
        </div>
      </header>

      <div className="pt-8">
        <DealsBoard deals={cards} />
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-right">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-semibold tracking-tight ${accent ? "text-emerald-600" : "text-zinc-900"}`}
      >
        {value}
      </p>
    </div>
  );
}
