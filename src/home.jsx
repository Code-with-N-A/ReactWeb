import React from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Projects from "./Projects";
import FAQSection from "./FAQ";

function Home() {
  const skills = ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JavaScript", "HTML", "CSS"];
  const services = [
    { title: "Web Development", desc: "Building responsive and modern web apps using React and Node.js." },
    { title: "UI/UX Design", desc: "Designing clean and intuitive interfaces for websites and apps." },
    { title: "Backend APIs", desc: "Creating scalable RESTful APIs with Express and MongoDB." },
  ];

  const scrollToSkills = () => {
    const element = document.getElementById("skills");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 md:pt-24 text-gray-900">

      {/* ---------- HERO SECTION ---------- */}
      <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 pb-20 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <h2 className="text-lg md:text-xl text-gray-600 font-medium"> Hi, I'm</h2>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Nitesh Amule
            </span>
          </h1>
          <h3 className="text-xl md:text-2xl text-gray-700 font-semibold">
            Full Stack Web Developer 
          </h3>
          <p className="text-gray-600 max-w-lg mx-auto md:mx-0">
            I build creative, responsive, and high-performance web apps using React, Node.js, Express, and MongoDB. I focus on clean UI and maintainable code that solves real problems.
          </p>

          {/* Buttons */}
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              to="/contact"
              className="bg-orange-500 text-white px-5 py-2 rounded-md font-medium hover:bg-orange-600 transition-all duration-200"
              aria-label="Go to Contact Page"
            >
              Contact Me
            </Link>
            <button
              onClick={scrollToSkills}
              className="border border-orange-500 text-orange-500 px-5 py-2 rounded-md font-medium hover:bg-orange-50 transition-all duration-200"
            >
              My Skills
            </button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-6 mt-6 text-gray-600 text-2xl">
            <a
              href="https://github.com/Code-with-N-A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="hover:text-gray-900 transition-transform transform hover:scale-110"
            >
              <FiGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/nitesh-amule-60223b34b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="hover:text-blue-600 transition-transform transform hover:scale-110"
            >
              <FiLinkedin />
            </a>
            <a
              href="mailto:amulestack93@gmail.com"
              aria-label="Send Email"
              className="hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <FiMail />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center mt-10 md:mt-0"
        >
          <img
            src={`${import.meta.env.BASE_URL}img/nitesh office .jpg`}
            alt="Illustration of a web developer coding"
            className="w-72 md:w-130 drop-shadow-lg rounded-2xl"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* ---------- SKILLS ---------- */}
      <section id="skills" className="px-6 md:px-16 py-16 bg-white rounded-2xl mx-4 md:mx-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">My Skills</h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
          {skills.map((skill) => (
            <motion.li
              key={skill}
              whileHover={{ scale: 1.1 }}
              className="bg-white shadow-md rounded-lg py-6 text-gray-900 font-semibold transition-all duration-300"
            >
              {skill}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section id="services" className="px-6 md:px-16 py-16 bg-white rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What I Do</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {services.map((service) => (
            <motion.div
              key={service.title}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-700">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Projects />
      <FAQSection/>
    </div>
  );
}

export default Home;
