import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FaveU フィードバック',
  description: 'FaveUへのフィードバック収集と管理',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%237c3aed"/><text x="50" y="65" font-size="60" font-weight="bold" text-anchor="middle" fill="white">F</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
