// app/tadao-home/page.tsx  (or pages/tadao-home.tsx if using pages router)

import { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Tadao | Buy & Sell Online in Kenya",
    description:
        "Tadao — Kenya's growing online marketplace for discovering and selling a wide range of goods. From electronics to fashion, simplify your online shopping.",
    keywords: [
        "Tadao",
        "tadaomarket",
        "Buy and sell Kenya",
        "Kenya marketplace",
        "online marketplace Kenya",
        "shop Kenya",
        "sell online Kenya",
    ],
    openGraph: {
        title: "Tadao | Buy & Sell Online in Kenya",
        description:
            "Discover Tadao — a trusted, simple, and secure marketplace for Kenyans. Buy and sell electronics, fashion, home goods and more.",
        url: "https://tadaomarket.com",
        siteName: "Tadao",
        type: "website",
        images: [
            {
                url: "https://tadaomarket.com/assets/og-image.png",
                width: 1200,
                height: 630,
                alt: "Tadao - Online Marketplace in Kenya",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Tadao | Buy & Sell Online in Kenya",
        description:
            "Shop and sell on Tadao — simple, secure, and community driven marketplace for Kenya.",
        images: ["https://tadaomarket.com/assets/og-image.png"],
    },
    alternates: {
        canonical: "https://tadaomarket.com",
    },
};

export default function TadaoHomePage() {
    const year = new Date().getFullYear();

    return (
        <>
            <Head>
                <link rel="canonical" href="https://tadaomarket.com" />

                {/* Organization structured data */}
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Tadao",
                            url: "https://tadaomarket.com",
                            logo: "https://tadaomarket.com/logo.png",
                            sameAs: [
                                "https://www.facebook.com/tadaomarket",
                                "https://www.instagram.com/tadaomarket",
                                "https://twitter.com/tadaomarket",
                            ],
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: "+254700000000",
                                contactType: "customer service",
                                areaServed: "KE",
                                availableLanguage: ["English", "Swahili"],
                            },
                        }),
                    }}
                />

                {/* WebSite structured data with search action */}
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "Tadao",
                            url: "https://tadaomarket.com",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://tadaomarket.com/search?q={search_term_string}",
                                "query-input": "required name=search_term_string",
                            },
                        }),
                    }}
                />
            </Head>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Hero */}
                <section className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Tadao
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Kenya&apos;s growing online marketplace - buy and sell a wide range of
                            quality goods. From electronics and appliances to fashion, books,
                            and beauty products, Tadao makes online shopping simple and
                            secure.
                        </p>

                        <div className="flex gap-3">
                            <a
                                className="inline-block bg-orange-500 text-white px-5 py-3 rounded-lg shadow hover:bg-orange-600"
                                href="/"
                            >
                                Shop Now
                            </a>
                            <a
                                className="inline-block border border-orange-500 text-orange-500 px-5 py-3 rounded-lg hover:bg-orange-50"
                                href="/"
                            >
                                Sell on Tadao
                            </a>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        {/* Example hero image placeholder — replace with your asset */}
                        <div className="relative h-48 md:h-56 rounded-lg overflow-hidden shadow">
                            <Image
                                src="/assets/logo.png"
                                alt="Tadao marketplace"
                                fill
                                style={{ objectFit: "cover" }}
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                    <p className="text-gray-700">
                        At tadaomarket.com our mission is to empower Kenyans with a
                        simple, secure, and smart way to shop and sell online. We believe
                        everyone deserves access to a trustworthy and modern digital
                        marketplace.
                    </p>
                </section>

                {/* Why choose us */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">Why Tadao?</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>
                            <strong>Broad Categories:</strong> From everyday items to
                            specialty goods - find it all.
                        </li>
                        <li>
                            <strong>Trusted Listings:</strong> Clear descriptions and fair
                            transactions.
                        </li>
                        <li>
                            <strong>Secure Platform:</strong> Industry-standard security and
                            straightforward policies.
                        </li>
                        <li>
                            <strong>Quick Communication:</strong> Sellers and buyers can chat
                            directly to close deals faster.
                        </li>
                        <li>
                            <strong>Community Support:</strong> Join a growing ecosystem of
                            local sellers and small businesses.
                        </li>
                    </ul>
                </section>

                {/* Our Journey */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-3">Our Journey</h2>
                    <p className="text-gray-700">
                        Tadao was created to uplift online commerce in Kenya.
                        Since launch, we&apos;ve grown by listening to users and continuously
                        improving the marketplace experience for both buyers and sellers.
                    </p>
                </section>

                {/* CTA */}
                <section className="mb-8 bg-gray-50 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-2">Be a Part of Us</h3>
                    <p className="text-gray-700 mb-4">
                        Whether you&apos;re a small business, reseller, or buyer looking for
                        value - Tadao is made for you.
                    </p>
                    <div>
                        <a
                            href="/"
                            className="inline-block bg-orange-500 text-white px-5 py-3 rounded-lg shadow hover:bg-orange-600"
                        >
                            Join Now
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center mt-12 text-sm text-gray-500">
                    &copy; {year} Tadao. All rights reserved.
                </footer>
            </main>
        </>
    );
}
