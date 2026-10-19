import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, setLogLevel } from "firebase/firestore";
import firebaseAppletConfig from "../../firebase-applet-config.json";

// Silence internal Firestore connectivity warnings (such as offline 10s backend unreachable notices)
try {
  setLogLevel("silent");
} catch {
  // Ignore in SSR/unsupported runtime environments
}

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyBupJTPVpssHECqGwKqpsYKnqX51gIaCz0",
  authDomain: firebaseAppletConfig.authDomain || "gen-lang-client-0670737769.firebaseapp.com",
  projectId: firebaseAppletConfig.projectId || "gen-lang-client-0670737769",
  storageBucket: firebaseAppletConfig.storageBucket || "gen-lang-client-0670737769.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "1084516537987",
  appId: firebaseAppletConfig.appId || "1:1084516537987:web:4b0340764b0441596c2db6"
};

const databaseId = (firebaseAppletConfig as any).databaseId || (firebaseAppletConfig as any).firestoreDatabaseId || "ai-studio-cffc71ec-2b8b-4a50-bfd1-319eec725b79";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db: any = null;
try {
  if (typeof window !== "undefined") {
    // In browser iframes, force long-polling to prevent WebSocket/streaming timeouts
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    }, databaseId);
  } else {
    // In Node.js SSR runtime, standard getFirestore
    db = getFirestore(app, databaseId);
  }
} catch {
  try {
    db = getFirestore(app, databaseId);
  } catch {
    db = null;
  }
}

export { app, auth, db };


