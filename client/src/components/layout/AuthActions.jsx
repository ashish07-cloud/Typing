import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/authStore";
import LogoutModal from "./LogoutModal";

export default function AuthActions() {
  const { user, isInitialized, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!isInitialized) return <div className="w-20 h-8 bg-[var(--text-color)]/5 animate-pulse rounded-xl" />;

  if (!user) {
    return (
      <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest font-bold">
        <Link to="/login" className="text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors">login</Link>
        <Link to="/register" className="px-6 py-2.5 rounded-xl bg-[var(--main-color)] text-[var(--bg-color)] shadow-lg shadow-[var(--main-color)]/20 hover:scale-105 transition-all">register</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-widest font-bold">
        <Link to="/profile" className="group flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--main-color)]/10 flex items-center justify-center text-[var(--main-color)] group-hover:bg-[var(--main-color)] group-hover:text-[var(--bg-color)] transition-all">
            {user.username[0].toUpperCase()}
          </div>
          <span className="text-[var(--sub-color)] group-hover:text-[var(--text-color)] transition-colors">{user.username}</span>
        </Link>
        <button onClick={() => setShowLogoutModal(true)} className="text-[var(--sub-color)] hover:text-red-500 transition-colors">logout</button>
      </div>
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => { logout(); setShowLogoutModal(false); }} />
    </>
  );
}