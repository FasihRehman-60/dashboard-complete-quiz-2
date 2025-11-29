import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startSessionWatcher } from "../utils/sessionWatcher";

function SignInForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      startSessionWatcher();

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 md:p-10 mt-5 mb-5">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8">Welcome Back</h2>
      <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Email</label>
          <input type="email"  name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}  required
            className="w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-amber-400"/>
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Password </label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required
              className="w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg 
                pr-10 focus:outline-none focus:ring-2 focus:ring-amber-400"/>

            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 
                hover:text-amber-500">
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (<p className="text-red-600 text-sm sm:text-base text-center">{error}</p>)}

        <button type="submit" disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"
          } text-white font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-lg transition`}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">
          <a href="/forgot-password" className="hover:underline text-amber-600"> Forgot password?</a>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
