import Parser from 'rss-parser';

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
  timeout: 10000,
});

interface NewsItem {
  title: string;
  link: string;
  content: string;
  pubDate?: string;
  category?: string;
}

const feeds = [
  'https://newsinfo.inquirer.net/feed',
  'https://www.philstar.com/rss/headlines',
  'https://mb.com.ph/feed',
];

// ✅ 카테고리 자동 인식
function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('covid') || t.includes('health')) return 'Health';
  if (t.includes('crime') || t.includes('murder') || t.includes('shot')) return 'Crime';
  if (t.includes('politics') || t.includes('election')) return 'Politics';
  if (t.includes('business')) return 'Business';
  if (t.includes('sports')) return 'Sports';
  return 'General';
}

export async function fetchAllRSSFeeds(): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      feed.items?.forEach((item) => {
        if (!item.title || !item.link) return;

        allItems.push({
          title: item.title,
          link: item.link,
          content: item.contentSnippet || item.content || '',
          pubDate: item.pubDate || '',
          category: detectCategory(item.title),
        });
      });
    } catch (error) {
      console.error(`❌ Failed to fetch RSS from ${url}:`, error);
    }
  }

  // ✅ 중복 뉴스 제거 (제목 기준)
  const unique = Array.from(new Map(allItems.map((i) => [i.title, i])).values());

  return unique;
}

