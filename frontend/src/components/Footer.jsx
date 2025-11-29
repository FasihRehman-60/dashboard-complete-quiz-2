import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Linkedin, Facebook, Github } from "lucide-react";

function Footer() {
  const location = useLocation();
  // Hide footer on the auth page
  if (location.pathname === "/auth") return null;

  return (
    <footer className="bg-gradient-to-b from-white to-amber-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-gray-900">News</span>
              <span className="text-amber-500">Wave</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">Stay informed. Stay inspired.</p>
          </div>

          <div className="w-full md:w-auto overflow-x-auto scrollbar-hide">
            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-2 sm:gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/business", label: "Business" },
                { to: "/entertainment", label: "Entertainment" },
                { to: "/health", label: "Health" },
                { to: "/science", label: "Science" },
                { to: "/sports", label: "Sports" },
                { to: "/technology", label: "Technology" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <NavLink  key={label} to={to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500 text-white font-semibold shadow-sm"
                        : "text-gray-600 hover:text-amber-600 hover:bg-amber-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5 sm:gap-6 mt-2">
          {[{
              Icon: Linkedin, href: "https://www.linkedin.com/in/fasih-rehman60/", label: "LinkedIn",  
            },{
              Icon: Facebook, href: "https://www.facebook.com/fasih.rehman.7393", label: "Facebook",
            },{
              Icon: Github, href: "https://github.com/Fasih60", label: "GitHub", 
            },
          ].map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="p-2 rounded-full bg-white text-gray-600 shadow-sm hover:bg-amber-500 hover:text-white  transform hover:scale-110 transition-all duration-300" >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-8"></div>

        {/* Copyright */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-6">© {new Date().getFullYear()} NewsWave — All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;