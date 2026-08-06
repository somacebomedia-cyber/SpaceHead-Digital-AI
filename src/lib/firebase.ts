import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBupJTPVpssHECqGwKqpsYKnqX51gIaCz0",
  authDomain: "gen-lang-client-0670737769.firebaseapp.com",
  projectId: "gen-lang-client-0670737769",
  storageBucket: "gen-lang-client-0670737769.firebasestorage.app",
  messagingSenderId: "1084516537987",
  appId: "1:1084516537987:web:4b0340764b0441596c2db6"
};

const databaseId = "ai-studio-cffc71ec-2b8b-4a50-bfd1-319eec725b79";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let db: any = null;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, databaseId);
} catch {
  try {
    db = getFirestore(app, databaseId);
  } catch (err) {
    console.warn("Firestore initialization warning:", err);
  }
}

export { app, auth, db };

