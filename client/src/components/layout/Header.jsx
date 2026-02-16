import { Link, useLocation } from "react-router-dom";
import AuthActions from "./AuthActions";
import useTheme from "../../hooks/useTheme";

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="
        w-full
        border-b
        border-sub/10
        px-4
        sm:px-6
        lg:px-8
        py-4
        bg-page/80
        backdrop-blur-md
        sticky
        top-0
        z-50
      "
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-3 h-3 bg-main rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              typing<span className="text-main">guru</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.25em] font-semibold">
            <Link
              to="/leaderboard"
              className={`transition-colors ${
                isActive("/leaderboard")
                  ? "text-main"
                  : "text-sub hover:text-main"
              }`}
            >
              leaderboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="
              px-3
              py-1.5
              rounded-md
              text-xs
              font-semibold
              border
              border-sub/20
              hover:border-main
              transition
            "
          >
            {theme === "light" ? "dark" : "light"}
          </button>

          <AuthActions />
        </div>
      </div>
    </header>
  );
}
