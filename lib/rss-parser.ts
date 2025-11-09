import Parser from 'rss-parser';

interface CustomFeed {
  title?: string;
  description?: string;
}

interface CustomItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  guid?: string;
}

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: ['content', 'contentSnippet', 'guid']
  }
});

const RSS_URL = 'https://newsinfo.inquirer.net/feed';

// REST API 직접 호출 방식으로 번역
async function translateToKorean(text: string): Promise<{translated: string, debug: any}> {
  const debugInfo: any = {
    input: text.substring(0, 50),
    hasApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    method: 'REST API Direct Call',
  };
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      debugInfo.error = 'GEMINI_API_KEY is not set';
      return { translated: text, debug: debugInfo };
    }

    // Gemini REST API 직접 호출 (v1 API에서 지원하는 모델 사용)
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    debugInfo.step1 = 'Calling REST API';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following English text to Korean. Only provide the translation, nothing else:\n\n${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      })
    });

    debugInfo.step2 = `Response status: ${response.status}`;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    debugInfo.step3 = 'Parsing response';

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from API');
    }

    const translatedText = data.candidates[0].content.parts[0].text;
    
    debugInfo.success = true;
    debugInfo.output = translatedText.substring(0, 50);
    debugInfo.outputLength = translatedText.length;
    
    return { translated: translatedText, debug: debugInfo };
  } catch (error: any) {
    debugInfo.error = error.message || String(error);
    debugInfo.errorType = error.constructor?.name || 'Unknown';
    return { translated: text, debug: debugInfo };
  }
}

// RSS 피드 가져오기 및 번역
export async function fetchAllRSSFeeds() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    
    const itemsToTranslate = feed.items.slice(0, 2);
    const translatedNews = [];
    
    for (let i = 0; i < itemsToTranslate.length; i++) {
      const item = itemsToTranslate[i];
      const title = item.title || '';
      const content = item.contentSnippet || item.content || '';
      
      const titleResult = await translateToKorean(title);
      const contentResult = await translateToKorean(content);
      
      translatedNews.push({
        title: titleResult.translated,
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: contentResult.translated,
        contentSnippet: contentResult.translated,
        category: item.categories?.[0] || 'General',
        guid: item.guid || item.link || '',
        _debug: {
          original: {
            title: title.substring(0, 60),
            content: content.substring(0, 60),
          },
          translated: {
            title: titleResult.translated.substring(0, 60),
            content: contentResult.translated.substring(0, 60),
          },
          translationDebug: {
            title: titleResult.debug,
            content: contentResult.debug,
          }
        }
      });
    }
    
    return translatedNews;
  } catch (error) {
    console.error('Error in fetchAllRSSFeeds:', error);
    throw error;
  }
}
