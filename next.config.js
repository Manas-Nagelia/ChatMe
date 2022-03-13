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
      },
      {
        source: "/signup",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/auth",
        permanent: true,
      },
    ]
  }
};

module.exports = nextConfig
