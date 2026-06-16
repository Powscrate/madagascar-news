import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "MadagascarNews/1.0" },
});

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  content: string;
  snippet: string;
  date: string;
  image: string;
  source: string;
  category: string;
}

const sources = [
  { url: "https://www.madagascar-tribune.com/spip.php?page=backend", name: "Madagascar Tribune", category: "Politique" },
  { url: "https://actu.orange.mg/feed", name: "Orange Actu Madagascar", category: "Actualités" },
  { url: "https://newsmada.com/feed", name: "Newsmada", category: "Actualités" },
  { url: "https://lesnews.mg/feed", name: "Les News", category: "Actualités" },
  { url: "https://www.moov.mg/feed", name: "Moov Madagascar", category: "Technologie" },
];

function extractImage(content: string): string {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (match) return match[1];
  const match2 = content.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp)/i);
  if (match2) return match2[0];
  return "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function encodeId(url: string): string {
  return Buffer.from(url).toString("base64url").slice(0, 48);
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results: NewsItem[] = [];

  const fetches = sources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 10).map((item) => ({
        id: encodeId(item.link || item.title || Math.random().toString()),
        title: item.title || "Sans titre",
        link: item.link || "#",
        content: item.content || item.contentSnippet || "",
        snippet: stripHtml(item.contentSnippet || item.content || "").slice(0, 200),
        date: item.isoDate || item.pubDate || new Date().toISOString(),
        image: extractImage(item.content || ""),
        source: source.name,
        category: source.category,
      }));
      results.push(...items);
    } catch {
      // source unavailable, skip
    }
  });

  await Promise.allSettled(fetches);
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function fetchNewsByCategory(cat: string): Promise<NewsItem[]> {
  const all = await fetchAllNews();
  return all.filter((item) => item.category.toLowerCase() === cat.toLowerCase());
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const all = await fetchAllNews();
  return all.find((item) => item.id === id) || null;
}

export const categories = [
  { slug: "actualites", label: "Actualités", emoji: "📰" },
  { slug: "politique", label: "Politique", emoji: "🏛️" },
  { slug: "technologie", label: "Technologie", emoji: "💻" },
  { slug: "economie", label: "Économie", emoji: "📈" },
  { slug: "sport", label: "Sport", emoji: "⚽" },
  { slug: "culture", label: "Culture", emoji: "🎭" },
];
