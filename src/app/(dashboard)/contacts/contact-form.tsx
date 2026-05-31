"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createContact,
  updateContact,
  type ContactFormState,
} from "./actions";
import { CONTACT_STATUSES, STATUS_META } from "@/lib/contact-status";
import type { Contact } from "@/generated/prisma/client";

const initialState: ContactFormState = {};

const fieldClass =
  "w-full rounded-[var(--radius)] border border-border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-[inset_0_1px_1px_rgba(16,18,27,0.02)] transition placeholder:text-zinc-400 focus:border-accent focus:outline-none focus-visible:outline-none";

const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export function ContactForm({ contact }: { contact?: Contact }) {
  const action = contact
    ? updateContact.bind(null, contact.id)
    : createContact;
  const [state, formAction, pending] = useActionState(action, initialState);

  const v = state.values;

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoFocus
            placeholder="Jane Cooper"
            defaultValue={v?.name ?? contact?.name ?? ""}
            className={fieldClass}
          />
          <FieldError message={state.errors?.name} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            defaultValue={v?.email ?? contact?.email ?? ""}
            className={fieldClass}
          />
          <FieldError message={state.errors?.email} />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="font-normal text-zinc-400">· optional</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            defaultValue={v?.phone ?? contact?.phone ?? ""}
            className={`${fieldClass} font-mono text-[13px]`}
          />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>
            Company <span className="font-normal text-zinc-400">· optional</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Acme Inc."
            defaultValue={v?.company ?? contact?.company ?? ""}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={v?.status ?? contact?.status ?? "lead"}
            className={`${fieldClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            }}
          >
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClass}>
            Notes <span className="font-normal text-zinc-400">· optional</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Context, next steps, where you met…"
            defaultValue={v?.notes ?? contact?.notes ?? ""}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <Link
          href="/contacts"
          className="rounded-[var(--radius)] px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-card)] transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : contact
              ? "Save changes"
              : "Create contact"}
        </button>
      </div>
    </form>
  );
}
