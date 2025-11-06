import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';

export async function GET() {
  try {
    const rssItems = await fetchAllRSSFeeds();
    
    // 디버깅: 필터 없이 전체 뉴스 반환
    return NextResponse.json({
      success: true,
      count: rssItems.length,
      totalRaw: rssItems.length,
      news: rssItems.slice(0, 5),  // 처음 5개만
      sample: rssItems[0]  // 첫 번째 뉴스 샘플
    });
  } catch (error) {
    console.error('RSS fetch error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
