import { useState } from 'react';
import useAuthStore from '../../../store/authStore';

export default function ProfileAvatar({ user, isOwnProfile }) {
  const [isUploading, setIsUploading] = useState(false);
  const { updateProfile } = useAuthStore();

  const getInitials = (name) => name.substring(0, 2).toUpperCase();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.size > 2000000) return alert("File too large (Max 2MB)");

    setIsUploading(true);
    // PRODUCTION NOTE: You should send this to a multipart/form-data endpoint
    // that uploads to Cloudinary/S3. Storing as Base64 is temporary debt.
    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateProfile({ avatar: reader.result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative shrink-0">
      <div 
        className={`w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl transition-all relative overflow-hidden border-4 border-[var(--bg-color)] ${
          isOwnProfile ? 'cursor-pointer hover:rotate-2 hover:scale-105' : ''
        }`}
        onClick={() => isOwnProfile && document.getElementById('avatar-upload').click()}
        style={user.avatar ? { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' } : { backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
      >
        {!user.avatar && getInitials(user.username)}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-[var(--main-color)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOwnProfile && (
        <input id="avatar-upload" type="file" hidden accept="image/*" onChange={handleFileUpload} />
      )}
    </div>
  );
}