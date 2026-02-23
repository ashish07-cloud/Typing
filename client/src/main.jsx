import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { THEMES } from "./styles/themes";

const savedTheme = localStorage.getItem("theme");

if (savedTheme && THEMES[savedTheme]) {
  const theme = THEMES[savedTheme];
  const root = document.documentElement;

  root.style.setProperty("--bg-color", theme.bg);
  root.style.setProperty("--main-color", theme.main);
  root.style.setProperty("--sub-color", theme.sub);
  root.style.setProperty("--text-color", theme.text);
  root.style.setProperty("--error-color", theme.error);

  root.dataset.theme = savedTheme;
}



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);