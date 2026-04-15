import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcomBuild Analizer Metrics',
  description: 'Dashboard de analytics para ecommerce — EcomBuild Analizer Metrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
