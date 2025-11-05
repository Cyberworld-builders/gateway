import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-24">
        <header className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs uppercase tracking-widest text-slate-400">
            CyberWorld Gateway
          </span>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Unified access to every CyberWorld product.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Authenticate once, explore everywhere. Manage your account, products,
            and shared permissions with Supabase-powered single sign-on.
          </p>
        </header>

        <section className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Get started</h2>
            <p className="text-sm text-slate-300">
              {session
                ? "You are signed in. Head over to your dashboard to continue."
                : "Sign in or create an account to start building with CyberWorld."}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-lime-400"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-lime-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-lime-400"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg border border-lime-500 px-4 py-2 text-sm font-semibold text-lime-300 transition hover:bg-lime-500/10"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-200">Centralized SSO</h3>
            <p className="mt-2 text-sm text-slate-400">
              Supabase Auth keeps your users in sync across gateway and product
              subdomains. Configure cookie domains to unlock instant cross-app
              sessions.
            </p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-slate-200">Product schemas</h3>
            <p className="mt-2 text-sm text-slate-400">
              Mirror the architecture plan with schema-per-product tables and RLS
              policies, all managed in Supabase migrations.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
