import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Folio — Votre histoire, bien présentée",
  description: "Créez et publiez un portfolio unique sans toucher au code.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-black/10 bg-[#f7f5ef]/90 backdrop-blur-md sticky top-0 z-50">
          <nav className="container-app flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
              <span className="grid size-8 place-items-center rounded-full bg-black text-[#d8ff5f]">F</span>
              folio.
            </Link>
            <div className="flex items-center gap-3 text-sm font-semibold">
              {user ? (
                <>
                  <span className="hidden text-black/50 sm:inline">Bonjour, {user.name.split(" ")[0]}</span>
                  <Link href="/dashboard" className="btn btn-dark !min-h-9 !px-4 !py-1">Mes portfolios</Link>
                </>
              ) : (
                <>
                  <Link href="/signin" className="hidden sm:inline">Connexion</Link>
                  <Link href="/signup" className="btn btn-dark !min-h-9 !px-4 !py-1">Créer mon portfolio</Link>
                </>
              )}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
