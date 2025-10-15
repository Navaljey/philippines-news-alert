`import { NextRequest, NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';
import { filterRelevantNews } from '@/lib/filter';
import { translateToKorean, reviewAndSummarize } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job started:', new Date().toISOString());

    const rssItems = await fetchAllRSSFeeds();
    const filteredNews = filterRelevantNews(rssItems);
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentImportantNews = filteredNews
      .filter(item => new Date(item.pubDate) > oneHourAgo)
      .filter(item => item.score >= 10)
      .slice(0, 5);

    console.log(\`Processing \${recentImportantNews.length} news items\`);

    for (const news of recentImportantNews) {
      const titleKo = await translateToKorean(news.title);
      const summary = await reviewAndSummarize(
        news.title,
        news.contentSnippet,
        news.category
      );

      console.log('Translated:', titleKo);
      
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
}`
    },
    {
