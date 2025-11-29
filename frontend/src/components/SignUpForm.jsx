import React, { useState } from "react";

function SignUpForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, confirmEmail, password, confirmPassword, gender } = formData;

    if (!name || !email || !confirmEmail || !password || !confirmPassword || !gender) {
      setError("All fields are required.");
      return;
    }

    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must include 1 capital letter, 1 special character, and be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Registration successful! 🎉 Redirecting...");
      setFormData({
        name: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        gender: "",
      });

      setTimeout(() => onSignupSuccess?.(), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">Create Your Account</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input type="email" name="email" placeholder="name@gmail.com" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"/>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Email</label>
            <input type="email" name="confirmEmail" placeholder="name@gmail.com" value={formData.confirmEmail} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input type="password" name="password" placeholder="Strong password" value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"/>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-400"/>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
          <div className="flex flex-wrap gap-4">
            {["male", "female", "other"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={handleChange} className="w-4 h-4 text-amber-500"/>
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error / Success */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        {/* Submit */}
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition"  >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
