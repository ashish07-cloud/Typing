import { useState } from 'react';

const THEMES = [
  { id: 'olive', name: 'creamy_olive', bg: '#f9f7f0', main: '#e68a2e' },
  { id: 'dark', name: 'midnight', bg: '#111111', main: '#e68a2e' },
  { id: 'cyberpunk', name: 'neon_matrix', bg: '#000000', main: '#00ff41' }
];

const CARET_STYLES = ['line', 'block', 'underline', 'none'];

export default function SettingsForm({ preferences, onSave }) {
  const [formData, setFormData] = useState({ ...preferences });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    <form onSubmit={handleSubmit} className="space-y-12 font-mono">
      {/* THEME SELECTOR */}
      <section className="space-y-4">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">color_scheme</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateField('theme', t.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                formData.theme === t.id ? 'border-[var(--main-color)]' : 'border-[var(--sub-color)]/10'
              }`}
              style={{ backgroundColor: t.bg }}
            >
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: t.main }} />
              <span className="block mt-2 text-xs font-bold" style={{ color: t.id === 'olive' ? '#2d2d2d' : '#fff' }}>{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* CARET STYLE */}
      <section className="space-y-4">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">caret_visuals</label>
        <div className="flex flex-wrap gap-3">
          {CARET_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => updateField('caretStyle', style)}
              className={`px-6 py-3 rounded-xl border-2 uppercase text-xs font-bold tracking-widest transition-all ${
                formData.caretStyle === style 
                  ? 'bg-[var(--main-color)] text-[var(--bg-color)] border-[var(--main-color)]' 
                  : 'border-[var(--sub-color)]/20 text-[var(--sub-color)]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* FONT SIZE PREVIEW */}
      <section className="space-y-4">
        <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-[0.3em]">typography_size</label>
        <input 
          type="range" min="16" max="42" 
          value={formData.fontSize} 
          onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
          className="w-full h-1 bg-[var(--sub-color)]/20 rounded-lg appearance-none cursor-pointer accent-[var(--main-color)]"
        />
        <div className="p-6 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-center"
             style={{ fontSize: `${formData.fontSize}px` }}>
          The quick brown fox jumps...
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-8 border-t border-[var(--sub-color)]/10">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 py-4 bg-[var(--main-color)] text-[var(--bg-color)] rounded-2xl font-bold uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? 'syncing...' : 'save_preferences'}
        </button>
      </div>
    </form>
  );
}