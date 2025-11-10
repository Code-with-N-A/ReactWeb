import TextareaAutosize from "react-textarea-autosize";
import React, { useState } from "react";

function ProjectIdeaForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idea: "",
  });

  const [status, setStatus] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, idea } = formData;

    // Validation
    if (!name || !email || !idea) {
      setStatus("⚠️ Please fill all fields.");
      setColor("red");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setStatus("❌ Please enter a valid email address.");
      setColor("red");
      return;
    }

    setLoading(true);
    setStatus("Processing...");
    setColor("blue");

    const payload = {
      Name: name,
      Email: email,
      Idea: idea,
      _subject: "New Project Idea Submission",
      _template: "table",
    };

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/niteshamule74@gmail.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send");

      setStatus("✅ Idea sent successfully! I’ll get back to you soon.");
      setColor("green");
      setFormData({ name: "", email: "", idea: "" });

      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setStatus("❌ Failed to send idea. Please try again.");
      setColor("red");
      setTimeout(() => setStatus(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
<section className="min-h-screen flex justify-center items-center bg-[#FFF] px-4 py-12">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent mb-3">
          Share Your Project Idea 
        </h2>
        <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
          Got a great idea or want to collaborate on a project? Let’s make it real together!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 transition-all duration-300">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 rounded-lg px-4 py-2 outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 outline-none transition-all"
            />
          </div>

          {/* Idea */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Project Idea</label>
            <TextareaAutosize
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              placeholder="Describe your idea in detail..."
              minRows={5}
              maxRows={12}
              className="w-full border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-lg px-4 py-2 outline-none transition-all resize-none"
            />
          </div>

          {/* Status */}
          {status && (
            <p className="text-center text-sm font-medium animate-pulse" style={{ color }}>
              {status}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:opacity-90 hover:scale-[1.02] transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : " Submit Idea"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProjectIdeaForm;
