import { useState } from 'react';
import SettingsForm from './SettingsForm';
import useAuthStore from '../../../store/authStore';

const SECTIONS = [
  { id: 'preferences', label: 'preferences', icon: '⚙️' },
  { id: 'account', label: 'account', icon: '👤' },
  { id: 'danger', label: 'danger_zone', icon: '⚠️' }
];

export default function ProfileSettings({ user }) {
  const [activeSection, setActiveSection] = useState('preferences');
  const { updatePreferences } = useAuthStore();

  return (
    <div className="bg-[var(--bg-color)] border border-[var(--sub-color)]/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      {/* Navigation Sidebar */}
      <div className="w-full md:w-64 bg-[var(--text-color)]/5 border-r border-[var(--sub-color)]/10 p-6">
        <nav className="flex md:flex-col gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 md:flex-none flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeSection === s.id
                  ? 'bg-[var(--main-color)] text-[var(--bg-color)] shadow-lg'
                  : 'text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--text-color)]/5'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
        {activeSection === 'preferences' && (
          <SettingsForm 
            preferences={user.preferences} 
            onSave={(prefs) => updatePreferences(prefs)} 
          />
        )}
        
        {activeSection === 'account' && (
          <div className="max-w-md space-y-8">
            <h2 className="text-2xl font-bold text-[var(--text-color)] tracking-tighter">account_settings</h2>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[var(--sub-color)] tracking-widest">email_address</label>
              <div className="p-4 rounded-xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--sub-color)]">
                {user.email}
              </div>
              <p className="text-[10px] text-[var(--sub-color)] italic mt-2">To change your email, please contact support.</p>
            </div>
          </div>
        )}

        {activeSection === 'danger' && (
          <div className="max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-red-500 tracking-tighter">danger_zone</h2>
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-[var(--text-color)] mb-4 font-medium">Deleting your account will wipe all your WPM history and leaderboard entries. This cannot be undone.</p>
              <button className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-colors">
                delete_my_account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}