import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

// Build Google OAuth Provider with Drive and Gmail permissions
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://mail.google.com/");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.modify");

// In-memory access token cache
let cachedAccessToken: string | null = null;

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

/**
 * Update cached token manually or from active connection
 */
export const setCachedToken = (token: string | null) => {
  cachedAccessToken = token;
};

/**
 * Retrieve current cached token
 */
export const getCachedToken = () => {
  return cachedAccessToken;
};

/**
 * Trigger OAuth Sign-In flow with Google to retrieve Drive scopes and cache access token
 */
export const connectGoogleDrive = async (): Promise<{ user: any; token: string }> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      cachedAccessToken = credential.accessToken;
      return { user: result.user, token: credential.accessToken };
    }
    throw new Error("Failed to retrieve Google Drive credentials from Auth result.");
  } catch (error: any) {
    console.error("Error connecting Google Drive:", error);
    throw error;
  }
};

/**
 * List files inside a specific Google Drive directory
 */
export const listDriveFiles = async (
  folderId: string = "root",
  search?: string
): Promise<{ files: DriveFile[] }> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available. Please connect first.");

  let q = `'${folderId}' in parents and trashed = false`;
  if (search) {
    q += ` and name contains '${search.replace(/'/g, "\\'")}'`;
  }

  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.append("q", q);
  url.searchParams.append("fields", "files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink)");
  url.searchParams.append("orderBy", "folder,name");
  url.searchParams.append("pageSize", "100");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to query Google Drive files.");
  }

  return res.json();
};

/**
 * Create a new folder on Google Drive
 */
export const createDriveFolder = async (
  name: string,
  parentId: string = "root"
): Promise<DriveFile> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available.");

  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId]
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to create folder in Google Drive.");
  }

  return res.json();
};

/**
 * Delete a file or folder from Google Drive (Mandatory user-confirm checked in UI)
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available.");

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to delete file from Google Drive.");
  }
};

/**
 * Upload a standard file binary to Google Drive using multipart upload
 */
export const uploadDriveFile = async (
  file: File,
  parentId: string = "root"
): Promise<DriveFile> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available.");

  const metadata = {
    name: file.name,
    parents: [parentId]
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to upload file to Google Drive.");
  }

  return res.json();
};

/**
 * Save JSON configuration or database backups directly to Google Drive
 */
export const uploadJsonToDrive = async (
  filename: string,
  content: any,
  parentId: string = "root"
): Promise<DriveFile> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available.");

  const metadata = {
    name: filename,
    mimeType: "application/json",
    parents: [parentId]
  };

  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", blob);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to save data backup to Google Drive.");
  }

  return res.json();
};

/**
 * Retrieve text or JSON content from a specific Google Drive file (used for importing data)
 */
export const getDriveFileContent = async (fileId: string): Promise<string> => {
  const token = getCachedToken();
  if (!token) throw new Error("Google Drive access token not available.");

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch file content from Google Drive.");
  }

  return res.text();
};
