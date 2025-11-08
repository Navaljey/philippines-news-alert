import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';

export async function GET() {
  try {
    console.log('🔄 Fetching and translating news feed...');
    
    // RSS 피드 가져오기 (번역 포함) - 이미 한국어로 번역됨
    const translatedNews = await fetchAllRSSFeeds();
    console.log(`📰 Fetched and translated ${translatedNews.length} items`);
    
    // 필터링 없이 번역된 뉴스 그대로 반환
    return NextResponse.json({
      success: true,
      count: translatedNews.length,
      news: translatedNews,
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
