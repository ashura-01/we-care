import React from "react";
import { Link } from "react-router-dom";

const PillButton = ({ children, to, className = "", ...props }) => {
  const basePill = "inline-block border-none rounded-full bg-[linear-gradient(to_right,#046ea3,#90e0cc)] bg-[length:200%_100%] text-white text-[14px] font-bold tracking-[0.2px] cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-right hover:text-[#0d404b] text-center no-underline";

  if (to) {
    return (
      <Link to={to} className={`${basePill} ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${basePill} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default PillButton;