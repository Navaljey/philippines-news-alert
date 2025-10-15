`export const metadata = {
  title: '필리핀 뉴스 알림',
  description: 'Philippines News Alert System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}`
    },
    {
      name: 'vercel.json',
      path: 'vercel.json',
      code: `{
  "crons": [{
    "path": "/cron",
    "schedule": "0 * * * *"
  }]
}`
    }
  ];

  const steps = [
    {
      title: '1. GitHub 저장소 생성',
      description: 'GitHub에 새 저장소를 만듭니다',
      link: 'https://github.com/new',
      details: [
        '저장소 이름: philippines-news-alert',
        'Public 또는 Private 선택',
        'README 추가하지 않음',
        'Create repository 클릭'
      ]
    },
    {
      title: '2. 파일 생성하기',
      description: '아래 파일들을 순서대로 생성합니다',
      isFileSection: true
    },
    {
      title: '3. Vercel 배포',
      description: 'Vercel에서 자동 배포 설정',
      link: 'https://vercel.com/new',
      details: [
        'Import Git Repository 클릭',
        '방금 만든 GitHub 저장소 선택',
        'Framework Preset: Next.js 자동 감지',
        'Deploy 클릭'
      ]
    },
    {
      title: '4. 환경 변수 설정',
      description: 'Vercel 프로젝트 설정에서 환경 변수 추가',
      details: [
        'Vercel 프로젝트 → Settings → Environment Variables',
        '아래 환경 변수들을 추가:'
      ],
      envVars: [
        { key: 'GEMINI_API_KEY', value: 'your_gemini_api_key' },
        { key: 'FIREBASE_PROJECT_ID', value: 'your_project_id' },
        { key: 'FIREBASE_PRIVATE_KEY', value: 'your_private_key' },
        { key: 'FIREBASE_CLIENT_EMAIL', value: 'your_client_email' },
        { key: 'CRON_SECRET', value: 'random_secret_string' }
      ]
    },
    {
      title: '5. 재배포',
      description: '환경 변수 추가 후 재배포',
      details: [
        'Vercel 대시보드 → Deployments 탭',
        '최신 배포 옆 ⋯ 메뉴 클릭',
        'Redeploy 선택'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🇵🇭</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                필리핀 뉴스 알림 시스템
              </h1>
              <p className="text-gray-600">GitHub + Vercel 간편 설정 가이드</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>시작하기 전에:</strong> GitHub 계정이 필요합니다. 
                  없으시면 <a href="https://github.com/join" target="_blank" rel="noopener noreferrer" className="underline">여기서 가입</a>하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {steps.map((step, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep(index)}
                className="flex-shrink-0 mt-1"
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300" />
                )}
              </button>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h2>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-4"
                  >
                    바로가기 →
                  </a>
                )}

                {step.details && (
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {step.envVars && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {step.envVars.map((env, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <code className="flex-1 bg-white px-3 py-2 rounded border">
                          {env.key}
                        </code>
                        <span className="text-gray-400">=</span>
                        <code className="flex-1 bg-white px-3 py-2 rounded border text-gray-500">
                          {env.value}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {step.isFileSection && (
                  <div className="space-y-4">
                    {files.map((file, fileIndex) => (
                      <div key={fileIndex} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                          <span className="text-white font-mono text-sm">
                            {file.path}
                          </span>
                          <button
                            onClick={() => copyToClipboard(file.code, fileIndex)}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition"
                          >
                            {copiedIndex === fileIndex ? (
                              <>
                                <Check className="w-4 h-4" />
                                복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-gray-900 p-4 overflow-x-auto">
                          <code className="text-gray-100 text-sm font-mono">
                            {file.code}
                          </code>
                        </pre>
                      </div>
                    ))}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        📝 파일 생성 방법
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                        <li>GitHub 저장소 페이지에서 <strong>Add file</strong> → <strong>Create new file</strong> 클릭</li>
                        <li>파일 경로 입력 (예: <code>package.json</code>)</li>
                        <li>폴더가 필요하면 경로에 슬래시 입력 (예: <code>lib/rss-parser.ts</code>)</li>
                        <li>위의 <strong>복사</strong> 버튼으로 코드 복사 후 붙여넣기</li>
                        <li>하단의 <strong>Commit new file</strong> 클릭</li>
                        <li>다음 파일로 반복</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🎉 완료 후 확인사항</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-200">✓</span>
              <span>Vercel 배포 URL 접속하여 홈페이지 확인</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-200">✓</span>
              <span><code className="bg-white/20 px-2 py-1 rounded">your-url.vercel.app/api/fetch-rss</code> 접속하여 RSS 수집 테스트</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-200">✓</span>
              <span>Vercel 대시보드에서 Cron Jobs 탭 확인 (1시간마다 자동 실행)</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">🔑 API 키 발급 가이드</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-400 pl-4">
              <h4 className="font-semibold mb-2">1. Gemini API 키</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a> 방문</li>
                <li>"Create API Key" 클릭</li>
                <li>생성된 키를 복사하여 Vercel 환경변수에 추가</li>
              </ol>
            </div>

            <div className="border-l-4 border-orange-400 pl-4">
              <h4 className="font-semibold mb-2">2. Firebase FCM 설정</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                <li><a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a>에서 프로젝트 생성</li>
                <li>프로젝트 설정 → 서비스 계정 탭</li>
                <li>"새 비공개 키 생성" 클릭</li>
                <li>다운로드된 JSON 파일에서 필요한 값 복사</li>
                <li>Vercel 환경변수에 추가</li>
              </ol>
            </div>

            <div className="border-l-4 border-green-400 pl-4">
              <h4 className="font-semibold mb-2">3. CRON_SECRET</h4>
              <p className="text-sm text-gray-300">
                랜덤한 문자열 생성 (예: <code className="bg-white/20 px-2 py-1 rounded">my-secret-key-12345</code>)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>문제가 발생하면 GitHub Issues에 문의하거나</p>
          <p>Vercel 대시보드의 Logs 탭에서 오류를 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}
