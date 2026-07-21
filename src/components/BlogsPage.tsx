import { useState, useMemo } from "react";
import { BlogPost } from "../types";
import SEO from "./SEO";
import { BookOpen, Search, ArrowLeft, Calendar, User, Clock, ChevronRight } from "lucide-react";

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
  onCloseBlog
}: BlogsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(blogs.map((b) => b.category));
    return ["All", ...Array.from(cats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Helper to parse content with safe markdown-like styles (paragraphs, custom code, titles)
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];

    return lines.map((line, idx) => {
      // Handle Code Block boundary
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeContent = codeBlockLines.join("\n");
          codeBlockLines = [];
          return (
            <pre key={idx} className="bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 rounded-xl overflow-x-auto my-4 border border-slate-800 leading-relaxed">
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

      // Handle Headings
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-sans font-bold text-slate-900 mt-8 mb-4">
            {line.substring(3)}
          </h3>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-lg font-sans font-bold text-slate-900 mt-6 mb-3">
            {line.substring(4)}
          </h4>
        );
      }

      // Handle empty paragraphs
      if (line.trim() === "") {
        return <div key={idx} className="h-4" />;
      }

      // Return general paragraph with styled highlights
      return (
        <p key={idx} className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div id="blogs-view" className="space-y-10 pb-16">
      {selectedBlog ? (
        <SEO 
          title={selectedBlog.title}
          description={selectedBlog.summary}
          canonicalUrl={`https://spacehead.co.za/blog/${selectedBlog.id}`}
        />
      ) : (
        <SEO 
          title="Insights & South African Business Marketing Guides"
          description="Read modern digital branding tactics, conversion science, and South African local business marketing guides compiled by SpaceHead AI."
          canonicalUrl="https://spacehead.co.za/blog"
        />
      )}

      {selectedBlog ? (
        /* Detailed Blog Reader View */
        <article className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <button
            onClick={onCloseBlog}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1.5 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all publications</span>
          </button>

          {/* Meta header details */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100 uppercase tracking-wider">
              {selectedBlog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
              {selectedBlog.title}
            </h1>

            <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>{selectedBlog.authorName || "SpaceHead AI"}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{new Date(selectedBlog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{getReadingTime(selectedBlog.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Content Render */}
          <div className="prose max-w-none">
            {renderFormattedContent(selectedBlog.content)}
          </div>

          {/* Footer tags */}
          <div className="flex flex-wrap gap-1.5 pt-8 border-t border-slate-100">
            {selectedBlog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-50 text-slate-600 text-xs font-mono px-3 py-1 rounded-lg border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
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
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
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

          {/* List display */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => onSelectBlog(blog)}
                  className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group border-l-4 border-l-slate-200 hover:border-l-purple-600"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                      <span className="text-purple-600 font-semibold uppercase">{blog.category}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
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
              <p className="text-sm font-medium text-slate-500 font-sans">No matching journal articles found</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="text-xs text-purple-600 hover:text-purple-700 font-semibold mt-2 underline"
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
