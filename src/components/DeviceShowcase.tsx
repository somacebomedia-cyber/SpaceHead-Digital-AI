import React, { useState } from "react";
import deviceShowcaseImg1 from "../assets/images/device_showcase.png";
import deviceShowcaseImg2 from "../assets/images/device_showcase_2.png";

const DRIVE_LAPTOP_URL = "https://lh3.googleusercontent.com/d/1rHsxS2G3u-DGo9GQAoUWTUwtCHFJhLNi=w1000";
const DRIVE_PHONE_URL = "https://lh3.googleusercontent.com/d/1CqzQa8KAES-QPJq6twhVTUCpew47JLNX=w1000";

interface DeviceShowcaseProps {
  macbookSrc?: string;
  iphoneSrc?: string;
}

/**
 * Hero device showcase displaying dual device renders with Google Drive sources and robust fallbacks.
 */
export default function DeviceShowcase({
  macbookSrc,
  iphoneSrc,
}: DeviceShowcaseProps) {
  // Primary Laptop Fallback Chain: Prop -> Drive URL -> Imported Asset -> Public Path
  const primarySources = [
    macbookSrc,
    DRIVE_LAPTOP_URL,
    deviceShowcaseImg1,
    "/images/hero/macbook-open.png",
    "/images/hero/drive_device.png"
  ].filter(Boolean) as string[];

  // Secondary Phone Fallback Chain: Prop -> Drive URL -> Imported Asset -> Public Path
  const secondarySources = [
    iphoneSrc,
    DRIVE_PHONE_URL,
    deviceShowcaseImg2,
    "/images/hero/iphone-front.png",
    "/images/hero/device_2.png"
  ].filter(Boolean) as string[];

  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(0);

  const handlePrimaryError = () => {
    if (primaryIndex < primarySources.length - 1) {
      setPrimaryIndex((prev) => prev + 1);
    }
  };

  const handleSecondaryError = () => {
    if (secondaryIndex < secondarySources.length - 1) {
      setSecondaryIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[380px] lg:min-h-[460px] py-6">
      {/* Soft backdrop glow panel */}
      <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Primary Main Device */}
      <div className="relative w-[280px] sm:w-[380px] lg:w-[420px] aspect-[16/10] flex items-center justify-center transition-transform duration-500 hover:scale-[1.02] z-10">
        <img
          src={primarySources[primaryIndex]}
          alt="SpaceHead Desktop Platform Render"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)] rounded-2xl transition-opacity duration-300"
          onError={handlePrimaryError}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Secondary Overlapping Mobile Device */}
      <div className="absolute -bottom-2 -right-2 sm:right-4 w-[160px] sm:w-[220px] lg:w-[240px] aspect-[9/18.5] flex items-center justify-center transition-transform duration-500 hover:scale-105 z-20">
        <img
          src={secondarySources[secondaryIndex]}
          alt="SpaceHead Mobile App Render"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] rounded-2xl transition-opacity duration-300"
          onError={handleSecondaryError}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

