import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import axiosClient from '../api/axiosClient';
import ProfileView from '../components/profile/ProfileView';
import Loader from '../components/common/Loader';

export default function ProfilePage() {
  const { username } = useParams(); // URL looks like /profile/user1
  const { user: currentUser, isInitialized } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // If no username in URL, show logged in user
        const target = username || currentUser?.username;
        if (!target) return;

        const res = await axiosClient.get(`/users/${target}`);
        setProfileData(res.data.user);
      } catch (err) {
        console.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized) fetchProfile();
  }, [username, currentUser, isInitialized]);

  if (!isInitialized || loading) return <Loader />;
  if (!username && !currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {profileData ? (
        <ProfileView 
          data={profileData} 
          isOwnProfile={currentUser?.username === profileData.username} 
        />
      ) : (
        <div className="text-center text-sub">User not found</div>
      )}
    </div>
  );
}