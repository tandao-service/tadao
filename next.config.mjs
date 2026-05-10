import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    domains: [
      "utfs.io",
      "img.clerk.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", port: "" },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:region/houses-and-apartments-for-sale-for-sale",
        destination: "/:region/houses-and-apartments-for-sale",
        permanent: true,
      },
      {
        source: "/:region/houses-and-apartments-for-rent-for-rent",
        destination: "/:region/houses-and-apartments-for-rent",
        permanent: true,
      },
      {
        source: "/:region/:slug*-for-sale-for-sale",
        destination: "/:region/:slug*-for-sale",
        permanent: true,
      },
      {
        source: "/:region/:slug*-for-rent-for-rent",
        destination: "/:region/:slug*-for-rent",
        permanent: true,
      },
    ];
  },
};

export default nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);