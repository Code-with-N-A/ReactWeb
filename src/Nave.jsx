import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";

function Nave() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close searchbar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !e.target.closest(".search-icon")
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && menuOpen) setMenuOpen(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen && showSearch) setShowSearch(false);
  };

  // ===== Smart Search =====
  useEffect(() => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (!parent || !parent.offsetParent) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "NAV", "HEADER", "FOOTER"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("nav")) return NodeFilter.FILTER_REJECT;
          if (parent.closest(".search-bar")) return NodeFilter.FILTER_REJECT;
          if (parent.tagName === "A") return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
      false
    );

    const foundMap = new Map();
    while (walker.nextNode()) {
      const text = walker.currentNode.nodeValue.trim();
      if (!text) continue;
      const index = text.toLowerCase().indexOf(searchText.toLowerCase());
      if (index !== -1 && !foundMap.has(text)) {
        foundMap.set(text, walker.currentNode.parentElement);
      }
    }

    const suggestionList = Array.from(foundMap.keys()).slice(0, 5).map((text) => {
      return { text, el: foundMap.get(text) };
    });

    setSuggestions(suggestionList);
  }, [searchText]);

  // Click suggestion → scroll + highlight + clear search
  const handleSuggestionClick = (el) => {
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const originalBg = el.style.backgroundColor;
    el.style.transition = "background-color 0.3s ease";
    el.style.backgroundColor = "yellow";

    setTimeout(() => {
      el.style.backgroundColor = originalBg || "transparent";
    }, 1000);

    setSearchText("");
    setShowSearch(false);
    setSuggestions([]);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white/90 backdrop-blur-md shadow-md px-6 py-4 transition-all duration-300">
        {/* Logo */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide">
          AmuleStack
        </h2>

        {/* Desktop Search Bar */}
<div className="hidden md:flex flex-1 justify-center relative">
  <div className="search-bar w-full max-w-lg relative">
    <input
      ref={inputRef}
      type="text"
      placeholder="Search..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="w-full px-4 py-2 pr-10 rounded-md text-gray-800 border border-gray-300 focus:border-orange-400 focus:outline-none"
    />
    {searchText && (
      <button
        onClick={() => setSearchText("")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 text-blue-600 px-2 rounded hover:bg-gray-200 transition"
      >
        X
      </button>
    )}

    {/* Suggestions */}
    {suggestions.length > 0 && (
      <ul className="bg-white shadow-md mt-2 rounded-lg max-h-60 overflow-y-auto border border-gray-300 z-50 absolute w-full">
        {suggestions.map((s, idx) => (
          <li
            key={idx}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => handleSuggestionClick(s.el)}
          >
            {s.text}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


        {/* Nav Links (right side on desktop) */}
        <ul className="hidden md:flex gap-6 font-medium">
          {["Home", "About","Blog","Contact"].map((item) => (
            <li key={item}>
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                end
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

        {/* Right Icons (mobile) */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleSearch}
            className="text-gray-700 text-xl hover:text-orange-500 transition search-icon cursor-pointer"
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
        <div
          ref={searchRef}
          className="fixed top-16 left-0 w-full flex flex-col items-center z-40 md:hidden"
        >
          <div className="flex items-center gap-2 bg-white shadow-lg py-3 px-4 w-11/12 rounded-lg border border-gray-200">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md text-gray-800 border border-gray-300 focus:border-orange-400 focus:outline-none"
            />
            <button
              onClick={() => setSearchText("")}
              className="bg-gray-100 text-blue-600 px-3 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              X
            </button>
          </div>

          {/* Mobile Suggestions */}
          {suggestions.length > 0 && (
            <ul className="bg-white shadow-md mt-2 rounded-lg max-h-60 overflow-y-auto border border-gray-300 w-11/12 z-50">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleSuggestionClick(s.el)}
                >
                  {s.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-white shadow-lg sm:hidden transition-all duration-500 transform z-40 ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 py-4 font-medium">
          {["Home", "About", "Blog", "Contact"].map((item) => (
            <li key={item} className="w-full text-center">
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-orange-500 transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-orange-400 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Nave;
