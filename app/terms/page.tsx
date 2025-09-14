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
                <title>Terms and Conditions | Tadao Market</title>
                <meta
                    name="description"
                    content="Read the terms and conditions for using tadaomarket.com, our online marketplace. By accessing the site, you agree to be bound by these terms."
                />
                <meta name="keywords" content="tadaomarket, terms and conditions, Kenya e-commerce, Tadao Market policies" />
                <meta property="og:title" content="Terms and Conditions | tadaomarket.com" />
                <meta property="og:description" content="Understand the terms and conditions for using tadaomarket.com, your trusted marketplace in Kenya." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.tadaomarket.com/terms" />
                <meta property="og:image" content="https://www.tadaomarket.com/assets/images/terms-and-conditions-cover.jpg" />
                <link rel="canonical" href="https://www.tadaomarket.com/terms" />
            </Head>
            <main>
                <div>
                    <div
                        className={`bg-gradient-to-b from-orange-500 to-orange-500 justify-center pl-2 pr-2 h-[60px] transition-all duration-300 overflow-visible w-full flex flex-col items-center`}
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
                        <div className="border rounded-lg dark:bg-[#2D3236] bg-white max-w-6xl mx-auto p-6">
                            <h1 className="text-2xl font-bold mb-4 dark:text-gray-400">Terms and Conditions</h1>
                            <p className="mb-4">
                                Welcome to <strong>Tadao Market</strong>! By using our website, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree to these terms, you should not use this website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
                            <p className="mb-4">
                                By accessing and using Tadao Market, you accept and agree to be bound by these terms. Any posted guidelines or rules applicable to our services may be updated periodically and are incorporated into these Terms of Service.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">2. User Obligations</h2>
                            <p className="mb-4">
                                Users agree to provide accurate and complete information when listing products or services. You must not post any misleading or false information, and you are responsible for ensuring that all listings comply with applicable laws and regulations.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">3. Listing Guidelines</h2>
                            <p className="mb-4">
                                Products or services must be listed in the correct categories with accurate descriptions. We reserve the right to remove any listings that are misleading, inappropriate, or violate our rules.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">4. Payment and Fees</h2>
                            <p className="mb-4">
                                We may charge fees for certain services, such as premium listings. Charges will always be clearly communicated before you make any payment.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">5. No Guarantee of Sale</h2>
                            <p className="mb-4">
                                We do not guarantee the sale of your listed item or service. Transactions are handled directly between buyers and sellers.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">6. User Conduct</h2>
                            <ul className="list-disc ml-6 mb-4">
                                <li>Do not post illegal, fraudulent, or offensive content.</li>
                                <li>No harassment or abusive behavior toward others.</li>
                                <li>Do not attempt to disrupt or hack the platform.</li>
                            </ul>

                            <h2 className="text-xl font-semibold mt-6 mb-2">7. Intellectual Property</h2>
                            <p className="mb-4">
                                All site content belongs to Tadao Market or its content creators. Do not reproduce or reuse any content without written permission.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">8. Limitation of Liability</h2>
                            <p className="mb-4">
                                We are not liable for any damages resulting from the use of our website.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">9. Changes to Terms</h2>
                            <p className="mb-4">
                                We may modify these terms at any time. Changes will be posted on this page. Continued use means you accept the updated terms.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">10. Governing Law</h2>
                            <p className="mb-4">
                                These terms are governed by the laws of Kenya. Any disputes will be handled in Kenyan courts.
                            </p>

                            <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact</h2>
                            <p className="mb-4">
                                For any questions, contact us at <a className="text-orange-500 hover:underline" href="mailto:support@tadaomarket.com">support@tadaomarket.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
                <ProgressPopup isOpen={isOpenP} onClose={handleCloseP} />
            </main>
        </>
    );
}
