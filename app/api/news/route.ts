import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';

export async function GET() {
  try {
    console.log('🔄 Fetching news feed...');
    
    // RSS 피드 가져오기 (번역 포함)
    const rssItems = await fetchAllRSSFeeds();
    console.log(`📰 Fetched ${rssItems.length} items`);
    
    // 필터링 (선택사항)
    const filteredNews = filterRelevantNews(rssItems);
    console.log(`✅ Filtered to ${filteredNews.length} relevant items`);
    
    return NextResponse.json({
      success: true,
      count: filteredNews.length,
      totalRaw: rssItems.length,
      news: filteredNews.slice(0, 50), // 최대 50개
    });
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        details: String(error)
      },
      { status: 500 }
    );
  }
}
