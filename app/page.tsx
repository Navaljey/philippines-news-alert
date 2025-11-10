'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  category: string;
  score?: number;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news);
        setLastUpdated(new Date().toLocaleString('ko-KR'));
      } else {
        setError('뉴스를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'disaster': '#f44336',
      'security': '#ff9800',
      'politics': '#2196F3',
      'clark-subic': '#4CAF50',
      'korean-community': '#9C27B0',
      'Latest News Stories': '#757575',
    };
    
    const labels: Record<string, string> = {
      'disaster': '🌪️ 재해',
      'security': '🚨 치안',
      'politics': '🏛️ 정치',
      'clark-subic': '📍 클락/수빅',
      'korean-community': '🇰🇷 한인사회',
      'Latest News Stories': '📰 최신뉴스',
    };

    return (
      <span style={{
        backgroundColor: colors[category] || '#757575',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 'bold',
      }}>
        {labels[category] || category}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {/* 헤더 */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            margin: '0 0 10px 0',
          }}>
            🇵🇭 필리핀 뉴스
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: '0 0 20px 0',
          }}>
            Inquirer.net의 최신 뉴스를 한국어로 번역하여 제공합니다
          </p>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}>
            <button
              onClick={fetchNews}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '불러오는 중...' : '🔄 새로고침'}
            </button>
            
            {lastUpdated && (
              <span style={{ color: '#999', fontSize: '14px' }}>
                마지막 업데이트: {lastUpdated}
              </span>
            )}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            color: '#c62828',
            fontWeight: 'bold',
          }}>
            ❌ {error}
          </div>
        )}

        {/* 뉴스 목록 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <div style={{ fontSize: '18px' }}>뉴스를 불러오는 중...</div>
          </div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
            <div style={{ fontSize: '18px' }}>뉴스가 없습니다</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {news.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}>
                  {getCategoryBadge(item.category)}
                  <span style={{
                    color: '#999',
                    fontSize: '14px',
                  }}>
                    {formatDate(item.pubDate)}
                  </span>
                </div>
                
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4',
                }}>
                  {item.title}
                </h2>
                
                <p style={{
                  color: '#666',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {item.contentSnippet}
                </p>
                
                {item.score !== undefined && item.score > 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#856404',
                    fontWeight: 'bold',
                  }}>
                    ⭐ 중요도: {item.score}점
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
