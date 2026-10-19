import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Maximize2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Volume2,
  AlertCircle,
  Loader2,
  Film,
} from "lucide-react";
import { Project } from "../types";
import { whatsappLinkWithMessage, CONTACT_PHONE_DISPLAY } from "../lib/contactInfo";

interface VideoLightboxModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function getEmbedVideoDetails(url?: string, category?: string): {
  isVideo: boolean;
  embedUrl?: string;
  isDirectVideo?: boolean;
  rawDriveId?: string;
  sourceType: "drive" | "youtube" | "vimeo" | "direct" | "unknown";
} {
  if (!url) return { isVideo: false, sourceType: "unknown" };

  const isAnimatedVideoCat = category === "Animated Videos";

  // Google Drive file link
  const driveMatch = url.match(
    /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) {
    const fileId = driveMatch[1];
    return {
      isVideo: true,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      rawDriveId: fileId,
      sourceType: "drive",
    };
  }

  // YouTube match
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) {
    return {
      isVideo: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      sourceType: "youtube",
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch) {
    return {
      isVideo: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      sourceType: "vimeo",
    };
  }

  // Direct video extensions
  const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
  if (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".mov")
  ) {
    return {
      isVideo: true,
      isDirectVideo: true,
      embedUrl: url,
      sourceType: "direct",
    };
  }

  if (isAnimatedVideoCat) {
    return {
      isVideo: true,
      embedUrl: url,
      sourceType: "unknown",
    };
  }

  return { isVideo: false, sourceType: "unknown" };
}

export default function VideoLightboxModal({
  project,
  isOpen,
  onClose,
}: VideoLightboxModalProps) {
  const [aspectRatioMode, setAspectRatioMode] = useState<"auto" | "16-9" | "9-16">("auto");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset loading state when project changes
  useEffect(() => {
    if (project) {
      setIsLoading(true);
      setLoadError(false);
      // Auto-detect portrait hint from tags or title
      const isPortrait =
        project.tags.some((t) => /reel|tiktok|status|portrait|9:16|story/i.test(t)) ||
        /reel|portrait|status|shorts/i.test(project.title);
      setAspectRatioMode(isPortrait ? "9-16" : "auto");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const videoDetails = getEmbedVideoDetails(project.demoUrl, project.category);
  const whatsappUrl = whatsappLinkWithMessage(
    `Hi SpaceHead AI, I just watched your video reel "${project.title}" and would like to get a quote for a promotional video advert for my business.`
  );

  return (
    <div
      id="video-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      {/* Background Dimming Click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Cinema Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[95vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-white">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 flex-shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3
                id="video-modal-title"
                className="font-display font-bold text-sm sm:text-base text-white truncate"
              >
                {project.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 truncate">
                <span>{project.category}</span>
                <span>•</span>
                <span className="text-orange-400">Cinematic Preview</span>
              </p>
            </div>
          </div>

          {/* Controls: Aspect Ratio + Close */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Aspect Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setAspectRatioMode("auto")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  aspectRatioMode === "auto"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Default Responsive Fit"
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setAspectRatioMode("16-9")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  aspectRatioMode === "16-9"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="16:9 Widescreen (YouTube & Desktop)"
              >
                <Monitor className="w-3 h-3" />
                <span>16:9</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatioMode("9-16")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  aspectRatioMode === "9-16"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="9:16 Portrait (WhatsApp Status, Reels, TikTok)"
              >
                <Smartphone className="w-3 h-3" />
                <span>9:16</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[460px] max-h-[68vh] overflow-hidden">
          {/* Subtle Stage Backlight Glow */}
          <div className="absolute inset-0 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 text-slate-300 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-xs font-mono tracking-wider uppercase text-slate-400">
                Buffering video stream...
              </p>
            </div>
          )}

          {/* Player Embed Container */}
          <div
            className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
              aspectRatioMode === "9-16"
                ? "max-w-sm aspect-[9/16] my-2"
                : aspectRatioMode === "16-9"
                ? "max-w-4xl aspect-video"
                : "w-full aspect-video"
            }`}
          >
            {videoDetails.isVideo ? (
              videoDetails.isDirectVideo ? (
                <video
                  ref={videoRef}
                  src={videoDetails.embedUrl}
                  controls
                  autoPlay
                  playsInline
                  onLoadedData={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setLoadError(true);
                  }}
                  className="w-full h-full max-h-[64vh] object-contain rounded-lg"
                />
              ) : (
                <iframe
                  src={videoDetails.embedUrl}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setLoadError(true);
                  }}
                  className="w-full h-full max-h-[64vh] border-none rounded-lg shadow-2xl"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              )
            ) : project.imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  onLoad={() => setIsLoading(false)}
                  className="max-h-[64vh] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Film className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">No video stream preview available for this asset.</p>
              </div>
            )}
          </div>

          {/* Fallback Notice if drive preview has embed restrictions */}
          {loadError && (
            <div className="absolute inset-x-4 bottom-4 z-20 bg-slate-900/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Video preview requires Google Drive direct authorization.</span>
              </div>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white text-slate-900 rounded-lg font-bold text-xs hover:bg-slate-100"
                >
                  Open in Drive
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control & Conversion Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-800/80 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
                title="Open Source Video File"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Original File</span>
              </a>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get a Video Advert (WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
