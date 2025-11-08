export async function fetchAllRSSFeeds() {
  const debugInfo: any = {
    logs: [],
    hasApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
  };
  
  try {
    debugInfo.logs.push('Starting RSS fetch');
    
    const feed = await parser.parseURL(RSS_URL);
    debugInfo.logs.push(`Fetched ${feed.items.length} items`);
    
    const itemsToTranslate = feed.items.slice(0, 2);
    debugInfo.logs.push(`Will translate ${itemsToTranslate.length} items`);
    
    const translatedNews = [];
    
    for (let i = 0; i < itemsToTranslate.length; i++) {
      const item = itemsToTranslate[i];
      const title = item.title || '';
      
      debugInfo.logs.push(`[${i + 1}] Original: ${title.substring(0, 40)}`);
      
      const translatedTitle = await translateToKorean(title);
      
      debugInfo.logs.push(`[${i + 1}] Translated: ${translatedTitle.substring(0, 40)}`);
      
      translatedNews.push({
        title: translatedTitle,
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.contentSnippet || '',
        contentSnippet: item.contentSnippet || '',
        category: item.categories?.[0] || 'General',
        guid: item.guid || item.link || '',
        _debug: {
          originalTitle: title.substring(0, 60),
          translatedTitle: translatedTitle.substring(0, 60),
        }
      });
    }

    debugInfo.logs.push('Translation complete');
    console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
    
    return translatedNews;
  } catch (error) {
    debugInfo.logs.push(`ERROR: ${String(error)}`);
    debugInfo.error = String(error);
    console.error('fetchAllRSSFeeds error:', debugInfo);
    throw error;
  }
}
