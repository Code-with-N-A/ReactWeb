import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSignup, setIsSignup] = useState(true); // true for signup, false for login

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/"; // Redirect target

  // Redirect if user already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate(from, { replace: true });
    });
    return () => unsubscribe();
  }, [navigate, from]);

  const startProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowMsg(false);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
  };

  const showNotification = (text, type) => {
    setMsg({ text, type });
    setShowMsg(true);
    startProgress();
  };

  const handleAuth = async () => {
    if (!email || !password) {
      showNotification("Please enter both email and password", "error");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          showNotification("This email is already registered", "error");
          return;
        }

        await createUserWithEmailAndPassword(auth, email, password);
        showNotification("Signup successful! Redirecting...", "success");

        setEmail("");
        setPassword("");

        setTimeout(() => navigate(from, { replace: true }), 2000);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification("Login successful! Redirecting...", "success");

        setEmail("");
        setPassword("");

        setTimeout(() => navigate(from, { replace: true }), 2000);
      }
    } catch (error) {
      let errorMessage = "Something went wrong!";
      if (isSignup) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/weak-password":
            errorMessage = "Password must be at least 6 characters";
            break;
        }
      } else {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "No account found with this email";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
        }
      }
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShowMsg(false);
    setProgress(0);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      const methods = await fetchSignInMethodsForEmail(auth, userEmail);
      showNotification(`${isSignup ? "Signup" : "Login"} with Google successful! Redirecting...`, "success");

      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (error) {
      showNotification("Google authentication failed", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShowMsg(false);
    setProgress(0);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const userEmail = result.user.email;

      const methods = await fetchSignInMethodsForEmail(auth, userEmail);
      showNotification(`${isSignup ? "Signup" : "Login"} with GitHub successful! Redirecting...`, "success");

      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (error) {
      showNotification("GitHub authentication failed", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-white to-indigo-100 flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Notification */}
      {showMsg && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50 px-2 animate-slideInDown">
          <div className="w-full sm:w-80 max-w-md flex flex-col items-center">
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg overflow-hidden border-l-4
              ${msg.type === "success" ? "bg-green-50 border-green-500 text-green-800" : "bg-red-50 border-red-500 text-red-800"}`}>
              
              <span className={`text-lg ${msg.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {msg.type === "success" ? "✓" : "✗"}
              </span>

              <p className="flex-1 text-sm font-medium">{msg.text}</p>
            </div>

            <div className="h-1 bg-gray-200 w-full rounded-b-lg mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${msg.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-gray-100 z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isSignup ? "Join AmuleStack" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 text-xs">
            {isSignup ? "Create your account" : "Sign in to continue"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-1 rounded-lg flex w-full">
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                isSignup ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                !isSignup ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isSignup ? "Signing Up..." : "Signing In..."}
              </div>
            ) : (
              isSignup ? "Sign Up" : "Sign In"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGitHubAuth}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <img src="https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg" className="w-4 h-4" />
              GitHub
            </button>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
              Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes slideInDown {
          0% { transform: translateY(-120%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInDown { animation: slideInDown 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
