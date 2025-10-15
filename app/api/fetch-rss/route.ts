import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';

export async function GET() {
  try {
    const rssItems = await fetchAllRSSFeeds();
    const filteredNews = filterRelevantNews(rssItems);
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentNews = filteredNews.filter(item => 
      new Date(item.pubDate) > oneDayAgo
    );

    return NextResponse.json({
      success: true,
      count: recentNews.length,
      news: recentNews.slice(0, 20),
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch RSS' },
      { status: 500 }
    );
  }
}
