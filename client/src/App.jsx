import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import Leaderboard from "./pages/Leaderboard";
import Loader from "./components/common/Loader";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  const { initialize, isInitialized } = useAuthStore(); // Changed from fetchMe to initialize

  useEffect(() => {
    initialize(); // Changed from fetchMe() to initialize()
  }, [initialize]); // Changed dependency

  // BOOT SEQUENCE: If we haven't checked the token yet, show a splash loader
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-color)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* PROTECTED ROUTES */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}