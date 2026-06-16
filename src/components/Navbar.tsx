import Link from "next/link";
import { categories } from "@/lib/rss";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">M</span>
            <span className="font-serif font-bold text-xl text-neutral-900">Madagascar News</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                className="text-sm text-neutral-600 hover:text-emerald-700 font-medium transition"
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">🇲🇬</span>
          </div>
        </div>
      </div>
    </header>
  );
}
