"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarContent } from "@/components/sidebar-content";

export function MobileSidebar({ username }: { username?: string }) {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll while the drawer is open.
  // Navigation closes the drawer via each link's onNavigate callback below.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar (hidden on md+) */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="-ml-1.5 rounded-md p-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent text-accent-fg">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a14 14 0 0 0 0 18" />
              <path d="M12 3a14 14 0 0 1 0 18" />
              <path d="M3.5 9h17M3.5 15h17" />
            </svg>
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight text-zinc-900">
            Atlas
          </span>
        </Link>
      </div>

      {/* Drawer + backdrop */}
      <div
        className={[
          "fixed inset-0 z-50 md:hidden",
          open ? "" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-zinc-900/40 backdrop-blur-[1px] transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className={[
            "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-border bg-surface px-4 py-5 shadow-[var(--shadow-pop)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-4 right-3 rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <SidebarContent
            username={username}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
