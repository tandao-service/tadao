import React, { useState, useRef, useEffect, ReactNode } from "react";

interface ShowPopupProps {
  trigger: ReactNode;
  content: ReactNode;
}

const ShowPopup: React.FC<ShowPopupProps> = ({ trigger, content }) => {
  const [visible, setVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const togglePopup = () => setVisible(!visible);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible]);

  return (
    <div className="relative">
      <div onClick={togglePopup}>{trigger}</div>
      {visible && (
        <div
          ref={popupRef}
          className="absolute z-20 p-2 bg-white w-[220px] border rounded shadow-lg"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default ShowPopup;
