import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

const CopyShareAdLink = ({ _id, titleId }: { _id: string, titleId: string }) => {
  const [copied, setCopied] = useState(false);

  const adUrl = process.env.NEXT_PUBLIC_DOMAIN_URL + "property/" + _id;
  const handleCopy = () => {
    navigator.clipboard.writeText(adUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this " + titleId + "!",
          url: adUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="w-full flex gap-1 items-center justify-between">
      <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
        <Copy size={16} /> {copied ? "Copied!" : "Copy " + titleId + " Link"}
      </Button>
      <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
        <Share2 size={16} /> Share {titleId} Link
      </Button>
    </div>
  );
};

export default CopyShareAdLink;
