import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PageBackground from "@/components/PageBackground";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="text-center relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Circuit background */}
      <PageBackground opacity={15} fullWidth={true} />
      
      <div className="relative z-10 max-w-2xl">
        <Image
          src="/images/logo.png"
          alt="CyberWorld Gateway Logo"
          className="mx-auto mb-8"
          style={{ maxWidth: "250px" }}
          width={250}
          height={250}
          priority
        />

        <h1 className="text-3xl sm:text-4xl mb-4 text-[#00ff00] uppercase tracking-wider">
          CyberWorld Gateway
        </h1>

        <p className="text-lg mb-8 text-[#00ff00]/70">
          Unified access to every CyberWorld product.
        </p>

        <div className="mb-12 text-sm text-[#00ff00]/60">
          <p className="mb-2">
            {session
              ? `> authenticated: ${session.user.email}`
              : "> status: unauthenticated"}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {session ? (
            <Link
              href="/dashboard"
              className="text-sm text-[#00ff00] hover:text-[#a6e102] hover:underline uppercase transition"
            >
              [ dashboard ]
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#00ff00] hover:text-[#a6e102] hover:underline uppercase transition"
              >
                [ sign in ]
              </Link>
              <Link
                href="/register"
                className="text-sm text-[#00ff00] hover:text-[#a6e102] hover:underline uppercase transition"
              >
                [ create account ]
              </Link>
            </>
          )}
        </div>

        <div className="border border-[#00ff00]/30 rounded p-6 bg-[#1a1a1a]/80 backdrop-blur text-left">
          <p className="text-xs text-[#00ff00]/80 mb-4 font-mono">
            // Gateway Features
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-[#a6e102]">→</span>{" "}
              <span className="text-[#00ff00]/90">
                Single Sign-On across all products
              </span>
            </div>
            <div>
              <span className="text-[#a6e102]">→</span>{" "}
              <span className="text-[#00ff00]/90">
                Supabase-powered authentication
              </span>
            </div>
            <div>
              <span className="text-[#a6e102]">→</span>{" "}
              <span className="text-[#00ff00]/90">
                Centralized user management
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#00ff00]/50 mt-8">
          Creation is the remedy for emptiness.
        </p>
      </div>
    </div>
  );
}
