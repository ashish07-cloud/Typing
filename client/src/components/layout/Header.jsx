import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Palette, Trophy } from "lucide-react"; // More professional icons
import AuthActions from "./AuthActions";
import { THEMES } from "../../styles/themes";
import useAuthStore from "../../store/authStore";
import { useTestStore } from "../../store/testStore";

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--bg-color", theme.bg);
  root.style.setProperty("--main-color", theme.main);
  root.style.setProperty("--sub-color", theme.sub);
  root.style.setProperty("--text-color", theme.text);
  root.style.setProperty("--error-color", theme.error);
  root.dataset.theme = themeName;
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updatePreferences } = useAuthStore();

  const status = useTestStore((s) => s.status);
  const isTyping = status === "running";

  const initialTheme =
    user?.preferences?.theme || localStorage.getItem("theme") || "olive";
  const [open, setOpen] = useState(false);
  const [lockedTheme, setLockedTheme] = useState(initialTheme);
  const panelRef = useRef(null);

  // LOGO CLICK HANDLER (MonkeyType Style)
  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      // If we are on home page, a full reload or state reset is better
      window.location.href = "/";
    }
  };

  // Scroll lock when theme menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleThemeClick = async (themeName) => {
    setLockedTheme(themeName);
    localStorage.setItem("theme", themeName);
    try {
      if (user)
        await updatePreferences({ ...user.preferences, theme: themeName });
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
  };

  return (
    <header
      className={`w-full border-b border-[var(--sub-color)]/10 px-4 sm:px-6 lg:px-8 py-3 md:py-4 
  bg-[var(--bg-color)]/80 backdrop-blur-md sticky top-0 z-50 
  transition-all duration-300 ${
    isTyping ? "opacity-90 border-transparent" : ""
  }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        {/* LEFT SIDE: Logo + Leaderboard */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 md:gap-3 group"
          >
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--main-color)] rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-out" />
            <h1 className="text-lg md:text-2xl font-black tracking-tighter">
              typing<span className="text-[var(--main-color)]">guru</span>
            </h1>
          </Link>

          {/* Leaderboard Button */}
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

        {/* RIGHT SIDE (Hidden During Typing) */}
        {!isTyping && (
          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* THEME BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-lg transition-all border flex items-center justify-center ${
                open
                  ? "border-[var(--main-color)] text-[var(--main-color)] bg-[var(--main-color)]/5"
                  : "border-[var(--sub-color)]/20 text-[var(--sub-color)] hover:text-[var(--main-color)] hover:border-[var(--main-color)]"
              }`}
            >
              <Palette size={20} />
            </button>

            {open && (
              <div
                ref={panelRef}
                className="absolute right-0 top-14 w-56 md:w-64 max-h-[70vh] overflow-y-auto p-2 rounded-2xl backdrop-blur-xl bg-[var(--bg-color)]/95 border border-[var(--sub-color)]/20 shadow-2xl"
              >
                <div className="px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sub-color)] font-bold border-b border-[var(--sub-color)]/10 mb-2">
                  Select Theme
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {Object.keys(THEMES).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeClick(themeKey)}
                      onMouseEnter={() => applyTheme(themeKey)}
                      onMouseLeave={() => applyTheme(lockedTheme)}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm capitalize transition-all ${
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
