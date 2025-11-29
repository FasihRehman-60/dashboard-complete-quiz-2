// src/App.jsx
import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route, useLocation, Navigate} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import NavBar from "./components/NavBar.jsx";
import News from "./components/News.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Services from "./pages/Services.jsx";
import "./index.css";
import Dashboard from "./pages/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { startSessionWatcher } from "./utils/sessionWatcher.js";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DeveloperAPI from "./pages/DeveloperAPI.jsx";
import ApiDocs from "./pages/ApiDocs.jsx"
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
};

function LayoutWrapper({ setProgress, apiKey, pageSize }) {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/auth" ||
    location.pathname === "/signin" ||
    location.pathname === "/signup";
    
    useEffect(() => {
      startSessionWatcher();
    }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <NavBar />}

      <main className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${hideLayout ? "pt-0 pb-0" : "pt-24 pb-10"} flex-1`}>
        <Routes>
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute>} />
          <Route path="/" element={<News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country="us" category="general" />}/>
          <Route path="/business" element={<News setProgress={setProgress} apiKey={apiKey} key="business" pageSize={pageSize} country="us" category="business"/>}/>
          <Route path="/entertainment" element={<News setProgress={setProgress} apiKey={apiKey} key="entertainment" pageSize={pageSize} country="us" category="entertainment"/>}/>
          <Route path="/health" element={<News setProgress={setProgress} apiKey={apiKey} key="health" pageSize={pageSize} country="us"category="health"/>}/>
          <Route path="/science" element={<News setProgress={setProgress} apiKey={apiKey} key="science" pageSize={pageSize} country="us" category="science"/>}/>
          <Route path="/sports"  element={<News setProgress={setProgress} apiKey={apiKey} key="sports" pageSize={pageSize} country="us" category="sports"/>}/>
          <Route path="/technology" element={<News  setProgress={setProgress} apiKey={apiKey} key="technology" pageSize={pageSize} country="us" category="technology"/>}/>
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services/>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/developer-api" element={<DeveloperAPI />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

const App = () => {
  const pageSize = 8;
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const [progress, setProgress] = useState(0);

  return (
    <Router>
      <LoadingBar color="#f59e0b" height={3} progress={progress}onLoaderFinished={() => setProgress(0)}/>
      <LayoutWrapper setProgress={setProgress} apiKey={apiKey} pageSize={pageSize} />
    </Router>
  );
};

export default App;
