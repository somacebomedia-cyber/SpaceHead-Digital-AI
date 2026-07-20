import { Project, BlogPost } from "../types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Coffee Lab Custom Brand Identity & Logo Suite",
    description: "A premium set of high-converting brand identity assets designed for a local South African artisanal coffee roastery. Includes custom vector logo concepts, high-contrast poster artwork, and printable business collateral created for a flat fee of R499 per item.",
    category: "Graphic Design",
    tags: ["Logo Concepts", "Poster Art", "Print Collateral", "Flat Fee Design"],
    demoUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
    githubUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
    createdAt: 1718000000000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-2",
    title: "EcoDrive SA Explainer & Cinematic Video Advert",
    description: "A high-conversion 30-second cinematic video advert designed to showcase a premium vehicle subscription service in Johannesburg. Combines engaging motion styling, fluid transition timing, and custom brand-color layouts using modern AI production pipelines.",
    category: "Animated Videos",
    tags: ["Video Advert", "Motion Graphics", "Promo Reel", "Social Video"],
    demoUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800",
    githubUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800",
    createdAt: 1719000000000,
    userId: "system",
    isPublic: true
  },
  {
    id: "proj-3",
    title: "Kasi Bites Premium Food E-Commerce Portal",
    description: "A bespoke professional website designed and built for a high-end food delivery franchise. Powered by ultra-fast responsive rendering, integrated Google Maps location pins, customer contact forms, and custom copy block layout, backed by our monthly care retainer.",
    category: "Websites",
    tags: ["Premium Build", "Enterprise Care Plan", "Responsive Web", "Local SEO"],
    demoUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800",
    githubUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=800",
    createdAt: 1720000000000,
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
  }
];
