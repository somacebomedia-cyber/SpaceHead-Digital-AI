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
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
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
