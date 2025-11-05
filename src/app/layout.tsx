import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CyberWorld Gateway - Unified Authentication",
    template: "%s | CyberWorld Gateway",
  },
  description:
    "Unified authentication gateway for CyberWorld products. Single sign-on powered by Supabase.",
  keywords: [
    "CyberWorld",
    "authentication",
    "gateway",
    "single sign-on",
    "SSO",
  ],
  authors: [{ name: "CyberWorld Builders", url: "https://cyberworldbuilders.com" }],
  creator: "CyberWorld Builders",
  publisher: "CyberWorld Builders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-[#00ff00] font-mono">
        {children}
      </body>
    </html>
  );
}
