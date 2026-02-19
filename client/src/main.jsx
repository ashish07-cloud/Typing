import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

const saved = localStorage.getItem("auth-storage");

if (saved) {
  try {
    const parsed = JSON.parse(saved);
    const prefs = parsed?.state?.user?.preferences;

    if (prefs?.theme) {
      document.documentElement.setAttribute("data-theme", prefs.theme);
    }
  } catch (e) {}
}



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        {/* You should build a simple ErrorBoundary component here later */}
        <App />
    </BrowserRouter>
  </React.StrictMode>
);