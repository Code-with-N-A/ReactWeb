import { useState, useEffect, useRef } from "react";
import {
  FaWhatsapp,
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";

export default function SocialLinks() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // 📌 Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🌐 Social links list
  const socialLinks = [
    {
      icon: <FaWhatsapp />,
      color: "bg-green-500",
      link: "https://wa.me/919303546247", // replace with your number
    },
    {
      icon: <FaEnvelope />,
      color: "bg-red-500",
      link: "mailto:amulestack93@gmail.com",
    },
    {
      icon: <FaLinkedin />,
      color: "bg-blue-600",
      link: "https://www.linkedin.com/in/nitesh-amule-60223b34b/",
    },
    {
      icon: <FaYoutube />,
      color: "bg-red-600",
      link: "https://www.youtube.com/@AmuleStack74",
    },
    {
      icon: <FaGithub />,
      color: "bg-gray-800",
      link: "https://github.com/Code-with-N-A",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed right-6 bottom-10 flex flex-col items-center space-y-3 z-50"
    >
      {/* 🌟 Social icons column */}
      <div
        className={`flex flex-col items-center space-y-3 transition-all duration-500 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {socialLinks.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative ${item.color} text-white text-xl p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300`}
            style={{
              animation: `wave 1.2s ease-in-out ${i * 0.12}s infinite alternate`,
            }}
          >
            {item.icon}
            <span className="absolute inset-0 rounded-full bg-white/30 blur-lg opacity-40 animate-pulse"></span>
          </a>
        ))}
      </div>

      {/* 🔘 Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative bg-gradient-to-r from-blue-600 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ${
          open ? "rotate-180" : ""
        }`}
      >
        <FaShareAlt size={20} />
        <span className="absolute inset-0 rounded-full bg-white/30 blur-lg animate-pulse"></span>
      </button>

      {/* ✅ Regular style tag (not jsx) */}
      <style>{`
        @keyframes wave {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          }
          100% {
            transform: scale(1.2);
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </div>
  );
}
