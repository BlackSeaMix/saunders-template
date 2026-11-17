import Link from "next/link";
import "./globals.css";

// Only the root layout may render <html>/<body> — and since app/layout.tsx
// was deleted so app/[locale]/layout.tsx could become the root (the only way
// to make <html lang> locale-driven), a 404 that occurs above the [locale]
// segment (e.g. /nonsense) has no layout to render <html> for it. This file
// is that fallback, with its own minimal <html lang="nl">.
export default function NotFound() {
  return (
    <html lang="nl">
      <body className="antialiased bg-ink text-cream">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-4xl font-semibold">404</h1>
          <p className="text-cream/70">Pagina niet gevonden.</p>
          <Link href="/nl" className="text-brandYellow underline">
            Terug naar de homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
