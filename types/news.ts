export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories?: string[];
  creator?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleKo: string;
  link: string;
  publishedAt: Date;
  content: string;
  contentKo: string;
  source: string;
  category: NewsCategory;
  relevanceScore: number;
}

export type NewsCategory = 
  | 'korean-community'
  | 'security'
  | 'disaster'
  | 'clark-subic'
  | 'politics'
  | 'general';

export interface FilterKeywords {
  koreanCommunity: string[];
  security: string[];
  disaster: string[];
  clarkSubic: string[];
  politics: string[];
}
