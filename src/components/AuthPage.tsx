import { useState, useTransition, FormEvent } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  Auth
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { signInWithGoogle } from "../lib/googleDriveService";
import { Mail, Lock, UserPlus, LogIn, AlertCircle, Sparkles } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onEnterDemo: () => void;
}

export default function AuthPage({ onAuthSuccess, onEnterDemo }: AuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    // Wrap the async Firebase login in a React 18 useTransition
    startTransition(async () => {
      try {
        if (!auth) {
          // If auth is not initialized (e.g. running SSR or initialization failed)
          throw new Error("Firebase Auth service is offline or unavailable.");
        }

        if (isLoginMode) {
          // Firebase Modular Login
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          onAuthSuccess(userCredential.user);
        } else {
          // Firebase Modular Signup
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          setSuccessMsg("Account successfully registered! Loading workspace...");
          setTimeout(() => {
            onAuthSuccess(userCredential.user);
          }, 1500);
        }
      } catch (err: any) {
        console.error("Firebase auth execution error:", err);
        // Map common Firebase errors to human friendly messages
        switch (err.code) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
          case "auth/user-not-found":
            setErrorMsg("Invalid email or password combination.");
            break;
          case "auth/email-already-in-use":
            setErrorMsg("This email is already linked to another workspace account.");
            break;
          case "auth/invalid-email":
            setErrorMsg("Please enter a valid email structure.");
            break;
          case "auth/weak-password":
            setErrorMsg("Weak password. Needs to be 6+ characters.");
            break;
          default:
            setErrorMsg(err.message || "An authentication exception occurred.");
        }
      }
    });
  };

  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    startTransition(async () => {
      try {
        const user = await signInWithGoogle();
        setSuccessMsg("Google Workspace authenticated successfully! Loading your studio...");
        setTimeout(() => {
          onAuthSuccess(user);
        }, 1200);
      } catch (err: any) {
        console.error("Google login failed:", err);
        setErrorMsg(err.message || "Failed to log in with Google. Ensure you granted permissions.");
      }
    });
  };

  return (
    <div id="auth-view" className="max-w-md mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Title details */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            {isLoginMode ? "Sign In Workspace" : "Provision Portal Account"}
          </h1>
          <p className="text-xs text-slate-500">
            Securely manage projects, dynamic logs, and technical blog publications.
          </p>
        </div>

        {/* Alerts / Success */}
        {errorMsg && (
          <div className="flex items-start space-x-2 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-xl text-xs font-medium">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="auth-email-input" className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="auth-email-input"
                type="email"
                placeholder="developer@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password-input" className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="auth-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
          >
            {isPending ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : isLoginMode ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Access Workspace</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Developer Account</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            id="auth-mode-toggle"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline focus:outline-none"
          >
            {isLoginMode ? "Need a new account? Create one here" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-mono tracking-wider uppercase">OR ACCESS INSTANTLY</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Google Auth Sign-In */}
        <button
          id="auth-google-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          className="w-full flex items-center justify-center space-x-3 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 24 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>Sign in with Google Workspace</span>
        </button>

        {/* Demo Bypass Trigger */}
        <button
          id="auth-demo-bypass-btn"
          onClick={onEnterDemo}
          className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Launch Demo Workspace (No Account)</span>
        </button>
      </div>
    </div>
  );
}
