import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) return setError("Email is required");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(data.message);
      setMessage("Reset link has been sent to your email.");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">Forgot Password</h2>
        <form className="space-y-5" onSubmit={handleForgot}>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Enter Your Email</label>
            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base"
              value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>

          {error && <p className="text-red-600 text-sm sm:text-base text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm sm:text-base text-center">{message}</p>}

          <button type="submit" disabled={loading} className={`w-full py-2 sm:py-3 rounded-md font-semibold text-white transition ${loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"}`}               >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
