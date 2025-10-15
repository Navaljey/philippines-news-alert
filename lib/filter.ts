import { RSSItem, NewsCategory, FilterKeywords } from '@/types/news';

export const FILTER_KEYWORDS: FilterKeywords = {
  koreanCommunity: [
    'korean', 'korea', 'korean community', 'korean national',
    'korean business', 'korean restaurant', 'korean expat',
    'south korea', 'korean embassy'
  ],
  security: [
    'crime', 'robbery', 'theft', 'murder', 'assault', 'kidnap',
    'police', 'arrest', 'shooting', 'drugs', 'violence',
    'security', 'safety', 'scam', 'fraud'
  ],
  disaster: [
    'typhoon', 'earthquake', 'flood', 'storm', 'weather',
    'disaster', 'evacuate', 'landslide', 'tsunami', 'volcano',
    'pagasa', 'rainfall', 'tropical depression'
  ],
  clarkSubic: [
    'clark', 'subic', 'pampanga', 'angeles city', 'olongapo',
    'clark freeport', 'subic bay', 'dmia', 'clark airport'
  ],
  politics: [
    'marcos', 'duterte', 'senate', 'congress', 'government',
    'president', 'election', 'law', 'bill',
    'bongbong marcos', 'sara duterte', 'legislative'
  ]
};

export function categorizeNews(item: RSSItem): NewsCategory {
  const text = `${item.title} ${item.contentSnippet}`.toLowerCase();
  
  if (matchKeywords(text, FILTER_KEYWORDS.koreanCommunity)) {
    return 'korean-community';
  }
  if (matchKeywords(text, FILTER_KEYWORDS.security)) {
    return 'security';
  }
  if (matchKeywords(text, FILTER_KEYWORDS.disaster)) {
    return 'disaster';
  }
  if (matchKeywords(text, FILTER_KEYWORDS.clarkSubic)) {
    return 'clark-subic';
  }
  if (matchKeywords(text, FILTER_KEYWORDS.politics)) {
    return 'politics';
  }
  
  return 'general';
}

function matchKeywords(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

export function calculateRelevanceScore(item: RSSItem, category: NewsCategory): number {
  if (category === 'general') return 0;
  
  const text = `${item.title} ${item.contentSnippet}`.toLowerCase();
  let score = 0;
  
  const categoryKeywords = FILTER_KEYWORDS[
    category === 'korean-community' ? 'koreanCommunity' :
    category === 'clark-subic' ? 'clarkSubic' : category
  ];
  
  categoryKeywords.forEach(keyword => {
    if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 10;
    } else if (text.includes(keyword.toLowerCase())) {
      score += 5;
    }
  });
  
  return score;
}

export function filterRelevantNews(items: RSSItem[]): Array<RSSItem & { category: NewsCategory; score: number }> {
  return items
    .map(item => {
      const category = categorizeNews(item);
      const score = calculateRelevanceScore(item, category);
      return { ...item, category, score };
    })
    .filter(item => item.category !== 'general' || item.score > 0)
    .sort((a, b) => b.score - a.score);
}
