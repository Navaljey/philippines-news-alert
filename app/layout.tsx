export const metadata = {
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
}
