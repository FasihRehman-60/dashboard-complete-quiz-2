import React from "react";
import { useNavigate } from "react-router-dom";

const AuthPopup = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white p-6 shadow-2xl w-[320px] text-center animate-scaleIn">
        <h2 className="mb-3 text-xl font-bold text-yellow-600">Sign In Required</h2>

        <p className="mb-6 text-sm text-gray-600">Please sign in to perform this action. </p>

        <button className="w-full rounded-lg bg-yellow-500 py-2.5 text-white font-semibold hover:bg-yellow-600 transition"onClick={() => navigate("/auth")}>
          Sign In
        </button>

        <button className="mt-3 w-full rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-100 transition" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
