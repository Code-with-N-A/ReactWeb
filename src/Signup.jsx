import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleSignup = async () => {
    if (!email || !password) {
      showNotification("Please enter both email and password", "error");
      return;
    }

    setLoading(true);
    try {
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
    } catch (error) {
      let errorMessage = "Something went wrong!";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password must be at least 6 characters";
          break;
      }
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShowMsg(false);
    setProgress(0);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      const methods = await fetchSignInMethodsForEmail(auth, userEmail);
      if (methods.length > 1) {
        showNotification("This Google account is already registered. Logging you in...", "success");
      } else {
        showNotification("Google Sign-In Successful! Redirecting...", "success");
      }

      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (error) {
      showNotification("Google Sign-In failed", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col md:flex-row px-4 sm:px-6 md:px-10 gap-4 md:gap-6 pt-24 md:pt-32 pb-12 md:pb-0">

      {/* Notification */}
      {showMsg && (
        <div className="fixed top-4 inset-x-0 flex justify-center z-50 px-2 animate-slideInDown">
          <div className="w-full sm:w-80 max-w-md flex flex-col items-center">
            <div className={`flex items-center gap-3 p-3 rounded-xl shadow-md overflow-hidden
              ${msg.type === "success" ? "bg-green-100 border border-green-500" : "bg-red-100 border border-red-500"}`}>
              
              <span className={`text-base font-bold p-1 rounded-full border ${
                msg.type === "success"
                  ? "text-green-600 border-green-600"
                  : "text-red-600 border-red-600"
              }`}>
                {msg.type === "success" ? "✔️" : "❌"}
              </span>

              <p className="flex-1 text-sm text-gray-800">{msg.text}</p>
            </div>

            <div className="h-1 bg-gray-200 w-full rounded-b-lg mt-1 overflow-hidden">
              <div
                className="h-full bg-gray-400 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Left Side */}
      <div className="flex-1 relative min-h-[280px] md:min-h-[350px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tl-2xl rounded-bl-2xl p-4 md:p-6 flex flex-col justify-center gap-2 md:gap-3 overflow-hidden">
        <h1 className="text-xl md:text-2xl font-bold">Welcome to AmuleStack</h1>
        <p className="text-sm md:text-base">
          Join our community! Create your account and explore amazing features with a smooth signup experience.
        </p>

        {/* Floating Graphics */}
        <div className="absolute top-2 right-2 w-12 h-12 md:w-16 md:h-16 bg-blue-400 rounded-full opacity-50 animate-bounce-slow"></div>
        <div className="absolute bottom-2 left-2 w-12 h-12 md:w-16 md:h-16 bg-blue-300 rounded-full opacity-40 animate-bounce-slow delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-blue-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
      </div>

      {/* Right Side */}
      <div className="flex-1 relative min-h-[280px] md:min-h-[350px] bg-white rounded-tr-2xl rounded-br-2xl p-4 md:p-6 flex flex-col gap-3 justify-center shadow-md overflow-hidden">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center">Sign Up</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-sm md:text-base transition"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-sm md:text-base transition"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5"/>
          Sign up with Google
        </button>

        <p className="text-center text-gray-500 text-sm md:text-base">
          Already have an account?{" "}
          <span onClick={() => navigate("/Login", { state: { from } })} className="text-orange-500 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>

      {/* Tailwind Animations */}
      <style>{`
        @keyframes slideInDown {
          0% { transform: translateY(-120%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInDown { animation: slideInDown 0.5s ease-out forwards; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .delay-200 { animation-delay: 0.2s; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}
