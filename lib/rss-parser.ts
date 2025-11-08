// RSS 피드 가져오기 및 번역
export async function fetchAllRSSFeeds() {
  try {
    console.log('🔥🔥🔥 fetchAllRSSFeeds CALLED!');
    console.log('🔥 GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('🔥 GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
    
    console.log('🔄 Starting to fetch RSS feed from:', RSS_URL);
    const feed = await parser.parseURL(RSS_URL);
    console.log(`📰 Fetched ${feed.items.length} items from RSS`);
    
    // 처음 2개만 번역 (빠른 테스트)
    const itemsToTranslate = feed.items.slice(0, 2);
    console.log(`🌐 Will translate ${itemsToTranslate.length} items`);
    
    const newsPromises = itemsToTranslate.map(async (item, index) => {
      const title = item.title || '';
      const content = item.contentSnippet || item.content || '';
      
      console.log(`[${index + 1}] 🔵 BEFORE Translation - Title: ${title.substring(0, 50)}`);
      
      const translatedTitle = await translateToKorean(title);
      const translatedContent = await translateToKorean(content);
      
      console.log(`[${index + 1}] 🟢 AFTER Translation - Title: ${translatedTitle.substring(0, 50)}`);
      
      return {
        title: translatedTitle,
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: translatedContent,
        contentSnippet: translatedContent,
        category: item.categories?.[0] || 'General',
        guid: item.guid || item.link || '',
      };
    });

    const news = await Promise.all(newsPromises);
    console.log(`✅ Successfully processed ${news.length} news items with translations`);
    console.log(`🟢 First item title after all: ${news[0]?.title.substring(0, 50)}`);
    return news;
  } catch (error) {
    console.error('❌ Error fetching Philippine news:', error);
    throw error;
  }
}
