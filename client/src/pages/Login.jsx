import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4 font-mono">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-sm bg-[var(--main-color)] rotate-45" />
            <h1 className="text-3xl font-black tracking-tighter text-[var(--text-color)]">
              typing<span className="text-[var(--main-color)]">guru</span>
            </h1>
          </div>
          <p className="text-[var(--sub-color)] text-[10px] uppercase tracking-[0.4em] font-bold">system_access</p>
        </div>

        {/* Form Container */}
        <div className="bg-[var(--text-color)]/[0.02] border border-[var(--sub-color)]/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-[var(--text-color)] mb-8 tracking-tight">Welcome Back</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">email_address</label>
              <input
                type="email"
                placeholder="commander@typing.guru"
                className="w-full p-4 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] focus:border-[var(--main-color)] focus:ring-4 focus:ring-[var(--main-color)]/10 outline-none transition-all placeholder:text-[var(--sub-color)]/30"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] focus:border-[var(--main-color)] focus:ring-4 focus:ring-[var(--main-color)]/10 outline-none transition-all placeholder:text-[var(--sub-color)]/30"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[var(--main-color)] text-[var(--bg-color)] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-[var(--main-color)]/20 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-[var(--bg-color)] border-t-transparent rounded-full animate-spin" />
                  <span>authenticating...</span>
                </div>
              ) : "sign_in"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[var(--sub-color)]/10 pt-8">
            <Link to="/register" className="text-[10px] font-bold text-[var(--sub-color)] hover:text-[var(--main-color)] uppercase tracking-widest transition-colors">
              create_new_identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}