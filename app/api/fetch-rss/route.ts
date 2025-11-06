import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';

export async function GET() {
  try {
    const rssItems = await fetchAllRSSFeeds();
    const filteredNews = filterRelevantNews(rssItems);

    return NextResponse.json({
      success: true,
      count: filteredNews.length,
      news: filteredNews.slice(0, 20),
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch RSS' },
      { status: 500 }
    );
  }
}
