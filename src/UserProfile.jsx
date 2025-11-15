import { useState, useRef, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ user, onLogout, sidebarClose }) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Click outside to close card (profile dropdown only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={cardRef}>
      {/* Profile Icon */}
      <button
        className="user-profile-button flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-orange-400 transition"
        onClick={() => setOpen(!open)}
      >
        {user && user.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <FiUser className="text-gray-600 w-6 h-6" />
        )}
      </button>

      {/* Dropdown Card */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-[100] p-3 flex flex-col gap-2">
          {!user ? (
            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  navigate("/Login");
                  setOpen(false);
                  sidebarClose && sidebarClose();
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1 rounded-md text-sm transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/Signup");
                  setOpen(false);
                  sidebarClose && sidebarClose();
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-1 rounded-md text-sm transition"
              >
                Signup
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 truncate">{user.email}</p>
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                  sidebarClose && sidebarClose();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-md text-sm transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
