import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useHistoryStore from "../../store/historyStore";

export default function AuthActions() {
  const { user, loading, logout } = useAuthStore();
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  if (loading) {
    return (
      <div className="text-sm text-olive-500">
        loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link
          to="/login"
          className="text-olive-700 hover:text-olive-900 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-md bg-olive-600 px-4 py-1.5 text-creamy-50 font-medium hover:bg-olive-700 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    clearHistory(); // ✅ IMPORTANT
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link
        to="/profile"
        className="text-olive-700 hover:text-olive-900 font-medium transition"
      >
        @{user.username}
      </Link>

      <button
        onClick={handleLogout}
        className="text-olive-500 hover:text-olive-800 transition"
      >
        Logout
      </button>
    </div>
  );
}
