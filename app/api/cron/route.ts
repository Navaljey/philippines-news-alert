import { NextRequest, NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';
import { translateToKorean, reviewAndSummarize } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job started:', new Date().toISOString());

    const rssItems = await fetchAllRSSFeeds();
    const filteredNews = filterRelevantNews(rssItems);

    // ▼▼▼ 1시간 제한 필터는 제거하고, 10점 & 5개 제한은 유지 ▼▼▼
    const recentImportantNews = filteredNews
      .filter(item => item.score >= 10) // 점수 10점 이상 조건 유지
      .slice(0, 5);                     // 최대 5개로 제한 유지
    // ▲▲▲ 수정된 부분 ▲▲▲

    console.log(`Processing ${recentImportantNews.length} news items`);

    for (const news of recentImportantNews) {
      const titleKo = await translateToKorean(news.title);
      const summary = await reviewAndSummarize(
        news.title,
        news.contentSnippet,
        news.category
      );

      console.log('Translated:', titleKo);

      // (참고) API 속도 제한을 피하기 위한 2초 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return NextResponse.json({
      success: true,
      processed: recentImportantNews.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
