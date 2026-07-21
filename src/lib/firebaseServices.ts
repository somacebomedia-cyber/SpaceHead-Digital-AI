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
  getDoc,
  setDoc
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

// ---------------- FIRESTORE ERROR HANDLING ----------------

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

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
        where("userId", "==", userId)
      );
    } else {
      q = query(
        collection(db, PROJECTS_COLLECTION),
        where("isPublic", "==", true)
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

    // Sort in memory by createdAt descending
    projects.sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return timeB - timeA;
    });

    // If Firestore has no items, merge/return standard ones
    if (projects.length === 0 && !userId) {
      return INITIAL_PROJECTS;
    }

    return projects;
  } catch (error: any) {
    if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
      handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
    }
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
  } catch (error: any) {
    console.error("Error writing project to Firestore", error);
    handleFirestoreError(error, OperationType.CREATE, PROJECTS_COLLECTION);
    throw error;
  }
}

export async function modifyProject(id: string, updates: Partial<Project>): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  try {
    await updateDoc(docRef, updates);
  } catch (error: any) {
    console.error("Error updating project in Firestore", error);
    handleFirestoreError(error, OperationType.UPDATE, `${PROJECTS_COLLECTION}/${id}`);
  }
}

export async function removeProject(id: string): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error("Error deleting project in Firestore", error);
    handleFirestoreError(error, OperationType.DELETE, `${PROJECTS_COLLECTION}/${id}`);
  }
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
        where("userId", "==", userId)
      );
    } else {
      q = query(
        collection(db, BLOGS_COLLECTION),
        where("isPublished", "==", true)
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

    // Sort in memory by createdAt descending
    blogs.sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return timeB - timeA;
    });

    if (blogs.length === 0 && !userId) {
      return INITIAL_BLOGS;
    }

    return blogs;
  } catch (error: any) {
    if (error?.code === "permission-denied" || error?.message?.includes("permissions")) {
      handleFirestoreError(error, OperationType.LIST, BLOGS_COLLECTION);
    }
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
  } catch (error: any) {
    console.error("Error writing blog to Firestore", error);
    handleFirestoreError(error, OperationType.CREATE, BLOGS_COLLECTION);
    throw error;
  }
}

export async function modifyBlog(id: string, updates: Partial<BlogPost>): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, BLOGS_COLLECTION, id);
  try {
    await updateDoc(docRef, updates);
  } catch (error: any) {
    console.error("Error updating blog in Firestore", error);
    handleFirestoreError(error, OperationType.UPDATE, `${BLOGS_COLLECTION}/${id}`);
  }
}

export async function removeBlog(id: string): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  const docRef = doc(db, BLOGS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error("Error deleting blog in Firestore", error);
    handleFirestoreError(error, OperationType.DELETE, `${BLOGS_COLLECTION}/${id}`);
  }
}

// ---------------- SETTINGS SERVICES ----------------

export interface AppSettings {
  driveApiKey?: string;
  videosFolderUrl?: string;
  graphicsFolderUrl?: string;
}

export async function fetchAppSettings(): Promise<AppSettings | null> {
  if (!isClientAndDbReady()) {
    return null;
  }
  try {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppSettings;
    }
    return null;
  } catch (error: any) {
    console.warn("Firestore fetchAppSettings failed, ignoring", error);
    return null;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  if (!isClientAndDbReady()) {
    throw new Error("Firestore is not available.");
  }
  try {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, settings, { merge: true });
  } catch (error: any) {
    console.error("Error writing settings to Firestore", error);
    handleFirestoreError(error, OperationType.WRITE, "settings/global");
    throw error;
  }
}
