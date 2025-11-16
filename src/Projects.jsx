import { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import SkeletonLoader from "./SkeletonLoader";

let projectCache = null;
let imageCache = {};

export default function ProjectShowcase() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [viewAll, setViewAll] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    const SHEET_URL =
        "";

    const preloadImage = (url) => {
        if (!url) return;
        if (!imageCache[url]) {
            const img = new Image();
            img.src = url;
            imageCache[url] = img;
        }
    };

    const fetchProjects = async () => {
        try {
            setApiError(false);

            if (projectCache) {
                setProjects(projectCache);
                setSelectedProject(projectCache[0]);
                setLoading(false);
                projectCache.forEach((p) => preloadImage(p.image));
                return;
            }

            const saved = sessionStorage.getItem("project_cache");
            if (saved) {
                const fromStorage = JSON.parse(saved);
                projectCache = fromStorage;
                setProjects(fromStorage);
                setSelectedProject(fromStorage[0]);
                setLoading(false);
                fromStorage.forEach((p) => preloadImage(p.image));
                return;
            }

            const response = await fetch(SHEET_URL);
            const csvText = await response.text();

            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
            });

            const formatted = parsed.data.map((row, index) => ({
                id: index + 1,
                title: row.Heading?.trim() || "No Title",
                description: row.Description?.trim() || "No Description",
                tech: row.Languge?.trim() || "N/A",
                year: row.Year?.trim() || "2024",
                image: row.IMG?.trim() || "",
                videoLink: row.Video?.trim() || "#",
                sourceLink: row.Source?.trim() || "#",
            }));

            projectCache = formatted;
            sessionStorage.setItem("project_cache", JSON.stringify(formatted));

            setProjects(formatted);
            setSelectedProject(formatted[0]);

            formatted.forEach((p) => preloadImage(p.image));
            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setApiError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) setViewAll(true);
    }, [isMobile]);

    if (loading)
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <SkeletonLoader loading={true} count={6} />
            </div>
        );

    if (apiError)
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <p className="text-lg text-gray-700 bg-red-50 px-5 py-3 rounded-xl shadow">
                    Unable to load projects. Please try again later.
                </p>
            </div>
        );

    return (
        <>
            {/* NOTE:
                - On small screens: container height = auto (page scrolls naturally)
                - On md+ screens: fixed 95vh so left + right align
            */}
            <div className="flex flex-col md:flex-row md:h-[95vh] bg-[#FFF] text-gray-800 overflow-hidden py-4 md:py-6 px-2 md:px-6">

                {/* LEFT SIDEBAR: fixed height only on md+ */}
                {!isMobile && (
                    <div className="md:w-1/4 bg-white shadow-md p-4 flex flex-col rounded-xl overflow-hidden mx-1 my-2 md:h-[95vh]">
                        <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
                            Projects List
                        </h2>

                        <button
                            onClick={() => setViewAll(true)}
                            className="w-full mb-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            All Projects
                        </button>

                        {/* This list scrolls independently if it grows, but within sidebar */}
                        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                            {projects.map((proj) => (
                                <button
                                    key={proj.id}
                                    onClick={() => {
                                        setSelectedProject(proj);
                                        setViewAll(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-all ${selectedProject?.id === proj.id && !viewAll
                                            ? "bg-blue-100 text-blue-700 font-semibold"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {proj.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* RIGHT CONTENT:
                    - md+: fixed height with internal scroll
                    - sm: auto height (so no inner card scroll; page scrolls)
                */}
                <div className="flex-1 md:h-[95vh] overflow-y-auto p-4 md:p-6 bg-[#FFF] rounded-xl hide-scrollbar">

                    {viewAll ? (
                        <motion.div
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {projects.map((proj) => (
                                <motion.div
                                    key={proj.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white shadow-lg rounded-2xl overflow-visible hover:shadow-xl transition-all"
                                >
                                    {/* outer padding so image sits inside card */}
                                    <div className="p-3 bg-white">
                                        {/* responsive image box — ensures cover on all sizes */}
                                        <div className="w-full h-40 md:h-48 lg:h-52 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={proj.image}
                                                alt={proj.title}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                    </div>

                                    {/* card content with slightly larger padding; no fixed height */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold mb-2 text-gray-700">
                                            {proj.title}
                                        </h3>

                                        {/* limit lines to 3 so cards don't grow too tall on mobile */}
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                            {proj.description}
                                        </p>

                                        <div className="flex justify-between text-sm mb-3">
                                            <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                                                {proj.tech}
                                            </span>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                                                {proj.year}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <a
                                                href={proj.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                            >
                                                <FaLinkedin /> Video
                                            </a>

                                            <a
                                                href={proj.sourceLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-800 hover:underline text-sm"
                                            >
                                                <FaGithub /> Source
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={selectedProject?.id || "single"}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white shadow-xl rounded-2xl p-6"
                        >
                            <div className="h-60 md:h-72 overflow-hidden rounded-xl mb-4 bg-gray-100">
                                <img
                                    src={selectedProject?.image}
                                    alt={selectedProject?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h2 className="text-2xl font-bold mb-2 text-blue-700">
                                {selectedProject?.title}
                            </h2>

                            <p className="text-gray-700 mb-4 leading-relaxed">
                                {selectedProject?.description}
                            </p>

                            <div className="flex justify-between mb-6">
                                <span className="bg-gray-200 px-4 py-1 rounded-full font-medium">
                                    {selectedProject?.tech}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium">
                                    {selectedProject?.year}
                                </span>
                            </div>

                            <div className="flex justify-start gap-4">
                                <a
                                    href={selectedProject?.videoLink}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FaLinkedin /> Video
                                </a>

                                <a
                                    href={selectedProject?.sourceLink}
                                    target="_blank"
                                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                                >
                                    <FaGithub /> Source
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

/* hide scrollbar helper */
const style = document.createElement("style");
style.innerHTML = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);
