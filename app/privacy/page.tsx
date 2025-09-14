"use client"

import ProgressPopup from "@/components/shared/ProgressPopup";
import StyledBrandName from "@/components/shared/StyledBrandName";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function About() {
    const router = useRouter();
    const [isOpenP, setIsOpenP] = useState(false);
    const handleCloseP = () => {
        setIsOpenP(false);
    };
    return (
        <>
            <Head>
                <title>Privacy Policy | Tadao Market</title>
                <meta
                    name="description"
                    content="Read the privacy policy for using tadaomarket.com, our online marketplace. By accessing the site, you agree to be bound by these Privacy Policy."
                />
                <meta name="keywords" content="tadaomarket, privacy policy, Kenya e-commerce, Tadao Market policies" />
                <meta property="og:title" content="Privacy Policy | tadaomarket.com" />
                <meta property="og:description" content="Understand the privacy policy for using tadaomarket.com, your trusted marketplace in Kenya." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.tadaomarket.com/privacy" />
                <meta property="og:image" content="https://www.tadaomarket.com/assets/images/terms-and-conditions-cover.jpg" />
                <link rel="canonical" href="https://www.tadaomarket.com/privacy" />
            </Head>
            <main>
                <div>
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
                                    <StyledBrandName />
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto lg:flex-row mt-0 p-1 justify-center">
                        <div className="privacy-policy p-6 dark:text-gray-300 text-gray-800">
                            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
                            <p className="mb-4">
                                Your privacy is important to us at <strong>Tadao Market</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By using our site, you agree to the terms outlined in this policy. If you do not agree with the terms, please do not use our website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
                            <p className="mb-4">
                                <strong>Personal Data:</strong> We collect personal information when you create an account, post a listing, or contact us, including:
                            </p>
                            <ul className="list-disc list-inside ml-6 mb-4">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Phone number</li>
                                <li>Location</li>
                                <li>Listing details (e.g., category, description, price)</li>
                            </ul>

                            <p className="mb-4">
                                <strong>Usage Data:</strong> We may also collect information about how you access and use our website, including:
                            </p>
                            <ul className="list-disc list-inside ml-6 mb-4">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Pages visited on our website</li>
                                <li>Time and date of visits</li>
                                <li>Time spent on each page</li>
                                <li>Device information</li>
                            </ul>

                            <p className="mb-4">
                                <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to track user activity and enhance your experience.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
                            <p className="mb-4">We use the collected information to:</p>
                            <ul className="list-disc list-inside ml-6 mb-4">
                                <li>Create and manage your account</li>
                                <li>Facilitate listings and transactions</li>
                                <li>Communicate with you regarding your account or listings</li>
                                <li>Respond to inquiries and provide customer support</li>
                                <li>Send updates, promotions, and marketing materials (with consent)</li>
                                <li>Analyze website usage and improve our services</li>
                                <li>Protect against fraud and unauthorized activities</li>
                                <li>Comply with legal obligations</li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-2">3. Security of Your Information</h2>
                            <p className="mb-4">We take appropriate measures to protect your personal information from unauthorized access, use, or disclosure. However, no data transmission over the internet is 100% secure.</p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Data Protection Rights</h2>
                            <p className="mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside ml-6 mb-4">
                                <li>Access the personal information we hold about you</li>
                                <li>Request corrections or deletions of your data</li>
                                <li>Restrict or object to the processing of your data</li>
                                <li>Request data portability</li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to This Privacy Policy</h2>
                            <p className="mb-4">We may update this Privacy Policy from time to time. Please review it periodically.</p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">6. Account Deletion Policy</h2>
                            <p className="mb-4">If you choose to delete your account, please note the following:</p>
                            <ul className="list-disc list-inside ml-6 mb-4">
                                <li>Your account information and data will be permanently deleted and cannot be recovered.</li>
                                <li>You will no longer have access to any data or content associated with your account.</li>
                                <li>Any product listings you have posted will be removed from the website.</li>
                                <li>To delete your account: Go to &apos;Your Profile&apos;, then click the settings icon on the right side to open the settings page. Finally, click the &apos;Delete Account&apos; button.</li>
                                <li>Please contact our support team if you need assistance with account deletion.</li>
                            </ul>

                            <p className="mt-4">
                                For any questions about this Privacy Policy, please contact us at <strong><a href="mailto:support@tadaomarket.com" className="text-[#BD7A4F] hover:underline">support@tadaomarket.com</a></strong>.
                            </p>
                        </div>
                    </div>
                </div>
                <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </main>
        </>
    );
}
