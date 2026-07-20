import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getFirestore
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { Project, BlogPost } from "../types";
import { INITIAL_PROJECTS, INITIAL_BLOGS } from "../data/initialData";

const PROJECTS_COLLECTION = "projects";
const BLOGS_COLLECTION = "blogs";

// Helper to check if Firestore is available (runs only on client)
const isClientAndDbReady = () => {
  return typeof window !== "undefined" && db !== null;
};

// ---------------- PROJECTS SERVICES ----------------

export async function fetchProjects(userId?: string): Promise<Project[]> {
  if (!isClientAndDbReady()) {
    return INITIAL_PROJECTS;
  }

  try {
    let q;
    if (userId) {
      q = query(
        collection(db, PROJECTS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, PROJECTS_COLLECTION),
        where("isPublic", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, any>;
      projects.push({
        id: docSnap.id,
        ...data
      } as Project);
    });

    // If Firestore has no items, merge/return standard ones
    if (projects.length === 0 && !userId) {
      return INITIAL_PROJECTS;
    }

    return projects;
  } catch (error) {
    console.warn("Firestore projects fetch failed, using mock data", error);
    return INITIAL_PROJECTS;
  }
}

export async function saveProject(project: Omit<Project, "id">): Promise<string> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available in server context.");
  }

  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), project);
    return docRef.id;
  } catch (error) {
    console.error("Error writing project to Firestore", error);
    throw error;
  }
}

export async function modifyProject(id: string, updates: Partial<Project>): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(docRef, updates);
}

export async function removeProject(id: string): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// ---------------- BLOGS SERVICES ----------------

export async function fetchBlogs(userId?: string): Promise<BlogPost[]> {
  if (!isClientAndDbReady()) {
    return INITIAL_BLOGS;
  }

  try {
    let q;
    if (userId) {
      q = query(
        collection(db, BLOGS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, BLOGS_COLLECTION),
        where("isPublished", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const blogs: BlogPost[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, any>;
      blogs.push({
        id: docSnap.id,
        ...data
      } as BlogPost);
    });

    if (blogs.length === 0 && !userId) {
      return INITIAL_BLOGS;
    }

    return blogs;
  } catch (error) {
    console.warn("Firestore blogs fetch failed, using mock data", error);
    return INITIAL_BLOGS;
  }
}

export async function saveBlog(blog: Omit<BlogPost, "id">): Promise<string> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available in server context.");
  }

  try {
    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), blog);
    return docRef.id;
  } catch (error) {
    console.error("Error writing blog to Firestore", error);
    throw error;
  }
}

export async function modifyBlog(id: string, updates: Partial<BlogPost>): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await updateDoc(docRef, updates);
}

export async function removeBlog(id: string): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, BLOGS_COLLECTION, id);
  await deleteDoc(docRef);
}
