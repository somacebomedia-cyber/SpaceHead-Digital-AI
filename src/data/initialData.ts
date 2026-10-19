import { Project, BlogPost } from "../types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-saas-stacfund",
    title: "StacFund — AI Business Funding & Pitch Platform",
    description: "Gamified business funding platform that simplifies grants, loans, and equity applications with step-by-step progress tracking, AI-powered investor matching, automated business plan creation, and pitch deck generation. Currently under active development, engineered for high-growth startups and SMEs.",
    category: "SaaS & Web Apps",
    tags: ["SaaS", "In Active Development", "FinTech", "AI Grants & Loans", "Pitch Decks", "Vercel Live Preview"],
    demoUrl: "https://stac-fund-ai.vercel.app/",
    githubUrl: "https://github.com/spaceheadai/stacfund-ai",
    imageUrl: "https://stac-fund-ai.vercel.app/icon.png",
    createdAt: 1773101000000,
    userId: "system",
    isPublic: true,
    status: "In Active Development"
  },
  {
    id: "proj-saas-incutrack",
    title: "IncuTrack AI — Business Incubation Tracking Platform",
    description: "Built for Esayidi TVET College Incubator, IncuTrack AI manages incubated businesses across a 36-month programme. Features private incubant portals, locked monthly progress check-ins (revenue, expenses, customers, staff, achievements & challenges), incubator manager dashboards, and automated 36-month journey tracking. Roadmap includes automated bank statement analysis and an AI business coach.",
    category: "SaaS & Web Apps",
    tags: ["SaaS", "Incubation Platform", "Esayidi TVET", "36-Month Tracking"],
    demoUrl: "",
    githubUrl: "",
    imageUrl: "https://esayiditvet.co.za/2025/wp-content/uploads/2023/02/footerlogo-300x171.png",
    createdAt: 1773099000000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-saas-nurserynet",
    title: "NurseryNet — Early Childhood Education Platform",
    description: "South African early childhood education platform connecting parents with verified preschools and empowering nursery owners with AI-powered marketing tools, funding discovery finders, and cloud growth resources. Currently under active development, featuring interactive school discovery, owner portal, and mobile-first experience.",
    category: "SaaS & Web Apps",
    tags: ["SaaS", "In Active Development", "EdTech", "Preschool Finder", "AI Tools", "Vercel Live Preview"],
    demoUrl: "https://nursery-net.vercel.app/",
    githubUrl: "",
    imageUrl: "https://ik.imagekit.io/wugvdm3ddq/Iconnew-512x512.png?updatedAt=1764044488330&v=4",
    createdAt: 1773100500000,
    userId: "system",
    isPublic: true,
    status: "In Active Development"
  },
  {
    id: "proj-saas-studioflow",
    title: "StudioFlow — Creative Workflow Automation",
    description: "Sleek creative pipeline and studio workflow management platform automating media production tracking, client revision loops, render asset management, and agency project delivery.",
    category: "SaaS & Web Apps",
    tags: ["SaaS", "Creative Workflow", "Media Asset Management", "Agency Automation"],
    demoUrl: "",
    githubUrl: "",
    imageUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'><rect width='800' height='500' fill='%230b0f19'/><g transform='translate(260, 140)'><rect x='0' y='70' width='18' height='60' rx='9' fill='%23a855f7'/><rect x='40' y='35' width='18' height='130' rx='9' fill='%23c084fc'/><rect x='80' y='10' width='18' height='180' rx='9' fill='%23818cf8'/><rect x='120' y='45' width='18' height='110' rx='9' fill='%236366f1'/><rect x='160' y='75' width='18' height='50' rx='9' fill='%234f46e5'/></g><text x='400' y='380' font-family='system-ui, sans-serif' font-size='32' font-weight='800' fill='%23ffffff' text-anchor='middle' letter-spacing='2'>STUDIOFLOW</text><text x='400' y='415' font-family='system-ui, sans-serif' font-size='14' font-weight='600' fill='%2394a3b8' text-anchor='middle' letter-spacing='4'>CREATIVE WORKFLOW SUITE</text></svg>",
    createdAt: 1773097000000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-web-nawilearn",
    title: "NawiLearn Preschool Website",
    description: "Custom digital web platform designed and built for a preschool owner in Umzimkhulu. Features intuitive parent navigation, early learning curriculum highlights, and ongoing active cloud management.",
    category: "Web Design",
    tags: ["Web Design", "Preschool", "Umzimkhulu", "Active Management"],
    demoUrl: "https://www.nawilearn.co.za",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1Wly0YL5g_Mpase3z0-QP5f2KwWg-jVve",
    createdAt: 1773090500000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-showreel",
    title: "New 2024 Showreel Promo",
    description: "High-impact cinematic promo showreel featuring dynamic motion transitions, bespoke audio pacing, and high audience retention design.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Promo Reel", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1_Ib8Xls88OM4sLLEdwYALoUNchbWDCWL/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1_Ib8Xls88OM4sLLEdwYALoUNchbWDCWL=w800",
    createdAt: 1773089290000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-3dlogo",
    title: "3D Logo Original with Music",
    description: "Bespoke 3D animated logo reveal crafted with high-fidelity metallic lighting reflections, spatial depth, and synchronized audio production.",
    category: "Animated Videos",
    tags: ["Animated Videos", "3D Motion", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1dfrmP16trlOMk1Ua8nHxQV3Tfap5yYQH/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1dfrmP16trlOMk1Ua8nHxQV3Tfap5yYQH=w800",
    createdAt: 1773089290100,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-mobileapp",
    title: "Mobile App Presentation Showcase",
    description: "Sleek UX presentation video highlighting fluid user interface flows and app interaction mechanics for mobile platforms.",
    category: "Animated Videos",
    tags: ["Animated Videos", "App Showcase", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1NN9GNNHSqbByr_PGZ6D5XkpUiBufq_3a/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1NN9GNNHSqbByr_PGZ6D5XkpUiBufq_3a=w800",
    createdAt: 1773089290200,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-mystic",
    title: "Mystic Space Walker Intro",
    description: "Atmospheric cosmic animated intro sequence crafted with particle visual effects and futuristic typography.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Intro Animation", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/13Z318bVatFJu1qezOB1KPJYOdVoc-rug/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/13Z318bVatFJu1qezOB1KPJYOdVoc-rug=w800",
    createdAt: 1773089291000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-neon",
    title: "Neon Spotlights Opener",
    description: "High-energy vibrant neon spotlight opener designed for brand reveals, events, and dynamic video ads.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Neon Opener", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1pCtYi5x1n9-skKVjD5JqZQSWER_Co8mw/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1pCtYi5x1n9-skKVjD5JqZQSWER_Co8mw=w800",
    createdAt: 1773089292000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-lightstreak",
    title: "Quick Light Streak Logo Reveal",
    description: "High-speed light streak particle intro delivering instant brand recognition and sleek energetic aesthetics.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Logo Animation", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1UUvDUuz9Dghv-bhABymcJA4qRlPL4kBG/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1UUvDUuz9Dghv-bhABymcJA4qRlPL4kBG=w800",
    createdAt: 1773089292100,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-shinysmooth",
    title: "Shiny-Smooth Metallic Logo Reveal",
    description: "Polished metallic reflection opener designed for high-end corporate identity and luxury brand intros.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Metallic Reveal", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/15e4pX32xazBGdTGxcjW6rC8tJIpAzIZJ/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/15e4pX32xazBGdTGxcjW6rC8tJIpAzIZJ=w800",
    createdAt: 1773089292200,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-pixellogo",
    title: "Pixel Logo Landscape Reveal",
    description: "Digital pixel grid motion reveal showcasing technology-focused brand branding with clean modern animation.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Tech Motion", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1C6wwGz70Kaz9sysV-gy1-LEPG1TTh4O4/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1C6wwGz70Kaz9sysV-gy1-LEPG1TTh4O4=w800",
    createdAt: 1773089292300,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-splashlogo",
    title: "Dynamic Splash Logo Animation",
    description: "Fluid splash visual impact intro animation combining liquid mechanics and dynamic brand positioning.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Fluid Motion", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1eNoFZ7QN85iPBB5Qst6RvTgzCSz19QBJ/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1eNoFZ7QN85iPBB5Qst6RvTgzCSz19QBJ=w800",
    createdAt: 1773089292400,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-shisanyama",
    title: "Shisanyama Butchery Ad",
    description: "High-converting promotional advert tailored for local food and butchery marketing campaigns.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Food Advert", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1TwQamGEkyDDpoRvu5So25QXlWaXTGPd6/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1TwQamGEkyDDpoRvu5So25QXlWaXTGPd6=w800",
    createdAt: 1773089293000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-membership",
    title: "Membership Card Landscape Showcase",
    description: "3D perspective membership card motion display designed for modern customer loyalty programs.",
    category: "Animated Videos",
    tags: ["Animated Videos", "Card Motion", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1-x08c7DJ5b7APJTLUIhbCkfYXYSVBozq/preview",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1-x08c7DJ5b7APJTLUIhbCkfYXYSVBozq=w800",
    createdAt: 1773089293100,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-nawilearn",
    title: "NawiLearn Educational Calendar Client Design",
    description: "Bespoke high-resolution client project design created for the NawiLearn educational calendar launch, featuring custom typography and layout balance.",
    category: "Graphic Design",
    tags: ["Brand Assets", "Client Work", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1jkJfHIXY1dsCyCYmbzBRrG53tstRk_yj/view",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1jkJfHIXY1dsCyCYmbzBRrG53tstRk_yj=w800",
    createdAt: 1773088848340,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-logo",
    title: "SpaceHead AI New Logo Concept",
    description: "Bespoke clean minimalist modern AI-generated logo featuring premium gradient tones designed for SpaceHead Digital AI's ultimate brand identity.",
    category: "Graphic Design",
    tags: ["Brand Assets", "Logo Concept", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1aYFdInKHl4tZbEEyQzyVemoENf1AkzBl/view",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1aYFdInKHl4tZbEEyQzyVemoENf1AkzBl=w800",
    createdAt: 1773077793085,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-poster",
    title: "Blue Yellow Illustrated Bus Tour Online Service Poster",
    description: "High-engagement vibrant illustrated promotional poster designed for online transport and bus tour booking systems. Optimized for conversion rate.",
    category: "Graphic Design",
    tags: ["Brand Assets", "Poster Art", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1VTINXhXZZsgC9zx_zq-q-UVFup--sIyN/view",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1VTINXhXZZsgC9zx_zq-q-UVFup--sIyN=w800",
    createdAt: 1773089281789,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-drive-marketing",
    title: "Social Media Marketing Strategy Banner",
    description: "High-retention social media marketing promotional poster optimized for digital campaign placements and immediate audience conversion.",
    category: "Graphic Design",
    tags: ["Brand Assets", "Social Marketing", "Drive Sync"],
    demoUrl: "https://drive.google.com/file/d/1m33IYgihB0HGf6y8cpg1fxlXXzGe3QaC/view",
    githubUrl: "",
    imageUrl: "https://lh3.googleusercontent.com/d/1m33IYgihB0HGf6y8cpg1fxlXXzGe3QaC=w800",
    createdAt: 1773089282198,
    userId: "system",
    isPublic: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Why Premium Website Design is the Absolute Best Investment for Your Modern SA Brand",
    slug: "why-premium-website-design-matters",
    summary: "In a highly competitive digital landscape, a generic template won't cut it. Learn why bespoke premium web builds combined with custom-tailored cloud care elevate brand trust.",
    content: `## The South African Luxury Digital Boom

Local businesses across South Africa—from Pretoria to Cape Town—are discovering that brand equity has moved online. When premium clients search for high-end services, custom properties, or creative specialists, they judge your capability within the first 3 seconds of opening your website.

### The Problem: Generic Templates Hurt Trust

Historically, many small business platforms relied on rigid, slow, cookie-cutter templates. For a serious brand seeking high-income clients, slow loading speeds and clunky navigation feel unprofessional and drive prospective clients away. 

That is why **SpaceHead AI** designs and builds custom web experiences tailored for premium conversion:
*   **Complete Custom Bespoke Build**: Premium bespoke setups designed strictly with modern styling and responsive fluid mechanics.
*   **High-Speed Secure Hosting & Premium Maintenance**: Active cloud care keeping your workspace online, secure, and fast.

### What You Get with Custom Premium Web Builds
We build fully-fledged responsive websites styled natively with modern frameworks (like Tailwind CSS and fast hydration). We integrate interactive call-to-actions, contact forms, Google Map API pins, and responsive touch-optimized layout blocks.

### The Value of Ongoing Cloud Care
You don't need to learn domain configurations, SSL renewals, or database management. For our premium clients, our retainer plan handles:
1.  **Fast SSD Cloud Hosting** ensuring your clients never wait for pages to load.
2.  **SSL Security Encryption** (free padlocks for customer trust).
3.  **Active Backups & Patch Updates** to protect your site against malicious traffic.

Bring your brand online today with a premium, friction-free agency solution built for serious businesses!`,
    category: "Web Design",
    tags: ["Premium Build", "Cloud Care", "Bespoke Design", "SEO Tips"],
    createdAt: 1718050000000,
    updatedAt: 1718050000000,
    userId: "system",
    authorName: "SpaceHead AI Team",
    isPublished: true
  },
  {
    id: "blog-2",
    title: "How Cinematic AI Video Adverts Boost Conversion Rates by Over 80%",
    slug: "visual-marketing-conversions-sa",
    summary: "Stock images feel clinical and disconnected. Explore how high-end custom-made video adverts and dynamic 3D animated product reels drive engagement and immediate brand loyalty.",
    content: `## Overcoming Content Blindness

The average South African scrolls through hundreds of meters of social media feed every day. In this high-density stream, standard stock photos or text-heavy status posts are immediately ignored. They suffer from "content blindness."

To stand out, your business needs **bespoke visual hooks**.

### The Power of Premium Video Ads & Custom Branding

When you use customized video ads that integrate your brand colors, cinematic narrative pacing, and clear value statements, you create an instant pattern-interrupt.
*   **Emotional Connection**: Custom videos with professional motion layouts build immediate familiarity.
*   **Visual Trust**: Cohesive, sharp transitions communicate elite professionalism.

### Why Animated Videos Are Your Secret Weapon

If a picture is worth a thousand words, a high-impact animated promo is worth a million.
1.  **Product Explainer Videos**: Break down complex software, machinery, or services into easy 30-second visuals.
2.  **High Retention**: Audiences retain 95% of a message when they watch it in a video, compared to only 10% when reading it in text.
3.  **Ad Space Efficiency**: Facebook, Instagram, and TikTok algorithms heavily prioritize high-retention video content, decreasing your cost-per-click dramatically.

At SpaceHead AI, we craft gorgeous custom video ads and sleek 3D video animations suited to capture modern attention spans. Let us handle your digital assets while you run your business.`,
    category: "Digital Marketing",
    tags: ["Video Adverts", "Animated Videos", "Social Conversion", "Branding"],
    createdAt: 1719100000000,
    updatedAt: 1719100000000,
    userId: "system",
    authorName: "SpaceHead AI Team",
    isPublished: true
  },
  {
    id: "blog-3",
    title: "StacFund AI Platform — Technical Overview, Security Hardening & Multi-Batch AI Document Engine",
    slug: "stacfund-ai-technical-case-study",
    summary: "A comprehensive technical breakdown of StacFund AI: South Africa's funding discovery and document generation platform for SMEs. Covers PWA installability, 16-file security audit, 12-variable HSL token design system, and tiered multi-batch Gemini generation producing up to 95-page business plans.",
    content: `## Product Overview & Brand Identity

**StacFund AI** (originally built in Google AI Studio under the name "FundHub" and later rebranded to StacFund) is a South African business funding discovery and document generation platform built specifically for entrepreneurs and SMEs seeking institutional funding from **NYDA**, **SEFA**, **NEF**, and **IDC**.

### Core Platform Pillars
*   **Targeted SA SME Funding**: Empowers township and local entrepreneurs to discover and apply for NYDA, SEFA, NEF, and IDC funding packages.
*   **Cosmic Space Purple Aesthetic**: Built with a distinctive deep-space cosmic purple brand identity that conveys technical precision and ambition.
*   **"SA Funding Pulse" Intelligence Layer**: Integrates a curated funding newsletter and intelligence system that alerts business owners to new grant cycles and institutional programs.
*   **PWA Standalone Capabilities**: Engineered with Progressive Web App features for mobile home-screen installation and direct app store-like accessibility.

---

## Technical Audit & Security Hardening (Recent Work)

### 1. 16-File Security Patch Delivery
A comprehensive security audit resolved six critical production issues across the platform:
1.  **API Key Isolation**: Eliminated client-side API key exposures by proxying all Gemini requests through secure server endpoints.
2.  **Authenticated Proxy Authorization**: Protected proxy routes with strict user token verification.
3.  **Firestore & Cloud Storage Security Rules**: Locked open write rules with granular tenant validation and schema checks.
4.  **Container Port Alignment**: Cleared hardcoded PORT variables to ensure smooth Cloud Run ingress routing.
5.  **Paystack Webhook Verification**: Enforced verified \`userId\` checking on payment confirmation webhooks.

### 2. Code Quality & Multi-Phase Audits
Replaced flawed code fragments left by external model iterations (GLM5.2):
*   **Canvas Export Engine**: Fixed canvas footer clipping during video export sequences.
*   **Express Rate Limiting**: Added strict route rate limiters on stock photo and asset discovery endpoints.
*   **OutlineEditor State Preservation**: Resolved silent discarding of user edits during outline adjustments.

### 3. Modern Design System & Component Redesign
*   **12-Variable HSL Design Token System**: Integrated a clean 12-variable HSL token system in \`index.css\` paired with Tailwind CSS for themes.
*   **Landing Page Restructure**: Rebuilt feature cards, improved accessibility (focus ring contrast, \`prefers-reduced-motion\` support), and replaced fabricated metrics with authentic copy.
*   **Split Document Renderers**:
    *   \`BusinessPlanDocument.tsx\`: Converted to a corporate Venturekit-style theme with dark cover support.
    *   \`PitchDeckDocument.tsx\`: Enhanced with a custom \`DiamondPhoto\` component and a real 2x2 competitor quadrant map.

---

## Document Generation Engine & Long-Term Roadmap

*   **Tiered Multi-Batch Gemini Orchestrator**: Upgraded the document generation pipeline from single-batch calls into a tiered multi-batch orchestrator capable of outputting up to **95-page comprehensive business plans** based on funding tiers.
*   **Document Overflow & CSS Fixes**: Diagnosed and resolved page capping issues (~50 page overflow-hidden CSS clipping), added missing schema fields, and rebalanced batch token limits.
*   **Backend & Security Protections**:
    *   Fixed Firebase Admin SDK chained method syntax in \`advancedScraper.ts\`.
    *   Upgraded SSRF protection in \`server.ts\` with DNS-level host validation.
    *   Resolved file upload gaps in \`OnboardingWizard.tsx\` to persist actual binary uploads rather than metadata stubs.`,
    category: "AI & Software Engineering",
    tags: ["StacFund AI", "SME Funding", "Security Audit", "Gemini Multi-Batch", "PWA", "NYDA/SEFA"],
    createdAt: 1723300000000,
    updatedAt: 1723300000000,
    userId: "system",
    authorName: "SpaceHead AI Engineering Team",
    isPublished: true
  }
];
