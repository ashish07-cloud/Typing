import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import ErrorBoundary from "./components/common/ErrorBoundary";

import { applyTheme, getStoredTheme } from "./styles/themeManager";

const storedTheme = getStoredTheme();
if (storedTheme) {
  applyTheme(storedTheme);
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