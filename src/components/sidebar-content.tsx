import Link from "next/link";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";

/** The inner contents of the sidebar, shared by the desktop rail and the
 * mobile drawer: wordmark, navigation, and the workspace footer. */
export function SidebarContent({
  username,
  onNavigate,
}: {
  username?: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Wordmark */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="mb-7 flex items-center gap-2.5 px-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-accent text-accent-fg shadow-[var(--shadow-card)]">
          <svg
            className="h-[18px] w-[18px]"
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
        <span className="font-display text-[19px] font-semibold tracking-tight text-zinc-900">
          Atlas
        </span>
      </Link>

      <SidebarNav onNavigate={onNavigate} />

      {/* Footer: signed-in user + sign out */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-[var(--radius)] px-2 py-1.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white uppercase">
            {(username ?? "?").slice(0, 2)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-zinc-800">
              {username ?? "Signed in"}
            </p>
            <p className="truncate text-xs text-muted">Acme Workspace</p>
          </div>
          <span className="ml-auto">
            <LogoutButton />
          </span>
        </div>
      </div>
    </>
  );
}
