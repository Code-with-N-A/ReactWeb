import React from "react";
import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiCode,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProjectIdeaForm from "./ProjctContect";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-gray-900 bg-[#FFF]">

      {/* HERO SECTION */}
      <section className="relative w-full h-[360px] md:h-[420px] flex items-center justify-center">
        <img
          src="https://m.media-amazon.com/images/I/51mtGYgLQ-L._AC_UF1000,1000_QL80_.jpg"
          alt="cover"
          onClick={() =>
            window.open(
              "https://m.media-amazon.com/images/I/51mtGYgLQ-L._AC_UF1000,1000_QL80_.jpg",
              "_blank"
            )
          }
          className="absolute w-full h-full object-cover cursor-pointer opacity-100"
        />

        {/* Soft Teal-Blue Overlay */}
        <div className="absolute inset-0 "></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-gray-900 z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow">
            About <span className="text-blue-700">Me</span>
          </h1>
          <p className="text-lg opacity-90">
            A clean and professional journey in web development
          </p>
        </motion.div>
      </section>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto rounded-3xl shadow-xl bg-white/70 backdrop-blur-md border border-white/40 overflow-hidden mt-[-5rem]"
      >
        <div className="relative">
          <img
            src={`${import.meta.env.BASE_URL}img/AmuleStack93.png`}
            alt="Cover"
            onClick={() =>
              window.open(
                `${import.meta.env.BASE_URL}img/AmuleStack93.png`,
                "_blank"
              )
            }
            className="w-full h-48 object-cover cursor-pointer opacity-95"
          />

          <img
            src={`${import.meta.env.BASE_URL}img/Nitesh.png`}
            alt="Profile"
            onClick={() =>
              window.open(`${import.meta.env.BASE_URL}img/Nitesh.png`, "_blank")
            }
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute left-10 bottom-[-3.5rem] cursor-pointer"
          />
        </div>

        <div className="pt-16 pb-10 px-8">
          <h2 className="text-3xl font-bold text-gray-900">Nitesh Amule</h2>

          <p className="text-gray-700 mt-1 flex items-center gap-2">
            <FiBriefcase className="text-blue-700" /> Full Stack Web Developer
          </p>

          <p className="text-gray-700 flex items-center gap-2 mt-1">
            <FiMapPin className="text-blue-700" /> Madhya Pradesh, India
          </p>

          <p className="mt-4 text-gray-800 leading-relaxed text-sm md:text-base max-w-3xl">
            Hello! I’m <strong>Nitesh</strong>, a full-stack developer passionate
            about building modern, clean and scalable web applications using{" "}
            <span className="text-blue-700 font-semibold">
              React.js, Node.js, MongoDB & Tailwind CSS
            </span>
            .
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={() =>
                window.open("https://github.com/Code-with-N-A", "_blank")
              }
              className="text-blue-700 hover:text-blue-900 transition"
            >
              <FiGithub size={24} />
            </button>

            <button
              onClick={() =>
                window.open("https://www.linkedin.com/in/nitesh-amule-60223b34b/", "_blank")
              }
              className="text-blue-700 hover:text-blue-900 transition"
            >
              <FiLinkedin size={24} />
            </button>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() =>
                window.open(
                  `${import.meta.env.BASE_URL}img/Nitesh Amule Resume.pdf`,
                  "_blank"
                )
              }
              className="cursor-pointer bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2 shadow"
            >
              <FiExternalLink /> Resume
            </button>

            <button
              onClick={() =>
                window.open(
                  `${import.meta.env.BASE_URL}img/Nitesh JS Certifecate.pdf`,
                  "_blank"
                )
              }
              className="cursor-pointer bg-blue-100 text-blue-900 px-4 py-2 rounded-md hover:bg-blue-200 transition flex items-center gap-2 shadow"
            >
              <FiExternalLink /> JavaScript
            </button>

            <button
              onClick={() =>
                window.open(`${import.meta.env.BASE_URL}img/React.pdf`, "_blank")
              }
              className="cursor-pointer bg-blue-100 text-blue-900 px-4 py-2 rounded-md hover:bg-blue-200 transition flex items-center gap-2 shadow"
            >
              <FiExternalLink /> React
            </button>
          </div>

          {/* STATS */}
          <div className="flex justify-between mt-10 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-700">12+</p>
              <p className="text-gray-700 text-sm">Projects</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">2+</p>
              <p className="text-gray-700 text-sm">Certificates</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">1+</p>
              <p className="text-gray-700 text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SKILLS SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10 text-blue-800"
        >
          <FiCode className="inline mr-2 text-blue-700" /> Skills & Expertise
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Frontend Development", desc: "React, HTML, CSS, JavaScript", level: "Advanced" },
            { name: "Backend Development", desc: "Node.js, Express, MongoDB", level: "Intermediate" },
            { name: "UI/UX Design", desc: "Tailwind CSS, Responsive Design", level: "Advanced" },
            { name: "Version Control", desc: "Git, GitHub", level: "Proficient" },
            { name: "Problem Solving", desc: "Algorithms, Data Structures", level: "Intermediate" },
            { name: "Deployment", desc: "Vercel, Netlify, Heroku", level: "Basic" },
          ].map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/40 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-900">{skill.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{skill.desc}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-900 text-xs rounded-full">
                {skill.level}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="bg-white/70 backdrop-blur-md py-16 px-6 border-t border-white/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-10 text-blue-800"
          >
            <FiBriefcase className="inline mr-2 text-blue-700" /> Experience & Education
          </motion.h2>

          <div className="space-y-9">
            <div className="flex items-start gap-4">
              <FiCalendar className="text-blue-700 mt-1" size={22} />
              <div>
                <h3 className="font-semibold text-gray-900">Self-Taught Web Developer</h3>
                <p className="text-gray-600 text-sm">2024 - Present</p>
                <p className="text-gray-700 mt-2">
                  Building modern, scalable projects using the full-stack ecosystem.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiAward className="text-blue-700 mt-1" size={22} />
              <div>
                <h3 className="font-semibold text-gray-900">JavaScript Certification</h3>
                <p className="text-gray-600 text-sm">2024</p>
                <p className="text-gray-700 mt-2">
                  Completed advanced concepts in JavaScript.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiAward className="text-blue-700 mt-1" size={22} />
              <div>
                <h3 className="font-semibold text-gray-900">React Certification</h3>
                <p className="text-gray-600 text-sm">2024</p>
                <p className="text-gray-700 mt-2">
                  Certified in building dynamic UIs using React.js.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-5 text-blue-800">
          My Web Development Journey
        </h2>

        <p className="text-gray-700 leading-relaxed text-lg mb-4">
          I began learning <strong>Web Development</strong> in{" "}
          <span className="text-blue-700 font-semibold">2024</span> with a deep
          curiosity to understand how websites function.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg mb-4">
          Over time, I learned UI design, API handling, backend development,
          authentication, optimization, and much more.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg">
          Today, I build <strong>modern</strong>, <strong>fast</strong> and{" "}
          <strong>fully responsive</strong> web applications.
        </p>
      </section>

      {/* TOOLS SECTION */}
      <section className="bg-white/70 backdrop-blur-md py-14 px-6 text-center border-t border-white/50">
        <h2 className="text-3xl font-bold mb-10 text-blue-800">
          Tools & Technologies I Use
        </h2>

        <div className="flex flex-wrap justify-center gap-6 text-blue-900">
          {[
            "HTML5",
            "CSS3",
            "JavaScript",
            "React.js",
            "Node.js",
            "MongoDB",
            "TailwindCSS",
            "GitHub",
            "VSCode",
          ].map((tool, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="px-6 py-3 bg-blue-100 rounded-xl shadow-sm font-medium hover:shadow-md transition-all"
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-10 text-blue-800"
        >
          What People Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Rohit Sharma",
              role: "Frontend Developer",
              text: "Nitesh is highly reliable and delivers clean, modern UI work. Great attention to detail!",
            },
            {
              name: "Priya Verma",
              role: "UI/UX Designer",
              text: "Working with Nitesh was smooth and productive. His solutions are smart and well-structured.",
            },
            {
              name: "Aman Gupta",
              role: "Backend Engineer",
              text: "Very professional and always on time. Nitesh understands requirements clearly and executes them perfectly.",
            },
            {
              name: "Sneha Patel",
              role: "Project Manager",
              text: "Excellent communication and high-quality output. Truly impressed with his consistency.",
            },

          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/40"
            >
              <p className="text-gray-700 italic">"{t.text}"</p>
              <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
              <p className="text-gray-600 text-sm">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <ProjectIdeaForm />



    </div>
  );
}

export default About;
