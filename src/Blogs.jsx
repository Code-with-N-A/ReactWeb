import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

// In-memory cache
let blogsCache = null;

//  Skeleton Shimmer Component (NO IMPORT NEEDED)
function BlogSkeleton() {
  return (
    <div className="flex flex-col items-center w-full mt-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white shadow-md w-[210mm] max-w-[95vw] p-6 mb-10 rounded-md"
        >
          <div className="w-full h-28 rounded-md mb-4 bg-gray-300"></div>

          <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      ))}
    </div>
  );
}

function Blogs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ⬅ NEW
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const cardRefs = useRef([]);
  const mainRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Convert text links into buttons
  const makeLinksClickable = (text) => {
    const urlRegex =
      /(https?:\/\/[^\s<]+|www\.[^\s<]+|data:image\/[a-zA-Z]+;base64,[^\s<]+)/gi;

    return text.replace(urlRegex, (url) => {
      const safeUrl = url.startsWith("http")
        ? url
        : url.startsWith("data:")
          ? url
          : "https://" + url;

      if (url.startsWith("data:image")) {
        return `<a href="#" onclick="(function(){
          const newTab = window.open();
          const img = newTab.document.createElement('img');
          img.src='${safeUrl}';
          img.style.maxWidth='100%';
          img.style.display='block';
          img.style.margin='20px auto';
          newTab.document.body.style.background='#f0f0f0';
          newTab.document.body.appendChild(img);
        })(); return false;"
        style="background-color:#d1ecff;color:#0369a1;text-decoration:none;padding:2px 6px;border-radius:4px;">Link Click</a>`;
      }

      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
      style="background-color:#d1ecff;color:#0369a1;text-decoration:none;padding:2px 6px;border-radius:4px;">Link Click</a>`;
    });
  };

  // Fetch CSV + Cache
  useEffect(() => {
    const loadData = async () => {
      try {
        // Memory cache
        if (blogsCache) {
          setData(blogsCache);
          setLoading(false);
          return;
        }

        // LocalStorage cache
        const stored = localStorage.getItem("blogsData");
        if (stored) {
          const parsedStored = JSON.parse(stored);
          blogsCache = parsedStored;
          setData(parsedStored);
          setLoading(false);
          return;
        }

        // Live fetch
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1tEQKsVOcB58VleOgFuKWy-PTuv1R9MMG1dVRzcQfAOk/export?format=csv&gid=670473458"
        );

        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(
          today.getMonth() + 1
        ).padStart(2, "0")}/${today.getFullYear().toString().slice(-2)}`;

        const formatted = parsed.data.map((row) => {
          const words = row.Heading.split(" ");
          return {
            heading: row.Heading,
            description: makeLinksClickable(row.Description.replace(/\n/g, "<br/>")),
            postLink: row.POST,
            demoText: words.slice(0, 3).join(" "),
            date: dateStr,
          };
        });

        blogsCache = formatted;
        localStorage.setItem("blogsData", JSON.stringify(formatted));
        setData(formatted);
      } catch (err) {
        console.error("Error:", err);
      }

      setLoading(false);
    };

    setTimeout(loadData, 500); // Slow effect 0.5s (Google like)
  }, []);

  // Scroll
  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="flex font-sans bg-gray-100 relative"
      style={{ paddingTop: "105px", minHeight: "100vh" }}
    >
      {/* Sidebar */}
      <aside
        className={`fixed transition-all duration-500 ${sidebarVisible ? "w-64 opacity-100" : "w-0 opacity-0"
          } border-r border-gray-300 bg-white`}
        style={{
          top: "68px",
          height: "calc(100vh - 75px)",
          overflow: "auto",
          scrollbarWidth: "none",
        }}
      >
        <style>{`aside::-webkit-scrollbar{display:none;}`}</style>

        {/* Sidebar Skeleton */}
        {loading ? (
          <div className="p-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-full bg-gray-300 rounded mb-4"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center h-12 bg-gray-200 text-gray-800 font-semibold text-lg sticky top-0">
              Headings
            </div>

            <ul className="space-y-3 p-4">
              {data.map((item, index) => (
                <li
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className="flex flex-col text-gray-700 hover:text-blue-600 cursor-pointer p-2 rounded-md bg-cyan-50"
                >
                  <span className="font-bold">{index + 1}. {item.demoText}</span>
                  <span className="text-xs text-gray-500 ml-6">{item.date}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* Toggle Button */}
      <div
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-r-md flex items-center justify-center shadow-md"
        style={{
          left: sidebarVisible && !isMobile ? "16.5rem" : "0",
          top: "68px",
          width: "40px",
          height: "40px",
          fontSize: "2rem",
          color: "#1e3a8a",
        }}
      >
        {sidebarVisible ? "<" : ">"}
      </div>

      {/* Main */}
      <main
        ref={mainRef}
        className="p-6 sm:p-10 md:p-16 flex flex-col items-center"
        style={{
          marginLeft: sidebarVisible && !isMobile ? "16rem" : "0",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        <style>{`main::-webkit-scrollbar{display:none;}`}</style>

        {/*  Show Skeleton Until Data Loads */}
        {loading ? (
          <BlogSkeleton />
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="bg-white shadow-md flex flex-col"
              style={{
                width: isMobile ? "95vw" : "210mm",
                padding: isMobile ? "16px" : "24px",
                marginBottom: "40px",
              }}
            >
              <a href={item.postLink} target="_blank">
                <div
                  className="w-full h-28 flex items-center justify-center bg-yellow-400 text-white text-xl font-bold rounded-md"
                >
                  {item.demoText}
                </div>
              </a>

              <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-2xl font-bold text-gray-800">{item.heading}</h2>

                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default Blogs;
