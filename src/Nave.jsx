import { useState, useRef, useEffect } from "react";
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
  const menuRef = useRef(null);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && menuOpen) setMenuOpen(false);
  };
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const menuItems = ["Home", "About", "Blog", "Contact"];

  const handleSidebarClick = () => setMenuOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-md px-4 md:px-6 py-3 font-[Poppins]">
        <h2 className="text-2xl font-[Pacifico] text-black tracking-wide drop-shadow-sm">
          AmuleStack
        </h2>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center relative">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </div>

        {/* Desktop Nav + User */}
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

          <UserProfile user={user} onLogout={handleLogout} sidebarClose={() => setMenuOpen(false)} />
        </div>

        {/* Mobile Icons */}
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
            {menuOpen ? <FiX className="text-orange-500" /> : <FiMenu className="text-gray-700" />}
          </button>
        </div>
      </nav>

      {/* Mobile Search */}
      {showSearch && (
        <div className="fixed top-16 left-2 right-2 w-[calc(100%-1rem)] flex flex-col items-center z-40 md:hidden px-4 py-3 bg-white shadow-md rounded-lg transition-all">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white z-40 shadow-2xl transform transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-16 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-2xl font-[Pacifico] text-black tracking-wide drop-shadow-sm">
            AmuleStack
          </h2>
          <UserProfile user={user} onLogout={handleLogout} sidebarClose={() => setMenuOpen(false)} />
        </div>

        {/* Mobile Menu Links */}
        <ul className="flex flex-col gap-3 w-full pl-6 font-[Poppins] mt-2">
          {menuItems.map((item) => (
            <li key={item} className="w-full">
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={handleSidebarClick}
                className={({ isActive }) =>
                  `block py-3 text-left text-lg font-medium text-gray-700 rounded hover:bg-gray-100 transition-all duration-200 ${
                    isActive ? "bg-gray-100 text-orange-500" : ""
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
