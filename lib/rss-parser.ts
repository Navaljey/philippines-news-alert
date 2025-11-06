import Parser from 'rss-parser';

// RSS 파서 초기화 (확장 필드 포함)
const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

// 수집할 RSS 피드 목록 (필리핀 주요 카테고리별)
const RSS_FEEDS = [
  { url: 'https://newsinfo.inquirer.net/feed', category: 'news' },
  { url: 'https://business.inquirer.net/feed', category: 'business' },
  { url: 'https://entertainment.inquirer.net/feed', category: 'entertainment' },
  { url: 'https://lifestyle.inquirer.net/feed', category: 'lifestyle' },
  { url: 'https://technology.inquirer.net/feed', category: 'technology' },
  { url: 'https://sports.inquirer.net/feed', category: 'sports' },
];

// 메인 함수: 모든 RSS 수집 + 정리
export async function fetchAllRSSFeeds() {
  const allItems: any[] = [];

  for (const { url, category } of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      console.log(`✅ [${category}] fetched ${feed.items.length} items from ${url}`);

      feed.items.forEach((item) => {
        const content =
          item.contentEncoded ||
          item.content ||
          item.description ||
          '';

        allItems.push({
          title: item.title?.trim() || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: cleanContent(content),
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || item.link || '',
          isoDate: item.isoDate || '',
          source: feed.title || '',
          category, // ← 카테고리 자동 부여
        });
      });
    } catch (err) {
      console.error(`❌ Failed to fetch ${url}:`, err);
    }
  }

  // ✅ 중복 제거
  const uniqueItems = deduplicateNews(allItems);

  console.log(`📰 Total fetched: ${allItems.length}, unique: ${uniqueItems.length}`);

  return uniqueItems;
}

// ✅ HTML 정리 함수
function cleanContent(rawHtml: string): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<[^>]*>/g, ' ') // HTML 태그 제거
    .replace(/\s+/g, ' ') // 공백 정리
    .trim();
}

// ✅ 중복 뉴스 제거 함수
function deduplicateNews(items: any[]): any[] {
  const seen = new Set<string>();
  const unique: any[] = [];

  for (const item of items) {
    const key = (item.title + item.link).toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}

