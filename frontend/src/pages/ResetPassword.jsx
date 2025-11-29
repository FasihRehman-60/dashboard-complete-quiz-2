import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password) return setError("Password is required");

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (!response.ok) throw new Error(data.message);

      setMessage("Password reset successful! Redirecting to Sign In...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">Reset Password</h2>

        <form className="space-y-5" onSubmit={handleReset}>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm sm:text-base" />
          </div>

          {error && <p className="text-red-600 text-sm sm:text-base text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm sm:text-base text-center">{message}</p>}

          <button  type="submit" disabled={loading} className={`w-full py-2 sm:py-3 rounded-md font-semibold text-white transition ${loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"}`}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
