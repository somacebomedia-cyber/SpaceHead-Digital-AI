import React from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonicalUrl = "https://spacehead.co.za", 
  ogImage = "https://spacehead.co.za/logo.png", 
  ogType = "website" 
}: SEOProps) {
  const fullTitle = `${title} | SpaceHead AI`;

  return (
    <>
      {/* React 19 natively hoists <title>, <meta>, and <link> tags to the document <head> */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
}
