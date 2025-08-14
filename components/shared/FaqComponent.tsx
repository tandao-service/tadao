"use client";

import Navbar from "@/components/shared/navbar";
import Head from "next/head";
import Footersub from "@/components/shared/Footersub";
import { useEffect, useState } from "react";
import { mode } from "@/constants";

interface Props {
  userId: string;
  user: any;
  handleOpenSell: () => void;
  handleOpenBook: () => void;
  handleOpenPlan: () => void;
  handleOpenChat: () => void;
  onClose: () => void;
  handleOpenAbout: () => void;
  handleOpenTerms: () => void;
  handleOpenPrivacy: () => void;
  handleOpenSafety: () => void;
  handleOpenPerfomance: () => void;
  handleOpenSettings: () => void;
  handleOpenShop: (shopId: any) => void;
}

const FaqComponent = ({
  userId,
  user,
  handleOpenPerfomance,
  handleOpenSettings,
  handleOpenShop,
  handleOpenSell,
  handleOpenBook,
  handleOpenChat,
  handleOpenPlan,
  onClose,
  handleOpenAbout,
  handleOpenTerms,
  handleOpenPrivacy,
  handleOpenSafety,
}: Props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || mode;
    const isDark = savedTheme === mode;
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle(mode, isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode === null) return;
    document.documentElement.classList.toggle(mode, isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  if (isDarkMode === null) return null;

  return (
    <div className="h-[100vh] bg-gray-100 p-0 dark:bg-[#131B1E] text-black dark:text-[#F1F3F3] overflow-hidden">
      <div className="h-full overflow-y-auto bg-gray-100 border">
        <style jsx>{`
          @media (max-width: 1024px) {
            div::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>
        <Head>
          <title>Frequently Asked Questions | tadaomarket.com</title>
          <meta
            name="description"
            content="Find answers to common questions about using tadaomarket.com, including how to post a product, contact sellers, and more."
          />
          <meta name="keywords" content="Tadao, FAQ, frequently asked questions, product marketplace, post a product, contact seller" />
          <meta property="og:title" content="Frequently Asked Questions | Tadao" />
          <meta property="og:description" content="Get help with common questions about posting products, contacting sellers, and managing your listings on Tadao." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.tadaomarket.com/faq" />
          <meta property="og:image" content="https://www.tadaomarket.com/assets/images/faq-cover.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Frequently Asked Questions | tadaomarket.com" />
          <meta name="twitter:description" content="Find answers to your questions about posting products and using Tadao. Learn more about our marketplace." />
          <meta name="twitter:image" content="https://www.tadaomarket.com/assets/images/faq-cover.jpg" />
          <link rel="canonical" href="https://www.tadaomarket.com/faq" />
        </Head>

        <div className="top-0 z-10 fixed w-full">
          <Navbar
            user={user}
            userstatus={user.status}
            userId={userId}
            onClose={onClose}
            popup="faq"
            handleOpenSell={handleOpenSell}
            handleOpenBook={handleOpenBook}
            handleOpenPlan={handleOpenPlan}
            handleOpenChat={handleOpenChat}
            handleOpenPerfomance={handleOpenPerfomance}
            handleOpenSettings={handleOpenSettings}
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
            handleOpenShop={handleOpenShop}
          />
        </div>

        <div className="max-w-3xl mx-auto flex mt-20 p-1">
          <div className="flex-1">
            <div className="rounded-[20px] dark:bg-[#2D3236] bg-white max-w-6xl mx-auto p-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-400 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    1. How can I list my product on Tadao?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    To list your product, sign up or log in, go to the &apos;Sell&apos; section, fill in the required information, upload clear photos, set a price, and submit your listing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    2. Is it free to post a product listing?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Yes, standard product listings are free. However, we offer optional premium upgrades for increased visibility at a small fee.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    3. How do I contact a seller?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can message the seller directly using the in-platform chat or use the contact information provided on the listing page.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    4. What should I do if I find a suspicious listing?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you suspect fraud or inappropriate content, click the &apos;Report&apos; button on the listing page. Our team will review and act accordingly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    5. How can I update or delete my listing?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Log in to your account, go to &apos;My Listings&apos;, select the listing, and choose to update or remove it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#BD7A4F] mb-2">
                    6. Can I get a refund for a premium listing?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Refund eligibility depends on our refund policy. Please check the policy details or reach out to customer support for guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <Footersub
            handleOpenAbout={handleOpenAbout}
            handleOpenTerms={handleOpenTerms}
            handleOpenPrivacy={handleOpenPrivacy}
            handleOpenSafety={handleOpenSafety}
          />
        </footer>
      </div>
    </div>
  );
};

export default FaqComponent;
