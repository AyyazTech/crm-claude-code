import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard";
import { STAGE_META, formatCurrency } from "@/lib/deal-stage";
import { RevenueChart } from "./revenue-chart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats(6);
  const maxStageCount = Math.max(...stats.byStage.map((s) => s.count), 1);
  const revenueTotal = stats.revenueByMonth.reduce((sum, m) => sum + m.total, 0);

  return (
    <>
      <header className="sticky top-14 z-10 border-b border-border bg-background/80 px-6 py-5 backdrop-blur md:top-0 md:px-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          An overview of your contacts and pipeline.
        </p>
      </header>

      <div className="space-y-6 px-6 py-8 md:px-10">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total contacts"
            value={String(stats.totalContacts)}
            href="/contacts"
            icon={
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </>
            }
          />
          <StatCard
            label="Open deals"
            value={String(
              stats.byStage
                .filter((s) => !["won", "lost"].includes(s.stage))
                .reduce((n, s) => n + s.count, 0),
            )}
            href="/deals"
            icon={
              <>
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
              </>
            }
          />
          <StatCard
            label="Pipeline value"
            value={formatCurrency(stats.pipelineValue)}
            href="/deals"
            icon={
              <>
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 3 3 5-6" />
              </>
            }
          />
          <StatCard
            label="Revenue won"
            value={formatCurrency(stats.wonValue)}
            accent
            href="/deals"
            icon={
              <>
                <circle cx="12" cy="8" r="6" />
                <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
              </>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <section className="rounded-[14px] border border-border bg-surface p-6 shadow-[var(--shadow-card)] lg:col-span-2">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Revenue</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Won deals · last 6 months
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-semibold tracking-tight text-zinc-900">
                  {formatCurrency(revenueTotal)}
                </p>
                <p className="text-xs text-muted">total</p>
              </div>
            </div>
            <RevenueChart data={stats.revenueByMonth} />
          </section>

          {/* Deals by stage */}
          <section className="rounded-[14px] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">
                Deals by stage
              </h2>
              <span className="text-xs text-muted">{stats.totalDeals} total</span>
            </div>
            <ul className="space-y-4">
              {stats.byStage.map((s) => {
                const meta = STAGE_META[s.stage];
                return (
                  <li key={s.stage}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-zinc-700">
                        <span className={`h-2 w-2 rounded-full ${meta.bar}`} />
                        {meta.label}
                      </span>
                      <span className="text-zinc-500">
                        <span className="font-medium text-zinc-800">
                          {s.count}
                        </span>{" "}
                        · {formatCurrency(s.value)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full ${meta.bar} transition-[width] duration-500`}
                        style={{
                          width: `${(s.count / maxStageCount) * 100}%`,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[14px] border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition hover:border-zinc-300 hover:shadow-[0_2px_10px_rgba(16,18,27,0.07)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-emerald-50 text-emerald-600" : "bg-accent/8 text-accent"}`}
        >
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon}
          </svg>
        </span>
      </div>
      <p
        className={`mt-3 font-mono text-2xl font-semibold tracking-tight ${accent ? "text-emerald-600" : "text-zinc-900"}`}
      >
        {value}
      </p>
    </Link>
  );
}
