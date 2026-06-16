import Link from "next/link";
import type { NewsItem } from "@/lib/rss";

export default function NewsCard({ item }: { item: NewsItem }) {
  const date = new Date(item.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col">
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {item.source}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs px-2 py-1 rounded-full">
          {item.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <time className="text-xs text-neutral-400 mb-2">{date}</time>
        <h3 className="font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-emerald-700 transition line-clamp-3">
          <Link href={`/article/${item.id}`}>{item.title}</Link>
        </h3>
        {item.snippet && (
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 mb-4">{item.snippet}</p>
        )}
        <div className="mt-auto">
          <Link
            href={`/article/${item.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition"
          >
            Lire l'article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
