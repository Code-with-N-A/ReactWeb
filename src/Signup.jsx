import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Login from "./Login";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

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

  const handleSignup = async () => {
    if (!email || !password) {
      setMsg({ text: "Please enter both email and password.", type: "error" });
      setShowMsg(true);
      startProgress();
      return;
    }

    setLoading(true);
    try {
      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setMsg({ text: "This email is already registered. Please login.", type: "error" });
        setShowMsg(true);
        startProgress();
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      setMsg({ text: "🎉 Signup Successful! Redirecting...", type: "success" });
      setShowMsg(true);
      startProgress();

      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      let errorMessage = "Something went wrong!";
      switch (error.code) {
        case "auth/invalid-email": errorMessage = "Invalid email address."; break;
        case "auth/weak-password": errorMessage = "Password must be at least 6 characters."; break;
      }
      setMsg({ text: errorMessage, type: "error" });
      setShowMsg(true);
      startProgress();
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShowMsg(false);
    setProgress(0);
    try {
      // Get email from Google first
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      // Check if user already exists
      const methods = await fetchSignInMethodsForEmail(auth, userEmail);
      if (methods.length > 1) {
        setMsg({ text: "This Google account is already registered. Logging you in...", type: "success" });
      } else {
        setMsg({ text: "🎉 Google Sign-In Successful! Redirecting...", type: "success" });
      }
      setShowMsg(true);
      startProgress();
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMsg({ text: "Google Sign-In failed.", type: "error" });
      setShowMsg(true);
      startProgress();
      console.error(error);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-blue-50 flex flex-col md:flex-row mt-20 mb-12 px-4 sm:px-6 md:px-12 gap-0 relative">

      {/* Notification */}
      {showMsg && (
        <div className="fixed top-5 inset-x-0 flex justify-center z-50 px-2">
          <div className="w-full sm:w-96 max-w-md flex flex-col items-center">
            <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl shadow-lg text-white font-semibold overflow-hidden
              ${msg.type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideInDown`}>
              <span className="text-xl sm:text-2xl">
                {msg.type === "success" ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}
              </span>
              <p className="flex-1 text-sm sm:text-base text-center">{msg.text}</p>
            </div>
            <div className="h-1 bg-gray-200 w-full rounded-b-lg mt-1">
              <div className="h-1 bg-gray-400 transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Left Side */}
      <div className="flex-1 relative min-h-[350px] md:min-h-[400px] bg-blue-500 text-white rounded-tl-2xl rounded-bl-2xl p-8 flex flex-col justify-center gap-4 overflow-hidden">
        <h1 className="text-3xl md:text-4xl font-bold">Welcome to AmuleStack</h1>
        <p className="text-base md:text-lg">
          Join our community! Create your account, explore amazing features, and enjoy a smooth signup experience.
        </p>
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 transform rotate-45 translate-x-8 -translate-y-8 md:w-24 md:h-24 md:translate-x-12 md:-translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500 transform -rotate-45 -translate-x-8 translate-y-8 md:w-24 md:h-24 md:-translate-x-12 md:translate-y-12"></div>
      </div>

      {/* Right Side */}
      <div className="flex-1 relative min-h-[350px] md:min-h-[400px] bg-white rounded-tr-2xl rounded-br-2xl p-8 flex flex-col gap-6 justify-center shadow-lg overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Sign Up</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-base"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-base"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-gray-200 hover:bg-gray-300 text-black py-3 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6"/>
          Sign up with Google
        </button>

        <p className="text-center text-gray-500">
          Already have an account?{" "}
          
          <span onClick={() => navigate("/Login")} className="text-orange-500 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>

      {/* Tailwind Animation */}
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
