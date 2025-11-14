// src/Login.jsx
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          photoURL:
            currentUser.photoURL ||
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
    } catch (error) {
      setMsg({ text: "Google Sign-In failed.", type: "error" });
      setShowMsg(true);
      startProgress();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    setUser(null);
    setMsg({ text: "Logged out successfully.", type: "success" });
    setShowMsg(true);
    startProgress();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gray-50 flex flex-col md:flex-row pt-24 pb-12 px-4 sm:px-6 md:px-12 relative">

      {/* Notification */}
      {showMsg && (
        <div className="fixed top-5 inset-x-0 flex justify-center z-50 px-2">
          <div className="w-full sm:w-96 max-w-md flex flex-col items-center">
            <div
              className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl shadow-lg text-white font-semibold overflow-hidden
              ${msg.type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideInDown`}
            >
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

      {/* Gmail Profile Icon */}
      {user && (
        <div className="absolute top-16 right-3 flex flex-col items-end z-10 mt-6">
          <img
            src={user.photoURL}
            alt="User Profile"
            className="w-6 h-6 md:w-10 md:h-10 rounded-full border border-gray-300 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 flex flex-col items-center animate-fadeIn">
              <p className="text-gray-700 text-sm break-words text-center">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Cards Container */}
<div className="flex flex-col md:flex-row w-11/12 md:w-3/4 h-auto md:h-[420px] gap-0 mt-6 mx-auto">

        {/* Left Card */}
        <div className="flex-1 bg-blue-500 text-white rounded-tl-2xl rounded-bl-2xl p-6 flex flex-col justify-center gap-4 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome Back!</h1>
          <p className="text-sm md:text-base">
            Login to your account and continue exploring amazing features. Fast and secure login experience.
          </p>
        </div>

        {/* Right Card */}
        <div className="flex-1 bg-white rounded-tr-2xl rounded-br-2xl p-6 flex flex-col gap-4 justify-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Login</h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-sm md:text-base"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2 text-sm md:text-base"
          />

          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-semibold text-sm md:text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-md text-black text-sm md:text-base hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 md:w-6 md:h-6" />
            Login with Google
          </button>

          <p className="text-center text-gray-500 text-sm md:text-base">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-orange-500 cursor-pointer hover:underline">
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

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
