import { useState, useMemo, useEffect } from "react";
import { BlogPost } from "../types";
import SEO, { DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA } from "./SEO";
import {
  BookOpen,
  Search,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ChevronRight,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import ArticleTableOfContents, { HeadingItem } from "./ArticleTableOfContents";
import { whatsappLinkWithMessage, CONTACT_PHONE_DISPLAY } from "../lib/contactInfo";
import { BlogCardSkeleton } from "./ShimmerSkeletons";

interface BlogsPageProps {
  blogs: BlogPost[];
  onSelectBlog: (blog: BlogPost) => void;
  selectedBlog: BlogPost | null;
  onCloseBlog: () => void;
}

export default function BlogsPage({
  blogs,
  onSelectBlog,
  selectedBlog,
  onCloseBlog,
}: BlogsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedLink, setCopiedLink] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [isHydrating, setIsHydrating] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category));
    return ["All", ...Array.from(cats)];
  }, [blogs]);

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsHydrating(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsHydrating(false), 120);
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  // Helper to estimate reading time
  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Extract structured headings for the Table of Contents
  const articleHeadings = useMemo<HeadingItem[]>(() => {
    if (!selectedBlog) return [];
    const lines = selectedBlog.content.split("\n");
    const list: HeadingItem[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("## ")) {
        const text = line.substring(3).trim();
        const slug = `sec-${index}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        list.push({ id: slug, text, level: 2 });
      } else if (line.startsWith("### ")) {
        const text = line.substring(4).trim();
        const slug = `sec-${index}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        list.push({ id: slug, text, level: 3 });
      }
    });

    return list;
  }, [selectedBlog]);

  // Scroll listener for reading progress and active TOC heading
  useEffect(() => {
    if (!selectedBlog) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Check which heading is currently in viewport view
      if (articleHeadings.length > 0) {
        let currentId = articleHeadings[0].id;
        for (const heading of articleHeadings) {
          const el = document.getElementById(heading.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 140) {
              currentId = heading.id;
            }
          }
        }
        setActiveHeadingId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedBlog, articleHeadings]);

  const handleSelectHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveHeadingId(id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper to parse text with inline markdown styles (**bold**, `code`)
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-purple-700 font-mono text-[12px] border border-slate-200/80"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Helper to parse content with safe markdown-like styles
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];

    return lines.map((line, idx) => {
      // Code block start/end
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeContent = codeBlockLines.join("\n");
          codeBlockLines = [];
          return (
            <pre
              key={idx}
              className="bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 sm:p-5 rounded-2xl overflow-x-auto my-6 border border-slate-800 leading-relaxed shadow-xs"
            >
              <code>{codeContent}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return null;
      }

      // Horizontal dividers
      if (line.trim() === "---") {
        return <hr key={idx} className="my-8 border-slate-200/80" />;
      }

      // Headings
      if (line.startsWith("## ")) {
        const text = line.substring(3).trim();
        const slug = `sec-${idx}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        return (
          <h2
            key={idx}
            id={slug}
            className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-10 mb-4 pt-2 tracking-tight scroll-mt-24 group flex items-center"
          >
            <span>{text}</span>
            <a
              href={`#${slug}`}
              className="opacity-0 group-hover:opacity-100 ml-2 text-purple-600 text-sm font-mono transition-opacity"
              aria-hidden="true"
            >
              #
            </a>
          </h2>
        );
      }

      if (line.startsWith("### ")) {
        const text = line.substring(4).trim();
        const slug = `sec-${idx}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        return (
          <h3
            key={idx}
            id={slug}
            className="text-base sm:text-lg font-display font-bold text-slate-800 mt-6 mb-3 scroll-mt-24 group flex items-center"
          >
            <span>{text}</span>
            <a
              href={`#${slug}`}
              className="opacity-0 group-hover:opacity-100 ml-2 text-purple-600 text-xs font-mono transition-opacity"
              aria-hidden="true"
            >
              #
            </a>
          </h3>
        );
      }

      // Bullet lists
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const itemText = line.trim().substring(2);
        return (
          <div key={idx} className="flex items-start space-x-2.5 my-2 ml-1 text-sm text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
            <span className="leading-relaxed">{parseInlineMarkdown(itemText)}</span>
          </div>
        );
      }

      // Numbered items
      const numMatch = line.trim().match(/^([0-9]+)\.\s+(.*)$/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start space-x-2.5 my-2.5 ml-1 text-sm text-slate-600">
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200/60 rounded px-1.5 py-0.5 mt-0.5 flex-shrink-0">
              {numMatch[1]}
            </span>
            <span className="leading-relaxed">{parseInlineMarkdown(numMatch[2])}</span>
          </div>
        );
      }

      // Empty spacing
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base mb-4">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <div id="blogs-view" className="space-y-10 pb-16">
      {/* Reading Progress Indicator Bar when article is open */}
      {selectedBlog && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {selectedBlog ? (
        <SEO
          title={`${selectedBlog.title} | SpaceHead AI Blog`}
          description={selectedBlog.summary}
          canonicalUrl={`https://spaceheadai.co.za/blog/${selectedBlog.id}`}
          ogType="article"
          publishedTime={new Date(selectedBlog.createdAt).toISOString()}
          author={selectedBlog.authorName || "SpaceHead AI"}
          articleSection={selectedBlog.category}
          articleTags={selectedBlog.tags}
          keywords={[
            ...selectedBlog.tags,
            "south african business",
            "south africa digital marketing",
            "local business tips za"
          ]}
          geoRegion="ZA"
          geoPlacename="South Africa"
          breadcrumbs={[
            { name: "Home", item: "https://spaceheadai.co.za" },
            { name: "Blog", item: "https://spaceheadai.co.za/blog" },
            { name: selectedBlog.title, item: `https://spaceheadai.co.za/blog/${selectedBlog.id}` }
          ]}
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://spaceheadai.co.za/blog/${selectedBlog.id}`
              },
              "headline": selectedBlog.title,
              "description": selectedBlog.summary,
              "datePublished": new Date(selectedBlog.createdAt).toISOString(),
              "dateModified": new Date(selectedBlog.createdAt).toISOString(),
              "author": {
                "@type": "Person",
                "name": selectedBlog.authorName || "SpaceHead AI"
              },
              "publisher": {
                "@type": "Organization",
                "name": "SpaceHead AI",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://spaceheadai.co.za/logo.png"
                }
              },
              "articleSection": selectedBlog.category,
              "keywords": [...selectedBlog.tags, "South Africa business", "local marketing"].join(", ")
            }
          ]}
        />
      ) : (
        <SEO
          title="South African Business Marketing & Local SEO Guides"
          description="Discover high-converting website design tips, Google Maps local SEO strategies, PayFast payment tutorials, and marketing guides for South African entrepreneurs."
          canonicalUrl="https://spaceheadai.co.za/blog"
          keywords={[
            "south african business marketing",
            "local seo tips south africa",
            "google maps business profile za",
            "how to get clients south africa",
            "payfast checkout setup guide",
            "small business website guide za",
            "digital marketing tips johannesburg cape town"
          ]}
          geoRegion="ZA"
          geoPlacename="South Africa"
          breadcrumbs={[
            { name: "Home", item: "https://spaceheadai.co.za" },
            { name: "Blog", item: "https://spaceheadai.co.za/blog" }
          ]}
          jsonLd={[
            DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA,
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "SpaceHead AI Business & Marketing Insights",
              "url": "https://spaceheadai.co.za/blog",
              "description": "Guides and tactical frameworks for growing South African local businesses, clinics, and professional practices online."
            }
          ]}
        />
      )}

      {selectedBlog ? (
        /* Detailed Blog Reader View */
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-6">
            <button
              onClick={onCloseBlog}
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 focus:outline-none cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all publications</span>
            </button>

            {/* Quick Share Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                title="Copy Article Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={whatsappLinkWithMessage(
                  `Check out this article from SpaceHead AI: "${selectedBlog.title}"`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Main Article Body */}
            <article className="flex-1 min-w-0 space-y-8 animate-fade-in">
              {/* Meta header details */}
              <div className="space-y-4 border-b border-slate-100 pb-8">
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100 uppercase tracking-wider">
                    {selectedBlog.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-semibold text-purple-700">
                      {getReadingTime(selectedBlog.content)} min read
                    </span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                  {selectedBlog.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans italic border-l-2 border-purple-500 pl-4">
                  {selectedBlog.summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{selectedBlog.authorName || "SpaceHead AI"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      {new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Table of Contents */}
              <ArticleTableOfContents
                headings={articleHeadings}
                activeId={activeHeadingId}
                onSelectHeading={handleSelectHeading}
              />

              {/* Content Render */}
              <div className="prose max-w-none text-slate-700">
                {renderFormattedContent(selectedBlog.content)}
              </div>

              {/* Footer tags */}
              <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-100">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-50 text-slate-600 text-xs font-mono px-3 py-1 rounded-lg border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Call-to-action banner at article finish */}
              <div className="mt-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden space-y-4">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SpaceHead AI Technical Delivery</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    Need a custom high-performance portal or AI tool?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    From responsive websites and interactive web applications to 30-second AI promo video reels, we build production-ready digital assets tailored for South African businesses.
                  </p>
                </div>

                <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={whatsappLinkWithMessage(
                      `Hi SpaceHead AI, I read your publication "${selectedBlog.title}" and would like to discuss building something similar for my business.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp ({CONTACT_PHONE_DISPLAY})</span>
                  </a>

                  <button
                    type="button"
                    onClick={onCloseBlog}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Back to Articles
                  </button>
                </div>
              </div>
            </article>

            {/* Desktop Sticky Table of Contents Sidebar */}
            <ArticleTableOfContents
              headings={articleHeadings}
              activeId={activeHeadingId}
              onSelectHeading={handleSelectHeading}
            />
          </div>
        </div>
      ) : (
        /* Blog Grid List View */
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-3 text-center max-w-2xl mx-auto mt-6">
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Grow Your Business Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Modern digital branding tactics, conversion science, and South African local business guides compiled by SpaceHead AI.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-1 w-full md:w-auto justify-start md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List display or Shimmer Hydration Skeletons */}
          {isHydrating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => onSelectBlog(blog)}
                  className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group border-l-4 border-l-slate-200 hover:border-l-purple-600"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600 font-semibold uppercase">
                          {blog.category}
                        </span>
                        <span>•</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Read time pill */}
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-purple-100">
                        <Clock className="w-3 h-3" />
                        <span>{getReadingTime(blog.content)} min read</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="pt-6 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-50 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                      <span>Read Publication</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500 font-sans">
                No matching journal articles found
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold mt-2 underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

