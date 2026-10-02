import React from "react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

interface ChaosButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "magenta" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const ChaosButton: React.FC<ChaosButtonProps> = ({
  children,
  variant = "primary",
  size = "lg",
  icon,
  rightIcon,
  fullWidth = true,
  disabled,
  onClick,
  className = "",
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    audio.play("click");
    haptics.trigger("light");
    onClick?.(e);
  };

  const baseStyles =
    "relative flex items-center justify-center font-display uppercase tracking-wider font-extrabold rounded-2xl transition-all duration-150 active:scale-[0.98] select-none cursor-pointer border";

  const sizeStyles = {
    sm: "px-4 py-2.5 text-sm gap-2",
    md: "px-6 py-3.5 text-base gap-2.5",
    lg: "px-6 py-4.5 text-lg gap-3 min-h-[58px]",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#FF1F4B] via-[#E11D48] to-[#BE123C] text-white border-t-[rgba(255,255,255,0.3)] border-x-transparent border-b-[#9F1239] shadow-[0_8px_25px_rgba(225,29,72,0.45)] hover:shadow-[0_10px_30px_rgba(255,31,75,0.6)]",
    secondary:
      "bg-gradient-to-r from-[#3B1F75] via-[#2A1654] to-[#1C0E38] text-white border-t-[rgba(255,255,255,0.2)] border-[rgba(168,85,247,0.3)] shadow-[0_8px_20px_rgba(168,85,247,0.25)] hover:border-[#A855F7]",
    magenta:
      "bg-gradient-to-r from-[#EC4899] via-[#DB2777] to-[#BE185D] text-white border-t-[rgba(255,255,255,0.3)] border-b-[#9D174D] shadow-[0_8px_25px_rgba(236,72,153,0.4)]",
    danger:
      "bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white border-t-[rgba(255,255,255,0.3)] shadow-[0_8px_25px_rgba(239,68,68,0.4)]",
    glass:
      "bg-[rgba(32,19,56,0.65)] backdrop-blur-md text-white border-[rgba(168,85,247,0.3)] hover:bg-[rgba(43,26,75,0.8)]",
  }[variant];

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed filter grayscale shadow-none border-gray-700 bg-gray-800 text-gray-400 active:scale-100"
    : "";

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`
        ${baseStyles}
        ${sizeStyles}
        ${variantStyles}
        ${disabledStyles}
        ${fullWidth ? "w-full" : "w-auto"}
        ${className}
      `}
    >
      {/* Top subtle gloss highlight */}
      <span className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-t-xl" />
      {icon && <span className="flex-shrink-0 text-xl">{icon}</span>}
      <span className="leading-tight text-center">{children}</span>
      {rightIcon && <span className="flex-shrink-0 ml-auto">{rightIcon}</span>}
    </button>
  );
};
