import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fantasy Formula - F1 Ranking App",
  description: "ELO-powered F1 race prediction platform with mobile-first design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <TopBar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-4 md:pb-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

