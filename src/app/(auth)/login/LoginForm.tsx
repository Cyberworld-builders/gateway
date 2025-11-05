'use client';

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type AuthFormState } from "./actions";

const initialState: AuthFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full border border-[#00ff00] bg-[#1a1a1a] px-4 py-2 text-center text-sm font-mono uppercase text-[#00ff00] transition hover:bg-[#00ff00] hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "[ authenticating... ]" : `[ ${label} ]`}
    </button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const error = state?.error;

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-mono uppercase text-[#00ff00]">
          // Sign In
        </h1>
        <p className="text-sm text-[#00ff00]/70">
          &gt; access your cyberworld workspace
        </p>
      </div>

      <input type="hidden" name="redirectTo" value={redirectTo ?? "/dashboard"} />

      <label className="space-y-1 text-sm">
        <span className="text-[#00ff00]/80 font-mono">EMAIL_ADDRESS:</span>
        <input
          className="w-full border border-[#00ff00]/30 bg-[#0d0d0d] px-3 py-2 text-[#00ff00] font-mono focus:border-[#00ff00] focus:outline-none placeholder:text-[#00ff00]/40"
          type="email"
          name="email"
          placeholder="user@cyberworld.net"
          required
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-[#00ff00]/80 font-mono">PASSWORD:</span>
        <input
          className="w-full border border-[#00ff00]/30 bg-[#0d0d0d] px-3 py-2 text-[#00ff00] font-mono focus:border-[#00ff00] focus:outline-none placeholder:text-[#00ff00]/40"
          type="password"
          name="password"
          placeholder="••••••••"
          minLength={6}
          required
        />
      </label>

      {error && (
        <p className="border border-red-500/50 bg-red-950/30 px-3 py-2 text-sm text-red-400 font-mono">
          ! ERROR: {error}
        </p>
      )}

      <SubmitButton label="sign in" />

      <p className="text-center text-sm text-[#00ff00]/70 font-mono">
        &gt; need an account?{" "}
        <Link className="text-[#a6e102] hover:text-[#00ff00] hover:underline" href="/register">
          [ register ]
        </Link>
      </p>
    </form>
  );
}
