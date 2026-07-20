import React from "react";

interface SpaceHeadLogoProps {
  className?: string;
  size?: number | string;
}

export default function SpaceHeadLogo({ className = "", size }: SpaceHeadLogoProps) {
  const dimension = size ? (typeof size === "number" ? `${size}px` : size) : undefined;
  
  // Use absolute path served from the public/ folder in development and copied to dist/client in production
  const imgSrc = "/logo.png";

  return (
    <img
      src={imgSrc}
      alt="SpaceHead AI Logo"
      style={dimension ? { width: dimension, height: dimension } : undefined}
      className={`select-none object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
