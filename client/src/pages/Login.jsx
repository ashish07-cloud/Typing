import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-creamy-50">
      <form
        onSubmit={handleSubmit}
        className="w-80 space-y-4 rounded-lg border border-creamy-300 bg-creamy-100 p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-olive-900">
          Login
        </h2>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-creamy-50 border border-olive-200 p-2 text-olive-900 focus:ring-2 focus:ring-olive-400 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-creamy-50 border border-olive-200 p-2 text-olive-900 focus:ring-2 focus:ring-olive-400 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full rounded-md bg-olive-600 py-2 font-medium text-creamy-50 hover:bg-olive-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
