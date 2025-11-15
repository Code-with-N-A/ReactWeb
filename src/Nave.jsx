import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

function Nave() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  const menuItems = ["Home", "About", "Blog", "Contact"];

  // 🔍 Toggle SearchBar (Mobile)
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && menuOpen) setMenuOpen(false);
  };

  // 📌 Sidebar Toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen && showSearch) setShowSearch(false);
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
        });
      } else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ❗ Phone Mode → Click outside hide searchbar
  useEffect(() => {
    if (!showSearch) return;

    const close = (e) => {
      const searchBox = document.getElementById("mobile-search-box");
      if (searchBox && !searchBox.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showSearch]);

  return (
    <>
      {/* 🔥 NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-md px-4 md:px-6 py-3 font-[Poppins]">
        <h2 className="text-2xl font-[Pacifico] text-black tracking-wide">
          AmuleStack
        </h2>

        {/* 🔍 Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center relative">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            onClose={() => setSearchText("")}
          />
        </div>

        {/* Desktop Menu + Profile */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 font-medium">
            {menuItems.map((item) => (
              <li key={item}>
                <NavLink
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `pb-1 transition-colors duration-200 ${
                      isActive
                        ? "border-b-2 border-orange-400 text-orange-500"
                        : "hover:border-b-2 hover:border-orange-400"
                    }`
                  }
                >
                  {item}
                </NavLink>
              </li>
            ))}
          </ul>

          <UserProfile
            user={user}
            onLogout={handleLogout}
            sidebarClose={() => setMenuOpen(false)}
          />
        </div>

        {/* 🔥 Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleSearch}
            className="text-gray-700 text-xl hover:text-orange-500 transition cursor-pointer"
          >
            <FiSearch />
          </button>

          <button
            onClick={toggleMenu}
            className="text-2xl text-gray-700 transition-all duration-300 hover:scale-110"
          >
            {menuOpen ? (
              <FiX className="text-orange-500" />
            ) : (
              <FiMenu className="text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* 🔥 BLUR OVERLAY — only when SearchBar open (MOBILE) */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowSearch(false)}
        ></div>
      )}

      {/* 🔥 MOBILE SEARCH BAR BOX */}
      {showSearch && (
        <div
          id="mobile-search-box"
          className="fixed top-16 left-2 right-2 w-[calc(100%-1rem)] z-50 md:hidden bg-white rounded-xl shadow-xl p-3"
        >
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            onClose={() => setShowSearch(false)}
          />
        </div>
      )}

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white z-50 shadow-2xl transform duration-500 md:hidden pt-16 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-2xl font-[Pacifico]">AmuleStack</h2>

          <UserProfile
            user={user}
            onLogout={handleLogout}
            sidebarClose={() => setMenuOpen(false)}
          />
        </div>

        <ul className="flex flex-col gap-3 w-full pl-6 font-[Poppins]">
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-lg transition ${
                    isActive
                      ? "text-orange-500 bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Nave;
