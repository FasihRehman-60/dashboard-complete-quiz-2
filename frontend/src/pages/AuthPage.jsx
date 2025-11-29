import React from "react";
import { useNavigate } from "react-router-dom";
import AuthSlider from "../components/AuthSlider";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-amber-50 to-gray-100 relative px-4">
      <button onClick={() => navigate("/")}
        className="absolute top-3 left-4 px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium shadow-md hover:bg-amber-400 transition-all duration-200">
        ← Return to Home
      </button>

      <div className="text-center">
        <div className="flex items-center justify-center space-x-1">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-600 mt-10 mb-0 leading-tight">
            <span className="text-gray-900">News</span>
            <span className="text-amber-500">Wave</span>
          </h3>
        </div>
      </div>
      <AuthSlider/>
    </div>
  );
};

export default AuthPage;
