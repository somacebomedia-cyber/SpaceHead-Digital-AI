export interface Project {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  createdAt: number;
  userId: string;
  isPublic: boolean;
  status?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readTime?: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  authorName: string;
  isPublished: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
}

export type LeadStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Proposal Sent"
  | "Converted"
  | "Archived"
  | "Spam";

export interface ProjectBriefRecord {
  id?: string;
  serviceId: string;
  serviceTitle: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  brief: string;
  referenceCode: string;
  createdAt: string;
  status: LeadStatus | string;
  adminNotes?: string;
  updatedAt?: string;
}

export interface WorkspaceLeadRecord {
  id?: string;
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  service: string;
  brief: string;
  quoteCode: string;
  createdAt: string;
  status: LeadStatus | string;
  adminNotes?: string;
  updatedAt?: string;
}

export interface ClientLeadInquiry {
  id: string;
  source: "project_brief" | "workspace_lead";
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  service: string;
  serviceId?: string;
  brief: string;
  referenceCode: string;
  createdAt: string;
  status: LeadStatus;
  adminNotes?: string;
  updatedAt?: string;
}

