import { THEMES } from "./themes";

const STORAGE_KEY = "theme";

export function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;

  const root = document.documentElement;

  root.style.setProperty("--bg-color", theme.bg);
  root.style.setProperty("--main-color", theme.main);
  root.style.setProperty("--sub-color", theme.sub);
  root.style.setProperty("--text-color", theme.text);
  root.style.setProperty("--error-color", theme.error);

  root.dataset.theme = themeName;
}

export function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && THEMES[stored]) return stored;
  return null;
}

export function setStoredTheme(themeName) {
  localStorage.setItem(STORAGE_KEY, themeName);
}

export function getInitialTheme(userTheme) {
  return (
    userTheme ||
    getStoredTheme() ||
    "olive" // fallback
  );
}