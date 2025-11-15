import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/"; // Redirect target

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

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setMsg({ text: "Please enter both email and password.", type: "error" });
      setShowMsg(true);
      startProgress();
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg({ text: "🎉 Login Successful!", type: "success" });
      setShowMsg(true);
      startProgress();
      setEmail("");
      setPassword("");
      navigate(from, { replace: true }); // Redirect to original page
    } catch (error) {
      let errorMessage = "Something went wrong!";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Email not registered.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
      }
      setMsg({ text: errorMessage, type: "error" });
      setShowMsg(true);
      startProgress();
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
      await signInWithPopup(auth, googleProvider);
      setMsg({ text: "🎉 Google Login Successful!", type: "success" });
      setShowMsg(true);
      startProgress();
      navigate(from, { replace: true }); // Redirect to original page
    } catch (error) {
      setMsg({ text: "Google Sign-In failed.", type: "error" });
      setShowMsg(true);
      startProgress();
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
              <p className="flex-1 text-sm sm:text-base text-gray-800 text-center">{msg.text}</p>
            </div>
            <div className="h-1 bg-gray-200 w-full rounded-b-lg mt-1 overflow-hidden">
              <div className="h-full bg-gray-400 transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Cards Container */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto h-auto md:h-[480px] gap-4 md:gap-6">

        {/* Left Card */}
        <div className="flex-1 relative bg-blue-500 text-white rounded-t-2xl md:rounded-tl-2xl md:rounded-bl-2xl p-6 flex flex-col justify-center gap-3 overflow-hidden">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Welcome Back!</h1>
          <p className="text-sm sm:text-base md:text-lg">
            Login to your account and continue exploring amazing features. Fast and secure login experience.
          </p>

          {/* Floating Graphics */}
          <div className="absolute top-2 right-2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-400 rounded-full opacity-50 animate-bounce-slow"></div>
          <div className="absolute bottom-2 left-2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-300 rounded-full opacity-40 animate-bounce-slow delay-200"></div>
          <div className="absolute top-1/2 left-1/2 w-16 sm:w-20 h-16 sm:h-20 bg-blue-200 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
        </div>

        {/* Right Card */}
        <div className="flex-1 bg-white rounded-b-2xl md:rounded-tr-2xl md:rounded-br-2xl p-6 flex flex-col gap-4 justify-center shadow-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">Login</h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-3 text-sm sm:text-base md:text-lg transition"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-3 text-sm sm:text-base md:text-lg transition"
          />

          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md text-black text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7" />
            Login with Google
          </button>

          <p className="text-center text-gray-500 text-sm sm:text-base md:text-base">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup", { state: { from } })} className="text-orange-500 cursor-pointer hover:underline">
              Sign Up
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
