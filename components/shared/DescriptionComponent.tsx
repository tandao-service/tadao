import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

const DescriptionComponent: React.FC<{ description: string }> = ({
  description,
}) => {
  const [showMore, setShowMore] = useState(false);
  const charLimit = 500; // Character limit for truncation

  const toggleShowMore = () => setShowMore(!showMore);
  const safeMessage = sanitizeHtml(description); // Removes harmful scripts

  // Apply truncation after sanitization
  const truncatedMessage =
    safeMessage.length > charLimit && !showMore
      ? `${safeMessage.slice(0, charLimit)}...`
      : safeMessage;

  return (
    <div>
      <p className="my-1 dark:text-gray-300 text-emerald-950">
        <span dangerouslySetInnerHTML={{ __html: truncatedMessage }} />
      </p>
      {safeMessage.length > charLimit && (
        <button
          onClick={toggleShowMore}
          className="text-emerald-600 hover:underline"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default DescriptionComponent;
