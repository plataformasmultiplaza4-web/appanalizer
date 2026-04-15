import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcomBuild Analizer',
  description: 'Dashboard de analytics para ecommerce — EcomBuild',
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
