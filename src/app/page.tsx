import { fetchAllNews, categories } from "@/lib/rss";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function Home() {
  const news = await fetchAllNews();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  EN DIRECT
                </span>
                <span className="text-emerald-200 text-sm">{news.length} articles récents</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">
                L'actualité de Madagascar,<br />
                <span className="text-emerald-300">en un coup d'œil</span>
              </h1>
              <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mb-8">
                Agrégeateur d'actualités indépendant. Suivez l'info malgache depuis les meilleures sources.
              </p>
              <div className="flex flex-wrap gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/categorie/${cat.slug}`}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    {cat.emoji} {cat.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent" />
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">
              Dernières actualités
            </h2>
            <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
              Mis à jour en continu
            </span>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-lg">Aucun article trouvé pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 30).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
