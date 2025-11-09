'use client';

import { useState } from 'react';

export default function TestFCM() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    if (!token.trim()) {
      setResult('❌ FCM 토큰을 입력해주세요');
      return;
    }

    setLoading(true);
    setResult('전송 중...');

    try {
      const response = await fetch('/api/test-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult('✅ 알림 전송 성공!');
      } else {
        setResult(`❌ 실패: ${data.error || data.message}`);
      }
    } catch (error) {
      setResult(`❌ 에러: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🔔 FCM 푸시 알림 테스트</h1>
      
      <div style={{ marginTop: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          FCM 토큰 입력:
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="여기에 FCM 토큰을 붙여넣으세요..."
          style={{
            width: '100%',
            height: '120px',
            padding: '10px',
            fontSize: '14px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <button
        onClick={sendTestNotification}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? '전송 중...' : '테스트 알림 보내기'}
      </button>

      {result && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: result.includes('✅') ? '#e8f5e9' : '#ffebee',
          border: `2px solid ${result.includes('✅') ? '#4CAF50' : '#f44336'}`,
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📱 FCM 토큰 얻는 방법</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Android/iOS 앱에서 Firebase Cloud Messaging 설정</li>
          <li>앱 실행 시 FCM 토큰 생성</li>
          <li>생성된 토큰을 복사해서 위 입력란에 붙여넣기</li>
          <li>"테스트 알림 보내기" 버튼 클릭</li>
        </ol>
      </div>
    </div>
  );
}
