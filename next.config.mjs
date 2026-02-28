// next.config.mjs
import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "img.clerk.com", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },

  async redirects() {
    return [
      // ✅ fix duplicated SEO slugs (old indexed URLs)
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

      // ✅ generic pattern for any "-for-sale-for-sale" -> "-for-sale"
      {
        source: "/:region/:listingSlug*-for-sale-for-sale",
        destination: "/:region/:listingSlug*-for-sale",
        permanent: true,
      },
      // ✅ generic pattern for any "-for-rent-for-rent" -> "-for-rent"
      {
        source: "/:region/:listingSlug*-for-rent-for-rent",
        destination: "/:region/:listingSlug*-for-rent",
        permanent: true,
      },
    ];
  },

  // Add additional PWA configuration if needed
};

export default nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);