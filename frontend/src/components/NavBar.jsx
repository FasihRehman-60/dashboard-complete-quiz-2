import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on auth page
  if (location.pathname === "/auth") return null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/business", label: "Business" },
    { to: "/entertainment", label: "Entertainment" },
    { to: "/health", label: "Health" },
    { to: "/science", label: "Science" },
    { to: "/sports", label: "Sports" },
    { to: "/technology", label: "Technology" },
    { to: "/services", label: "Services"},
    { to: "/contact", label: "Contact" },

  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-white/95 to-amber-50/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <NavLink to="/" className="text-2xl font-bold tracking-tight leading-none">
              <span className="text-gray-900">News</span>
              <span className="text-amber-500">Wave</span>
            </NavLink>
            <p className="text-gray-600 text-xs font-medium mt-0.5">Stay informed. Stay inspired.</p>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7 ml-10">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={label} to={to} end={end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-amber-600 font-semibold"
                      : "text-gray-700 hover:text-amber-600"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Button (Desktop + Mobile) */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-600 transition shadow-md">
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <Link to="/auth" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-md shadow-sm transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg px-4 py-4 mt-2 space-y-4">
            {/* Links */}
            <div className="flex flex-col gap-3">
              {navLinks.map(({ to, label, end }) => (
                <NavLink key={label} to={to} end={end} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium py-2 px-2 rounded-md ${
                      isActive
                        ? "bg-amber-500 text-white"
                        : "text-gray-800 hover:bg-amber-100"
                    }`
                  }>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Login / Logout */}
            <div className="pt-2 border-t border-gray-200">
              {isLoggedIn ? (
                <button onClick={() => { handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-red-600 transition">
                  <LogOut size={14} /> Logout
                </button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="w-full block text-center bg-amber-500 text-white py-2.5 rounded-md text-sm font-semibold hover:bg-amber-600 transition">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default NavBar;