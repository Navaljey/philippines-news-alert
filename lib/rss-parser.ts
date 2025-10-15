import Parser from 'rss-parser';
import { RSSItem } from '@/types/news';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['dc:creator', 'creator']
    ]
  }
});

export async function fetchInquirerRSS(): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL('https://www.inquirer.net/feed');
    
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
  } catch (error) {
    console.error('RSS fetch error:', error);
    throw new Error('Unable to fetch RSS feed');
  }
}

export async function fetchAllRSSFeeds(): Promise<RSSItem[]> {
  const feeds = await Promise.allSettled([
    fetchInquirerRSS()
  ]);

  const allItems: RSSItem[] = [];
  
  feeds.forEach(result => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  });

  return allItems.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}
