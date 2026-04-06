/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig