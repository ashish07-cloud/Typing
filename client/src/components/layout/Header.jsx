import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";

import AuthActions from "./AuthActions";
import { THEMES } from "../../styles/themes";
import useAuthStore from "../../store/authStore";
import { useTestStore } from "../../store/testStore";

import {
  applyTheme,
  setStoredTheme,
  getInitialTheme,
} from "../../styles/themeManager";

export default function Header() {
  const location = useLocation();
  const { user, updatePreferences } = useAuthStore();
  const status = useTestStore((s) => s.status);
  const isTyping = status === "running";

  const [open, setOpen] = useState(false);
  const [lockedTheme, setLockedTheme] = useState(
    getInitialTheme(user?.preferences?.theme)
  );

  const panelRef = useRef(null);

  // Apply theme once on mount
  useEffect(() => {
    applyTheme(lockedTheme);
  }, []); // only once

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const handleThemeClick = async (themeName) => {
    setLockedTheme(themeName);
    applyTheme(themeName);
    setStoredTheme(themeName);

    try {
      if (user) {
        await updatePreferences({
          ...user.preferences,
          theme: themeName,
        });
      }
    } catch (err) {
      console.error(err);
    }

    setOpen(false);
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.location.href = "/";
    }
  };

  return (
    <header
      className={`w-full border-b border-[var(--sub-color)]/10
px-4 sm:px-6 lg:px-8 py-3 md:py-4
sticky top-0 z-[999]
bg-[var(--bg-color)] transition-all duration-300
${isTyping ? "opacity-60" : "opacity-100"}`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 md:gap-3 group"
          >
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--main-color)] rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <h1 className="text-lg md:text-2xl font-black tracking-tighter">
              typing<span className="text-[var(--main-color)]">guru</span>
            </h1>
          </Link>

          <Link
            to="/leaderboard"
            className={`text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
              location.pathname === "/leaderboard"
                ? "text-[var(--main-color)]"
                : "text-[var(--sub-color)] hover:text-[var(--main-color)]"
            }`}
          >
            leaderboard
          </Link>
        </div>

        {/* RIGHT SIDE */}
        {!isTyping && (
          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                open
                  ? "border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/10"
                  : "border-[var(--sub-color)]/20 text-[var(--sub-color)] hover:border-[var(--main-color)] hover:text-[var(--main-color)]"
              }`}
            >
              <Palette size={20} />
            </button>

            {/* Theme Dropdown */}
            {open && (
              <div
                ref={panelRef}
                className="absolute right-0 top-14 w-56 md:w-64 max-h-[70vh] overflow-y-auto p-2 rounded-2xl
                bg-[var(--bg-color)] border border-[var(--sub-color)]/20 shadow-2xl"
              >
                <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sub-color)] font-bold border-b border-[var(--sub-color)]/10 mb-2">
                  Select Theme
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {Object.keys(THEMES).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeClick(themeKey)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm capitalize transition-colors ${
                        lockedTheme === themeKey
                          ? "bg-[var(--main-color)] text-[var(--bg-color)] font-bold"
                          : "text-[var(--text-color)] hover:bg-[var(--sub-color)]/10"
                      }`}
                    >
                      {themeKey}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AuthActions />
          </div>
        )}
      </div>
    </header>
  );
}