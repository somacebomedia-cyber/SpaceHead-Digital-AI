import React from "react";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "product";
  keywords?: string[] | string;
  geoRegion?: string; // e.g. "ZA" or "ZA-GP", "ZA-WC", "ZA-KZN"
  geoPlacename?: string; // e.g. "South Africa", "Johannesburg", "Cape Town", "Durban"
  geoPosition?: string; // e.g. "-26.2041;28.0473"
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  articleSection?: string;
  articleTags?: string[];
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Standard South African Local Business structured schema
 */
export const DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://spaceheadai.co.za/#organization",
  "name": "SpaceHead AI",
  "alternateName": "SpaceHead AI Digital Agency",
  "url": "https://spaceheadai.co.za",
  "logo": "https://spaceheadai.co.za/logo.png",
  "image": "https://spaceheadai.co.za/logo.png",
  "description": "Bespoke website design, promotional 2D animated video ads, and next-generation software development engineered for South African local businesses and medical practices.",
  "telephone": "+27735398287",
  "email": "spaceheadai@gmail.com",
  "priceRange": "R950 - R25000",
  "currenciesAccepted": "ZAR",
  "paymentAccepted": "PayFast, Instant EFT, Credit Card, Debit Card, SnapScan",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZA",
    "addressRegion": "Gauteng",
    "addressLocality": "Johannesburg"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -26.2041,
    "longitude": 28.0473
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "09:00",
      "closes": "13:00"
    }
  ],
  "areaServed": [
    { "@type": "Country", "name": "South Africa" },
    { "@type": "City", "name": "Johannesburg" },
    { "@type": "City", "name": "Cape Town" },
    { "@type": "City", "name": "Durban" },
    { "@type": "City", "name": "Pretoria" },
    { "@type": "City", "name": "Sandton" },
    { "@type": "City", "name": "Centurion" },
    { "@type": "City", "name": "Umhlanga" },
    { "@type": "City", "name": "Gqeberha" },
    { "@type": "City", "name": "Bloemfontein" }
  ],
  "sameAs": [
    "https://facebook.com/spaceheadai",
    "https://instagram.com/spaceheadai",
    "https://linkedin.com/company/spaceheadai",
    "https://twitter.com/SpaceHeadAI"
  ]
};

export default function SEO({
  title,
  description,
  canonicalUrl = "https://spaceheadai.co.za",
  ogImage = "https://spaceheadai.co.za/logo.png",
  ogType = "website",
  keywords,
  geoRegion = "ZA",
  geoPlacename = "South Africa",
  geoPosition = "-26.2041;28.0473",
  noindex = false,
  publishedTime,
  modifiedTime,
  author,
  articleSection,
  articleTags,
  breadcrumbs,
  jsonLd,
}: SEOProps) {
  // Prevent duplicate branding suffix
  const fullTitle = title.includes("SpaceHead AI")
    ? title
    : `${title} | SpaceHead AI`;

  // Format keywords string
  const keywordsStr = Array.isArray(keywords)
    ? keywords.join(", ")
    : typeof keywords === "string"
    ? keywords
    : undefined;

  // Format ICBM coordinate from geoPosition
  const icbmCoords = geoPosition.includes(";")
    ? geoPosition.replace(";", ", ")
    : geoPosition;

  // Build JSON-LD array if structured data or breadcrumbs provided
  const structuredDataList: Array<Record<string, any>> = [];

  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      structuredDataList.push(...jsonLd);
    } else {
      structuredDataList.push(jsonLd);
    }
  }

  // Auto-generate BreadcrumbList schema if breadcrumbs are passed
  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.item,
      })),
    });
  }

  return (
    <>
      {/* React 19 natively hoists <title>, <meta>, <link>, and <script> tags to <head> */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywordsStr && <meta name="keywords" content={keywordsStr} />}

      {/* Regional & Geographic Meta Tags for South African Local SEO */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={icbmCoords} />
      <meta httpEquiv="content-language" content="en-za" />

      {/* Robots Directive */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />
      <meta
        name="googlebot"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        }
      />

      {/* OpenGraph Protocol Tags */}
      <meta property="og:site_name" content="SpaceHead AI" />
      <meta property="og:locale" content="en_ZA" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Article Specific OpenGraph Tags */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === "article" && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {ogType === "article" &&
        articleTags &&
        articleTags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter / X Social Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SpaceHeadAI" />
      <meta name="twitter:creator" content="@SpaceHeadAI" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Schema.org Structured Data (JSON-LD) */}
      {structuredDataList.map((data, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/<\/script>/gi, "<\\/script>"),
          }}
        />
      ))}
    </>
  );
}
