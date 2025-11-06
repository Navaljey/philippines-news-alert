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

async function translateToKorean(text: string): Promise<string> {
  try {
    console.log('Translating text:', text.substring(0, 50) + '...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return text;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Translate the following English text to Korean. Only provide the translation, nothing else:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();
    
    console.log('Translation successful');
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function fetchAllRSSFeeds() {
  const RSS_URL = 'https://newsinfo.inquirer.net/feed';
  
  try {
    const feed = await parser.parseURL(RSS_URL);
    
    const newsPromises = feed.items.slice(0, 50).map(async (item) => {
      const title = item.title || '';
      const content = item.contentSnippet || item.content || '';
      
      const translatedTitle = await translateToKorean(title);
      const translatedContent = await translateToKorean(content);
      
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
    return news;
  } catch (error) {
    console.error('Error fetching Philippine news:', error);
    throw error;
  }
}
