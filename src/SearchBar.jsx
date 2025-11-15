import { useState, useEffect, useRef } from "react";

export default function SearchBar({ searchText, setSearchText }) {
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close searchbar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchText]);

  // Smart Search Suggestions
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
          if (
            ["SCRIPT", "STYLE", "NOSCRIPT", "NAV", "HEADER", "FOOTER"].includes(
              parent.tagName
            )
          )
            return NodeFilter.FILTER_REJECT;
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
      if (text.toLowerCase().includes(searchText.toLowerCase()) && !foundMap.has(text)) {
        foundMap.set(text, walker.currentNode.parentElement);
      }
    }

    const suggestionList = Array.from(foundMap.keys())
      .slice(0, 5)
      .map((text) => ({ text, el: foundMap.get(text) }));

    setSuggestions(suggestionList);
  }, [searchText]);

  // Click suggestion
  const handleSuggestionClick = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const originalBg = el.style.backgroundColor;
    el.style.transition = "background-color 0.3s ease";
    el.style.backgroundColor = "yellow";
    setTimeout(() => {
      el.style.backgroundColor = originalBg || "transparent";
    }, 1000);
    setSearchText(""); // Close searchbar
    setSuggestions([]);
  };

  return (
    <div ref={searchRef} className="search-bar w-full max-w-lg relative z-50">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full px-4 py-2 pr-10 rounded-md text-gray-800 border border-gray-300 focus:border-orange-400 focus:outline-none bg-white"
      />

      {/* Clear Button */}
      {searchText && (
        <button
          onClick={() => setSearchText("")}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 px-2 rounded hover:bg-gray-200 transition"
        >
          X
        </button>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="bg-white shadow-md mt-2 rounded-lg max-h-60 overflow-y-auto border border-gray-300 absolute w-full">
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
  );
}
