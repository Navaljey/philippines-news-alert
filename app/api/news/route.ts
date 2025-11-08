import { NextResponse } from 'next/server';
import { fetchAllRSSFeeds } from '@/lib/rss-parser';

export async function GET() {
  const debugLogs: string[] = [];
  
  try {
    debugLogs.push('Step 1: API called');
    
    debugLogs.push('Step 2: Calling fetchAllRSSFeeds...');
    const translatedNews = await fetchAllRSSFeeds();
    
    debugLogs.push(`Step 3: Got ${translatedNews.length} items`);
    debugLogs.push(`First item title: ${translatedNews[0]?.title.substring(0, 60)}`);
    
    return NextResponse.json({
      success: true,
      count: translatedNews.length,
      news: translatedNews,
      debug: debugLogs,
    });
  } catch (error) {
    debugLogs.push(`ERROR: ${String(error)}`);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        details: String(error),
        debug: debugLogs,
      },
      { status: 500 }
    );
  }
}
