/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['mui-one-time-password-input'],
  env: {
    NEXT_PUBLIC_API_URL: process?.env?.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_APP_URL: process?.env?.NEXT_PUBLIC_APP_URL || '',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // async redirects() {
  //     return [
  //         {
  //             source: '/',
  //             destination: '/wallet',
  //             permanent: true,
  //         },
  //     ]
  // },
}

export default nextConfig
