import React from "react";
import logoImg from "../assets/images/spacehead_logo_permanent.png";

interface SpaceHeadLogoProps {
  className?: string;
  size?: number | string;
}

export default function SpaceHeadLogo({ className = "", size }: SpaceHeadLogoProps) {
  const dimension = size ? (typeof size === "number" ? `${size}px` : size) : undefined;

  return (
    <img
      src={logoImg}
      alt="SpaceHead AI Logo"
      style={dimension ? { width: dimension, height: dimension } : undefined}
      className={`select-none object-contain block shrink-0 ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
