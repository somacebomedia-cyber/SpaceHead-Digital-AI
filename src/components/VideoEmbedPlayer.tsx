import React, { useState, useEffect } from "react";
import { Film, Play, Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

interface VideoEmbedPlayerProps {
  embedUrl: string;
  isDirectVideo?: boolean;
  title: string;
  category?: string;
  demoUrl?: string;
  className?: string;
  onLoaded?: () => void;
}

export default function VideoEmbedPlayer({
  embedUrl,
  isDirectVideo = false,
  title,
  category = "Video Showcase",
  demoUrl,
  className = "w-full h-full",
  onLoaded,
}: VideoEmbedPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // If iframe takes more than 7 seconds, give user option to open directly
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setLoadTimeout(false);

    const timer = setTimeout(() => {
      setLoadTimeout(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, [embedUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoaded?.();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadTimeout(false);
  };

  return (
    <div className={`relative bg-black flex items-center justify-center overflow-hidden ${className}`}>
      {/* Skeleton Loading Shimmer Placeholder */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 text-slate-300 p-6 space-y-4 animate-pulse">
          {/* Animated Video Reel Icon */}
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="text-center space-y-1 max-w-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-orange-400">
              Connecting Stream
            </p>
            <p className="text-sm font-semibold text-white truncate max-w-xs">{title}</p>
            <p className="text-[11px] text-slate-400">
              Negotiating Google Drive secure video player...
            </p>
          </div>

          {/* Shimmer line bars */}
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-orange-500 via-purple-500 to-indigo-500 animate-[shimmer_2s_infinite]" />
          </div>

          {loadTimeout && demoUrl && (
            <div className="pt-2 animate-fade-in text-center space-y-2">
              <p className="text-xs text-amber-300">Taking longer than usual?</p>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Drive</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Direct Video Element or Iframe */}
      {isDirectVideo ? (
        <video
          src={embedUrl}
          controls
          autoPlay
          playsInline
          onLoadedData={handleIframeLoad}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-contain ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        />
      ) : (
        <iframe
          src={embedUrl}
          onLoad={handleIframeLoad}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full border-none ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}

      {/* Embedding Blocked Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400" />
          <h4 className="font-display font-bold text-sm text-white">
            Embed Stream Unavailable
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            This video file has strict cookie or preview settings on Google Drive.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Drive</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
