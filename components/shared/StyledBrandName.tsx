import React from "react";

const StyledBrandName: React.FC = () => {
  return (
    <h1 className="flex items-center gap-2 text-lg lg:text-xl font-bold text-white tracking-wide">
      <img src="/logo_white.png" alt="Tadao Logo" className="w-7 h-7" />
      <span className="bg-clip-text text-transparent bg-gradient-to-r to-white from-white">
        Tadao
      </span>
    </h1>
  );
};

export default StyledBrandName;
