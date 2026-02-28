// next.config.mjs
import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "img.clerk.com", "lh3.googleusercontent.com"],
    remotePatterns: [{ protocol: "https", hostname: "utfs.io", port: "" }],
  },

  async redirects() {
    return [
      // ✅ Fix double "for-sale-for-sale"
      {
        source: "/:region/houses-and-apartments-for-sale-for-sale",
        destination: "/:region/houses-and-apartments-for-sale",
        permanent: true,
      },

      // ✅ Fix double "for-rent-for-rent" (if it exists)
      {
        source: "/:region/houses-and-apartments-for-rent-for-rent",
        destination: "/:region/houses-and-apartments-for-rent",
        permanent: true,
      },

      // ✅ generic: anything ending with -for-sale-for-sale
      {
        source: "/:region/:slug*-for-sale-for-sale",
        destination: "/:region/:slug*-for-sale",
        permanent: true,
      },

      // ✅ generic: anything ending with -for-rent-for-rent
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