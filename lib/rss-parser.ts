import Parser from 'rss-parser';
import { RSSItem } from '@/types/news';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['dc:creator', 'creator']
    ]
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 10000
});

// Inquirer.net RSS 피드
export async function fetchInquirerRSS(): Promise<RSSItem[]> {
  const urls = [
    'https://www.inquirer.net/feed',
    'https://newsinfo.inquirer.net/feed',
    'https://globalnation.inquirer.net/feed',
    'https://business.inquirer.net/feed'
  ];
  
  for (const url of urls) {
    try {
      console.log(`[Inquirer] Trying: ${url}`);
      const feed = await parser.parseURL(url);
      
      if (feed.items && feed.items.length > 0) {
        console.log(`[Inquirer] ✓ Success! Got ${feed.items.length} items from ${url}`);
        return feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.content || item['content:encoded'] || '',
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || item.link || '',
          categories: item.categories || [],
          creator: item.creator || item['dc:creator'] || ''
        }));
      }
    } catch (err) {
      console.log(`[Inquirer] ✗ Failed ${url}:`, err instanceof Error ? err.message : String(err));
    }
  }
  
  console.error('[Inquirer] All URLs failed');
  return [];
}

// PhilStar RSS 피드
export async function fetchPhilStarRSS(): Promise<RSSItem[]> {
  const urls = [
    'https://www.philstar.com/rss/headlines',
    'https://www.philstar.com/rss/news',
    'https://www.philstar.com/rss/nation'
  ];
  
  for (const url of urls) {
    try {
      console.log(`[PhilStar] Trying: ${url}`);
      const feed = await parser.parseURL(url);
      
      if (feed.items && feed.items.length > 0) {
        console.log(`[PhilStar] ✓ Success! Got ${feed.items.length} items from ${url}`);
        return feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.content || item['content:encoded'] || '',
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || item.link || '',
          categories: item.categories || [],
          creator: item.creator || item['dc:creator'] || ''
        }));
      }
    } catch (err) {
      console.log(`[PhilStar] ✗ Failed ${url}:`, err instanceof Error ? err.message : String(err));
    }
  }
  
  console.error('[PhilStar] All URLs failed');
  return [];
}

// Rappler RSS 피드
export async function fetchRapplerRSS(): Promise<RSSItem[]> {
  const urls = [
    'https://www.rappler.com/feed/',
    'https://www.rappler.com/nation/feed/',
    'https://www.rappler.com/newsbreak/feed/'
  ];
  
  for (const url of urls) {
    try {
      console.log(`[Rappler] Trying: ${url}`);
      const feed = await parser.parseURL(url);
      
      if (feed.items && feed.items.length > 0) {
        console.log(`[Rappler] ✓ Success! Got ${feed.items.length} items from ${url}`);
        return feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.content || item['content:encoded'] || '',
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || item.link || '',
          categories: item.categories || [],
          creator: item.creator || item['dc:creator'] || ''
        }));
      }
    } catch (err) {
      console.log(`[Rappler] ✗ Failed ${url}:`, err instanceof Error ? err.message : String(err));
    }
  }
  
  console.error('[Rappler] All URLs failed');
  return [];
}

// GMA News RSS 피드
export async function fetchGMANewsRSS(): Promise<RSSItem[]> {
  const urls = [
    'https://data.gmanetwork.com/gno/rss/news/feed.xml',
    'https://data.gmanetwork.com/gno/rss/topstories/feed.xml'
  ];
  
  for (const url of urls) {
    try {
      console.log(`[GMA News] Trying: ${url}`);
      const feed = await parser.parseURL(url);
      
      if (feed.items && feed.items.length > 0) {
        console.log(`[GMA News] ✓ Success! Got ${feed.items.length} items from ${url}`);
        return feed.items.map(item => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.content || item['content:encoded'] || '',
          contentSnippet: item.contentSnippet || '',
          guid: item.guid || item.link || '',
          categories: item.categories || [],
          creator: item.creator || item['dc:creator'] || ''
        }));
      }
    } catch (err) {
      console.log(`[GMA News] ✗ Failed ${url}:`, err instanceof Error ? err.message : String(err));
    }
  }
  
  console.error('[GMA News] All URLs failed');
  return [];
}

// 모든 RSS 피드 수집
export async function fetchAllRSSFeeds(): Promise<RSSItem[]> {
  console.log('=== Starting RSS Feed Collection ===');
  
  const feeds = await Promise.allSettled([
    fetchInquirerRSS(),
    fetchPhilStarRSS(),
    fetchRapplerRSS(),
    fetchGMANewsRSS()
  ]);

  const allItems: RSSItem[] = [];
  let successCount = 0;
  
  feeds.forEach((result, index) => {
    const sources = ['Inquirer', 'PhilStar', 'Rappler', 'GMA News'];
    if (result.status === 'fulfilled' && result.value.length > 0) {
      allItems.push(...result.value);
      successCount++;
      console.log(`✓ ${sources[index]}: ${result.value.length} items`);
    } else {
      console.log(`✗ ${sources[index]}: Failed or 0 items`);
    }
  });

  console.log(`=== Total: ${allItems.length} items from ${successCount} sources ===`);

  // 중복 제거 (같은 URL은 하나만)
  const uniqueItems = Array.from(
    new Map(allItems.map(item => [item.link, item])).values()
  );

  console.log(`=== After deduplication: ${uniqueItems.length} unique items ===`);

  return uniqueItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
