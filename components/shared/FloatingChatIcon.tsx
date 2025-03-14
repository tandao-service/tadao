// components/FloatingChatIcon.js

import React from "react";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
interface FloatingChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}
const FloatingChatIcon: React.FC<FloatingChatIconProps> = ({
  onClick,
  isOpen,
}) => {
  return (
    <div
      className="fixed bottom-20 lg:bottom-10 right-1 lg:right-5 bg-green-600 w-14 h-14 flex justify-center items-center rounded-full cursor-pointer z-10"
      onClick={onClick}
    >
      <div className="w-10 h-10 flex text-white items-center justify-center rounded-full bg-green-600 tooltip tooltip-bottom hover:cursor-pointer">
        {isOpen === true ? (
          <>
            <KeyboardArrowDownOutlinedIcon />
          </>
        ) : (
          <>
            <QuestionAnswerOutlinedIcon />
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingChatIcon;
