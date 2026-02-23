import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="text-center max-w-lg">
        <h1 className="text-7xl font-black text-[var(--main-color)] tracking-tight mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-3">
          Page not found
        </h2>

        <p className="text-[var(--sub-color)] mb-8">
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-[var(--main-color)] text-[var(--bg-color)] font-semibold hover:opacity-90 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}