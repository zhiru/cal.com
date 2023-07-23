import './globals.css'
import './prism.css'
import { classNames } from '@calcom/lib'
import { Inter } from 'next/font/google'

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={classNames(
          'bg-base dark:bg-foreground min-h-screen font-sans antialiased',
          font.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}
