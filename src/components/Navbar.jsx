import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItemClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
              ✈
            </div>

            <div>
              <h1 className="font-bold text-slate-900 leading-none">
                TripPilot AI
              </h1>

              <p className="text-[11px] text-slate-400 mt-1">
                Your intelligent travel companion
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={navItemClass("/dashboard")}>
              My Trips
            </Link>

            <Link to="/generate" className={navItemClass("/generate")}>
              Plan a Trip
            </Link>
          </nav>

          {/* Profile */}

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-xl p-1.5 pr-3 hover:bg-slate-50 transition"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                T
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800">Traveler</p>

                <p className="text-[11px] text-slate-400">My account</p>
              </div>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={`w-4 h-4 text-slate-400 transition ${
                  menuOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <>
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50">
                  <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
                      ✦
                    </div>

                    <div>
                      <h1 className="font-bold text-slate-900 leading-none">
                        TripPilot AI
                      </h1>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Plan smarter. Travel better.
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/generate"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    Plan New Trip
                  </Link>

                  <div className="h-px bg-slate-100 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
