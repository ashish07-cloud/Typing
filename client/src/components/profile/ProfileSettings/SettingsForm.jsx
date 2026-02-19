import { useState } from "react";
import { THEMES } from "../../../styles/themes";
import useTheme from "../../../hooks/useTheme";

const CARET_STYLES = ["line", "block", "underline", "none"];

export default function SettingsForm({ preferences, onSave }) {
  const [formData, setFormData] = useState({ ...preferences });
  const [isSaving, setIsSaving] = useState(false);

  // 🔥 Live theme preview (instant apply)
  useTheme(formData.theme);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-14 font-mono">

      {/* ========================= */}
      {/* THEME SELECTOR */}
      {/* ========================= */}
      <section className="space-y-6">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">
          color_scheme
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {Object.entries(THEMES).map(([key, theme]) => {
            const isActive = formData.theme === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => updateField("theme", key)}
                className={`p-5 rounded-2xl border transition-all duration-300 group text-left backdrop-blur-md ${
                  isActive
                    ? "border-[var(--main-color)] scale-[1.03]"
                    : "border-[var(--sub-color)]/15 hover:border-[var(--sub-color)]/40"
                }`}
                style={{ backgroundColor: theme.bg }}
              >
                {/* 4 Color Preview Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div
                    className="h-6 rounded-md"
                    style={{ backgroundColor: theme.bg }}
                  />
                  <div
                    className="h-6 rounded-md"
                    style={{ backgroundColor: theme.main }}
                  />
                  <div
                    className="h-6 rounded-md"
                    style={{ backgroundColor: theme.sub }}
                  />
                  <div
                    className="h-6 rounded-md"
                    style={{ backgroundColor: theme.text }}
                  />
                </div>

                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.text }}
                >
                  {key}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================= */}
      {/* CARET STYLE */}
      {/* ========================= */}
      <section className="space-y-6">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">
          caret_visuals
        </label>

        <div className="flex flex-wrap gap-3">
          {CARET_STYLES.map((style) => {
            const active = formData.caretStyle === style;

            return (
              <button
                key={style}
                type="button"
                onClick={() => updateField("caretStyle", style)}
                className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                  active
                    ? "bg-[var(--main-color)] text-[var(--bg-color)] border-[var(--main-color)]"
                    : "border-[var(--sub-color)]/20 text-[var(--sub-color)] hover:border-[var(--sub-color)]/40"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================= */}
      {/* FONT SIZE */}
      {/* ========================= */}
      <section className="space-y-6">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">
          typography_size
        </label>

        <input
          type="range"
          min="12"
          max="42"
          value={formData.fontSize}
          onChange={(e) =>
            updateField("fontSize", parseInt(e.target.value))
          }
          className="w-full h-1 bg-[var(--sub-color)]/20 rounded-lg appearance-none cursor-pointer accent-[var(--main-color)]"
        />

        <div
          className="p-6 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-center transition-all"
          style={{ fontSize: `${formData.fontSize}px` }}
        >
          The quick brown fox jumps over the lazy dog.
        </div>
      </section>

      {/* ========================= */}
      {/* SAVE BUTTON */}
      {/* ========================= */}
      <div className="pt-10 border-t border-[var(--sub-color)]/10">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-4 bg-[var(--main-color)] text-[var(--bg-color)] rounded-2xl font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? "syncing..." : "save_preferences"}
        </button>
      </div>
    </form>
  );
}
