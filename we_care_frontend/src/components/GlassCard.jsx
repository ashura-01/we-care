import React from "react";

const GlassCard = ({ children, className = "", ...props }) => {
  // 1. bg-white/30: Gives it that milky base.
  // 2. backdrop-blur-md: The "frosting" engine.
  // 3. border-white/40: The sharp "glass" edge.
  // 4. shadow-xl: Gives it height off the background.
  const baseGlass = `
    relative 
    overflow-hidden 
    box-border 
    backdrop-blur-[16px] 
    backdrop-saturate-[180%]
    bg-[linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.1))] 
    border border-white/40
    shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
    rounded-[24px]
  `;

  return (
    <div className={`${baseGlass} ${className}`} {...props}>
      {/* Subtle "Shine" Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.3),transparent)] opacity-40" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;