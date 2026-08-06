import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Wand2, 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Video, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX, 
  Palette, 
  Check, 
  Loader2, 
  CreditCard, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  RefreshCw,
  Sparkle,
  Zap,
  Lock,
  Unlock,
  X,
  CheckCircle2,
  Tag
} from "lucide-react";
import SEO from "./SEO";
import { initiatePayfastPayment } from "../lib/payfastClient";

interface LogoStudioProps {
  onTabChange: (tab: string) => void;
}

interface LogoVariation {
  id: string;
  name: string;
  tagline: string;
  style: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  iconType: "shield" | "rocket" | "hexagon" | "circle" | "gem" | "flame" | "leaf";
  imageUrl?: string;
  svgContent?: string;
}

interface PendingCheckout {
  type: "logo" | "animation";
  id: string;
  title: string;
  price: number;
  itemDescription: string;
  features: string[];
  actionFn: () => void;
}

const INDUSTRY_OPTIONS = [
  "Tech & AI",
  "Coffee & Restaurant",
  "Fitness & Sports",
  "Beauty & Cosmetics",
  "Real Estate & Property",
  "Fashion & Apparel",
  "Finance & Investment",
  "Logistics & Transport",
  "Media & Entertainment",
  "Preschool & Education"
];

const STYLE_ARCHETYPES = [
  { id: "3d-metallic", label: "3D Metallic Emblem", desc: "Bold chrome reflections, deep shadows & metallic shine" },
  { id: "minimalist-luxury", label: "Minimalist Luxury", desc: "Crisp golden ratio typography, delicate linework" },
  { id: "cyber-neon", label: "Cyberpunk Neon Monogram", desc: "High-voltage neon outlines, futuristic geometric font" },
  { id: "mascot-badge", label: "Bold Shield Badge", desc: "Impactful crest, strong outer borders, corporate trust" },
  { id: "organic-leaf", label: "Organic Natural Gradient", desc: "Fluid curves, vibrant natural gradients, eco aesthetic" }
];

const COLOR_PALETTES = [
  { name: "SpaceHead Cyber", primary: "#6366F1", secondary: "#8B5CF6", bg: "#0F172A" },
  { name: "Royal Gold & Onyx", primary: "#F59E0B", secondary: "#D97706", bg: "#020617" },
  { name: "Emerald Sunset", primary: "#10B981", secondary: "#3B82F6", bg: "#052E16" },
  { name: "Rose Neon Quartz", primary: "#EC4899", secondary: "#8B5CF6", bg: "#18020C" },
  { name: "Clean Slate Studio", primary: "#0F172A", secondary: "#475569", bg: "#F8FAFC" }
];

const ANIMATION_PRESETS = [
  { 
    id: "streak-laser", 
    name: "Light Streak Laser Reveal", 
    desc: "A glowing energy laser traces the logo outline with trailing light sparks before a full radiant flash.",
    icon: Zap 
  },
  { 
    id: "metallic-sheen", 
    name: "3D Metallic Reflection", 
    desc: "Specular chrome sheen sweeps diagonally across metallic bevels with spatial lighting sweep.",
    icon: Sparkle 
  },
  { 
    id: "cosmic-orbit", 
    name: "Cosmic Orbital Ring", 
    desc: "Dual neon glowing rings rotate in 3D perspective, expanding into a starry particle burst.",
    icon: Sparkles 
  },
  { 
    id: "cyber-glitch", 
    name: "Cyberpunk Glitch Pulse", 
    desc: "High-voltage cyan & magenta outline flicker with digital scanline slice effects.",
    icon: Sliders 
  },
  { 
    id: "fluid-splash", 
    name: "Fluid Ripple Splash", 
    desc: "Liquid wave swells outwards around the logo icon with water droplet particles.",
    icon: RefreshCw 
  },
  { 
    id: "warp-zoom", 
    name: "Hyper-Speed Warp Entrance", 
    desc: "Logo zooms in from deep space hyper-drive with cosmic speed lines and lens flare.",
    icon: ArrowRight 
  }
];

export default function LogoStudio({ onTabChange }: LogoStudioProps) {
  const [activeTab, setActiveTab] = useState<"create" | "animate">("create");

  // Logo Creation State
  const [businessName, setBusinessName] = useState("SpaceHead");
  const [tagline, setTagline] = useState("AI Marketing & Web");
  const [industry, setIndustry] = useState("Tech & AI");
  const [selectedStyle, setSelectedStyle] = useState("3d-metallic");
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [vibePrompt, setVibePrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<LogoVariation[]>([]);

  // Animation Studio State
  const [activeLogoImage, setActiveLogoImage] = useState<string | null>(null);
  const [activeLogoName, setActiveLogoName] = useState("SpaceHead Logo");
  const [selectedPreset, setSelectedPreset] = useState("streak-laser");
  const [isPlaying, setIsPlaying] = useState(true);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(75);
  const [particleDensity, setParticleDensity] = useState(60);
  const [bgStyle, setBgStyle] = useState<"dark" | "onyx" | "light" | "purple">("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Recording & Video State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Unlocked Products State (State set of IDs unlocked after purchase or demo trigger)
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);
  const [isProcessingPayfast, setIsProcessingPayfast] = useState(false);

  // Free Regeneration Limit State
  const MAX_FREE_REGENERATIONS = 5;
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);

  const hasUnlimitedRegenerations = unlockedItems.includes("unlimited-regenerations");
  const remainingRegenerations = Math.max(0, MAX_FREE_REGENERATIONS - generationCount);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Initial Sample Generator on Mount
  useEffect(() => {
    generateDefaultVariations("SpaceHead", "AI Marketing & Web", selectedPalette);
  }, []);

  const generateDefaultVariations = (name: string, tag: string, palette: typeof COLOR_PALETTES[0]) => {
    const icons: Array<LogoVariation["iconType"]> = ["rocket", "shield", "hexagon", "gem"];
    const styles = ["3D Metallic", "Cyber Neon", "Minimalist Luxury", "Bold Badge"];
    
    const mockVariations: LogoVariation[] = icons.map((icon, idx) => ({
      id: `logo-${Date.now()}-${idx}`,
      name: name || "Brand",
      tagline: tag || "",
      style: styles[idx],
      primaryColor: idx === 1 ? "#EC4899" : idx === 2 ? "#10B981" : palette.primary,
      secondaryColor: idx === 1 ? "#8B5CF6" : idx === 2 ? "#3B82F6" : palette.secondary,
      bgColor: palette.bg,
      iconType: icon
    }));
    setGeneratedLogos(mockVariations);

    if (!activeLogoImage) {
      setActiveLogoName(name || "SpaceHead Logo");
    }
  };

  const handleShuffleLogos = () => {
    if (!hasUnlimitedRegenerations && generationCount >= MAX_FREE_REGENERATIONS) {
      setShowLimitModal(true);
      return;
    }
    if (!hasUnlimitedRegenerations) {
      setGenerationCount((prev) => prev + 1);
    }
    generateDefaultVariations(businessName, tagline, selectedPalette);
  };

  // Enhance Prompt using Server API
  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/logo-studio/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          tagline,
          industry,
          style: selectedStyle,
          colors: `${selectedPalette.primary} and ${selectedPalette.secondary}`,
          customDetails: vibePrompt
        })
      });
      const data = await response.json();
      if (data.enhancedPrompt) {
        setEnhancedPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error("Prompt enhance error:", err);
      setEnhancedPrompt(`Vector badge logo for ${businessName}, ${industry} industry, high contrast, clean background.`);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Logos
  const handleGenerateLogos = async () => {
    if (!hasUnlimitedRegenerations && generationCount >= MAX_FREE_REGENERATIONS) {
      setShowLimitModal(true);
      return;
    }
    if (!hasUnlimitedRegenerations) {
      setGenerationCount((prev) => prev + 1);
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/logo-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enhancedPrompt || vibePrompt || `Clean modern logo for ${businessName}`,
          businessName,
          style: selectedStyle,
          colorPalette: selectedPalette.name,
          aspectRatio: "1:1"
        })
      });
      const data = await response.json();

      if (data.status === "success" && data.imageUrl) {
        const newVariation: LogoVariation = {
          id: `gemini-logo-${Date.now()}`,
          name: businessName,
          tagline,
          style: selectedStyle,
          primaryColor: selectedPalette.primary,
          secondaryColor: selectedPalette.secondary,
          bgColor: selectedPalette.bg,
          iconType: "rocket",
          imageUrl: data.imageUrl
        };
        setGeneratedLogos((prev) => [newVariation, ...prev.slice(0, 3)]);
        setActiveLogoImage(data.imageUrl);
        setActiveLogoName(businessName);
      } else {
        generateDefaultVariations(businessName, tagline, selectedPalette);
      }
    } catch (err) {
      console.error("Logo generate error:", err);
      generateDefaultVariations(businessName, tagline, selectedPalette);
    } finally {
      setIsGenerating(false);
    }
  };

  // Transfer Logo to Animation Studio
  const handleTransferToAnimation = (logo: LogoVariation) => {
    if (logo.imageUrl) {
      setActiveLogoImage(logo.imageUrl);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        renderStaticLogoToCtx(ctx, logo, 600, 600);
        setActiveLogoImage(canvas.toDataURL("image/png"));
      }
    }
    setActiveLogoName(logo.name);
    setActiveTab("animate");
  };

  // Handle Custom File Upload for Animation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setActiveLogoImage(event.target.result as string);
          setActiveLogoName(file.name.replace(/\.[^/.]+$/, ""));
          setActiveTab("animate");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Audio FX Synthesizer for Animation Preview
  const playAudioFx = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (selectedPreset === "streak-laser") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (selectedPreset === "metallic-sheen") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio playback quiet fallback
    }
  }, [soundEnabled, selectedPreset]);

  // Render Static Vector Logo on Canvas
  const renderStaticLogoToCtx = (ctx: CanvasRenderingContext2D, logo: LogoVariation, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = logo.bgColor;
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, logo.primaryColor);
    grad.addColorStop(1, logo.secondaryColor);

    const centerX = width / 2;
    const centerY = height / 2 - 30;

    ctx.save();
    ctx.translate(centerX, centerY);
    
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = logo.primaryColor;
    if (logo.iconType === "rocket") {
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.lineTo(25, 20);
      ctx.lineTo(0, 10);
      ctx.lineTo(-25, 20);
      ctx.closePath();
      ctx.fill();
    } else if (logo.iconType === "shield") {
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(35, -20);
      ctx.lineTo(35, 20);
      ctx.lineTo(0, 45);
      ctx.lineTo(-35, 20);
      ctx.lineTo(-35, -20);
      ctx.closePath();
      ctx.fill();
    } else if (logo.iconType === "gem") {
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(35, -15);
      ctx.lineTo(0, 45);
      ctx.lineTo(-35, -15);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = logo.bgColor === "#F8FAFC" ? "#0F172A" : "#FFFFFF";
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(logo.name.toUpperCase(), centerX, centerY + 120);

    if (logo.tagline) {
      ctx.fillStyle = logo.primaryColor;
      ctx.font = "600 14px 'JetBrains Mono', monospace";
      ctx.fillText(logo.tagline.toUpperCase(), centerX, centerY + 148);
    }
  };

  // 60 FPS HTML5 Canvas Animation Engine
  useEffect(() => {
    if (activeTab !== "animate") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }> = [];

    const colorOptions = ["#6366F1", "#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899"];
    for (let i = 0; i < particleDensity * 2; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
      });
    }

    let logoImg: HTMLImageElement | null = null;
    if (activeLogoImage) {
      logoImg = new Image();
      logoImg.src = activeLogoImage;
    }

    const renderFrame = () => {
      if (!isPlaying) {
        animFrameIdRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      time += 0.03 * animSpeed;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      if (bgStyle === "dark") {
        ctx.fillStyle = "#0F172A";
      } else if (bgStyle === "onyx") {
        ctx.fillStyle = "#020617";
      } else if (bgStyle === "purple") {
        const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width);
        bgGrad.addColorStop(0, "#2E1065");
        bgGrad.addColorStop(1, "#0F172A");
        ctx.fillStyle = bgGrad;
      } else {
        ctx.fillStyle = "#F8FAFC";
      }
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      for (const p of particles) {
        p.x += p.vx * animSpeed;
        p.y += p.vy * animSpeed;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (glowIntensity / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      if (selectedPreset === "cosmic-orbit") {
        ctx.strokeStyle = "#8B5CF6";
        ctx.lineWidth = 4;
        ctx.globalAlpha = (glowIntensity / 100) * 0.7;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.8);
        ctx.scale(1.4, 0.4);
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = "#06B6D4";
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-time * 1.2);
        ctx.scale(0.5, 1.4);
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (selectedPreset === "streak-laser") {
        const streakX = cx + Math.cos(time * 3) * 180;
        const streakY = cy + Math.sin(time * 3) * 180;

        const streakGrad = ctx.createRadialGradient(streakX, streakY, 0, streakX, streakY, 80);
        streakGrad.addColorStop(0, "#6366F1");
        streakGrad.addColorStop(1, "transparent");

        ctx.fillStyle = streakGrad;
        ctx.beginPath();
        ctx.arc(streakX, streakY, 80, 0, Math.PI * 2);
        ctx.fill();
      } else if (selectedPreset === "cyber-glitch") {
        ctx.fillStyle = "rgba(6, 182, 212, 0.05)";
        for (let y = 0; y < height; y += 8) {
          ctx.fillRect(0, y, width, 2);
        }
      } else if (selectedPreset === "fluid-splash") {
        const ringRadius = (time * 100) % 220;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);

      let logoScale = 1;
      let logoRotate = 0;

      if (selectedPreset === "warp-zoom") {
        logoScale = 0.8 + Math.sin(time * 2) * 0.15;
      } else if (selectedPreset === "metallic-sheen") {
        logoRotate = Math.sin(time) * 0.05;
      } else if (selectedPreset === "cyber-glitch") {
        if (Math.random() > 0.92) {
          ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        }
      }

      ctx.scale(logoScale, logoScale);
      ctx.rotate(logoRotate);

      if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
        const logoSize = Math.min(width, height) * 0.55;
        ctx.drawImage(logoImg, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
      } else {
        const defaultLogo = generatedLogos[0] || {
          name: activeLogoName || "SpaceHead",
          tagline: "AI Marketing",
          primaryColor: "#6366F1",
          secondaryColor: "#8B5CF6",
          bgColor: "#0F172A",
          iconType: "rocket"
        };
        renderStaticLogoToCtx(ctx, defaultLogo, width, height);
      }
      ctx.restore();

      if (selectedPreset === "metallic-sheen") {
        ctx.save();
        const sheenPos = (time * 250) % (width * 2) - width;
        const sheenGrad = ctx.createLinearGradient(sheenPos, 0, sheenPos + 100, height);
        sheenGrad.addColorStop(0, "transparent");
        sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(glowIntensity / 100) * 0.6})`);
        sheenGrad.addColorStop(1, "transparent");

        ctx.fillStyle = sheenGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Render subtle watermark overlay in preview mode if not unlocked
      const animKey = `anim-${activeLogoName}`;
      if (!unlockedItems.includes(animKey)) {
        ctx.save();
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "right";
        ctx.fillText("SPACEHEAD PREVIEW MODE", width - 20, height - 20);
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeTab, activeLogoImage, activeLogoName, selectedPreset, isPlaying, animSpeed, glowIntensity, particleDensity, bgStyle, generatedLogos, unlockedItems]);

  // Actual Download Execution functions
  const executeLogoDownload = (logo: LogoVariation) => {
    const link = document.createElement("a");
    link.download = `${logo.name.toLowerCase().replace(/\s+/g, "-")}-business-logo.png`;
    
    if (logo.imageUrl) {
      link.href = logo.imageUrl;
      link.click();
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        renderStaticLogoToCtx(ctx, logo, 1200, 1200);
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }
  };

  const executeVideoRecordDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(60);
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);

        // Auto download video blob
        const link = document.createElement("a");
        link.download = `${activeLogoName.toLowerCase().replace(/\s+/g, "-")}-animation.webm`;
        link.href = url;
        link.click();
      };

      recorder.start();
      setIsRecording(true);
      playAudioFx();

      setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 5000);
    } catch (err) {
      console.error("Canvas video recording failed:", err);
      setIsRecording(false);
    }
  };

  const executeFrameSnapshotDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${activeLogoName.toLowerCase().replace(/\s+/g, "-")}-animated-frame.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Click Handlers for Download (Payment Triggered if not unlocked)
  const handleRequestLogoDownload = (logo: LogoVariation) => {
    const isUnlocked = unlockedItems.includes(logo.id);
    if (isUnlocked) {
      executeLogoDownload(logo);
    } else {
      setPendingCheckout({
        type: "logo",
        id: logo.id,
        title: `Business Logo PNG & Source Assets: "${logo.name}"`,
        price: 49,
        itemDescription: `High-resolution transparent PNGs, vector asset master, and commercial usage rights for ${logo.name}.`,
        features: [
          "High-Resolution PNG (4000x4000px)",
          "Transparent Background Files",
          "Full Commercial Usage Rights",
          "Instant Clean Digital Download"
        ],
        actionFn: () => {
          setUnlockedItems((prev) => [...prev, logo.id]);
          executeLogoDownload(logo);
        }
      });
    }
  };

  const handleRequestVideoDownload = () => {
    const animKey = `anim-${activeLogoName}`;
    const isUnlocked = unlockedItems.includes(animKey);
    if (isUnlocked) {
      executeVideoRecordDownload();
    } else {
      setPendingCheckout({
        type: "animation",
        id: animKey,
        title: `60 FPS 3D Logo Animation File: "${activeLogoName}"`,
        price: 79,
        itemDescription: `Cinematic 60 FPS WebM & MP4 Motion Video export with spatial particle effects and audio synthesizer sound design.`,
        features: [
          "60 FPS HD Motion Video Export (WebM/MP4)",
          "Spatial 3D Lighting & Particle Presets",
          "Audio Synthesizer Sound Design Track",
          "Full Commercial License for Web, Ads & Social"
        ],
        actionFn: () => {
          setUnlockedItems((prev) => [...prev, animKey]);
          executeVideoRecordDownload();
        }
      });
    }
  };

  // Launch Payfast Checkout
  const handlePayfastCheckout = async () => {
    if (!pendingCheckout) return;
    setIsProcessingPayfast(true);
    try {
      await initiatePayfastPayment({
        amountRands: pendingCheckout.price,
        itemName: pendingCheckout.title,
        itemDescription: pendingCheckout.itemDescription,
        returnPath: "/services",
        cancelPath: "/services",
        customStr1: `logo-studio-${pendingCheckout.type}`
      });
    } catch (err) {
      console.error("Payfast payment redirect error:", err);
      setIsProcessingPayfast(false);
    }
  };

  // Instant Unlock for Testing / Demo mode
  const handleInstantDemoUnlock = () => {
    if (!pendingCheckout) return;
    pendingCheckout.actionFn();
    setPendingCheckout(null);
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      <SEO 
        title="AI Logo & Animation Studio | Self-Serve Logo Generator & 3D Animator"
        description="Self-serve AI platform by SpaceHead AI to generate bespoke business logos and create cinematic 3D logo animations with real-time video export. Free to create and preview; pay R49 for logo downloads and R79 for video downloads."
        canonicalUrl="https://spaceheadai.co.za/services"
      />

      {/* Hero Title & Pricing Clarity Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono font-bold uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5 text-purple-600" />
          <span>SpaceHead AI Self-Serve Creator</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          AI Logo & Animation Studio
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Generate bespoke business logos and animate them with 60 FPS 3D motion graphics in real time for free. Pay only when you download!
        </p>

        {/* Pricing Highlights Ribbon */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-2.5 rounded-2xl border border-indigo-500/30 shadow-md">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
            <Sparkle className="w-4 h-4" />
            <span>
              {hasUnlimitedRegenerations 
                ? "Unlimited Regenerations Active" 
                : `Free Regenerations: ${remainingRegenerations}/${MAX_FREE_REGENERATIONS}`}
            </span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center space-x-1 text-xs font-mono font-bold text-emerald-400">
            <Tag className="w-3.5 h-3.5" />
            <span>Logo Download: ZAR R49</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center space-x-1 text-xs font-mono font-bold text-purple-300">
            <Video className="w-3.5 h-3.5" />
            <span>Animation Download: ZAR R79</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="block pt-2">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "create"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wand2 className="w-4 h-4 text-purple-400" />
              <span>Generate Business Logo (Free Preview)</span>
            </button>

            <button
              onClick={() => setActiveTab("animate")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "animate"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Animate Logo 3D Motion (Free Preview)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: GENERATE LOGO STUDIO */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Form Controls Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <span>Brand Identity Specs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Configure parameters for instant free AI logo generation.</p>
            </div>

            {/* Business Name & Tagline */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Logistics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                  Tagline / Slogan (Optional)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Moving Business Forward"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-1.5">
                Industry Sector
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              >
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Style Archetypes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-2">
                Logo Style Archetype
              </label>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {STYLE_ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setSelectedStyle(arch.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between ${
                      selectedStyle === arch.id
                        ? "bg-indigo-50/80 border-indigo-500 text-indigo-950 font-bold shadow-sm"
                        : "bg-slate-50/50 border-slate-200/70 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-slate-900">{arch.label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{arch.desc}</span>
                    </div>
                    {selectedStyle === arch.id && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-2">
                Color Palette Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => setSelectedPalette(pal)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      selectedPalette.name === pal.name
                        ? "bg-slate-900 text-white border-slate-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">{pal.name}</span>
                    <div className="flex space-x-1 flex-shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: pal.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: pal.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gemini Prompt Enhancer */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Custom Vibe & Gemini Prompt
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>Gemini AI Enhance</span>
                </button>
              </div>

              <textarea
                value={enhancedPrompt || vibePrompt}
                onChange={(e) => {
                  setVibePrompt(e.target.value);
                  setEnhancedPrompt(e.target.value);
                }}
                rows={3}
                placeholder="Describe specific icon ideas, geometric symbols, or brand aesthetic..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
              />
            </div>

            {/* Free Regeneration Counter Bar */}
            <div className="flex items-center justify-between text-xs px-1 py-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3">
              <span className="text-slate-600 font-medium flex items-center space-x-1.5">
                <Sparkle className="w-3.5 h-3.5 text-amber-500" />
                <span>Free Regenerations</span>
              </span>
              {hasUnlimitedRegenerations ? (
                <span className="text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlimited Active</span>
                </span>
              ) : (
                <span className={`font-mono font-bold ${generationCount >= MAX_FREE_REGENERATIONS ? "text-rose-600 font-extrabold animate-pulse" : "text-indigo-600"}`}>
                  {remainingRegenerations} / {MAX_FREE_REGENERATIONS} Left
                </span>
              )}
            </div>

            {/* Action Button */}
            {!hasUnlimitedRegenerations && generationCount >= MAX_FREE_REGENERATIONS ? (
              <button
                type="button"
                onClick={() => setShowLimitModal(true)}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Free Generation Limit Reached (Unlock Options)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateLogos}
                disabled={isGenerating || !businessName}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Free AI Logos...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Free Logos ({hasUnlimitedRegenerations ? "Unlimited" : `${remainingRegenerations} left`})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Output Results Grid Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Generated AI Logo Concepts</h3>
                <p className="text-xs text-slate-500">Preview & animate freely. Pay R49 only when downloading.</p>
              </div>
              <button
                onClick={handleShuffleLogos}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Shuffle Concepts ({hasUnlimitedRegenerations ? "∞" : `${remainingRegenerations} left`})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {generatedLogos.map((logo) => {
                const isUnlocked = unlockedItems.includes(logo.id);
                return (
                  <div 
                    key={logo.id}
                    className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Logo Display Canvas / Image */}
                    <div 
                      className="h-64 flex items-center justify-center p-6 relative overflow-hidden transition-colors"
                      style={{ backgroundColor: logo.bgColor }}
                    >
                      {logo.imageUrl ? (
                        <img 
                          src={logo.imageUrl} 
                          alt={logo.name} 
                          className="max-h-52 max-w-52 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center space-y-3">
                          <div 
                            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg border border-white/10 transition-transform duration-300 group-hover:scale-110"
                            style={{
                              background: `linear-gradient(135deg, ${logo.primaryColor}, ${logo.secondaryColor})`
                            }}
                          >
                            <Sparkles className="w-12 h-12 text-white" />
                          </div>
                          <div>
                            <h4 className={`text-xl font-bold tracking-tight uppercase ${logo.bgColor === "#F8FAFC" ? "text-slate-900" : "text-white"}`}>
                              {logo.name}
                            </h4>
                            {logo.tagline && (
                              <span className="text-[11px] font-mono tracking-widest uppercase block mt-0.5" style={{ color: logo.primaryColor }}>
                                {logo.tagline}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border border-white/10">
                        {logo.style}
                      </span>

                      {/* Unlocked / Locked badge overlay */}
                      <span className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center space-x-1 backdrop-blur-md ${
                        isUnlocked ? "bg-emerald-900/80 text-emerald-300 border-emerald-500/40" : "bg-purple-950/80 text-purple-200 border-purple-400/30"
                      }`}>
                        {isUnlocked ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                        <span>{isUnlocked ? "Unlocked" : "Download R49"}</span>
                      </span>
                    </div>

                    {/* Card Controls */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleTransferToAnimation(logo)}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Animate Free</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestLogoDownload(logo)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                          isUnlocked 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                            : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm"
                        }`}
                        title={isUnlocked ? "Download Logo PNG" : "Download Logo (Payfast R49)"}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isUnlocked ? "Download" : "Download R49"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ANIMATE LOGO STUDIO */}
      {activeTab === "animate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* Interactive Live Canvas Section */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Canvas Stage */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
              <canvas
                ref={canvasRef}
                width={700}
                height={550}
                className="w-full h-[420px] sm:h-[500px] object-contain block"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full flex items-center space-x-2 text-xs font-mono text-slate-200">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span>60 FPS Motion • {activeLogoName}</span>
              </div>

              {/* Price Tag Badge */}
              <div className="absolute top-4 right-4 bg-purple-950/90 backdrop-blur-md border border-purple-500/40 px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-mono font-bold text-purple-200">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Animation Export: ZAR R79</span>
              </div>

              {/* Canvas Overlay Quick Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={() => {
                      playAudioFx();
                      setIsPlaying(true);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
                    title="Replay Motion Fx"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      soundEnabled ? "bg-purple-900/60 text-purple-300" : "bg-slate-800 text-slate-500"
                    }`}
                    title="Toggle Audio Synthesizer"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRequestVideoDownload}
                    disabled={isRecording}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>
                      {isRecording 
                        ? "Recording Video..." 
                        : unlockedItems.includes(`anim-${activeLogoName}`) 
                        ? "Download Video" 
                        : "Download Video (R79)"}
                    </span>
                  </button>

                  <button
                    onClick={executeFrameSnapshotDownload}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Snapshot Frame"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Frame</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recorded Video Preview Download Banner */}
            {recordedVideoUrl && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">WebM Video Render Complete!</h5>
                    <p className="text-[11px] text-emerald-700">HD motion video file ready for download.</p>
                  </div>
                </div>
                <a
                  href={recordedVideoUrl}
                  download={`${activeLogoName.toLowerCase().replace(/\s+/g, "-")}-animation.webm`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </a>
              </div>
            )}
          </div>

          {/* Animation Presets & Settings Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Logo File Upload Zone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Active Logo File
              </label>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {activeLogoImage ? (
                    <img src={activeLogoImage} alt={activeLogoName} className="w-full h-full object-contain" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-slate-900 block truncate">{activeLogoName}</span>
                  <span className="text-[10px] text-slate-500 block">Custom upload or AI Generated Logo</span>
                </div>
                <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Animation Preset Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Select 3D Motion Preset
              </label>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {ANIMATION_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset.id);
                        playAudioFx();
                      }}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start space-x-3 cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/80 border-purple-500 text-purple-950 font-bold shadow-sm"
                          : "bg-slate-50/50 border-slate-200/70 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`p-2 rounded-xl flex-shrink-0 ${isSelected ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold block text-slate-900">{preset.name}</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">{preset.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Motion Fine-Tuning</h4>
              
              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Motion Speed</span>
                  <span className="font-mono font-bold text-indigo-600">{animSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={animSpeed}
                  onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Glow Intensity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">Glow & Lighting Intensity</span>
                  <span className="font-mono font-bold text-purple-600">{glowIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Background Theme */}
              <div className="space-y-1.5">
                <span className="block text-xs font-medium text-slate-600">Stage Background Theme</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "dark", name: "Deep Slate", color: "#0F172A" },
                    { id: "onyx", name: "Onyx Black", color: "#020617" },
                    { id: "purple", name: "Cosmic Glow", color: "#2E1065" },
                    { id: "light", name: "Studio Light", color: "#F8FAFC" }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setBgStyle(theme.id as any)}
                      className={`p-2 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                        bgStyle === theme.id ? "border-purple-600 ring-2 ring-purple-500/30" : "border-slate-200"
                      }`}
                      style={{ backgroundColor: theme.color, color: theme.id === "light" ? "#0F172A" : "#FFFFFF" }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Download Trigger Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Ready to Export
                </span>
                <span className="text-xs font-bold font-mono text-purple-300">ZAR R79</span>
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Download 60 FPS HD Video Animation</h5>
                <p className="text-[11px] text-slate-300 mt-1">
                  Get high-resolution motion video files, sound design FX, and commercial license to use on social media, websites, and video ads.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRequestVideoDownload}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-amber-300" />
                <span>Download Video Animation (R79)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PAYFAST PAY-ON-DOWNLOAD CHECKOUT MODAL */}
      {pendingCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setPendingCheckout(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto text-purple-700">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{pendingCheckout.type === "logo" ? "Download Business Logo" : "Download Video Animation"}</h3>
              <p className="text-xs text-slate-500">Pay once to unlock digital asset download with full commercial rights.</p>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">{pendingCheckout.type === "logo" ? "Logo Asset Pack" : "60 FPS Video Export"}</span>
                <span className="text-[11px] text-slate-500 block">Instant digital delivery</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-slate-900">R{pendingCheckout.price}</span>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">ZAR via Payfast</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Included Deliverables:</h4>
              <ul className="space-y-2">
                {pendingCheckout.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePayfastCheckout}
                disabled={isProcessingPayfast}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayfast ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Payfast...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay R{pendingCheckout.price} via Payfast</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleInstantDemoUnlock}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Unlock className="w-4 h-4 text-purple-600" />
                <span>Simulate Payfast Payment & Download Now (Demo)</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Secured by Payfast South Africa • Instant Unlocking</span>
            </div>
          </div>
        </div>
      )}

      {/* FREE GENERATION LIMIT REACHED MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Free Regeneration Limit Reached</h3>
              <p className="text-xs text-slate-500">
                You've used all {MAX_FREE_REGENERATIONS} free logo regenerations for this session.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Unlimited Logo Generation Pass</span>
                  <span className="text-[11px] text-slate-500 block">Unlimited AI concept generations & shuffling</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold font-mono text-slate-900">R29</span>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Payfast</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setPendingCheckout({
                    type: "logo",
                    id: "unlimited-regenerations",
                    title: "Unlimited Logo Regenerations Pass",
                    price: 29,
                    itemDescription: "Unlock unlimited AI logo concept regenerations & shuffling in Logo Studio.",
                    features: [
                      "Unlimited AI Logo Generations",
                      "Unlimited Concept Shuffling",
                      "High-Speed Gemini Prompt Enhancements",
                      "Full Session Access across all color palettes"
                    ],
                    actionFn: () => {
                      setUnlockedItems((prev) => [...prev, "unlimited-regenerations"]);
                      setShowLimitModal(false);
                    }
                  });
                  setShowLimitModal(false);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Unlock Unlimited Regenerations (R29)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUnlockedItems((prev) => [...prev, "unlimited-regenerations"]);
                  setShowLimitModal(false);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Unlock className="w-4 h-4 text-purple-600" />
                <span>Simulate Unlimited Unlock (Demo)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGenerationCount(0);
                  setShowLimitModal(false);
                }}
                className="w-full py-2 px-4 text-slate-500 hover:text-slate-800 text-xs font-medium text-center transition-colors cursor-pointer"
              >
                Reset Free Credits (+{MAX_FREE_REGENERATIONS} Free)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
