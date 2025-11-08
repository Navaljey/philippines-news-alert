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

// 번역 함수
async function translateToKorean(text: string): Promise<string> {
  try {
    console.log('>>> Translating text (first 50 chars):', text.substring(0, 50));
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('ERROR: GEMINI_API_KEY is not set');
      return text;
    }

    console.log('>>> GEMINI_API_KEY exists, length:', process.env.GEMINI_API_KEY.length);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following English text to Korean. Only provide the translation, nothing else:\n\n${text}`;
    
    console.log('>>> Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    
    console.log('>>> Translation successful (first 50 chars):', translatedText.substring(0, 50));
    return translatedText;
  } catch (error) {
    console.error('ERROR during translation:', error);
    return text;
  }
}

// RSS 피드 가져오기 및 번역
export async function fetchAllRSSFeeds() {
  try {
    console.log('========================================');
    console.log('STEP 1: Starting RSS fetch');
    console.log('RSS URL:', RSS_URL);
    console.log('Has GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY);
    console.log('========================================');
    
    const feed = await parser.parseURL(RSS_URL);
    console.log('STEP 2: RSS fetched, total items:', feed.items.length);
    
    // 처음 2개만 번역 (빠른 테스트)
    const itemsToTranslate = feed.items.slice(0, 2);
    console.log('STEP 3: Will translate', itemsToTranslate.length, 'items');
    
    const translatedNews = [];
    
    for (let i = 0; i < itemsToTranslate.length; i++) {
      const item = itemsToTranslate[i];
      const title = item.title || '';
      const content = item.contentSnippet || item.content || '';
      
      console.log('========================================');
      console.log(`Item ${i + 1}/${itemsToTranslate.length}`);
      console.log('Original title:', title.substring(0, 60));
      console.log('========================================');
      
      const translatedTitle = await translateToKorean(title);
      const translatedContent = await translateToKorean(content);
      
      console.log('Translated title:', translatedTitle.substring(0, 60));
      
      translatedNews.push({
        title: translatedTitle,
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: translatedContent,
        contentSnippet: translatedContent,
        category: item.categories?.[0] || 'General',
        guid: item.guid || item.link || '',
      });
    }

    console.log('========================================');
    console.log('STEP 4: Translation complete');
    console.log('Total translated items:', translatedNews.length);
    console.log('First item title:', translatedNews[0]?.title.substring(0, 60));
    console.log('========================================');
    
    return translatedNews;
  } catch (error) {
    console.error('ERROR in fetchAllRSSFeeds:', error);
    throw error;
  }
}
