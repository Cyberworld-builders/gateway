import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PageBackground from "@/components/PageBackground";

import { SignOutButton } from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#00ff00] px-6 py-12 relative">
      {/* Circuit background */}
      <PageBackground opacity={15} fullWidth={true} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="CyberWorld Gateway"
                width={80}
                height={80}
                className="hover:opacity-80 transition"
              />
            </Link>
            <div>
              <h1 className="text-2xl font-mono uppercase text-[#00ff00] mb-1">
                // Dashboard
              </h1>
              <p className="text-sm text-[#00ff00]/60 font-mono">
                &gt; gateway control panel
              </p>
            </div>
          </div>
          <SignOutButton />
        </header>

        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <div className="border border-[#00ff00]/30 bg-[#0d0d0d] p-6">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#a6e102] mb-4">
              [ ACCOUNT_INFO ]
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[#00ff00]/60 font-mono">user:</span>{" "}
                <span className="text-[#00ff00]">{user?.email ?? "Unknown"}</span>
              </div>
              <div>
                <span className="text-[#00ff00]/60 font-mono">uid:</span>{" "}
                <span className="text-[#00ff00]/80 font-mono text-xs break-all">
                  {user?.id}
                </span>
              </div>
              <div>
                <span className="text-[#00ff00]/60 font-mono">status:</span>{" "}
                <span className="text-[#a6e102]">AUTHENTICATED</span>
              </div>
            </div>
          </div>

          <div className="border border-[#00ff00]/30 bg-[#0d0d0d] p-6">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#a6e102] mb-4">
              [ PRODUCTS ]
            </h2>
            <div className="space-y-2 text-sm text-[#00ff00]/70">
              <p className="font-mono">
                &gt; No products configured yet
              </p>
              <p className="font-mono text-xs text-[#00ff00]/50">
                // Connect your product subdomains here
              </p>
            </div>
          </div>
        </div>

        <div className="border border-[#00ff00]/30 bg-[#0d0d0d] p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-[#a6e102] mb-4">
            [ NEXT_STEPS ]
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-[#a6e102] font-mono">→</span>
              <span className="text-[#00ff00]/80 font-mono">
                Wire product-specific schemas & RLS policies
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#a6e102] font-mono">→</span>
              <span className="text-[#00ff00]/80 font-mono">
                Configure shared user preferences across subdomains
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#a6e102] font-mono">→</span>
              <span className="text-[#00ff00]/80 font-mono">
                Connect social login providers in Supabase
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-[#00ff00]/70 hover:text-[#a6e102] hover:underline font-mono"
          >
            [ back to gateway ]
          </Link>
        </div>
      </div>
    </div>
  );
}
