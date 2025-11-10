import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiUser, FiSend } from "react-icons/fi";

function Contact() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  // ========= Validation Functions ==========
  const isValidGmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidNumber = (number) => /^[0-9]{10}$/.test(number.replace(/\D/g, ""));

  // ========= Handle Submit ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone } = formData;

    if (!fname || !lname || !email || !phone) {
      setStatus("⚠️ Please fill all fields.");
      setColor("red");
      return;
    }

    if (!isValidGmail(email)) {
      setStatus("✉️ Enter a valid email (example@gmail.com).");
      setColor("red");
      return;
    }

    if (!isValidNumber(phone)) {
      setStatus("📞 Enter a valid 10-digit mobile number.");
      setColor("red");
      return;
    }

    setLoading(true);
    setStatus("Processing...");
    setColor("blue");

    const payload = {
      Name: `${fname} ${lname}`,
      First_Name: fname,
      Last_Name: lname,
      Email: email,
      Number: phone.replace(/\D/g, ""),
      _subject: "New Contact Form Submission",
      _template: "table",
    };

    try {
      const res = await fetch("https://formsubmit.co/ajax/amulestack93@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("✅ Message sent successfully!");
      setColor("green");
      setFormData({ fname: "", lname: "", email: "", phone: "" });

      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("❌ Failed to send message. Try again.");
      setColor("red");
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 max-w-3xl w-full border border-gray-200"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Get in <span className="text-orange-500">Touch</span>
        </h2>
        <p className="text-center text-gray-500 mb-10">
          I’d love to hear from you! Fill out the form below and I’ll get back
          to you soon.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-orange-400"
                value={formData.fname}
                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-orange-400"
                value={formData.lname}
                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-orange-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-orange-400"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
              loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            } flex items-center justify-center gap-2`}
          >
            {loading ? "Sending..." : <>Send Message <FiSend /></>}
          </motion.button>

          {/* Status Message */}
          {status && (
            <p className="text-center font-medium" style={{ color }}>
              {status}
            </p>
          )}
        </form>

       
      </motion.div>
    </div>
  );
}

export default Contact;
