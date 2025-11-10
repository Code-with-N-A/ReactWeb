import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Full Stack Web Development?",
      answer:
        "Full Stack Web Development means working on both the front-end (client side) and back-end (server side) of a web application. It includes technologies like HTML, CSS, JavaScript, React, Node.js, Express, and databases such as MongoDB or MySQL.",
    },
    {
      question: "Which technologies should I learn for Full Stack Development?",
      answer:
        "You should learn HTML, CSS, JavaScript, React (for front-end), Node.js, Express (for back-end), and MongoDB or MySQL (for databases). Also, Git, REST APIs, and basic deployment (Vercel, Render, or AWS) are important.",
    },
    {
      question: "How long does it take to become a Full Stack Developer?",
      answer:
        "On average, it takes 6 to 12 months of consistent learning and practice to become a beginner-to-intermediate Full Stack Developer. It depends on your learning pace and how much time you spend building real projects.",
    },
    {
      question: "What kind of projects can a Full Stack Developer build?",
      answer:
        "A Full Stack Developer can build dynamic websites, portfolio sites, blogs, e-commerce platforms, admin dashboards, chat apps, and more. Basically, anything that needs both front-end and back-end logic.",
    },
    {
      question: "Is Full Stack Development a good career in 2025?",
      answer:
        "Yes! Full Stack Developers are in high demand in 2025. Companies prefer developers who can handle both front-end and back-end work, making it one of the best and most flexible career options in tech.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-[#FFF] flex justify-center items-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
           Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-semibold text-gray-800 text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
