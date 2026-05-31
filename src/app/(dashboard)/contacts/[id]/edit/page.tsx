import Link from "next/link";
import { notFound } from "next/navigation";
import { getContact } from "@/lib/contacts";
import { ContactForm } from "../../contact-form";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In this Next.js version `params` is a Promise and must be awaited.
  const { id } = await params;
  const contact = await getContact(id);

  if (!contact) notFound();

  return (
    <>
      <header className="border-b border-border bg-background/80 px-6 py-5 backdrop-blur md:px-10">
        <Link
          href="/contacts"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-zinc-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Contacts
        </Link>
      </header>

      <div className="px-6 py-8 md:px-10">
        <div className="animate-fade-up mx-auto max-w-2xl">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
              Edit contact
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              Update {contact.name}&rsquo;s details.
            </p>
          </div>

          <div className="rounded-[14px] border border-border bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
            <ContactForm contact={contact} />
          </div>
        </div>
      </div>
    </>
  );
}
