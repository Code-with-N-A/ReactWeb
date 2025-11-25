import React, { useEffect, useState, useRef } from "react";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1tEQKsVOcB58VleOgFuKWy-PTuv1R9MMG1dVRzcQfAOk/export?format=csv&gid=670473458";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='24'%3EImage not available%3C/text%3E%3C/svg%3E";

// CSV PARSER (improved)
function parseCSV(text) {
  if (!text) return [];

  // Split into lines and remove empty lines
  const rawLines = text.split(/\r?\n/).map((l) => l.trim());
  const lines = rawLines.filter((l) => l !== "");

  if (lines.length === 0) return [];

  // Regex-aware split (handles commas inside quotes)
  const splitCols = (line) =>
    line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.trim());

  const headers = splitCols(lines[0]).map((h) => h.replace(/^"|"$/g, "").trim());

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCols(lines[i]).map((c) => c.replace(/^"|"$/g, "").trim());

    // skip fully empty rows
    if (cols.length === 0 || cols.every((c) => c === "")) continue;

    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j] || `col_${j}`] = cols[j] ?? "";
    }

    // add a stable-ish unique id (index + small random part)
    row._id = `${i}-${Math.random().toString(36).slice(2, 8)}`;

    data.push(row);
  }

  return data;
}

// Skeleton Loader
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 shadow p-4 flex flex-col h-[420px]">
      <div className="bg-gray-300 h-44 mb-4"></div>
      <div className="h-6 bg-gray-300 mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-300 mb-2 w-full"></div>
      <div className="h-4 bg-gray-300 mb-4 w-5/6"></div>
      <div className="flex justify-between mt-auto gap-2">
        <div className="h-8 bg-gray-300 flex-1"></div>
        <div className="h-8 bg-gray-300 flex-1"></div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [items, setItems] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimer = useRef(null);

  const [showFinder, setShowFinder] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightCard, setHighlightCard] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  // Fetch CSV once
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((csv) => {
        if (!mounted) return;
        const data = parseCSV(csv).reverse(); // keep your reverse
        setItems(data);
        setFetchError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("CSV fetch error:", err);
        setFetchError("Failed to load data");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featured = items.slice(0, 7);

  // Manage autoplay interval safely
  const clearSlideTimer = () => {
    if (slideTimer.current) {
      clearInterval(slideTimer.current);
      slideTimer.current = null;
    }
  };

  const startAutoSlide = () => {
    clearSlideTimer();
    // only start if there are at least 2 slides
    if (!featured || featured.length < 2) return;
    slideTimer.current = setInterval(() => {
      setCurrentSlide((p) => {
        const len = featured.length || 1;
        return (p + 1) % len;
      });
    }, 8000);
  };

  useEffect(() => {
    // start or stop autoplay when featured changes
    startAutoSlide();
    return () => clearSlideTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featured.length]); // only depends on length change

  // Reset timer when user manually navigates
  const resetAndGo = (newIndex) => {
    setCurrentSlide(newIndex);
    startAutoSlide();
  };

  const goNext = () => {
    if (!featured || featured.length === 0) return;
    setCurrentSlide((p) => {
      const len = featured.length || 1;
      return (p + 1) % len;
    });
    startAutoSlide();
  };

  const goPrev = () => {
    if (!featured || featured.length === 0) return;
    setCurrentSlide((p) => {
      const len = featured.length || 1;
      return (p - 1 + len) % len;
    });
    startAutoSlide();
  };

  const searchResults = items.filter((a) =>
    (a.Heading || "").toLowerCase().includes(search.toLowerCase())
  );

  const triggerHighlight = (index) => {
    setHighlightCard(index);
    setTimeout(() => setHighlightCard(null), 2000);
  };

  // modal: close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalImg(null);
    };
    if (modalImg) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [modalImg]);

  // helper for image error fallback
  const handleImgError = (e) => {
    if (e?.target) e.target.src = PLACEHOLDER_IMAGE;
  };

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const paginatedItems = items.slice(start, end);

  // when items change (new fetch) ensure page within bounds
  useEffect(() => {
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // when page changes, scroll to top of grid
  useEffect(() => {
    // small timeout to allow render
    setTimeout(() => {
      const grid = document.getElementById("blog-grid-top");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, [page]);

  // helper to go to a specific page and then scroll to the card
  const goToItemAndHighlight = (itemId) => {
    const idx = items.findIndex((x) => x._id === itemId);
    if (idx === -1) return;
    const targetPage = Math.floor(idx / PER_PAGE) + 1;
    setPage(targetPage);

    // wait for page to render then scroll to the element
    setTimeout(() => {
      const el = document.getElementById(`card-${itemId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const globalIdx = items.findIndex((x) => x._id === itemId);
        triggerHighlight(globalIdx);
      }
    }, 220);
  };

  return (
    <div className="min-h-screen bg-[#FFF] p-4 md:p-6 lg:p-10">
      {/* Top slider container */}
      <div
        className="relative h-48 md:h-72 lg:h-80 mb-4 mt-8 overflow-hidden 
                      border border-gray-300 shadow-xl bg-white"
        aria-live="polite"
      >
        {loading && (
          <div className="flex items-center justify-center h-full">Loading...</div>
        )}

        {!loading && (!featured || featured.length === 0) && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No featured items
          </div>
        )}

        {!loading &&
          featured.map((item, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={item._id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700
                  ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}
                  flex flex-row items-center bg-white`}
                role="group"
                aria-hidden={!isActive}
              >
                {/* LEFT */}
                <div className="w-1/2 p-3 md:p-6 flex flex-col justify-center h-full">
                  <h2 className="text-sm md:text-3xl font-bold mb-2 line-clamp-2">
                    {item.Heading || "Untitled"}
                  </h2>

                  <p className="hidden md:block text-gray-700 mb-4 line-clamp-3">
                    {item.Description || ""}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={item["Linkedin English"] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 bg-blue-600 text-white text-xs md:text-sm"
                    >
                      English
                    </a>

                    <a
                      href={item["Link Hinglish"] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-2 bg-green-600 text-white text-xs md:text-sm"
                    >
                      Hinglish
                    </a>
                  </div>

                  <p className="text-gray-500 text-xs mt-2">
                    Uploaded on: {item.Timestamp || "—"}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="w-1/2 flex items-center justify-center p-2">
                  <img
                    src={item["Img URL"] || PLACEHOLDER_IMAGE}
                    alt={item.Heading || "feature image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImgError}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* NEXT/PREV BUTTONS */}
      {!loading && featured.length > 1 && (
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="px-6 py-2 bg-black text-white text-sm shadow hover:opacity-80"
          >
            Prev
          </button>

          <div className="flex items-center gap-3">
            {/* dots */}
            {featured.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => resetAndGo(i)}
                className={`w-3 h-3 rounded-full ${i === currentSlide ? "bg-black" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label="Next"
            className="px-6 py-2 bg-black text-white text-sm shadow hover:opacity-80"
          >
            Next
          </button>
        </div>
      )}

      {/* FIND BLOG BUTTON */}
      <div className="flex justify-end mb-10">
        <button
          onClick={() => setShowFinder((s) => !s)}
          className="px-5 py-3 bg-black text-white shadow hover:opacity-80 transition"
          aria-expanded={showFinder}
        >
          Find Blog
        </button>
      </div>

      {/* FIND BLOG PANEL */}
      {showFinder && (
        <div
          className="w-full bg-white shadow-xl p-6 mb-10 max-w-3xl mx-auto border border-gray-300"
          role="dialog"
          aria-modal="true"
          aria-label="Find blog dialog"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Find Any Blog</h2>

          <input
            type="text"
            placeholder="Search heading..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border-2 mb-6 text-lg"
            aria-label="Search heading"
          />

          <div className="h-[420px] overflow-y-auto border-2 p-4 bg-gray-50">
            {searchResults.length === 0 && (
              <div className="p-3 text-gray-500">No results</div>
            )}

            {searchResults.map((item, i) => {
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    setShowFinder(false);
                    goToItemAndHighlight(item._id);
                  }}
                  className="p-3 border-b cursor-pointer hover:bg-gray-200 transition text-lg"
                >
                  {item.Heading || "Untitled"}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      {!showFinder && (
        <div id="blog-grid-top" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : items.length === 0
            ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                {fetchError ? fetchError : "No items available"}
              </div>
            )
            : paginatedItems.map((item, idx) => {
                const globalIdx = start + idx;
                return (
                  <div
                    id={`card-${item._id}`}
                    key={item._id}
                    className={`bg-white shadow-lg overflow-hidden hover:shadow-xl transition h-[420px] flex flex-col border border-gray-300 ${
                      highlightCard === globalIdx ? "ring-4 ring-yellow-400" : ""
                    }`}
                  >
                    <div className="p-2">
                      <div className="border border-gray-300">
                        <img
                          src={item["Img URL"] || PLACEHOLDER_IMAGE}
                          alt={item.Heading || "card image"}
                          className="w-full h-40 object-cover cursor-pointer hover:scale-105 transition"
                          loading="lazy"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalImg(item["Img URL"] || PLACEHOLDER_IMAGE);
                          }}
                          onError={handleImgError}
                        />
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex flex-col flex-1">
                      <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                        {item.Heading || "Untitled"}
                      </h2>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {item.Description || ""}
                      </p>

                      <p className="text-gray-500 text-xs mb-3">
                        Uploaded on: {item.Timestamp || "—"}
                      </p>

                      <div className="flex gap-2 mt-auto">
                        <a
                          href={item["Linkedin English"] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-center text-sm"
                        >
                          English
                        </a>

                        <a
                          href={item["Link Hinglish"] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-center text-sm"
                        >
                          Hinglish
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}

      {/* PAGINATION (below grid) */}
      {!loading && items.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* show up to 7 page buttons centered around current page */}
          {Array.from({ length: totalPages }).map((_, i) => {
            // limit display: show first 3, last 3 and around current page
            const pageNum = i + 1;
            const show =
              totalPages <= 9 ||
              pageNum <= 3 ||
              pageNum > totalPages - 3 ||
              Math.abs(pageNum - page) <= 2;
            if (!show) {
              // render a placeholder for skipped groups (only once)
              const leftDotsNeeded = pageNum === 4 && page > 5;
              const rightDotsNeeded = pageNum === totalPages - 3 && page < totalPages - 4;
              if (leftDotsNeeded || rightDotsNeeded) {
                return (
                  <span key={`dots-${i}`} className="px-2">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={i}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 border rounded ${pageNum === page ? "bg-black text-white" : ""}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <img
            src={modalImg}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
            onError={handleImgError}
          />
        </div>
      )}
    </div>
  );
}
