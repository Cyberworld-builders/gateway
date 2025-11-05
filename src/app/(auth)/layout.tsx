import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-12">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg shadow-black/40">
          {children}
        </div>
      </div>
    </div>
  );
}

