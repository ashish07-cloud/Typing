import { useState, useMemo } from "react";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileStats from "./ProfileStats/ProfileStats";
import ProfileActivity from "./ProfileActivity/RecentActivity";
import AchievementsList from "./ProfileAchievements/AchievementsList";
import ProfileSettings from "./ProfileSettings/ProfileSettings";

export default function ProfileView({ data, isOwnProfile }) {
  const [activeTab, setActiveTab] = useState("overview");

  const wpmHistory = useMemo(() => {
    if (!data?.recentTests) return [];
    return [...data.recentTests]
      .reverse()
      .map((t, i) => ({
        wpm: t.wpm,
        accuracy: t.accuracy,
        label: i + 1,
      }));
  }, [data]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "achievements", label: "Achievements" },
    ...(isOwnProfile ? [{ id: "settings", label: "Settings" }] : []),
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* GLASS TAB BAR */}
      <div className="flex gap-2 p-2 rounded-2xl bg-[var(--bg-color)]/40 backdrop-blur-xl border border-[var(--sub-color)]/10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-[var(--main-color)] text-[var(--bg-color)] shadow-md"
                : "text-[var(--sub-color)] hover:text-[var(--text-color)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ProfileHeader user={data} isOwnProfile={isOwnProfile} />

      {activeTab === "overview" && (
        <div className="space-y-10">
          <ProfileStats user={data} wpmHistory={wpmHistory} />
          <ProfileActivity activities={data.recentTests} />
        </div>
      )}

      {activeTab === "activity" && (
        <ProfileActivity activities={data.recentTests} />
      )}

      {activeTab === "achievements" && (
        <AchievementsList userAchievements={data.achievements} />
      )}

      {activeTab === "settings" && isOwnProfile && (
        <ProfileSettings user={data} />
      )}
    </div>
  );
}
