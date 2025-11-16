import { useState, useRef, useEffect } from "react";
import { FiUser, FiMail, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ user, onLogout, sidebarClose }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={cardRef}>
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center rounded-full 
        bg-white overflow-hidden shadow-sm border border-gray-300 
        hover:border-orange-500 transition"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} className="w-full h-full object-cover" />
        ) : (
          <FiUser className="text-gray-600 w-6 h-6" />
        )}
      </button>

      {/* --- DROPDOWN CARD --- */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl 
          border border-gray-100 p-4 z-[200] animate-slideDown 
          flex flex-col gap-4"
        >
          {/* When NOT Logged In */}
          {!user ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                Welcome
              </h3>
              <p className="text-sm text-gray-600 leading-5">
                Login or create an account to access your profile, settings, and more.
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    navigate("/Login");
                    setOpen(false);
                    sidebarClose && sidebarClose();
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white 
                  py-2 rounded-xl text-sm font-medium transition"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/Signup");
                    setOpen(false);
                    sidebarClose && sidebarClose();
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 
                  py-2 rounded-xl text-sm font-medium transition"
                >
                  Signup
                </button>
              </div>
            </>
          ) : (
            <>
              {/* TOP USER SECTION */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shadow-sm">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-full h-full p-3 text-gray-600" />
                  )}
                </div>

                {/* Email + Title */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    Your Account
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <FiMail className="text-gray-500" />
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                  sidebarClose && sidebarClose();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white 
                py-2.5 rounded-xl text-sm font-semibold transition 
                flex items-center justify-center gap-2"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
