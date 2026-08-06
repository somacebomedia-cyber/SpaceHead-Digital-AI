import React, { useState } from "react";
import logoImg from "../assets/images/spacehead_logo_permanent.png";

const DRIVE_LOGO_URL = "https://lh3.googleusercontent.com/d/1aYFdInKHl4tZbEEyQzyVemoENf1AkzBl=w800";

interface SpaceHeadLogoProps {
  className?: string;
  size?: number | string;
}

export default function SpaceHeadLogo({ className = "", size }: SpaceHeadLogoProps) {
  const [imgSrc, setImgSrc] = useState<string>(DRIVE_LOGO_URL);
  const [failedCount, setFailedCount] = useState<number>(0);

  const dimension = size ? (typeof size === "number" ? `${size}px` : size) : undefined;
  const dimensionStyle = dimension ? { width: dimension, height: dimension } : undefined;

  const handleError = () => {
    if (failedCount === 0) {
      setImgSrc(logoImg);
      setFailedCount(1);
    } else if (failedCount === 1) {
      setImgSrc("/logo.png");
      setFailedCount(2);
    } else {
      setFailedCount(3);
    }
  };

  if (failedCount >= 3) {
    return (
      <div 
        style={dimensionStyle}
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-500 p-1.5 shadow-md shadow-purple-500/20 shrink-0 ${className}`}
        aria-label="SpaceHead AI Logo"
      >
        <span className="text-white font-bold text-sm tracking-wider uppercase px-2 py-1">SpaceHead</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt="SpaceHead AI Logo"
      onError={handleError}
      style={dimensionStyle}
      className={`select-none object-contain block shrink-0 ${className}`}
      referrerPolicy="no-referrer"
    />
  );
}
