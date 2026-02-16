import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-page rounded-3xl border border-sub/20 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-main/10 mb-6">
            <span className="text-3xl">👋</span>
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-dark mb-3">
            Confirm Logout
          </h3>
          
          {/* Message */}
          <p className="text-sub mb-8 leading-relaxed">
            Are you sure you want to log out? You'll need to sign in again to access your typing stats and history.
          </p>
          
          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-sub/20 text-sub hover:bg-dark/5 hover:border-sub/30 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 px-6 rounded-xl bg-main text-page font-medium hover:bg-main/90 transition-all duration-300 shadow-lg shadow-main/20"
            >
              Yes, Logout
            </button>
          </div>
          
          {/* Security Note */}
          <p className="mt-6 text-xs text-sub/60">
            Your data will be saved and ready when you sign back in.
          </p>
        </div>
      </div>
    </div>
  );
}