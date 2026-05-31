"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/deal-stage";
import type { MonthRevenue } from "@/lib/dashboard";

export function RevenueChart({ data }: { data: MonthRevenue[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.total), 1);
  // Round the axis ceiling up to a "nice" number for the gridline labels.
  const ceiling = niceCeiling(max);

  return (
    <div>
      <div className="flex">
        {/* Y axis */}
        <div className="flex w-14 flex-col justify-between pr-2 text-right text-[10px] font-medium text-zinc-400 tabular-nums">
          <span>{compact(ceiling)}</span>
          <span>{compact(ceiling / 2)}</span>
          <span>$0</span>
        </div>

        {/* Plot */}
        <div className="relative flex-1">
          {/* Gridlines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-px w-full bg-border/70" />
            ))}
          </div>

          <div className="relative flex h-44 items-end gap-2 sm:gap-3">
            {data.map((m, i) => {
              const pct = (m.total / ceiling) * 100;
              const isHovered = hovered === i;
              return (
                <div
                  key={m.key}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tooltip */}
                  <div
                    className={[
                      "absolute -top-1 z-10 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white shadow-[var(--shadow-pop)] transition",
                      isHovered
                        ? "opacity-100"
                        : "pointer-events-none opacity-0",
                    ].join(" ")}
                  >
                    {formatCurrency(m.total)}
                  </div>

                  <div
                    className={[
                      "w-full max-w-12 rounded-t-[5px] transition-[height,background-color] duration-300 ease-out",
                      m.total === 0
                        ? "bg-zinc-200"
                        : isHovered
                          ? "bg-indigo-600"
                          : "bg-indigo-500/85",
                    ].join(" ")}
                    style={{ height: `${Math.max(pct, m.total === 0 ? 2 : 4)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X axis */}
      <div className="mt-2 flex pl-14">
        <div className="flex flex-1 gap-2 sm:gap-3">
          {data.map((m) => (
            <span
              key={m.key}
              className="flex-1 text-center text-xs font-medium text-muted"
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function niceCeiling(max: number): number {
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / pow) * pow;
}

function compact(value: number): string {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${Math.round(value)}`;
}
