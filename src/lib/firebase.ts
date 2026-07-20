import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
// Pass the databaseId to specify the custom Firestore database
const db = getFirestore(app, databaseId);

export { app, auth, db };
