import { useState, useMemo, useTransition, FormEvent } from "react";
import GoogleDriveManager from "./GoogleDriveManager";
import GoogleGmailManager from "./GoogleGmailManager";
import { Project, BlogPost } from "../types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Plus, 
  Trash, 
  Edit, 
  Save, 
  RefreshCw, 
  FileText, 
  Check, 
  Eye, 
  EyeOff, 
  Database, 
  Activity, 
  Settings, 
  X, 
  ArrowLeft 
} from "lucide-react";

interface AdminPanelProps {
  projects: Project[];
  blogs: BlogPost[];
  user: any;
  onAddProject: (proj: Omit<Project, "id">) => Promise<void>;
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onAddBlog: (blog: Omit<BlogPost, "id">) => Promise<void>;
  onUpdateBlog: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
}

export default function AdminPanel({
  projects,
  blogs,
  user,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "projects" | "blogs" | "drive" | "gmail">("analytics");
  const [isPending, startTransition] = useTransition();

  // Project Editing State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCat, setProjCat] = useState("Developer Tools");
  const [projTags, setProjTags] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projGit, setProjGit] = useState("");
  const [projImg, setProjImg] = useState("");
  const [projPublic, setProjPublic] = useState(true);

  // Blog Editing State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCat, setBlogCat] = useState("Web Engineering");
  const [blogTags, setBlogTags] = useState("");
  const [blogPublished, setBlogPublished] = useState(true);

  // Database Synchronization Sync status
  const dbStatus = useMemo(() => {
    if (user && user.uid === "demo-bypass") {
      return { connected: true, mode: "Local Persistence Simulation (Demo Mode)", color: "text-amber-500" };
    }
    if (user) {
      return { connected: true, mode: "Cloud Firestore Real-Time Synchronized", color: "text-emerald-500" };
    }
    return { connected: false, mode: "Offline Read-Only", color: "text-slate-400" };
  }, [user]);

  // Chart Data compilation
  const projectCatData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [projects]);

  const blogCatData = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [blogs]);

  const COLORS = ["#f97316", "#eab308", "#10b981", "#3b82f6", "#6366f1", "#a855f7"];

  // Form Submissions
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) return;

    startTransition(async () => {
      const tagList = projTags.split(",").map((t) => t.trim()).filter((t) => t !== "");
      const projectPayload = {
        title: projTitle,
        description: projDesc,
        category: projCat,
        tags: tagList,
        demoUrl: projDemo || undefined,
        githubUrl: projGit || undefined,
        imageUrl: projImg || undefined,
        createdAt: editingProject ? editingProject.createdAt : Date.now(),
        userId: user?.uid || "unknown",
        isPublic: projPublic
      };

      try {
        if (editingProject && editingProject.id) {
          await onUpdateProject(editingProject.id, projectPayload);
        } else {
          await onAddProject(projectPayload);
        }
        resetProjectForm();
      } catch (err) {
        alert("Operation failed. Ensure your connection and rules settings are valid.");
      }
    });
  };

  const handleSaveBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    startTransition(async () => {
      const tagList = blogTags.split(",").map((t) => t.trim()).filter((t) => t !== "");
      const slugVal = blogSlug.trim().toLowerCase().replace(/\s+/g, "-") || 
                      blogTitle.trim().toLowerCase().replace(/\s+/g, "-");

      const blogPayload = {
        title: blogTitle,
        slug: slugVal,
        summary: blogSummary,
        content: blogContent,
        category: blogCat,
        tags: tagList,
        createdAt: editingBlog ? editingBlog.createdAt : Date.now(),
        updatedAt: Date.now(),
        userId: user?.uid || "unknown",
        authorName: user?.email ? user.email.split("@")[0] : "SpaceHead Creator",
        isPublished: blogPublished
      };

      try {
        if (editingBlog && editingBlog.id) {
          await onUpdateBlog(editingBlog.id, blogPayload);
        } else {
          await onAddBlog(blogPayload);
        }
        resetBlogForm();
      } catch (err) {
        alert("Operation failed. Verify database access constraints.");
      }
    });
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setIsAddingProject(false);
    setProjTitle("");
    setProjDesc("");
    setProjCat("Developer Tools");
    setProjTags("");
    setProjDemo("");
    setProjGit("");
    setProjImg("");
    setProjPublic(true);
  };

  const resetBlogForm = () => {
    setEditingBlog(null);
    setIsAddingBlog(false);
    setBlogTitle("");
    setBlogSlug("");
    setBlogSummary("");
    setBlogContent("");
    setBlogCat("Web Engineering");
    setBlogTags("");
    setBlogPublished(true);
  };

  const loadProjectForEdit = (p: Project) => {
    setEditingProject(p);
    setIsAddingProject(true);
    setProjTitle(p.title);
    setProjDesc(p.description);
    setProjCat(p.category);
    setProjTags(p.tags.join(", "));
    setProjDemo(p.demoUrl || "");
    setProjGit(p.githubUrl || "");
    setProjImg(p.imageUrl || "");
    setProjPublic(p.isPublic);
  };

  const loadBlogForEdit = (b: BlogPost) => {
    setEditingBlog(b);
    setIsAddingBlog(true);
    setBlogTitle(b.title);
    setBlogSlug(b.slug);
    setBlogSummary(b.summary);
    setBlogContent(b.content);
    setBlogCat(b.category);
    setBlogTags(b.tags.join(", "));
    setBlogPublished(b.isPublished);
  };

  return (
    <div id="admin-view" className="space-y-10 pb-16">
      {/* Studio Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl mt-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-wider">
              {dbStatus.mode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight">
            Developer Studio Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Welcome, <span className="text-slate-200 font-semibold">{user?.email || "Demo Admin"}</span>. Manage your workspace indices dynamically.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
              activeSubTab === "analytics"
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Analytics Panel
          </button>
          <button
            onClick={() => setActiveSubTab("projects")}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
              activeSubTab === "projects"
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Manage Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveSubTab("blogs")}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
              activeSubTab === "blogs"
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Manage Blog Posts ({blogs.length})
          </button>
          <button
            onClick={() => setActiveSubTab("drive")}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
              activeSubTab === "drive"
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Google Drive Storage
          </button>
          <button
            onClick={() => setActiveSubTab("gmail")}
            className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
              activeSubTab === "gmail"
                ? "bg-white text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Gmail Workspace
          </button>
        </div>
      </div>

      {/* Analytics Sub Tab */}
      {activeSubTab === "analytics" && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Portfolio Items</span>
                <Settings className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-sans font-extrabold text-slate-900 mt-2">{projects.length}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {projects.filter((p) => p.isPublic).length} public • {projects.filter((p) => !p.isPublic).length} hidden
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Publications</span>
                <FileText className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-sans font-extrabold text-slate-900 mt-2">{blogs.length}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {blogs.filter((b) => b.isPublished).length} published articles
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Storage Sync Mode</span>
                <Database className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-sm font-bold text-slate-800 mt-2.5 truncate">{dbStatus.mode}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Connected to project: <span className="font-mono bg-slate-100 text-slate-700 px-1 rounded">gen-lang-client</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col h-[320px]">
              <h3 className="font-sans font-bold text-slate-800 text-sm tracking-wide mb-4">
                Projects Category Breakdown
              </h3>
              <div className="flex-1 w-full min-h-[220px]">
                {projectCatData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectCatData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {projectCatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">No project data available</div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
                {projectCatData.map((item, idx) => (
                  <div key={item.name} className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[10px] text-slate-600 font-medium">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm flex flex-col h-[320px]">
              <h3 className="font-sans font-bold text-slate-800 text-sm tracking-wide mb-4">
                Articles Category Distribution
              </h3>
              <div className="flex-1 w-full min-h-[220px]">
                {blogCatData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={blogCatData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} barSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">No blog data available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Management Sub Tab */}
      {activeSubTab === "projects" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-sans font-bold text-slate-900">Manage Portfolio Projects</h2>
            {!isAddingProject && (
              <button
                onClick={() => setIsAddingProject(true)}
                className="flex items-center space-x-1.5 px-4.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            )}
          </div>

          {isAddingProject ? (
            /* Creation Form */
            <form onSubmit={handleSaveProject} className="bg-white border border-slate-150 p-6 sm:p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-sans font-bold text-slate-950">
                  {editingProject ? "Update Portfolio Project" : "Add New Showcase Entry"}
                </h3>
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. AI Vision Assistant"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category *</label>
                  <select
                    value={projCat}
                    onChange={(e) => setProjCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Security & Cloud">Security & Cloud</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Project Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Enter a descriptive summary explaining goals, challenges, and implementation architecture."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={projTags}
                    onChange={(e) => setProjTags(e.target.value)}
                    placeholder="React, TypeScript, Firebase"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Unsplash/Web)</label>
                  <input
                    type="url"
                    value={projImg}
                    onChange={(e) => setProjImg(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Live Demo URL</label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://example.com/demo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projGit}
                    onChange={(e) => setProjGit(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <input
                    type="checkbox"
                    id="proj-public"
                    checked={projPublic}
                    onChange={(e) => setProjPublic(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="proj-public" className="text-xs font-semibold text-slate-700">
                    Publish to Public Portfolio immediately (Visible to guest visitors)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "Syncing..." : "Save Showcase Project"}</span>
                </button>
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Items List */
            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 pl-6">Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4">Date Added</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                        <td className="p-4 pl-6 max-w-xs sm:max-w-sm">
                          <div className="font-semibold text-slate-950 font-sans">{p.title}</div>
                          <div className="text-xs text-slate-400 font-mono truncate">{p.id}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-150">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4">
                          {p.isPublic ? (
                            <span className="flex items-center text-xs font-medium text-emerald-600">
                              <Eye className="w-4 h-4 mr-1 shrink-0" />
                              <span>Public</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-xs font-medium text-slate-400">
                              <EyeOff className="w-4 h-4 mr-1 shrink-0" />
                              <span>Hidden</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => loadProjectForEdit(p)}
                            className="p-1.5 hover:bg-slate-100 hover:text-orange-600 rounded-lg text-slate-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(p.id!)}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-xs text-slate-400 font-mono">
                          Workspace collection is currently empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blogs Management Sub Tab */}
      {activeSubTab === "blogs" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-sans font-bold text-slate-900">Manage Blog Publications</h2>
            {!isAddingBlog && (
              <button
                onClick={() => setIsAddingBlog(true)}
                className="flex items-center space-x-1.5 px-4.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </button>
            )}
          </div>

          {isAddingBlog ? (
            /* Creation Form */
            <form onSubmit={handleSaveBlog} className="bg-white border border-slate-150 p-6 sm:p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="font-sans font-bold text-slate-950">
                  {editingBlog ? "Edit Technical Article" : "Write Technical Article"}
                </h3>
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Mastering React Hydration"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Slug Path (URL identifier)</label>
                  <input
                    type="text"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="mastering-react-hydration"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category *</label>
                  <select
                    value={blogCat}
                    onChange={(e) => setBlogCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  >
                    <option value="Web Engineering">Web Engineering</option>
                    <option value="Security & Cloud">Security & Cloud</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="React 18, SSR, Vite"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Short Summary *</label>
                  <input
                    type="text"
                    required
                    value={blogSummary}
                    onChange={(e) => setBlogSummary(e.target.value)}
                    placeholder="Summarize the core technical findings or target problem of this tutorial..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Article Markdown Content *</label>
                  <textarea
                    required
                    rows={12}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write content using headings (## Title) and code blocks (```code```)."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <input
                    type="checkbox"
                    id="blog-published"
                    checked={blogPublished}
                    onChange={(e) => setBlogPublished(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="blog-published" className="text-xs font-semibold text-slate-700">
                    Publish article immediately (Visible on guest technical journal)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "Syncing..." : "Publish Article"}</span>
                </button>
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Items List */
            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Author</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                        <td className="p-4 pl-6 max-w-xs sm:max-w-sm">
                          <div className="font-semibold text-slate-950 font-sans">{b.title}</div>
                          <div className="text-xs text-slate-400 font-mono truncate">/blog/{b.slug}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-150">
                            {b.category}
                          </span>
                        </td>
                        <td className="p-4">
                          {b.isPublished ? (
                            <span className="flex items-center text-xs font-medium text-emerald-600">
                              <Check className="w-4.5 h-4.5 mr-0.5 shrink-0" />
                              <span>Published</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-xs font-medium text-slate-400">
                              <EyeOff className="w-4 h-4 mr-1 shrink-0" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-500">
                          {b.authorName || "SpaceHead AI"}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => loadBlogForEdit(b)}
                            className="p-1.5 hover:bg-slate-100 hover:text-orange-600 rounded-lg text-slate-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBlog(b.id!)}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {blogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-xs text-slate-400 font-mono">
                          Workspace publications collection is empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Google Drive Sub Tab */}
      {activeSubTab === "drive" && (
        <div className="animate-in fade-in duration-200">
          <GoogleDriveManager 
            projects={projects}
            blogs={blogs}
            onImportBlog={(title, content, summary) => {
              // Switch subtab, toggle form open, and populate with parsed content
              setActiveSubTab("blogs");
              setIsAddingBlog(true);
              setBlogTitle(title);
              setBlogContent(content);
              setBlogSummary(summary);
              setBlogSlug(title.trim().toLowerCase().replace(/\s+/g, "-"));
            }}
            onImportProject={onAddProject}
          />
        </div>
      )}

      {/* Gmail Workspace Sub Tab */}
      {activeSubTab === "gmail" && (
        <div className="animate-in fade-in duration-200">
          <GoogleGmailManager />
        </div>
      )}
    </div>
  );
}
