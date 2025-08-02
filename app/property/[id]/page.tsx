import { getAdById } from '@/lib/actions/dynamicAd.actions';
import { notFound } from 'next/navigation';
import Head from 'next/head';

type Props = {
    params: {
        id: string;
    };
};

export default async function PropertyPage({ params: { id } }: Props) {
    const ad = await getAdById(id);

    if (!ad) {
        return (
            <>
                <Head>
                    <title>Property Not Found | mapa.co.ke</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <main className="p-6 text-center">
                    <h1 className="text-2xl font-bold">Property not found</h1>
                    <p>Please check the URL or search again.</p>
                </main>
            </>
        );
    }

    const {
        data: {
            title,
            description,
            price,
            imageUrl = [],
            propertyadrea = {},
        } = {},
        category = 'Real Estate',
        _id,
    } = ad;

    const displayImage = imageUrl[0] || '/fallback.jpg';
    const displayTitle = title || 'Property Details';
    const location = propertyadrea.myaddress || 'Kenya';

    return (
        <>
            <Head>
                <title>{displayTitle} - {category} | mapa.co.ke</title>
                <meta name="description" content={description || 'Find properties for sale or rent in Kenya on mapa.co.ke'} />
                <meta name="keywords" content={`${category}, ${location}, mapa.co.ke`} />
                <meta property="og:title" content={displayTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={displayImage} />
                <meta property="og:url" content={`https://mapa.co.ke/property/${_id}`} />
                <link rel="canonical" href={`https://mapa.co.ke/property/${_id}`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Residence",
                            name: displayTitle,
                            description,
                            image: displayImage,
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: location,
                            },
                            offers: {
                                "@type": "Offer",
                                priceCurrency: "KES",
                                price,
                                availability: "https://schema.org/InStock",
                            },
                        }),
                    }}
                />
            </Head>

            <main className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-2">{displayTitle}</h1>
                <p className="mb-4">{description}</p>
                <img
                    src={displayImage}
                    alt={displayTitle}
                    className="w-full max-w-2xl object-cover rounded-lg shadow"
                />
                <p className="mt-4 font-semibold">Price: KSh {price?.toLocaleString()}</p>
                <p>Location: {location}</p>
            </main>
        </>
    );
}
