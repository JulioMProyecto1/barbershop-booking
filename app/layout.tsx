import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Taller de Belleza Los Vega',
  description: 'With <3 to Andrea',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
