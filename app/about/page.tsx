"use client"
import ProgressPopup from "@/components/shared/ProgressPopup";
import StyledBrandName from "@/components/shared/StyledBrandName";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function About() {
    const router = useRouter();
    const [isOpenP, setIsOpenP] = useState(false);
    const handleCloseP = () => {
        setIsOpenP(false);
    };
    return (
        <>
            <Head>
                <title>About Tadao | Kenya&apos;s Smart Marketplace</title>
                <meta
                    name="description"
                    content="Learn about tadaomarket.com, Kenya's growing marketplace for online shopping and product listings. From electronics to home goods, we make buying and selling seamless."
                />
                <meta property="og:title" content="About tadaomarket.com | Kenya's Smart Marketplace" />
                <meta
                    property="og:description"
                    content="At Tadao, we connect buyers and sellers across diverse categories with transparency and convenience."
                />
                <meta property="og:image" content="/assets/images/logo.png" />
                <meta property="og:url" content="https://tadaomarket.com/about" />
                <meta property="og:type" content="website" />
                <meta name="keywords" content="Tadao, online shopping Kenya, sell products, e-commerce, buy online" />
                <meta name="author" content="Tadao" />
                <link rel="canonical" href="https://www.tadaomarket.com/about" />
            </Head>

            <main> <div className="flex-1">
                <div
                    className={`bg-gradient-to-b from-orange-500 to-orange-500 lg:from-gray-100 justify-center pl-2 pr-2 h-[60px] lg:to-gray-100 transition-all duration-300 overflow-visible w-full flex flex-col items-center`}
                >
                    <div className="w-full h-full justify-between flex items-center">
                        <div className="flex items-center gap-1">

                            <div
                                className="mr-2 w-5 h-8 flex text-white lg:text-gray-700 items-center justify-center rounded-sm tooltip tooltip-bottom hover:cursor-pointer lg:hover:text-orange-500"
                                data-tip="Back"
                                onClick={() => {
                                    setIsOpenP(true);
                                    router.push("/");
                                }}
                            >

                                <ArrowBackOutlinedIcon />

                            </div>

                            <div className="flex items-center gap-2">

                                <img src="/logo_white.png" alt="Logo" className="w-8 h-8 lg:hidden rounded-full" />
                                <img src="/logo.png" alt="Logo" className="w-8 h-8 hidden lg:inline rounded-full" />
                                <StyledBrandName />
                            </div>

                        </div>

                    </div>
                </div>
                <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
                    <div className="max-w-4xl mx-auto p-8">
                        <h1 className="text-3xl font-bold dark:text-gray-400 text-gray-800 mb-6 text-center">
                            About Tadao
                        </h1>

                        <div className="space-y-6 dark:text-gray-300 text-gray-700">
                            <p className="text-lg">
                                Welcome to <span className="font-semibold text-orange-500">Tadao</span>, Kenya&apos;s growing online
                                marketplace for discovering and selling a wide range of goods. From home appliances and electronics to fashion,
                                books, beauty products, and much more - we&apos;re here to simplify your online shopping experience.
                            </p>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Our Mission</h2>
                                <p>
                                    Our mission at tadaomarket.com is to empower Kenyans with a simple, secure, and smart way to shop and sell
                                    online. We believe everyone should have access to a modern digital marketplace that is trustworthy and easy to use.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">
                                    Why Tadao?
                                </h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><span className="font-semibold">Broad Categories</span>: From everyday items to specialty goods, find it all in one place.</li>
                                    <li><span className="font-semibold">Trusted Listings</span>: We promote accurate product descriptions and fair transactions.</li>
                                    <li><span className="font-semibold">Secure Platform</span>: We prioritize your safety with industry-standard security and clear guidelines.</li>
                                    <li><span className="font-semibold">Quick Communication</span>: Sellers and buyers can chat directly and close deals faster.</li>
                                    <li><span className="font-semibold">Community Support</span>: Join a growing ecosystem of sellers, shoppers, and local businesses.</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Our Journey</h2>
                                <p>
                                    Tadao was created with the goal of uplifting online commerce in Kenya. Since our start, we&apos;ve grown by
                                    listening to our users and delivering a reliable and evolving marketplace platform.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold dark:text-gray-400 text-gray-800 mb-4">Be a Part of Us</h2>
                                <p>
                                    Whether you&apos;re a small business, reseller, or buyer looking for quality and value - Tadao is made for you.
                                    Thank you for supporting our vision to build a smarter marketplace in Kenya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </main>
        </>
    );
}
