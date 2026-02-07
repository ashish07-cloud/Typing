import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await register(form);
      navigate("/");
    } catch {
      setError("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-creamy-50">
      <form
        onSubmit={handleSubmit}
        className="w-80 space-y-4 rounded-lg border border-creamy-300 bg-creamy-100 p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-olive-900">
          Register
        </h2>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          className="w-full rounded-md bg-creamy-50 border border-olive-200 p-2 text-olive-900 focus:ring-2 focus:ring-olive-400 focus:outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full rounded-md bg-creamy-50 border border-olive-200 p-2 text-olive-900 focus:ring-2 focus:ring-olive-400 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full rounded-md bg-creamy-50 border border-olive-200 p-2 text-olive-900 focus:ring-2 focus:ring-olive-400 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full rounded-md bg-olive-600 py-2 font-medium text-creamy-50 hover:bg-olive-700 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}
