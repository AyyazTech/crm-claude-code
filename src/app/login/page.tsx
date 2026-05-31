import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in · Atlas CRM",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-accent text-accent-fg shadow-[var(--shadow-card)]">
            <svg
              className="h-6 w-6"
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
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted">Sign in to Atlas CRM</p>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
          <LoginForm />
        </div>

        {/* Demo credentials hint */}
        <p className="mt-5 text-center text-xs text-muted">
          Demo login —{" "}
          <span className="font-mono text-zinc-600">admin</span> /{" "}
          <span className="font-mono text-zinc-600">admin123</span>
        </p>
      </div>
    </div>
  );
}
