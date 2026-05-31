"use client";

import { useFormStatus } from "react-dom";
import { deleteContact } from "./actions";

function DeleteButton({ name }: { name: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Delete ${name}`}
      title="Delete contact"
      onClick={(e) => {
        if (!confirm(`Delete ${name}? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      {pending ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      )}
    </button>
  );
}

export function DeleteContactButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form action={deleteContact} className="inline-flex">
      <input type="hidden" name="id" value={id} />
      <DeleteButton name={name} />
    </form>
  );
}
