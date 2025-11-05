import { createSupabaseServerClient } from "@/lib/supabase/server";

import { SignOutButton } from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-24">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Gateway dashboard</h1>
            <p className="text-sm text-slate-400">
              View your profile and cross-product access in one place.
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-slate-400">
              Account
            </h2>
            <p className="mt-3 text-2xl font-semibold text-slate-100">
              {user?.email ?? "Unknown user"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Supabase auth UID: <span className="font-mono text-xs">{user?.id}</span>
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-sm font-medium uppercase tracking-widest text-slate-400">
              Next steps
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Wire product-specific schemas &amp; RLS policies.</li>
              <li>Expose shared user preferences across subdomains.</li>
              <li>Connect social login providers in Supabase.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

