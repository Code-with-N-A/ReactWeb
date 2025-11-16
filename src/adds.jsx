import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";

let newsCache = null; // DATA CACHE
let imageCache = {}; // IMAGE CACHE

export default function AdvtigmentNews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // --------------------------
  //   PRELOAD IMAGE FUNCTION (Partial) 
  // --------------------------
  const preloadImage = (url) => {
    if (!url) return;
    if (!imageCache[url]) {
      const img = new Image();
      img.src = url;
      imageCache[url] = img; // store image
    }
  };

  const preloadNearbyImages = (pageIndex) => {
    preloadImage(data[pageIndex]?.img);
    preloadImage(data[pageIndex + 1]?.img);
    preloadImage(data[pageIndex - 1]?.img);
  };

  // --------------------------
  //   EXTRACT LINKS
  // --------------------------
  const extractLinks = (text) => {
    const urlRegex =
      /(https?:\/\/[^\s<]+|www\.[^\s<]+|data:image\/[a-zA-Z]+;base64,[^\s<]+|https?:\/\/.*\.(mp4|webm|ogg|mov|avi))/gi;
    const links = [];
    let cleanedText = text;
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      const url = match[0];
      cleanedText = cleanedText.replace(url, "").trim();

      if (url.startsWith("data:image") || url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        links.push({ url, type: "Image" });
      } else if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
        links.push({ url, type: "Video" });
      } else {
        links.push({ url, type: "Link" });
      }
    }
    return { cleanedText, links };
  };

  // --------------------------
  //   FETCH + PRELOAD DATA
  // --------------------------
  const fetchData = async () => {
    try {
      if (newsCache) {
        setData(newsCache);
        setLoading(false);
        preloadNearbyImages(0); // preload first few images only
        return;
      }

      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1uEA4JEXvJqXDxFwK5OhYCYn0pRiAmmofAcLn75fbPuo/export?format=csv"
      );

      const csvText = await response.text();
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear().toString().slice(-2)}`;

      const formatted = parsed.data
        .map((row) => {
          const descRaw = row.Description?.trim() || "No Description";
          const { cleanedText, links } = extractLinks(descRaw);
          return {
            heading: row.Heading?.trim() || "No Heading",
            description: cleanedText,
            links,
            img: row.IMG?.trim() || "",
            date: dateStr,
          };
        })
        .reverse();

      newsCache = formatted;
      setData(formatted);
      preloadNearbyImages(0); // preload first few images only
      setLoading(false);
    } catch (err) {
      console.error("Loading error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextPage = () => {
    if (currentPage < data.length - 1) {
      setCurrentPage((p) => {
        const next = p + 1;
        preloadNearbyImages(next);
        return next;
      });
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => {
        const prev = p - 1;
        preloadNearbyImages(prev);
        return prev;
      });
    }
  };

  const item = data[currentPage];

  // Memoize links list to avoid re-rendering unnecessarily
  const linksList = useMemo(() => {
    if (!item) return null;
    return item.links.map((link, idx) => {
      let bgColor = "bg-blue-100 text-blue-800";
      if (link.type === "Image") bgColor = "bg-green-100 text-green-800";
      if (link.type === "Video") bgColor = "bg-red-100 text-red-800";

      return (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${bgColor} px-3 py-1 rounded font-semibold text-sm`}
        >
          {link.type}
        </a>
      );
    });
  }, [item]);

  return (
    <div className="flex flex-col items-center bg-white h-auto py-4 px-3">
      {loading || !item ? (
        <div className="h-64 w-full max-w-6xl bg-gray-100 animate-pulse rounded-md"></div>
      ) : (
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="
            bg-white shadow 
            w-full max-w-6xl
            flex flex-col md:flex-row
            overflow-hidden
            border border-gray-200
            rounded-xl
          "
        >
          {/* LEFT IMAGE */}
          <div className="w-full md:w-[40%] bg-white p-4 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg bg-white">
              <img
                src={item.img}
                alt="img"
                className="
                  w-full h-auto
                  max-h-[260px] sm:max-h-[300px] md:max-h-[340px]
                  object-contain
                  p-1
                "
                loading="lazy"
              />
            </div>
          </div>

          {/* RIGHT TEXT */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-2xl md:text-3xl text-black leading-tight break-words">
                {item.heading}
              </h2>

              {/* DESCRIPTION */}
              <p className="text-gray-700 text-base md:text-lg leading-relaxed break-words">
                {item.description}
              </p>

              {/* LINKS LIST */}
              {item.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">{linksList}</div>
              )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-gray-500 text-sm">{item.date}</p>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={`
                    flex-1 sm:flex-none
                    px-4 py-2 rounded-md font-semibold transition
                    ${currentPage === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-black hover:bg-gray-300"}
                  `}
                >
                  Previous
                </button>

                <button
                  onClick={nextPage}
                  disabled={currentPage === data.length - 1}
                  className={`
                    flex-1 sm:flex-none
                    px-4 py-2 rounded-md font-semibold transition
                    ${currentPage === data.length - 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-black hover:bg-gray-300"}
                  `}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
