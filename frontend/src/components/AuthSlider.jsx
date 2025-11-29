import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthSlider = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const toggleForm = () => setIsSignUp((prev) => !prev);

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 py-8 bg-gray-50">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px] md:min-h-[500px]">
        {/* Left Side Panel (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 p-10 text-center bg-gradient-to-br from-amber-400 to-amber-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {isSignUp ? "Welcome Back!" : "Hello, Friend!"}
          </h2>

          <p className="text-sm mb-6 max-w-xs leading-relaxed">
            {isSignUp
              ? "Already have an account? Log in to stay connected with us."
              : "Enter your personal details and start your journey with us today!"}
          </p>

          <button onClick={toggleForm}  className="border border-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-white hover:text-amber-700 transition-all">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>

        {/* Right Side Form Area (Full Width on Mobile) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 relative  flex flex-col justify-center bg-white">
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div key="signup"
                initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.35 }}>
                <SignUpForm onSignupSuccess={() => setIsSignUp(false)} />

                {/* Show toggle button on MOBILE only */}
                <div className="mt-6 flex justify-center md:hidden">
                  <button onClick={toggleForm} className="text-amber-600 font-semibold text-sm underline underline-offset-2">
                    Already have an account? Sign In
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="signin" 
                initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} transition={{ duration: 0.35 }}>
                <SignInForm />

                {/* Show toggle button on MOBILE only */}
                <div className="mt-6 flex justify-center md:hidden">
                  <button onClick={toggleForm} className=" text-amber-600 font-semibold text-sm underline underline-offset-2">
                    Don't have an account? Sign Up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
