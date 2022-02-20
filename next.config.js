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
        destination: "/",
        permanent: true,
      },
      {
        source: "/chat",
        destination: "/",
        permanent: true,
      },
      {
        source: "/chats",
        destination: "/",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/account",
        permanent: true,
      }
    ]
  }
};

module.exports = nextConfig
