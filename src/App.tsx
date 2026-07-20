import { useState, useEffect, useCallback, useTransition } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Project, BlogPost } from "./types";
import { INITIAL_PROJECTS, INITIAL_BLOGS } from "./data/initialData";
import { 
  fetchProjects, 
  saveProject, 
  modifyProject, 
  removeProject, 
  fetchBlogs, 
  saveBlog, 
  modifyBlog, 
  removeBlog 
} from "./lib/firebaseServices";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ServicesPage from "./components/ServicesPage";
import ProjectsPage from "./components/ProjectsPage";
import BlogsPage from "./components/BlogsPage";
import ContactPage from "./components/ContactPage";
import AuthPage from "./components/AuthPage";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Data Lists
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [dataLoading, setDataLoading] = useState(false);

  // Selected Detail views
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Transition hooks
  const [isPending, startTransition] = useTransition();

  // Handle Tab Switch nicely with React 18 Transition APIs
  const handleTabChange = useCallback((tab: string) => {
    startTransition(() => {
      setCurrentTab(tab);
      // Close detailed subviews on main navigation click
      setSelectedProject(null);
      setSelectedBlog(null);
    });
  }, []);

  // Monitor Authentication state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        // Switch to admin if user lands on auth
        if (currentTab === "auth") {
          setCurrentTab("admin");
        }
      } else {
        // If logged out and not on a public page, reset to home
        setUser(null);
        if (currentTab === "admin") {
          setCurrentTab("home");
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [currentTab]);

  // Load projects and blogs based on authentication context and active collections
  const loadWorkspaceData = useCallback(async () => {
    setDataLoading(true);
    try {
      if (user && user.uid === "demo-bypass") {
        // Load custom demo storage from localStorage if available
        const localProjs = localStorage.getItem("demo_projects");
        const localBlogs = localStorage.getItem("demo_blogs");
        
        if (localProjs) {
          setProjects(JSON.parse(localProjs));
        } else {
          setProjects(INITIAL_PROJECTS);
          localStorage.setItem("demo_projects", JSON.stringify(INITIAL_PROJECTS));
        }

        if (localBlogs) {
          setBlogs(JSON.parse(localBlogs));
        } else {
          setBlogs(INITIAL_BLOGS);
          localStorage.setItem("demo_blogs", JSON.stringify(INITIAL_BLOGS));
        }
      } else {
        // Fetch real Firestore datasets (only fetches public ones if not authenticated, or all if admin)
        const fetchedProjects = await fetchProjects(user ? user.uid : undefined);
        const fetchedBlogs = await fetchBlogs(user ? user.uid : undefined);
        setProjects(fetchedProjects);
        setBlogs(fetchedBlogs);
      }
    } catch (error) {
      console.warn("Failed loading synchronized datasets, falling back to mock layers", error);
      setProjects(INITIAL_PROJECTS);
      setBlogs(INITIAL_BLOGS);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  // Trigger content loading whenever user profile changes
  useEffect(() => {
    // Only load if not server-side
    if (typeof window !== "undefined") {
      loadWorkspaceData();
    }
  }, [user, loadWorkspaceData]);

  // Handle logout
  const handleLogout = async () => {
    if (user && user.uid === "demo-bypass") {
      setUser(null);
      setCurrentTab("home");
      return;
    }
    if (auth) {
      await signOut(auth);
    }
  };

  // Demo Bypass Workspace Trigger
  const handleEnterDemo = () => {
    setUser({
      uid: "demo-bypass",
      email: "demo.developer@studio.com"
    });
    setCurrentTab("admin");
  };

  // ---------------- ADMIN CREATIVE MUTATIONS ----------------

  const handleAddProject = async (projPayload: Omit<Project, "id">) => {
    if (user && user.uid === "demo-bypass") {
      const newProj = { id: `proj-${Date.now()}`, ...projPayload };
      const updatedList = [newProj, ...projects];
      setProjects(updatedList);
      localStorage.setItem("demo_projects", JSON.stringify(updatedList));
      return;
    }
    await saveProject(projPayload);
    await loadWorkspaceData();
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    if (user && user.uid === "demo-bypass") {
      const updatedList = projects.map((p) => p.id === id ? { ...p, ...updates } : p);
      setProjects(updatedList);
      localStorage.setItem("demo_projects", JSON.stringify(updatedList));
      return;
    }
    await modifyProject(id, updates);
    await loadWorkspaceData();
  };

  const handleDeleteProject = async (id: string) => {
    if (user && user.uid === "demo-bypass") {
      const updatedList = projects.filter((p) => p.id !== id);
      setProjects(updatedList);
      localStorage.setItem("demo_projects", JSON.stringify(updatedList));
      return;
    }
    await removeProject(id);
    await loadWorkspaceData();
  };

  const handleAddBlog = async (blogPayload: Omit<BlogPost, "id">) => {
    if (user && user.uid === "demo-bypass") {
      const newBlog = { id: `blog-${Date.now()}`, ...blogPayload };
      const updatedList = [newBlog, ...blogs];
      setBlogs(updatedList);
      localStorage.setItem("demo_blogs", JSON.stringify(updatedList));
      return;
    }
    await saveBlog(blogPayload);
    await loadWorkspaceData();
  };

  const handleUpdateBlog = async (id: string, updates: Partial<BlogPost>) => {
    if (user && user.uid === "demo-bypass") {
      const updatedList = blogs.map((b) => b.id === id ? { ...b, ...updates } : b);
      setBlogs(updatedList);
      localStorage.setItem("demo_blogs", JSON.stringify(updatedList));
      return;
    }
    await modifyBlog(id, updates);
    await loadWorkspaceData();
  };

  const handleDeleteBlog = async (id: string) => {
    if (user && user.uid === "demo-bypass") {
      const updatedList = blogs.filter((b) => b.id !== id);
      setBlogs(updatedList);
      localStorage.setItem("demo_blogs", JSON.stringify(updatedList));
      return;
    }
    await removeBlog(id);
    await loadWorkspaceData();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <div>
        <Navbar 
          currentTab={currentTab} 
          onTabChange={handleTabChange} 
          user={user} 
          onLogout={handleLogout} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {authLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider">
                  Loading Workspace Hub...
                </span>
              </div>
            </div>
          ) : (
            <div className={isPending ? "opacity-75 transition-opacity" : ""}>
              {currentTab === "home" && (
                <Home 
                  projects={projects} 
                  blogs={blogs} 
                  onTabChange={handleTabChange}
                  onSelectProject={(p) => { setSelectedProject(p); handleTabChange("projects"); }}
                  onSelectBlog={(b) => { setSelectedBlog(b); handleTabChange("blogs"); }}
                />
              )}

              {currentTab === "services" && (
                <ServicesPage 
                  onTabChange={handleTabChange}
                />
              )}

              {currentTab === "projects" && (
                <ProjectsPage 
                  projects={projects} 
                  onSelectProject={setSelectedProject}
                  selectedProject={selectedProject}
                  onCloseModal={() => setSelectedProject(null)}
                />
              )}

              {currentTab === "blogs" && (
                <BlogsPage 
                  blogs={blogs} 
                  onSelectBlog={setSelectedBlog}
                  selectedBlog={selectedBlog}
                  onCloseBlog={() => setSelectedBlog(null)}
                />
              )}

              {currentTab === "contact" && (
                <ContactPage />
              )}

              {currentTab === "auth" && (
                <AuthPage 
                  onAuthSuccess={(u) => { setUser(u); handleTabChange("admin"); }} 
                  onEnterDemo={handleEnterDemo}
                />
              )}

              {currentTab === "admin" && (
                <AdminPanel 
                  projects={projects} 
                  blogs={blogs} 
                  user={user} 
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onAddBlog={handleAddBlog}
                  onUpdateBlog={handleUpdateBlog}
                  onDeleteBlog={handleDeleteBlog}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <Footer onTabChange={handleTabChange} />
    </div>
  );
}
