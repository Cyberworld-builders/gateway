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
      className="w-full rounded-lg bg-lime-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

type OAuthParams = {
  client_id: string;
  redirect_uri: string;
  state?: string;
};

export function LoginForm({ 
  redirectTo, 
  oauthParams 
}: { 
  redirectTo?: string;
  oauthParams?: OAuthParams;
}) {
  const [state, formAction] = useActionState(loginAction, initialState);
  const error = state?.error;

  // Determine the product name from client_id
  const productName = oauthParams?.client_id 
    ? oauthParams.client_id.charAt(0).toUpperCase() + oauthParams.client_id.slice(1)
    : "CyberWorld";

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">
          {oauthParams ? `Sign in to ${productName}` : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-400">
          {oauthParams 
            ? `Use your CyberWorld account to access ${productName}`
            : "Sign in to manage your CyberWorld workspace."}
        </p>
      </div>

      <input type="hidden" name="redirectTo" value={redirectTo ?? "/dashboard"} />
      
      {/* OAuth parameters */}
      {oauthParams && (
        <>
          <input type="hidden" name="client_id" value={oauthParams.client_id} />
          <input type="hidden" name="redirect_uri" value={oauthParams.redirect_uri} />
          {oauthParams.state && (
            <input type="hidden" name="state" value={oauthParams.state} />
          )}
        </>
      )}

      <label className="space-y-1 text-sm">
        <span className="text-slate-300">Email</span>
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 focus:border-lime-400 focus:outline-none"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="space-y-1 text-sm">
        <span className="text-slate-300">Password</span>
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 focus:border-lime-400 focus:outline-none"
          type="password"
          name="password"
          placeholder="••••••••"
          minLength={6}
          required
        />
      </label>

      {error && (
        <p className="rounded-md border border-red-900 bg-red-950/70 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <SubmitButton label="Sign in" />

      <p className="text-center text-sm text-slate-400">
        Need an account?{" "}
        <Link 
          className="text-lime-400 hover:text-lime-300" 
          href={
            oauthParams 
              ? `/register?client_id=${oauthParams.client_id}&redirect_uri=${encodeURIComponent(oauthParams.redirect_uri)}${oauthParams.state ? `&state=${oauthParams.state}` : ''}`
              : "/register"
          }
        >
          Register here
        </Link>
        .
      </p>
    </form>
  );
}

