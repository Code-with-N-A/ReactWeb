import React, { useState, useEffect, useRef } from "react";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1tEQKsVOcB58VleOgFuKWy-PTuv1R9MMG1dVRzcQfAOk/export?format=csv&gid=670473458";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

const AmuleStackLogo = () => (
  <svg
    className="w-8 h-8 text-gray-500"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 4a7 7 0 1 0 4.9 12l4.2 4.2 1.4-1.4-4.2-4.2A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"
      fill="currentColor"
    />
  </svg>
);


const ClearIcon = () => (
  <svg
    className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


function parseCSV(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const header = lines[0].split(",");
  return lines
    .slice(1)
    .map((line, i) => {
      if (!line.trim()) return null;
      const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      const obj = {};
      header.forEach((h, idx) => {
        obj[h.trim()] = (values[idx] || "").replace(/^"|"$/g, "").trim();
      });
      obj._id = i + "-" + Math.random().toString(36).slice(2, 8);
      return obj;
    })
    .filter(Boolean);
}

// Helper: split string into words, lowercase, remove empty
function getWords(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

// Word-level similarity score irrespective of order
function wordSimilarity(query, text) {
  const queryWords = getWords(query);
  const textWords = getWords(text);

  if (queryWords.length === 0 || textWords.length === 0) return 0;

  let commonCount = 0;
  const textWordSet = new Set(textWords);

  queryWords.forEach((w) => {
    if (textWordSet.has(w)) commonCount++;
  });

  return commonCount / queryWords.length; // fraction of query words matched
}

// Simple character-level fuzzy similarity (used if no direct word match)
function charSimilarity(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase();
  b = b.toLowerCase();

  const aSet = new Set(a);
  const bSet = new Set(b);

  let common = 0;
  aSet.forEach((ch) => {
    if (bSet.has(ch)) common++;
  });

  const lengthScore = 1 - Math.abs(a.length - b.length) / Math.max(a.length, b.length);

  return (common / Math.max(aSet.size, bSet.size)) * 0.7 + lengthScore * 0.3;
}

export default function AmuleStackSearch() {
  const [items, setItems] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [finalQuery, setFinalQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickedSuggestion, setClickedSuggestion] = useState(null);
  const [initialCards, setInitialCards] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);

  // New state for zoomed image url
  const [zoomedImg, setZoomedImg] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((r) => r.text())
      .then((t) => {
        const parsed = parseCSV(t);
        setItems(parsed);
        setInitialCards(parsed.reverse().slice(0, 12));
      })
      .catch(console.error);
  }, []);

  // Suggestions based on Heading only, excluding "a"
  useEffect(() => {
    if (!typingText.trim()) {
      setSuggestions([]);
      setClickedSuggestion(null);
      return;
    }
    if (clickedSuggestion) {
      setSuggestions([clickedSuggestion]);
      return;
    }

    const q = typingText.toLowerCase();

    const matched = items
      .filter(
        (x) =>
          x.Heading &&
          x.Heading.toLowerCase().includes(q) &&
          x.Heading.toLowerCase() !== "a"
      )
      .slice(0, 8);

    setSuggestions(matched);
  }, [typingText, items, clickedSuggestion]);

  useEffect(() => {
    if (!finalQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const q = finalQuery.toLowerCase().trim();

      // 1. Items with Heading containing ALL query words (high priority)
      let headingMatches = items
        .map((item) => {
          const heading = item.Heading.toLowerCase();
          const queryWords = getWords(q);

          // Check how many query words exist in heading (full word match)
          let matchedWordsCount = 0;
          queryWords.forEach((w) => {
            if (heading.includes(w)) matchedWordsCount++;
          });

          return { ...item, matchedWordsCount };
        })
        .filter((item) => item.matchedWordsCount > 0)
        .sort((a, b) => b.matchedWordsCount - a.matchedWordsCount);

      // 2. Items with Description matches (word-level similarity)
      let descriptionMatches = items
        .map((item) => {
          const desc = item.Description.toLowerCase();
          const score = wordSimilarity(q, desc);
          return { ...item, wordScore: score };
        })
        .filter((item) => item.wordScore > 0)
        .sort((a, b) => b.wordScore - a.wordScore);

      // Remove duplicates from descriptionMatches that are in headingMatches
      const headingIds = new Set(headingMatches.map((i) => i._id));
      descriptionMatches = descriptionMatches.filter((i) => !headingIds.has(i._id));

      // Combine: heading matches first, then description matches
      const combined = [...headingMatches, ...descriptionMatches];

      // If no matches, fallback to fuzzy char similarity on heading+desc
      if (combined.length === 0) {
        const fuzzyMatches = items
          .map((item) => {
            const text = (item.Heading + " " + item.Description).toLowerCase();
            const score = charSimilarity(q, text);
            return { ...item, charScore: score };
          })
          .filter((i) => i.charScore > 0.3)
          .sort((a, b) => b.charScore - a.charScore);

        setResults(fuzzyMatches);
      } else {
        setResults(combined);
      }
      setLoading(false);
    }, 400);
  }, [finalQuery, items]);

  const handleSuggestionClick = (s) => {
    setClickedSuggestion(s);
    setTypingText(s.Heading);
    setFinalQuery(s.Heading);
    setSuggestions([]);
    setSearchStarted(true);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setFinalQuery(typingText);
      setClickedSuggestion(null);
      setSuggestions([]);
      setSearchStarted(true);
    }
  };

  const handleClear = () => {
    setTypingText("");
    setFinalQuery("");
    setSuggestions([]);
    setResults([]);
    setClickedSuggestion(null);
    setSearchStarted(false);
  };

  const handleImgError = (e) => (e.target.src = PLACEHOLDER);

  // New function to toggle zoom image
  const toggleZoom = (src) => {
    if (zoomedImg === src) {
      setZoomedImg(null);
    } else {
      setZoomedImg(src);
    }
  };

  return (
    <div className="min-h-screen bg-gray-#FFF pb-20">

      {/* Top background section */}
      <div
        className="w-full pb-50 pt-18 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage:
            "url('https://enhancedrivingschool.com/wp-content/uploads/2025/02/blog-banner.jpg')",
        }}
      >
        {/* Light transparent overlay (NO BLUR) */}
        <div className="absolute inset-0 bg-white/40"></div>

        {/* Content Wrapper */}
        <div className="relative w-full max-w-3xl mx-auto px-4">
          {/* Search Bar wrapper ko relative bana diya */}
          <div className="relative w-full">
            {/* Search Bar */}
            <div
              className="flex items-center shadow-md px-4 py-3 bg-white rounded-md
  transition-all duration-200 focus-within:shadow-lg"
            >

              {/* Left Logo */}
              <div className="mr-3 flex items-center justify-center opacity-70">
                <AmuleStackLogo />
              </div>

              <input
                className="flex-1 px-3 outline-none text-lg bg-transparent tracking-wide text-gray-800"
                placeholder="Search anything..."
                value={typingText}
                onChange={(e) => {
                  setTypingText(e.target.value);
                  setClickedSuggestion(null);
                }}
                onKeyDown={handleEnter}
                aria-label="Search input"
              />

              {/* Clear Button */}
              {typingText && (
                <button
                  onClick={handleClear}
                  aria-label="Clear search"
                  title="Clear search"
                  className="ml-3 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <ClearIcon />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 w-full bg-white rounded-xl shadow-lg mt-3 z-30 
        max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                style={{ minWidth: "100%" }}
              >
                {suggestions.map((s) => (
                  <div
                    key={s._id}
                    className="px-5 py-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3 select-none
              transition-colors duration-150"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <AmuleStackLogo />
                    <span className="font-medium text-gray-800">{s.Heading}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Zoomed Image Modal */}
      {zoomedImg && (
        <div
          onClick={() => setZoomedImg(null)}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[100]"
          aria-modal="true"
          role="dialog"
        >
          <img
            src={zoomedImg}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain cursor-zoom-out"
          />
        </div>
      )}

      {/* Results */}
      <main className="w-full max-w-7xl mx-auto px-6 mt-10">
        {!searchStarted && initialCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {initialCards.map((item) => (
              <article
                key={item._id}
                className="border border-gray-200 p-3 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white"
              >
                <img
                  src={item["Img URL"] || PLACEHOLDER}
                  onError={handleImgError}
                  alt={item.Heading}
                  className="w-full h-38 object-cover mb-5 border border-gray-200 cursor-pointer"
                  onClick={() => toggleZoom(item["Img URL"] || PLACEHOLDER)}
                />
                <h2 className="text-2xl font-semibold text-gray-900 mb-3 leading-snug">
                  {item.Heading}
                </h2>
                <p className="text-gray-600 text-base mb-6 line-clamp-3 flex-grow overflow-hidden">
                  {item.Description}
                </p>
                <div className="flex gap-4 mt-auto">
                  <a
                    href={item["Linkedin English"]}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
                  >
                    English
                  </a>
                  <a
                    href={item["Link Hinglish"]}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                  >
                    Hinglish
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {searchStarted && (
          <>
            {loading ? (
              <div
                className="flex justify-center py-24"
                aria-live="polite"
                aria-busy="true"
              >
                <svg
                  className="animate-spin h-16 w-16 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Loading"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-24">
                <h2 className="text-5xl font-extrabold text-gray-700">
                  No Results Found
                </h2>
                <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
                  Try checking your spelling or try different keywords.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {results.map((item) => (
                  <article
                    key={item._id}
                    className="border border-gray-200 p-3 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white"
                  >
                    <img
                      src={item["Img URL"] || PLACEHOLDER}
                      onError={handleImgError}
                      alt={item.Heading}
                      className="w-full h-38 object-cover mb-5 border border-gray-200 cursor-pointer"
                      onClick={() => toggleZoom(item["Img URL"] || PLACEHOLDER)}
                    />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 leading-snug">
                      {item.Heading}
                    </h2>
                    <p className="text-gray-600 text-base mb-6 line-clamp-3 flex-grow overflow-hidden">
                      {item.Description}
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a
                        href={item["Linkedin English"]}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
                      >
                        English
                      </a>
                      <a
                        href={item["Link Hinglish"]}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
                      >
                        Hinglish


                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
    background-color: #9ca3af;
    border-radius: 6px;
  }
  .scrollbar-track-gray-100::-webkit-scrollbar-track {
    background-color: #f3f4f6;
  }
  .scrollbar-thumb-gray-400::-webkit-scrollbar {
    width: 6px;
  }
`}</style>


    </div>
  );
}
