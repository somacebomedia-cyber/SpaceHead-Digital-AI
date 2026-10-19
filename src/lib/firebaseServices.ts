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
import { Project, BlogPost, ClientLeadInquiry, LeadStatus } from "../types";
import { INITIAL_PROJECTS, INITIAL_BLOGS } from "../data/initialData";

const PROJECTS_COLLECTION = "projects";
const BLOGS_COLLECTION = "blogs";

// Helper to check if Firestore is available (runs only on client)
const isClientAndDbReady = () => {
  if (typeof window === "undefined" || db === null) return false;
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;
  return true;
};

// Timeout helper to avoid waiting endlessly if Firestore is offline or unreachable
const fetchWithTimeout = <T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore request timed out")), timeoutMs)
    )
  ]);
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

    const querySnapshot = await fetchWithTimeout(getDocs(q), 2500);
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, any>;
      projects.push({
        id: docSnap.id,
        ...data
      } as Project);
    });

    // If Firestore has items, combine with default system portfolio items so system showcases remain available
    const firestoreIds = new Set(projects.map((p) => p.id));
    for (const initProj of INITIAL_PROJECTS) {
      if (!firestoreIds.has(initProj.id)) {
        projects.push(initProj);
      } else {
        const index = projects.findIndex((p) => p.id === initProj.id);
        if (index !== -1) {
          const currentImg = projects[index].imageUrl || "";
          const isLegacyStock = currentImg.includes("images.unsplash.com");
          projects[index] = {
            ...projects[index],
            demoUrl: projects[index].demoUrl || initProj.demoUrl,
            status: projects[index].status || initProj.status,
            imageUrl: isLegacyStock ? initProj.imageUrl : (projects[index].imageUrl || initProj.imageUrl),
          };
        }
      }
    }

    // Sort in memory by createdAt descending
    projects.sort((a, b) => {
      const timeA = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const timeB = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return timeB - timeA;
    });

    return projects;
  } catch (error: any) {
    // If remote Firestore is unreachable or in offline transition, seamlessly fallback to default projects
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

    const querySnapshot = await fetchWithTimeout(getDocs(q), 2500);
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
    // If remote Firestore is unreachable or in offline transition, seamlessly fallback to default blogs
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
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    return null;
  }
  try {
    const docRef = doc(db, "settings", userId);
    const docSnap = await fetchWithTimeout(getDoc(docRef), 2500);
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
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("User must be signed in to save settings.");
  }
  try {
    const docRef = doc(db, "settings", userId);
    await setDoc(docRef, settings, { merge: true });
  } catch (error: any) {
    console.error("Error writing settings to Firestore", error);
    handleFirestoreError(error, OperationType.WRITE, `settings/${userId}`);
    throw error;
  }
}

// ---------------- INBOUND LEADS & INQUIRIES SERVICES ----------------

export const INITIAL_DEMO_LEADS: ClientLeadInquiry[] = [
  {
    id: "lead-demo-1",
    source: "project_brief",
    name: "Dr. Thandeka Mkhize",
    businessName: "Mkhize Family Practice",
    email: "thandeka.mkhize@mkhizepractice.co.za",
    phone: "079 448 6843",
    service: "Premium Website Design",
    serviceId: "web-design",
    brief: "We need a clean, responsive medical booking portal for our practice in Durban. Key requirements include automated WhatsApp appointment confirmations, Google Maps directions, staff bios, and integration with our medical aid consultation rates.",
    referenceCode: "SH-7842-26",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    status: "New",
    adminNotes: "Urgent turnaround requested. Practice re-launch scheduled for next month."
  },
  {
    id: "lead-demo-2",
    source: "workspace_lead",
    name: "Sipho Nkosi",
    businessName: "Nkosi Logistics & Freight",
    email: "sipho@nkosilogistics.co.za",
    phone: "082 555 1928",
    service: "Custom AI App Prototype",
    brief: "Looking to develop a proof-of-concept web application for dispatch tracking across Gauteng and KZN corridors. Drivers should be able to scan waybill barcodes and clients should see automated delivery milestone updates in real time.",
    referenceCode: "SH-3190-26",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    status: "Contacted",
    adminNotes: "Sent introductory WhatsApp message and shared our portfolio demo link. Scheduled call for Friday 10:00."
  },
  {
    id: "lead-demo-3",
    source: "project_brief",
    name: "Keisha Petersen",
    businessName: "Cape Coastal Living Rentals",
    email: "keisha@capecoastalliving.co.za",
    phone: "071 884 9201",
    service: "High-Impact Video Ad Campaign",
    serviceId: "video-ads",
    brief: "Require three 30-second vertical 9:16 reels showcasing luxury villa rentals in Camps Bay and Clifton. High-energy cuts, kinetic modern typography, drone b-roll integration, and compelling call-to-actions for European summer tourists.",
    referenceCode: "SH-6521-26",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    status: "Proposal Sent",
    adminNotes: "Sent detailed storyboard breakdown and formal quotation of R14,500. Awaiting signature from executive director."
  },
  {
    id: "lead-demo-4",
    source: "workspace_lead",
    name: "Johan van der Merwe",
    businessName: "AgriTech Telemetry Solutions",
    email: "johan@agritech.co.za",
    phone: "083 419 7720",
    service: "Web Engineering & API Portal",
    brief: "We need an executive dashboard that hooks into our solar borehole IoT sensors. Farmers need to view daily water yield graphs, pump voltage diagnostics, and export CSV audit logs.",
    referenceCode: "SH-9043-26",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    status: "In Progress",
    adminNotes: "Sprint 1 scope locked. Figma wireframes approved. Setting up Cloud Firestore schema."
  }
];

export async function fetchInboundLeads(): Promise<ClientLeadInquiry[]> {
  const leadsMap = new Map<string, ClientLeadInquiry>();

  // 1. Fetch from Firestore if ready
  if (isClientAndDbReady()) {
    try {
      // Query project_briefs
      const briefsPromise = fetchWithTimeout(getDocs(collection(db, "project_briefs")), 3500);
      // Query workspace_leads
      const leadsPromise = fetchWithTimeout(getDocs(collection(db, "workspace_leads")), 3500);

      const [briefsSnap, leadsSnap] = await Promise.allSettled([briefsPromise, leadsPromise]);

      if (briefsSnap.status === "fulfilled") {
        briefsSnap.value.forEach((docSnap) => {
          const data = docSnap.data() as Record<string, any>;
          const key = data.referenceCode || docSnap.id;
          leadsMap.set(key, {
            id: docSnap.id,
            source: "project_brief",
            name: data.name || "Anonymous Client",
            businessName: data.businessName || "",
            email: data.email || "",
            phone: data.phone || "",
            service: data.serviceTitle || "Custom Brief",
            serviceId: data.serviceId || "",
            brief: data.brief || "",
            referenceCode: data.referenceCode || `SH-${docSnap.id.substring(0, 4)}`,
            createdAt: data.createdAt || new Date().toISOString(),
            status: (data.status as LeadStatus) || "New",
            adminNotes: data.adminNotes || "",
            updatedAt: data.updatedAt || ""
          });
        });
      }

      if (leadsSnap.status === "fulfilled") {
        leadsSnap.value.forEach((docSnap) => {
          const data = docSnap.data() as Record<string, any>;
          const key = data.quoteCode || docSnap.id;
          if (!leadsMap.has(key)) {
            leadsMap.set(key, {
              id: docSnap.id,
              source: "workspace_lead",
              name: data.name || "Anonymous Inquirer",
              businessName: data.businessName || "",
              email: data.email || "",
              phone: data.phone || "",
              service: data.service || "General Inquiry",
              brief: data.brief || "",
              referenceCode: data.quoteCode || `SH-${docSnap.id.substring(0, 4)}`,
              createdAt: data.createdAt || new Date().toISOString(),
              status: (data.status as LeadStatus) || "New",
              adminNotes: data.adminNotes || "",
              updatedAt: data.updatedAt || ""
            });
          }
        });
      }
    } catch (fsErr) {
      console.warn("Error fetching remote Firestore leads, using fallback layers:", fsErr);
    }
  }

  // 2. Merge local storage backups
  try {
    if (typeof window !== "undefined") {
      const localBriefs = JSON.parse(localStorage.getItem("project_briefs") || "[]");
      if (Array.isArray(localBriefs)) {
        localBriefs.forEach((b: any, idx: number) => {
          const key = b.referenceCode || `local-brief-${idx}`;
          if (!leadsMap.has(key)) {
            leadsMap.set(key, {
              id: b.id || `local-brief-${idx}`,
              source: "project_brief",
              name: b.name || "Client Submission",
              businessName: b.businessName || "",
              email: b.email || "",
              phone: b.phone || "",
              service: b.serviceTitle || "Project Brief",
              serviceId: b.serviceId || "",
              brief: b.brief || "",
              referenceCode: b.referenceCode || `SH-${idx + 1000}`,
              createdAt: b.createdAt || new Date().toISOString(),
              status: (b.status as LeadStatus) || "New",
              adminNotes: b.adminNotes || "",
              updatedAt: b.updatedAt || ""
            });
          }
        });
      }

      const localLeads = JSON.parse(localStorage.getItem("workspace_leads") || "[]");
      if (Array.isArray(localLeads)) {
        localLeads.forEach((l: any, idx: number) => {
          const key = l.quoteCode || `local-lead-${idx}`;
          if (!leadsMap.has(key)) {
            leadsMap.set(key, {
              id: l.id || `local-lead-${idx}`,
              source: "workspace_lead",
              name: l.name || "Lead Submission",
              businessName: l.businessName || "",
              email: l.email || "",
              phone: l.phone || "",
              service: l.service || "Website Consult",
              brief: l.brief || "",
              referenceCode: l.quoteCode || `SH-${idx + 2000}`,
              createdAt: l.createdAt || new Date().toISOString(),
              status: (l.status as LeadStatus) || "New",
              adminNotes: l.adminNotes || "",
              updatedAt: l.updatedAt || ""
            });
          }
        });
      }
    }
  } catch (lsErr) {
    console.warn("Error reading local leads:", lsErr);
  }

  // 3. If leadsMap is still empty, include initial demo leads so the dashboard can be previewed immediately
  if (leadsMap.size === 0) {
    INITIAL_DEMO_LEADS.forEach((lead) => {
      leadsMap.set(lead.referenceCode, lead);
    });
  }

  // 4. Return sorted by createdAt descending (newest first)
  const result = Array.from(leadsMap.values());
  result.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  return result;
}

export async function updateInboundLead(
  leadId: string,
  source: "project_brief" | "workspace_lead",
  updates: Partial<ClientLeadInquiry>
): Promise<void> {
  const collectionName = source === "project_brief" ? "project_briefs" : "workspace_leads";
  const timestamp = new Date().toISOString();
  const payloadToSave = {
    ...updates,
    updatedAt: timestamp
  };

  // Update in Firestore if not demo and client ready
  if (isClientAndDbReady() && !leadId.startsWith("lead-demo-") && !leadId.startsWith("local-")) {
    try {
      const docRef = doc(db, collectionName, leadId);
      await updateDoc(docRef, payloadToSave);
    } catch (err: any) {
      console.warn("Firestore updateInboundLead failed, updating locally:", err);
      handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${leadId}`);
    }
  }

  // Update in localStorage
  try {
    if (typeof window !== "undefined") {
      const key = collectionName;
      const raw = localStorage.getItem(key);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const updated = list.map((item: any) => {
            if (item.id === leadId || item.referenceCode === updates.referenceCode || item.quoteCode === updates.referenceCode) {
              return { ...item, ...updates, updatedAt: timestamp };
            }
            return item;
          });
          localStorage.setItem(key, JSON.stringify(updated));
        }
      }
    }
  } catch (lsErr) {
    console.warn("Could not sync update to localStorage:", lsErr);
  }
}

export async function deleteInboundLead(
  leadId: string,
  source: "project_brief" | "workspace_lead"
): Promise<void> {
  const collectionName = source === "project_brief" ? "project_briefs" : "workspace_leads";

  // Delete in Firestore if real document
  if (isClientAndDbReady() && !leadId.startsWith("lead-demo-") && !leadId.startsWith("local-")) {
    try {
      const docRef = doc(db, collectionName, leadId);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.error("Firestore deleteInboundLead error:", err);
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${leadId}`);
    }
  }

  // Delete in localStorage
  try {
    if (typeof window !== "undefined") {
      const key = collectionName;
      const raw = localStorage.getItem(key);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const filtered = list.filter((item: any) => item.id !== leadId);
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      }
    }
  } catch (lsErr) {
    console.warn("Could not remove lead from localStorage:", lsErr);
  }
}

export async function createManualInboundLead(
  lead: Omit<ClientLeadInquiry, "id">
): Promise<string> {
  const collectionName = lead.source === "project_brief" ? "project_briefs" : "workspace_leads";
  
  if (isClientAndDbReady()) {
    try {
      const docRef = await addDoc(collection(db, collectionName), lead);
      return docRef.id;
    } catch (err: any) {
      console.warn("createManualInboundLead remote failed, storing locally:", err);
    }
  }

  const localId = `manual-${Date.now()}`;
  try {
    if (typeof window !== "undefined") {
      const current = JSON.parse(localStorage.getItem(collectionName) || "[]");
      current.unshift({ id: localId, ...lead });
      localStorage.setItem(collectionName, JSON.stringify(current));
    }
  } catch (lsErr) {
    console.warn("Local storage fallback error:", lsErr);
  }
  return localId;
}

