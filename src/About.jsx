import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink, FiMail, FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProjectIdeaForm from "./ProjctContect";

function About() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen text-gray-800">
      {/* HERO SECTION */}
      <section className="relative w-full h-[380px] md:h-[450px] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80"
          alt="cover"
          onClick={() =>
            window.open(
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
              "_blank"
            )
          }
          className="absolute w-full h-full object-cover cursor-pointer opacity-80"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            About <span className="text-orange-400">Me</span>
          </h1>
          <p className="text-lg opacity-90">
            My journey in web development & technology
          </p>
        </motion.div>
      </section>

      {/* 👤 LINKEDIN-STYLE PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mt-[-5rem]"
      >
        <div className="relative">
          <img
            src={`${import.meta.env.BASE_URL}img/AmuleStack93.png`}
            alt="Cover"
            onClick={() =>
              window.open(`${import.meta.env.BASE_URL}img/AmuleStack93.png`, "_blank")
            }
            className="w-full h-44 object-cover cursor-pointer"
          />

          <img
            src={`${import.meta.env.BASE_URL}img/Nitesh.png`}
            alt="Profile"
            onClick={() =>
              window.open(`${import.meta.env.BASE_URL}img/Nitesh.png`, "_blank")
            }
            className="w-32 h-32 rounded-full border-4 border-white absolute left-10 bottom-[-3rem] shadow-lg cursor-pointer"
          />

        </div>

        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-gray-900">Nitesh Amule</h2>
          <p className="text-gray-500">Full Stack Web Developer</p>

          <p className="mt-3 text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">
            Hi, I'm <strong>Nitesh</strong> — a passionate web developer from
            Madhya Pradesh, India. I began my web development journey in{" "}
            <strong>2024</strong> and have been building innovative, clean, and
            scalable digital experiences ever since. My focus areas are{" "}
            <span className="text-orange-500 font-semibold">
              React.js, Node.js, MongoDB, and Tailwind CSS
            </span>
            .
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() =>
                window.open(`${import.meta.env.BASE_URL}img/Nitesh Amule Resume.pdf`, "_blank")
              }
              className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <FiExternalLink /> Resume
            </button>

            <button
              onClick={() =>
                window.open(`${import.meta.env.BASE_URL}img/Nitesh JS Certifecate.pdf`, "_blank")
              }
              className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-400 transition-all flex items-center gap-2"
            >
              <FiExternalLink /> JavaScript
            </button>

            <button
              onClick={() =>
                window.open(`${import.meta.env.BASE_URL}img/React.pdf`, "_blank")
              }
              className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-md font-medium hover:bg-sky-600 transition-all flex items-center gap-2"
            >
              <FiExternalLink /> React
            </button>
          </div>


          {/* Stats */}
          <div className="flex justify-between mt-8 text-center">
            <div>
              <p className="text-xl font-bold text-gray-800">12+</p>
              <p className="text-gray-500 text-sm">Projects</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">2+</p>
              <p className="text-gray-500 text-sm">Certificates</p>
            </div>
            
          </div>
        </div>
      </motion.div>

      {/* DOCUMENTATION / JOURNEY SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-5 text-gray-800">
           My Web Development Journey
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-4">
          I started learning <strong>Web Development</strong> in{" "}
          <span className="text-orange-500 font-semibold">2024</span>, with
          curiosity to understand how websites work. Initially, I practiced
          HTML, CSS, and JavaScript to create static pages — then moved to
          frameworks like <strong>React.js</strong> and backend tools like{" "}
          <strong>Node.js</strong> and <strong>MongoDB</strong>.
        </p>

        <p className="text-gray-600 leading-relaxed text-lg mb-4">
          Over time, I learned how to design user interfaces, manage state, and
          build REST APIs. I’ve created projects ranging from image converters,
          QR generators, and portfolio websites to full-stack applications.
        </p>

        <p className="text-gray-600 leading-relaxed text-lg">
          Today, I focus on building <strong>modern, fast</strong>, and{" "}
          <strong>responsive</strong> web experiences with optimized code and
          accessibility in mind.
        </p>
      </section>

      {/*  TOOLS SECTION */}
      <section className="bg-white py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
           Tools & Technologies I Use
        </h2>
        <div className="flex flex-wrap justify-center gap-6 text-gray-700">
          {["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "MongoDB", "TailwindCSS", "GitHub", "VSCode"].map(
            (tool, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="px-5 py-3 bg-gray-100 rounded-xl shadow-sm font-medium hover:shadow-md transition-all"
              >
                {tool}
              </motion.div>
            )
          )}
        </div>
      </section>

      <ProjectIdeaForm />
    </div>
  );
}

export default About;
