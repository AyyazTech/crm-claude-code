import Link from "next/link";
import { getContacts } from "@/lib/contacts";
import { StatusBadge } from "@/components/status-badge";
import { DeleteContactButton } from "./delete-contact-button";

// The contacts list is a live view of the database; read fresh on every request
// and rely on revalidatePath() in actions.ts to refresh after mutations.
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_TINTS = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
];

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <>
      {/* Page header */}
      <header className="sticky top-14 z-10 border-b border-border bg-background/80 backdrop-blur md:top-0">
        <div className="flex items-center justify-between gap-4 px-6 py-5 md:px-10">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
              Contacts
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {contacts.length === 0
                ? "No contacts yet"
                : `${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"} in your workspace`}
            </p>
          </div>
          <Link
            href="/contacts/new"
            className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-card)] transition hover:brightness-110 active:brightness-95"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New contact
          </Link>
        </div>
      </header>

      <div className="px-6 py-8 md:px-10">
        {contacts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="animate-fade-up overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-card)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                    Company
                  </th>
                  <th className="hidden px-5 py-3 font-semibold lg:table-cell">
                    Phone
                  </th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr
                    key={contact.id}
                    className="group border-b border-border/70 transition-colors last:border-0 hover:bg-zinc-50/80"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${AVATAR_TINTS[i % AVATAR_TINTS.length]}`}
                        >
                          {initials(contact.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900">
                            {contact.name}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-zinc-600 sm:table-cell">
                      {contact.company ?? (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-[13px] text-zinc-500 lg:table-cell">
                      {contact.phone ?? (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={contact.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <Link
                          href={`/contacts/${contact.id}/edit`}
                          className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                          aria-label={`Edit ${contact.name}`}
                          title="Edit contact"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </Link>
                        <DeleteContactButton
                          id={contact.id}
                          name={contact.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center rounded-[14px] border border-dashed border-border bg-surface px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/8 text-accent">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6M22 11h-6" />
        </svg>
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-zinc-900">
        No contacts yet
      </h2>
      <p className="mt-1 text-sm text-muted">
        Add your first contact to start building your pipeline.
      </p>
      <Link
        href="/contacts/new"
        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-card)] transition hover:brightness-110"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        New contact
      </Link>
    </div>
  );
}
