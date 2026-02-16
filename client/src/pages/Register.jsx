import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 6) {
      return setError("Password is too short (min 6 chars).");
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Send only the fields the User model expects initially
      await register({ 
        username: formData.username, 
        email: formData.email, 
        password: formData.password 
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try a different username.");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ show, toggle, label }) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sub-color)] hover:text-[var(--main-color)] transition-colors p-1"
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4 font-mono">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[var(--text-color)] tracking-tighter">join_the_arena</h1>
          <p className="text-[var(--sub-color)] text-[10px] uppercase tracking-[0.4em] mt-2">new_identity_registration</p>
        </div>

        <div className="bg-[var(--text-color)]/[0.02] border border-[var(--sub-color)]/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">username</label>
              <input 
                className="w-full p-4 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] focus:border-[var(--main-color)] outline-none transition-all" 
                placeholder="speed_demon"
                onChange={e => setFormData({...formData, username: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">email_address</label>
              <input 
                type="email" 
                placeholder="user@typing.guru"
                className="w-full p-4 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] outline-none focus:border-[var(--main-color)] transition-all" 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  placeholder="min 6 characters"
                  className="w-full p-4 pr-12 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] outline-none focus:border-[var(--main-color)] transition-all" 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                  minLength={6} 
                />
                <EyeIcon show={showPass} toggle={() => setShowPass(!showPass)} label="Toggle password visibility" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest ml-1">confirm_password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="re-enter password"
                  className="w-full p-4 pr-12 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] outline-none focus:border-[var(--main-color)] transition-all" 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  required 
                />
                <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} label="Toggle confirm password visibility" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-4 bg-[var(--main-color)] text-[var(--bg-color)] font-black uppercase tracking-widest rounded-2xl mt-4 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[var(--main-color)]/20"
            >
              {isLoading ? "initializing_protocol..." : "create_account"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[var(--sub-color)]/10 pt-8">
            <Link to="/login" className="text-[10px] font-bold text-[var(--sub-color)] hover:text-[var(--main-color)] uppercase tracking-widest transition-colors">
              already_registered?_log_in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}