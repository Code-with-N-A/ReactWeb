import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const projectsData = [
  {
    id: 1,
    title: "1. HTML Form Project.",
    description:
      "Create responsive forms with validation using pure HTML.",
    tech: "HTML",
    year: "2024",
    image: `${import.meta.env.BASE_URL}img/Marks.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_nitesh-amule-amulestack-activity-7391972209566830592-g5hW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/MarksCounter.html",
  },
  {
    id: 2,
    title: "2. CSS Portfolio",
    description:
      "Modern personal portfolio website styled with advanced CSS.",
    tech: "CSS",
    year: "2024",
    image: `${import.meta.env.BASE_URL}img/Marks.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_nitesh-amule-amulestack-activity-7391972209566830592-g5hW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/MarksCounter.html",
  },
  {
    id: 3,
    title: "3. JavaScript MCQZ",
    description: "Interactive MCQZ with JavaScript logic and UI.",
    tech: "JavaScript",
    year: "2025",
    image: `${import.meta.env.BASE_URL}img/MCQZ.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_webdevelopment-javascript-frontenddevelopment-activity-7366002387557253120-0ZB4?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/mcqz.html",
  },
  {
    id: 4,
    title: "4. JavaScript ATM",
    description: "Interactive ATM with JavaScript logic and UI.",
    tech: "JavaScript",
    year: "2025",
    image: `${import.meta.env.BASE_URL}img/ATM.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_atmsimulator-javascript-html-activity-7364908004040749057-P026?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/ATM.html",
  },
  {
    id: 5,
    title: "5. JavaScript Voting",
    description: "Interactive Voting with JavaScript logic and UI.",
    tech: "JavaScript",
    year: "2025",
    image: `${import.meta.env.BASE_URL}img/Voting.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_webdevelopment-javascript-html-activity-7362453616437137408-HmrW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/voting.html",
  },
  {
    id: 6,
    title: "6. JavaScript Binary Number",
    description: "Interactive Binary Number with JavaScript logic and UI.",
    tech: "JavaScript",
    year: "2025",
    image: `${import.meta.env.BASE_URL}img/binary.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_coding-programming-developerlife-activity-7363127252827389952-PUYm?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink:
      "https://github.com/Code-with-N-A/AllProjects/blob/master/binary.html",
  },
  {
    id: 7,
    title: "7. MPQP RGPV Exam Q Paper",
    description:
      "Complete collection of Polytechnic diploma exam papers from all RGPV branches. Link MPQP.",
    tech: "JavaScript",
    year: "2025",
    image: `${import.meta.env.BASE_URL}img/MPQP.png`,
    videoLink:
      "https://www.linkedin.com/posts/nitesh-amule-60223b34b_mpqp-mppolytechnic-polytechnicpapers-activity-7382390958933340160-ygwW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFdsCKIBGOVv5jwbPuTBrYGp9i7XB4l1T1w",
    sourceLink: "https://github.com/Code-with-N-A/MPQP",
  },
];



export default function ProjectShowcase() {
    const [selectedProject, setSelectedProject] = useState(projectsData[0]);
    const [viewAll, setViewAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) setViewAll(true);
    }, [isMobile]);

    return (
        <>
            <div className="flex flex-col md:flex-row h-[90vh] bg-[#FFF] text-gray-800 overflow-hidden py-4 md:py-6 px-2 md:px-6">

                {/* Left Sidebar (hide in mobile) */}
                {!isMobile && (
                    <div className="md:w-1/4 bg-white shadow-md border-r p-4 flex flex-col rounded-xl overflow-hidden mx-1 my-2">
                        <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
                            Projects List
                        </h2>
                        <button
                            onClick={() => setViewAll(true)}
                            className="w-full mb-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                            All Projects
                        </button>

                        <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
                            {projectsData.map((proj) => (
                                <button
                                    key={proj.id}
                                    onClick={() => {
                                        setSelectedProject(proj);
                                        setViewAll(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition-all ${selectedProject.id === proj.id && !viewAll
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

                {/* Right Content */}
                <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 bg-[#FFF] rounded-xl hide-scrollbar">
                    {viewAll ? (
                        // All Projects
                        <motion.div
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {projectsData.map((proj) => (
                                <motion.div
                                    key={proj.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                                >
                                    <div className="h-48 md:h-52 overflow-hidden bg-gray-100">
                                        <img
                                            src={proj.image}
                                            alt={proj.title}
                                            className="w-full h-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold mb-2 text-gray-700">
                                            {proj.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {proj.description}
                                        </p>
                                        <div className="flex justify-between text-sm mb-3">
                                            <span className="bg-gray-200 px-3 py-1 rounded-full">
                                                {proj.tech}
                                            </span>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                                {proj.year}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <a
                                                href={proj.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                <FaLinkedin /> Video
                                            </a>
                                            <a
                                                href={proj.sourceLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-800 hover:underline"
                                            >
                                                <FaGithub /> Source
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        // Single Project
                        <motion.div
                            key={selectedProject.id}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
                        >
                            <div className="h-60 md:h-72 overflow-hidden rounded-xl mb-4 bg-gray-100">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover object-center"
                                    loading="lazy"
                                />
                            </div>

                            <h2 className="text-2xl font-bold mb-2 text-blue-700">
                                {selectedProject.title}
                            </h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                {selectedProject.description}
                            </p>

                            <div className="flex justify-between mb-6">
                                <span className="bg-gray-200 px-4 py-1 rounded-full font-medium">
                                    {selectedProject.tech}
                                </span>
                                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium">
                                    {selectedProject.year}
                                </span>
                            </div>

                            <div className="flex justify-start gap-4">
                                <a
                                    href={selectedProject.videoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    <FaLinkedin /> Video
                                </a>
                                <a
                                    href={selectedProject.sourceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all"
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

/* Hide scrollbar globally */
const style = document.createElement("style");
style.innerHTML = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;
document.head.appendChild(style);
