import { useState, useMemo } from "react";
import { Project } from "../types";
import SEO from "./SEO";
import { Code, Search, ExternalLink, Github, Globe, X, PlusCircle, Play } from "lucide-react";

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedProject: Project | null;
  onCloseModal: () => void;
}

function getEmbedUrl(url?: string): { isVideo: boolean; embedUrl?: string; isDirectVideo?: boolean } {
  if (!url) return { isVideo: false };

  // Google Drive file link
  const driveMatch = url.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return {
      isVideo: true,
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }

  // YouTube match
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return {
      isVideo: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch) {
    return {
      isVideo: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // Direct video extensions
  const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
  if (
    cleanUrl.endsWith(".mp4") || 
    cleanUrl.endsWith(".webm") || 
    cleanUrl.endsWith(".ogg") || 
    cleanUrl.endsWith(".mov") ||
    url.includes("googleusercontent.com/drive-viewer")
  ) {
    return {
      isVideo: true,
      isDirectVideo: true,
      embedUrl: url
    };
  }

  return { isVideo: false };
}

export default function ProjectsPage({ 
  projects, 
  onSelectProject, 
  selectedProject, 
  onCloseModal 
}: ProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div id="projects-view" className="space-y-10 pb-16">
      <SEO 
        title="Bespoke Creative Showcase | Premium Project Portfolio"
        description="Browse our portfolio of bespoke creative digital assets, high-converting brand identity concepts, and premium responsive business websites designed for absolute luxury and impact."
        canonicalUrl="https://spacehead.co.za/projects"
      />
      
      {/* Page Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto mt-6">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Bespoke Creative Showcase
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          A portfolio of premium digital assets, high-converting brand identity concepts, and custom-built responsive websites engineered for excellence.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, tag..."
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

      {/* Grid List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasVideo = project.category === "Animated Videos" || getEmbedUrl(project.demoUrl).isVideo;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="aspect-video w-full overflow-hidden relative bg-slate-100">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <Code className="w-12 h-12" />
                    </div>
                  )}
                  {hasVideo && (
                    <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/40 flex items-center justify-center transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-orange-500 text-slate-900 group-hover:text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {project.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-sans font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Code className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500 font-sans">No matching projects found</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="text-xs text-purple-600 hover:text-purple-700 font-semibold mt-2 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Dynamic Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative aspect-video w-full bg-slate-100">
              {(() => {
                const video = getEmbedUrl(selectedProject.demoUrl);
                if (video.isVideo) {
                  if (video.isDirectVideo) {
                    return (
                      <video 
                        src={video.embedUrl} 
                        controls 
                        autoPlay
                        className="w-full h-full object-contain bg-black"
                      />
                    );
                  }
                  return (
                    <iframe
                      src={video.embedUrl}
                      className="w-full h-full border-none"
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                      title={selectedProject.title}
                    />
                  );
                }

                if (selectedProject.imageUrl) {
                  return (
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  );
                }

                return (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Code className="w-16 h-16" />
                  </div>
                );
              })()}
              <button
                onClick={onCloseModal}
                className="absolute top-4 right-4 p-2 bg-white/95 text-slate-700 hover:bg-slate-100 rounded-full shadow-md transition-colors z-10"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 id="modal-title" className="text-2xl font-sans font-extrabold text-slate-900">
                  {selectedProject.title}
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {selectedProject.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-50 text-slate-600 text-xs font-mono px-2.5 py-1 rounded-lg border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Live Demo</span>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
