import { fetchNewsById, fetchArticleContent } from "@/lib/rss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchNewsById(id);

  if (!item) notFound();

  const [articleData] = await Promise.all([
    item.link !== "#" ? fetchArticleContent(item.link) : null,
  ]);

  const date = new Date(item.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const displayImage = articleData?.image || item.image;

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-emerald-700 mb-6 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux actualités
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">{item.source}</span>
            <span className="text-neutral-400 text-xs">{item.category}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 leading-tight mb-4">{item.title}</h1>

          <time className="text-sm text-neutral-500">{date}</time>

          {displayImage && (
            <div className="mt-6 rounded-xl overflow-hidden bg-neutral-100">
              <img src={displayImage} alt={item.title} className="w-full h-auto object-cover max-h-96" loading="lazy" />
            </div>
          )}

          <div className="mt-8 text-neutral-700 leading-relaxed space-y-4 text-lg">
            {articleData?.html ? (
              <div dangerouslySetInnerHTML={{ __html: articleData.html }} className="article-content space-y-4" />
            ) : item.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: item.content
                    .replace(/<script[\s\S]*?<\/script>/gi, "")
                    .replace(/<style[\s\S]*?<\/style>/gi, ""),
                }}
                className="article-content space-y-4"
              />
            ) : (
              <p className="text-neutral-500 italic">
                Le contenu complet de cet article n&apos;est pas disponible.
                Veuillez cliquer sur le lien ci-dessous pour le lire sur le site source.
              </p>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap items-center gap-4">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Lire sur {item.source}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
