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
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function parseRSS(xml: string, sourceName: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const getTag = (tag: string) => {
      const m = content.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      return m ? m[1].trim() : "";
    };

    const title = stripHtml(getTag("title"));
    const link = stripHtml(getTag("link"));
    const description = getTag("description");
    const date = getTag("pubDate") || getTag("dc:date");
    const encoded = getTag("content:encoded") || description;

    if (!title && !link) continue;

    items.push({
      id: encodeId(link || title),
      title: title || "Sans titre",
      link: link || "#",
      content: encoded,
      snippet: stripHtml(description).slice(0, 200) || stripHtml(encoded).slice(0, 200),
      date: date || new Date().toISOString(),
      image: extractImage(encoded),
      source: sourceName,
      category,
    });
  }
  return items;
}

export async function fetchArticleContent(url: string): Promise<{ html: string; image: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MadagascarNews/1.0)" },
    });
    const html = await res.text();

    let content = "";
    const patterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<div[^>]*class=["'][^"']*(?:content|article|post|entry|story|main)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*id=["'][^"']*(?:content|article|post|entry|story|main)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<body[^>]*>([\s\S]*?)<\/body>/i,
    ];

    for (const pattern of patterns) {
      const m = html.match(pattern);
      if (m) { content = m[1]; break; }
    }

    if (!content) return null;

    const cleaned = content
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "")
      .replace(/<form[\s\S]*?<\/form>/gi, "")
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
      .replace(/class=["'][^"']*["']/gi, "")
      .replace(/id=["'][^"']*["']/gi, "")
      .replace(/style=["'][^"']*["']/gi, "")
      .replace(/on\w+=["'][^"']*["']/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    const articleImage = extractImage(cleaned) || extractImage(html);

    return { html: cleaned, image: articleImage };
  } catch {
    return null;
  }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const results: NewsItem[] = [];

  const fetches = sources.map(async (source) => {
    try {
      const res = await fetch(source.url, {
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "MadagascarNews/1.0" },
      });
      const xml = await res.text();
      const items = parseRSS(xml, source.name, source.category).slice(0, 10);
      results.push(...items);
    } catch {
      // source unavailable
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
  { slug: "actualites", label: "Actualités" },
  { slug: "politique", label: "Politique" },
  { slug: "technologie", label: "Technologie" },
  { slug: "economie", label: "Économie" },
  { slug: "sport", label: "Sport" },
  { slug: "culture", label: "Culture" },
];
