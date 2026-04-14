import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EcomBuild Analytics',
  description: 'Dashboard de analytics para ecommerce COD — Ecom Build Academy',
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
