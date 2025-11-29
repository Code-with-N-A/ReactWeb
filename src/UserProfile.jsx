import { useState, useRef, useEffect } from "react";
import { FiUser, FiMail, FiLogOut, FiEdit, FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserProfile({ user, onLogout, sidebarClose }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu");
  const [displayName, setDisplayName] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Load saved name + date from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userDisplayName");
    const savedDate = localStorage.getItem("userJoinDate");

    if (savedName) setDisplayName(savedName);
    if (savedDate) setJoinDate(savedDate);
  }, []);

  // When user logs in or refresh happens — update info
  useEffect(() => {
    if (!user) return;

    // Use localStorage name if available, otherwise Firebase name
    const nameFromLocal = localStorage.getItem("userDisplayName");
    const finalName =
      nameFromLocal ||
      user.displayName ||
      (user.email
        ? user.email.split("@")[0].charAt(0).toUpperCase() +
          user.email.split("@")[0].slice(1).toLowerCase()
        : "User");

    setDisplayName(finalName);
    localStorage.setItem("userDisplayName", finalName);

    // Joining date
    if (!localStorage.getItem("userJoinDate")) {
      const date = user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
      setJoinDate(formattedDate);
      localStorage.setItem("userJoinDate", formattedDate);
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setOpen(false);
        setView("menu");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Animation
  const dropdownClasses = open
    ? "opacity-100 scale-100 translate-y-0"
    : "opacity-0 scale-95 -translate-y-2";

  const handleViewChange = (v) => setView(v);
  const backToMenu = () => setView("menu");

  const handleSave = (newName) => {
    setDisplayName(newName);
    localStorage.setItem("userDisplayName", newName);
    setView("menu");
  };

  // Helper function to calculate days since joining
  const calculateDaysSinceJoining = () => {
    if (!joinDate) return "N/A";
    const [day, month, year] = joinDate.split("/");
    const joinDateObj = new Date(`20${year}`, month - 1, day); // Assuming YY is 2000s
    const now = new Date();
    const diffTime = now - joinDateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : "N/A"; // Handle future dates
  };

  // Helper function to get current date/time and day
  const getCurrentDateTimeAndDay = () => {
    const now = new Date();
    const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    return { formattedDateTime, dayName };
  };

  return (
    <div className="relative" ref={cardRef}>
      {/* Profile Button */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) setView("menu");
        }}
        className="w-12 h-12 flex items-center justify-center rounded-full 
        bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl hover:scale-105 
        transition-all duration-300"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} className="w-full h-full object-cover rounded-full" />
        ) : (
          <FiUser className="text-white w-7 h-7" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={`absolute right-0 mt-4 w-80 bg-white shadow-2xl rounded-2xl 
          p-6 z-[200] transition-all duration-300 ${dropdownClasses}`}
        >
          {!user ? (
            <>
              <h3 className="text-xl font-bold text-gray-900 text-center">Welcome Back!</h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                Create an account to continue.
              </p>

              <button
                onClick={() => {
                  navigate("/Signup");
                  setOpen(false);
                  sidebarClose && sidebarClose();
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 mt-4 rounded-xl"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {/* Back Button */}
              {view !== "menu" && (
                <button
                  onClick={backToMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
                >
                  <FiArrowLeft /> Back
                </button>
              )}

              {/* --- MENU VIEW --- */}
              {view === "menu" && (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-md bg-gray-200">
                      {user?.photoURL ? (
                        <img src={user.photoURL} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-full h-full p-4 text-gray-600" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <FiMail className="w-4 h-4" /> {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-3 border-t"></div>

                  {/* Menu Buttons */}
                  <button
                    onClick={() => handleViewChange("profile")}
                    className="w-full bg-gray-50 hover:bg-gray-100 py-3 px-4 rounded-xl flex items-center gap-3"
                  >
                    <FiUser /> View Profile
                  </button>

                  <button
                    onClick={() => handleViewChange("edit")}
                    className="w-full bg-gray-50 hover:bg-gray-100 py-3 px-4 rounded-xl flex items-center gap-3 mt-2"
                  >
                    <FiEdit /> Edit Profile
                  </button>

                  <div className="my-3 border-t"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                      sidebarClose && sidebarClose();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              )}

              {/* --- PROFILE VIEW --- */}
              {view === "profile" && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Your Profile</h3>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shadow bg-gray-200">
                      {user?.photoURL ? (
                        <img src={user.photoURL} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-full h-full p-5 text-gray-600" />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">{displayName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Joined: {joinDate}</p>
                    </div>
                  </div>

                  {/* New Section: Current Date/Time, Day, and Days Since Joining */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Current Info</h4>
                    <p className="text-xs text-gray-600">
                      <strong>Date & Time:</strong> {getCurrentDateTimeAndDay().formattedDateTime}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Day:</strong> {getCurrentDateTimeAndDay().dayName}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Days Since Joining:</strong> {calculateDaysSinceJoining()}
                    </p>
                  </div>
                </div>
              )}

              {/* --- EDIT VIEW --- */}
              {view === "edit" && (
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newName = e.target.name.value.trim();
                    if (newName) handleSave(newName);
                  }}
                >
                  <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>

                  <div>
                    <label className="text-sm text-gray-700">Display Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={displayName}
                      className="w-full px-3 py-2 border rounded-lg mt-1"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    <FiSave /> Save Changes
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
