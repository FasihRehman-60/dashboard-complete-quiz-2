import React, { useState } from "react";
import {Mail, Phone, User, MessageCircle, FileText, ChevronDown,} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        type: "General Inquiry",
        message: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center px-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">Get in Touch</h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">Have a project, question, or idea? Send me a message — I reply within a few hours.</p>

      <form onSubmit={handleSubmit} className="bg-white/90 shadow-xl border border-gray-100 rounded-3xl p-10 w-full max-w-3xl backdrop-blur-md space-y-8">
        {success && <p className="text-green-600 font-medium">{success}</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
            <User className="absolute top-10 left-3 w-5 h-5 text-amber-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} required  placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-xl px-10 py-2.5 focus:ring-2 focus:ring-amber-400 shadow-sm transition"/>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
            <Mail className="absolute top-10 left-3 w-5 h-5 text-amber-400" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-xl px-10 py-2.5 focus:ring-2 focus:ring-amber-400 shadow-sm transition" placeholder="you@example.com"/>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Phone Number</label>
            <Phone className="absolute top-10 left-3 w-5 h-5 text-amber-400" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-10 py-2.5 focus:ring-2 focus:ring-amber-400 shadow-sm transition" placeholder="+92 300 0000000"/>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Subject</label>
            <FileText className="absolute top-10 left-3 w-5 h-5 text-amber-400" />
            <input type="text" name="subject" value={formData.subject} onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-10 py-2.5 focus:ring-2 focus:ring-amber-400 shadow-sm transition" placeholder="Project discussion, help, etc."/>
          </div>

          {/* TYPE */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-1">Message Type</label>
            <div className="relative">
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-amber-400 shadow-sm transition">
                <option>General Inquiry</option>
                <option>Project / Website Request</option>
                <option>Bug Report</option>
                <option>Feedback / Suggestion</option>
              </select>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="relative">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Message</label>
          <MessageCircle className="absolute top-10 left-3 w-5 h-5 text-amber-400" />
          <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required
            className="w-full border border-gray-300 rounded-xl px-10 py-2.5 focus:ring-2 focus:ring-amber-400 shadow-sm resize-none transition" placeholder="Write your message..."></textarea>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* Contact Info Card */}
      <div className="bg-white/90 shadow-md border border-gray-100 rounded-3xl p-8 w-full max-w-lg mt-12 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Ways to Connect</h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <span>Email:{" "}
              <a href="mailto:mirza.fasih99@gmail.com" className="text-amber-600 hover:underline font-medium">mirza.fasih99@gmail.com</a>
            </span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-amber-500" />
            <span> WhatsApp:{" "}
              <a href="https://wa.me/923066899891" target="_blank" rel="noreferrer" className="text-amber-600 hover:underline font-medium">
                +92 306 6899891
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;