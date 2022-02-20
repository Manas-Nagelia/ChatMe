/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/chats",
        permanent: true,
      },
      {
        source: "/chat",
        destination: "/chats",
        permanent: true,
      }
    ]
  }
};

module.exports = nextConfig
