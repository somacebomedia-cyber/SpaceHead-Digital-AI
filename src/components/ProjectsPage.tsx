import { useState, useMemo } from "react";
import { Project } from "../types";
import SEO, { DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA } from "./SEO";
import { Code, Search, ExternalLink, Github, Globe, X, PlusCircle, Play, Maximize2, Film } from "lucide-react";
import VideoLightboxModal from "./VideoLightboxModal";
import VideoEmbedPlayer from "./VideoEmbedPlayer";
import { ProjectCardSkeleton } from "./ShimmerSkeletons";

interface ProjectsPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedProject: Project | null;
  onCloseModal: () => void;
}

function getEmbedUrl(url?: string, category?: string): { isVideo: boolean; embedUrl?: string; isDirectVideo?: boolean } {
  if (!url) return { isVideo: false };

  const isAnimatedVideoCat = category === "Animated Videos";

  // Google Drive file link
  const driveMatch = url.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    if (isAnimatedVideoCat || url.includes("/preview")) {
      return {
        isVideo: true,
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
      };
    }
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
    cleanUrl.endsWith(".mov")
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightboxVideoProject, setLightboxVideoProject] = useState<Project | null>(null);
  const [isHydrating, setIsHydrating] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsHydrating(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsHydrating(false), 120);
  };

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
        title="Web Design & Video Ads Portfolio for SA Businesses"
        description="Explore custom websites, animated promotional video ads, and digital branding projects built for South African businesses, medical practices, and emerging startups."
        canonicalUrl="https://spaceheadai.co.za/projects"
        keywords={[
          "web design portfolio south africa",
          "south african business website examples",
          "animated video ads showcase",
          "promotional video portfolio south africa",
          "medical practice website portfolio za",
          "graphic design portfolio johannesburg",
          "responsive web agency cape town durban"
        ]}
        geoRegion="ZA"
        geoPlacename="South Africa"
        breadcrumbs={[
          { name: "Home", item: "https://spaceheadai.co.za" },
          { name: "Portfolio", item: "https://spaceheadai.co.za/projects" }
        ]}
        jsonLd={[
          DEFAULT_SOUTH_AFRICA_BUSINESS_SCHEMA,
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "SpaceHead AI Creative Portfolio & Case Studies",
            "url": "https://spaceheadai.co.za/projects",
            "description": "Showcase of responsive web design, animated promotional video ads, and digital brand identities delivered for South African businesses."
          }
        ]}
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

      {/* Grid List or Shimmer Hydration Skeletons */}
      {isHydrating ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const hasVideo = project.category === "Animated Videos" && getEmbedUrl(project.demoUrl, project.category).isVideo;
            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className={`aspect-video w-full overflow-hidden relative flex items-center justify-center ${
                  hasVideo ? "bg-slate-900" : "bg-slate-950 p-6 border-b border-slate-800/80"
                }`}>
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className={`transition-all duration-300 group-hover:scale-105 ${
                        hasVideo
                          ? "w-full h-full object-cover"
                          : "max-h-[85%] max-w-[85%] object-contain drop-shadow-md"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900">
                      <Code className="w-12 h-12" />
                    </div>
                  )}
                  {hasVideo && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxVideoProject(project);
                      }}
                      className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/40 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-orange-500 text-slate-900 group-hover:text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {project.category}
                  </span>
                  {project.status && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 border border-amber-400/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {project.status}
                    </span>
                  )}
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
                  <div className="pt-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                            tag === "In Active Development"
                              ? "bg-amber-50 text-amber-800 border-amber-200 font-semibold"
                              : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {hasVideo ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxVideoProject(project);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch in Cinema Player</span>
                      </button>
                    ) : project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-900 hover:bg-purple-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{project.demoUrl.includes("vercel.app") ? "Open Vercel App Preview" : "Visit Live Site"}</span>
                      </a>
                    ) : null}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              {(() => {
                const video = getEmbedUrl(selectedProject.demoUrl, selectedProject.category);
                if (video.isVideo && video.embedUrl) {
                  return (
                    <VideoEmbedPlayer
                      embedUrl={video.embedUrl}
                      isDirectVideo={video.isDirectVideo}
                      title={selectedProject.title}
                      category={selectedProject.category}
                      demoUrl={selectedProject.demoUrl}
                      className="w-full h-full"
                    />
                  );
                }

                if (selectedProject.imageUrl) {
                  return (
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      loading="lazy"
                      decoding="async"
                      className="max-h-[85%] max-w-[85%] object-contain cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setIsFullscreen(true)}
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

              {/* Fullscreen Trigger Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-3 left-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold rounded-full shadow-md backdrop-blur-md transition-all flex items-center space-x-1.5 z-10"
                title="Expand Full Screen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Screen</span>
              </button>

              <button
                onClick={() => { setIsFullscreen(false); onCloseModal(); }}
                className="absolute top-3 right-3 p-2 bg-white/95 text-slate-700 hover:bg-slate-100 rounded-full shadow-md transition-colors z-10"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                    {selectedProject.category}
                  </span>
                  {selectedProject.status && (
                    <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {selectedProject.status}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 id="modal-title" className="text-xl sm:text-2xl font-sans font-extrabold text-slate-900">
                  {selectedProject.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
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
                {getEmbedUrl(selectedProject.demoUrl, selectedProject.category).isVideo && (
                  <button
                    type="button"
                    onClick={() => {
                      onCloseModal();
                      setLightboxVideoProject(selectedProject);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    <span>Watch in Cinema Player</span>
                  </button>
                )}

                <button
                  onClick={() => setIsFullscreen(true)}
                  className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>View Full Screen</span>
                </button>

                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-purple-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {selectedProject.demoUrl.includes("vercel.app")
                        ? "Open Vercel App Preview"
                        : selectedProject.demoUrl.includes("drive.google.com")
                        ? "Open Drive Asset Link"
                        : "Visit Live Website"}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Dedicated Lightbox/Media Overlay (Mobile & Desktop) */}
      {isFullscreen && selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between items-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl flex items-center justify-between py-2 px-2 text-white z-20">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans line-clamp-1">{selectedProject.title}</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">{selectedProject.category}</p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex items-center space-x-1"
              aria-label="Exit Fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-6xl flex items-center justify-center my-auto overflow-hidden relative">
            {(() => {
              const video = getEmbedUrl(selectedProject.demoUrl, selectedProject.category);
              if (video.isVideo && video.embedUrl) {
                return (
                  <VideoEmbedPlayer
                    embedUrl={video.embedUrl}
                    isDirectVideo={video.isDirectVideo}
                    title={selectedProject.title}
                    category={selectedProject.category}
                    demoUrl={selectedProject.demoUrl}
                    className="w-full h-full max-h-[88vh] aspect-video rounded-xl overflow-hidden"
                  />
                );
              }

              if (selectedProject.imageUrl) {
                return (
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                );
              }

              return (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <Code className="w-16 h-16" />
                </div>
              );
            })()}
          </div>

          <div className="w-full max-w-6xl flex justify-center py-2 z-20">
            {selectedProject.demoUrl && (
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-md transition-colors flex items-center space-x-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Original Drive File</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Distraction-Free Cinematic Video Lightbox Modal */}
      <VideoLightboxModal
        project={lightboxVideoProject}
        isOpen={!!lightboxVideoProject}
        onClose={() => setLightboxVideoProject(null)}
      />
    </div>
  );
}
