import React, { useState } from "react";
import { FaTwitter } from "react-icons/fa";
import { IAd } from "@/lib/database/models/ad.model";
import Head from "next/head";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailIcon,
  EmailShareButton,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import { updateshared } from "@/lib/actions/ad.actions";

interface shareProps {
  ad: IAd;
}

const ShareAd: React.FC<shareProps> = ({ ad }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const shareUrl = `https://autoyard.co.ke/ads/${ad._id}`;
  const shareTitle = `${ad.title}, Price: Ksh ${ad.price}`;
  const shareDescription = ad.description;
  const imageUrl = ad.imageUrls[0];
  const handleShare = async () => {
    //console.log(`Shared via ${platform}`);
    const shared = (Number(ad.shared ?? "0") + 1).toString();
    const _id = ad._id;
    await updateshared({
      _id,
      shared,
      path: `/ads/${ad._id}`,
    });
    // You can add any analytics or event tracking here
  };
  return (
    <>
      <Head>
        <meta property="og:title" content={ad.title} />
        <meta property="og:description" content={ad.description} />
        <meta property="og:image" content={ad.imageUrls[0]} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Autoyard" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ad.title} />
        <meta name="twitter:description" content={ad.description} />
        <meta name="twitter:image" content={ad.imageUrls[0]} />
        <meta name="twitter:url" content={shareUrl} />
      </Head>
      <div className="flex gap-1 w-full p-1">
        <FacebookShareButton
          url={shareUrl}
          title={shareTitle}
          quote={shareDescription} // Facebook uses 'quote' for description
          hashtag="" // Optionally add a hashtag
          onClick={() => handleShare()}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={`${shareTitle}\n${shareDescription}`} // WhatsApp uses 'title' as the shared message
          separator=": " // Separator between title and URL
          onClick={() => handleShare()}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={`${shareTitle}\n${shareDescription}`} // Twitter uses 'title' for the tweet content
          hashtags={[]} // Optionally add hashtags
          onClick={() => handleShare()}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={shareTitle} // Email uses 'subject' for the email subject
          body={shareDescription} // Email uses 'body' for the email content
          onClick={() => handleShare()}
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareAd;
