import { Link } from "react-router-dom";
import AuthActions from "./AuthActions";

export default function Header() {
  return (
    <header className="w-full bg-creamy-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-olive-900"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-olive-600" />
          typing<span className="font-bold">guru</span>
        </Link>

        {/* Auth */}
        <AuthActions />
      </div>

      {/* subtle divider */}
      <div className="h-px w-full bg-creamy-300" />
    </header>
  );
}
