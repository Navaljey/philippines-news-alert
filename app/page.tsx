`export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          필리핀 뉴스 알림 시스템
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Inquirer.net의 뉴스를 수집하고 AI로 번역하여 알림을 보냅니다.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">API 엔드포인트</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /api/fetch-rss</code>
              <span className="ml-2">- RSS 피드 수집</span>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/translate</code>
              <span className="ml-2">- 뉴스 번역</span>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/notify</code>
              <span className="ml-2">- 푸시 알림 전송</span>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">GET /cron</code>
              <span className="ml-2">- 자동 크론 작업</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            다음 단계
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Vercel에서 환경 변수 설정</li>
            <li>Gemini API 키 추가</li>
            <li>Firebase FCM 설정</li>
            <li>Cron job 활성화</li>
          </ol>
        </div>
      </div>
    </main>
  );
}`
    },
    {
