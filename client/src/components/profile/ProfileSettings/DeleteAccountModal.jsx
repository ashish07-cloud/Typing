import { useState } from "react";
import useAuthStore from "../../../store/authStore";
import axiosClient from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosClient.delete("/auth/delete");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Account deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[var(--bg-color)] rounded-3xl p-8 border border-[var(--sub-color)]/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <h2 className="text-xl font-bold text-red-500 mb-4 tracking-tight">
          delete_account
        </h2>

        <p className="text-sm text-[var(--text-color)] mb-6">
          This action is permanent. All your stats, history and leaderboard
          entries will be removed.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[var(--sub-color)]/20 text-[var(--sub-color)] hover:bg-[var(--text-color)]/5 transition"
          >
            cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "deleting..." : "yes_delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
