import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";

function Blogs() {
  const [data, setData] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const cardRefs = useRef([]);
  const mainRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile or tablet
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

  // Convert links into clickable buttons
  const makeLinksClickable = (text) => {
    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+|data:image\/[a-zA-Z]+;base64,[^\s<]+)/gi;
    return text.replace(urlRegex, (url) => {
      const safeUrl = url.startsWith("http") ? url : url.startsWith("data:") ? url : "https://" + url;

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

  // Fetch CSV
  useEffect(() => {
    const fetchCSV = async () => {
      try {
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

        setData(formatted);
      } catch (err) {
        console.error("Error fetching CSV:", err);
      }
    };
    fetchCSV();
  }, []);

  // Scroll to blog
  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="flex font-sans bg-gray-100 relative"
      style={{
        paddingTop: "105px",
        minHeight: "100vh",
        overflow: "hidden", // Hide body scrollbar
      }}
    >
      {/* Sidebar */}
      <aside
        className={`fixed transition-all duration-500 ${
          sidebarVisible ? "w-64 opacity-100" : "w-0 opacity-0"
        } border-r border-gray-300 bg-white`}
        style={{
          top: "75px",
          left: 0,
          height: "calc(100vh - 75px)",
          overflow: "auto",
          zIndex: isMobile ? 50 : "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`aside::-webkit-scrollbar{display:none;}`}</style>
        {sidebarVisible && (
          <>
            <div className="flex items-center justify-center h-12 bg-gray-200 text-gray-800 font-semibold text-lg sticky top-0">
              Headings
            </div>
            <ul className="space-y-3 p-4">
              {data.map((item, index) => (
                <li
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className="flex flex-col text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-300 p-2 rounded-md bg-cyan-50 hover:bg-cyan-100"
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-2">{index + 1}.</span>
                    <span className="font-medium truncate">{item.demoText}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">{item.date}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* Sidebar Toggle */}
      <div
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-r-md flex items-center justify-center transition-all duration-500 shadow-md"
        style={{
          left: sidebarVisible && !isMobile ? "16.5rem" : "0",
          top: "85px",
          width: "40px",
          height: "40px",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1e3a8a",
          zIndex: 60,
        }}
      >
        {sidebarVisible ? "<" : ">"}
      </div>

      {/* Main Blogs Section */}
      <main
        ref={mainRef}
        className={`p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col items-center transition-all duration-300 scroll-snap-y snap-mandatory`}
        style={{
          scrollBehavior: "smooth",
          gap: "24px",
          height: "calc(100vh - 90px)",
          marginLeft: sidebarVisible && !isMobile ? "16rem" : "0",
          paddingBottom: "30vh",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`main::-webkit-scrollbar{display:none;}`}</style>
        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className="bg-white shadow-md flex flex-col snap-start"
            style={{
              width: isMobile ? "95vw" : "210mm",
              maxWidth: "95vw",
              padding: isMobile ? "16px" : "24px",
              marginBottom: "40px",
              borderRadius: "0px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <a href={item.postLink} target="_blank" rel="noopener noreferrer">
              <div
                className="w-full h-28 flex items-center justify-center cursor-pointer transition-transform duration-300"
                style={{
                  backgroundColor: "#fbbf24",
                  color: "white",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                {item.demoText}
              </div>
            </a>
            <div className="flex flex-col gap-4 text-justify mt-4 flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">{item.heading}</h2>
              <p
                className="text-gray-700 text-base leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Blogs;
