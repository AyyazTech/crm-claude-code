"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

const fieldClass =
  "w-full rounded-[var(--radius)] border border-border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-[inset_0_1px_1px_rgba(16,18,27,0.02)] transition placeholder:text-zinc-400 focus:border-accent focus:outline-none";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          defaultValue={state.username ?? ""}
          placeholder="admin"
          className={fieldClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={fieldClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[var(--radius)] bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-[var(--shadow-card)] transition hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
