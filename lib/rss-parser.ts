import Parser from 'rss-parser';

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
  timeout: 10000,
});

export interface NewsItem {
  title: string;
  link: string;
  content: string;
  pubDate: string;               // ✅ string으로 고정 (undefined 방지)
  category?: string;
  contentSnippet?: string;
  guid?: string;
}

const feeds = [
  'https://newsinfo.inquirer.net/feed',
  'https://www.philstar.com/rss/headlines',
  'https://mb.com.ph/feed',
  // 필요한 경우 추가 가능
];

// ✅ 카테고리 자동 인식 함수
function detectCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('covid') || t.includes('health') || t.includes('hospital')) return 'Health';
  if (t.includes('crime') || t.includes('murder') || t.includes('shot') || t.includes('arrest')) return 'Crime';
  if (t.includes('politics') || t.includes('election') || t.includes('senate')) return 'Politics';
  if (t.includes('business') || t.includes('economy') || t.includes('market')) return 'Business';
  if (t.includes('sports') || t.includes('game') || t.includes('tournament')) return 'Sports';
  if (t.includes('weather') || t.includes('storm') || t.includes('typhoon')) return 'Weather';
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
          pubDate: item.pubDate || '', // ✅ undefined 방지
          category: detectCategory(item.title),
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || '',
        });
      });
    } catch (error) {
      console.error(`❌ Failed to fetch RSS from ${url}:`, error);
    }
  }

  // ✅ 중복 뉴스 제거 (제목 + 링크 기준)
  const unique = Array.from(
    new Map(allItems.map((item) => [item.title + item.link, item])).values()
  );

  // ✅ 날짜 최신순 정렬
  unique.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });

  return unique;
}
