/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig