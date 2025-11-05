import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#00ff00] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-6 text-center">
          <Image
            src="/images/logo.png"
            alt="CyberWorld Gateway"
            className="mx-auto mb-4"
            style={{ maxWidth: "150px" }}
            width={150}
            height={150}
          />
          <p className="text-xs text-[#00ff00]/50 font-mono uppercase tracking-wider">
            CyberWorld Gateway
          </p>
        </Link>

        <div className="border border-[#00ff00]/30 bg-[#1a1a1a]/90 p-8 shadow-lg shadow-[#00ff00]/5">
          {children}
        </div>

        <p className="text-center text-xs text-[#00ff00]/40 mt-6 font-mono">
          &copy; {new Date().getFullYear()} CyberWorld Builders
        </p>
      </div>
    </div>
  );
}
