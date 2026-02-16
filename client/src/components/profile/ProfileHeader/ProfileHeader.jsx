import { useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import useAuthStore from '../../../store/authStore';

export default function ProfileHeader({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const { updateProfile } = useAuthStore();

  const handleSaveBio = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ bio });
      setIsEditing(false);
    } catch (error) {
      console.error('Bio update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[var(--bg-color)] border border-[var(--sub-color)]/10 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--main-color)]/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
        <ProfileAvatar user={user} isOwnProfile={isOwnProfile} />
        
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold text-[var(--text-color)] tracking-tighte text-transform: uppercase mb-2">
                {user.username}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-[var(--sub-color)] font-mono text-xs uppercase tracking-widest">
                <span className="flex items-center gap-1">
                   <span className="opacity-50">from</span> {user.country || 'untracked'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--sub-color)]/30" />
                <span>joined {user.joinDate || 'recently'}</span>
              </div>
            </div>
            
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 rounded-xl border border-[var(--sub-color)]/20 text-[var(--sub-color)] hover:text-[var(--text-color)] hover:bg-[var(--text-color)]/5 transition-all text-xs font-bold uppercase tracking-widest"
              >
                {isEditing ? 'cancel' : 'edit_profile'}
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-4 rounded-2xl bg-[var(--text-color)]/5 border border-[var(--sub-color)]/10 text-[var(--text-color)] outline-none focus:border-[var(--main-color)] transition-all resize-none font-mono text-sm"
                rows={3}
                maxLength={200}
                placeholder="write something about yourself..."
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSaveBio}
                  disabled={isSaving}
                  className="px-8 py-2 bg-[var(--main-color)] text-[var(--bg-color)] rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 transition-all hover:scale-105"
                >
                  {isSaving ? 'saving...' : 'save_bio'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[var(--sub-color)] text-lg leading-relaxed max-w-2xl italic">
              {user.bio || (isOwnProfile ? 'Click edit to add a bio...' : 'No bio provided.')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}