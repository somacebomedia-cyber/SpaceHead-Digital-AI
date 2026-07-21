import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

// Build Google OAuth Provider with Gmail permissions
const provider = new GoogleAuthProvider();
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
 * Trigger clean Google Sign-In without extra scopes (Google Drive / Gmail)
 */
export const signInWithGoogle = async (): Promise<any> => {
  try {
    const loginProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, loginProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Trigger OAuth Sign-In flow with Google to retrieve credentials and cache access token
 */
export const connectGoogleDrive = async (): Promise<{ user: any; token: string }> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential && credential.accessToken) {
      cachedAccessToken = credential.accessToken;
      return { user: result.user, token: credential.accessToken };
    }
    throw new Error("Failed to retrieve Google credentials from Auth result.");
  } catch (error: any) {
    console.error("Error connecting Google authentication:", error);
    throw error;
  }
};
