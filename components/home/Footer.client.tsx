// components/home/Footer.tsx
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="mt-5 border-t border-gray-300 bg-white p-5 text-black dark:border-gray-700 dark:bg-[#131B1E] dark:text-[#F1F3F3]">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* About */}
                    <div>
                        <p className="mb-3 font-bold text-slate-950 dark:text-gray-400">About us</p>
                        <ul className="space-y-3">
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/about">About Tadao Market</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/terms">Terms &amp; Conditions</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/privacy-policy">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <p className="mb-3 font-bold text-slate-950 dark:text-gray-400">Support</p>
                        <ul className="space-y-3">
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <a href="mailto:support@tadaomarket.com">support@tadaomarket.com</a>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/safety-tips">Safety tips</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/faq">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Apps */}
                    <div>
                        <p className="mb-3 font-bold text-slate-950 dark:text-gray-400">Our Apps</p>
                        <ul className="space-y-3">
                            <li>
                                <Link href="https://play.google.com/store/apps/details?id=com.tadaomarket.app">
                                    <Image
                                        src="/assets/images/google-play.svg"
                                        alt="Google Play"
                                        className="w-40"
                                        width={160}
                                        height={48}
                                    />
                                </Link>
                            </li>
                            <li>
                                <Image
                                    src="/assets/images/app-store.svg"
                                    alt="App Store"
                                    className="w-40 opacity-80"
                                    width={160}
                                    height={48}
                                />
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <p className="mb-3 font-bold text-slate-950 dark:text-gray-400">Our resources</p>
                        <ul className="space-y-3">
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/social/facebook">Our Facebook</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/social/instagram">Our Instagram</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/social/youtube">Our YouTube</Link>
                            </li>
                            <li className="text-sm hover:text-[#BD7A4F]">
                                <Link href="/social/twitter">Our Twitter</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-300 pt-3 text-center dark:border-gray-700">
                    <p className="text-xs font-bold text-slate-700 dark:text-gray-400">
                        {currentYear} Tadao Market. All Rights reserved.
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600 dark:text-gray-400 md:text-xs">
                        Powered by{" "}
                        <Link className="hover:text-[#BD7A4F]" href="https://craftinventors.co.ke">
                            Craft Inventors
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}