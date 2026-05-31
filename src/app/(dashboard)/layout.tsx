import { SidebarContent } from "@/components/sidebar-content";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const username = user?.username;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-5 md:flex">
        <SidebarContent username={username} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar + slide-in drawer (hidden on md+) */}
        <MobileSidebar username={username} />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
