import { useEffect } from "react";
import { THEMES } from "../styles/themes";

export default function useTheme(themeName) {
  useEffect(() => {
    const theme = THEMES[themeName];
    if (!theme) return;

    const root = document.documentElement;

    root.style.setProperty("--bg-color", theme.bg);
    root.style.setProperty("--main-color", theme.main);
    root.style.setProperty("--sub-color", theme.sub);
    root.style.setProperty("--text-color", theme.text);
    root.style.setProperty("--error-color", theme.error);

    root.dataset.theme = themeName;
    // ⚠️ Don't save to localStorage here — only save on actual selection
  }, [themeName]);
}