import React from "react";

interface ChaosLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  withGlow?: boolean;
}

export const ChaosLogo: React.FC<ChaosLogoProps> = ({
  size = "lg",
  className = "",
  withGlow = true,
}) => {
  const sizeClasses = {
    xs: "h-6 w-auto",
    sm: "h-9 w-auto",
    md: "h-14 w-auto",
    lg: "h-24 w-auto md:h-28",
    xl: "h-36 w-auto md:h-44",
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl pointer-events-none scale-125" />
      )}
      <img
        src="/logo-transparent.png"
        alt="CHAOS"
        className={`relative z-10 object-contain drop-shadow-[0_8px_24px_rgba(255,0,56,0.6)] ${sizeClasses[size]}`}
      />
    </div>
  );
};

