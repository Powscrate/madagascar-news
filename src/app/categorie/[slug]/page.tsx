import { fetchAllNews, categories } from "@/lib/rss";
import NewsCard from "@/components/NewsCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await fetchAllNews();
  const cat = categories.find((c) => c.slug === slug);
  const filtered = all.filter((item) => item.category.toLowerCase() === slug.toLowerCase());

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            {cat?.emoji} {cat?.label || slug}
          </h1>
          <p className="text-neutral-500 mt-1">{filtered.length} articles</p>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">Aucun article dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 30).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
