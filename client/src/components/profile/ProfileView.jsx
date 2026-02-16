import { useState, useEffect, useMemo } from 'react';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ProfileStats from './ProfileStats/ProfileStats';
import ProfileActivity from './ProfileActivity/RecentActivity';
import AchievementsList from './ProfileAchievements/AchievementsList';
import ProfileSettings from './ProfileSettings/ProfileSettings';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import Loader from '../common/Loader';

export default function ProfileView({ username: urlUsername }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user: currentUser } = useAuthStore();
  
  // Logic: Are we looking at our own profile?
  const isOwnProfile = useMemo(() => {
    return !urlUsername || urlUsername === currentUser?.username;
  }, [urlUsername, currentUser]);

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true);
      try {
        // If viewing own profile via /profile, target currentUser.username
        const target = urlUsername || currentUser?.username;
        if (!target) return;

        const res = await axiosClient.get(`/users/${target}`);
        setProfileData(res.data.user);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [urlUsername, currentUser?.username]);

  // Transform recent tests for the chart
  const wpmHistory = useMemo(() => {
    if (!profileData?.recentTests) return [];
    return [...profileData.recentTests]
      .reverse()
      .map((t, i) => ({ wpm: t.wpm, accuracy: t.accuracy, label: i + 1 }));
  }, [profileData]);

  if (loading) return <Loader />;
  if (!profileData) return <div className="text-center py-20 text-sub">User not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '🕒' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: '⚙️' }] : [])
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* TABS */}
      <div className="flex gap-2 mb-8 bg-dark/5 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-main text-page shadow-sm' : 'text-sub hover:text-dark'
            }`}
          >
            <span>{tab.label.toLowerCase()}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-8">
        <ProfileHeader user={profileData} isOwnProfile={isOwnProfile} />

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <ProfileStats stats={profileData.stats} wpmHistory={wpmHistory} />
            <ProfileActivity activities={profileData.recentTests} />
          </div>
        )}

        {activeTab === 'activity' && (
          <ProfileActivity activities={profileData.recentTests} />
        )}

        {activeTab === 'achievements' && (
          <AchievementsList userAchievements={profileData.achievements} />
        )}

        {activeTab === 'settings' && isOwnProfile && (
          <ProfileSettings user={profileData} />
        )}
      </div>
    </div>
  );
}