import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Standalone output for Node.js deployment (Hostinger, VPS, Docker)
  output: 'standalone',
  images: { unoptimized: true },
}

export default nextConfig
