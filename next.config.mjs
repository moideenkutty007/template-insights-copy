/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/reports',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/reports',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
