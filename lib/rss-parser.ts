import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// 번역 함수 - 디버그 정보 추가
async function translateToKorean(text: string): Promise<{translated: string, debug: any}> {
  const debugInfo: any = {
    input: text.substring(0, 50),
    hasApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
  };
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      debugInfo.error = 'GEMINI_API_KEY is not set';
      return { translated: text, debug: debugInfo };
    }

    debugInfo.step1 = 'Creating Gemini client';
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    debugInfo.step2 = 'Getting model';
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    debugInfo.step3 = 'Generating content';
    const prompt = `Translate the following English text to Korean. Only provide the translation, nothing else:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    debugInfo.step4 = 'Getting response';
    
    const response = await result.response;
    debugInfo.step5 = 'Getting text';
    
    const translatedText = response.text();
    debugInfo.output = translatedText.substring(0, 50);
    debugInfo.success = true;
    
    return { translated: translatedText, debug: debugInfo };
  } catch (error: any) {
    debugInfo.error = error.message || String(error);
    debugInfo.errorDetails = {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 200)
    };
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
