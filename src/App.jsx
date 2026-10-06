import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import BugResult from './components/BugResult';
import BugDex from './components/BugDex';
import BugDetailModal from './components/BugDetailModal';
import DailyQuests from './components/DailyQuests';
import Achievements from './components/Achievements';
import ProfileSettings from './components/ProfileSettings';
import LevelUpModal from './components/LevelUpModal';
import AchievementToast from './components/AchievementToast';

import {
  getBugDex,
  getUserStats,
  getDailyQuests,
  getAchievements,
  calculateLevelData,
  saveDiscovery,
  seedSampleCollection,
} from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [showLanding, setShowLanding] = useState(false);
  const [bugs, setBugs] = useState([]);
  const [stats, setStats] = useState({ xp: 0, totalDiscovered: 0, uniqueDiscovered: 0, streak: 1 });
  const [dailyQuests, setDailyQuests] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Scanning & Result state
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [lastScanResult, setLastScanResult] = useState(null);

  // Modals & Overlays
  const [selectedBugDetail, setSelectedBugDetail] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const [toastAchievement, setToastAchievement] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Load initial local data
  const refreshData = () => {
    const loadedBugs = getBugDex();
    const rawStats = getUserStats();
    const levelData = calculateLevelData(rawStats.xp);
    const quests = getDailyQuests();
    const achs = getAchievements();

    setBugs(loadedBugs);
    setStats({ ...rawStats, levelData });
    setDailyQuests(quests);
    setAchievements(achs);

    // If first visit and collection is empty, offer landing page or sample
    const hasVisited = localStorage.getItem('bugdex_has_visited');
    if (!hasVisited && loadedBugs.length === 0) {
      setShowLanding(true);
      localStorage.setItem('bugdex_has_visited', 'true');
    }
  };

  useEffect(() => {
    refreshData();
    setIsMuted(localStorage.getItem('bugdex_muted') === 'true');
  }, []);

  // When scanner finishes analysis
  const handleBugAnalyzed = (bugData, location, photoBase64) => {
    // Check if duplicate or new, and calculate XP
    const saveOutcome = saveDiscovery(bugData, location, photoBase64);

    setCurrentAnalysis({
      bugData,
      location,
      photoBase64,
      isExisting: !saveOutcome.isNewDiscovery,
      xpEarned: saveOutcome.xpEarned,
      savedBug: saveOutcome.savedBug,
    });

    setLastScanResult(saveOutcome);
    setCurrentTab('result');

    // Trigger level up modal if reached
    if (saveOutcome.leveledUp) {
      setTimeout(() => {
        setLevelUpData({
          newLevel: saveOutcome.newLevel,
          rankTitle: saveOutcome.stats.levelData.rankTitle,
        });
      }, 800);
    }

    // Trigger achievement toast if any unlocked
    if (saveOutcome.newAchievements && saveOutcome.newAchievements.length > 0) {
      setTimeout(() => {
        setToastAchievement(saveOutcome.newAchievements[0]);
      }, 1500);
    }

    refreshData();
  };

  const handleQuestCompleted = (outcome) => {
    refreshData();
    if (outcome.leveledUp) {
      const levelInfo = calculateLevelData(getUserStats().xp);
      setLevelUpData({
        newLevel: outcome.newLevel,
        rankTitle: levelInfo.rankTitle,
      });
    }
  };

  return (
    <div className="min-h-screen bg-nature-950 text-emerald-50 font-sans relative flex flex-col selection:bg-nature-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastAchievement && (
        <AchievementToast
          achievement={toastAchievement}
          onClose={() => setToastAchievement(null)}
        />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          rankTitle={levelUpData.rankTitle}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Species Detail Modal */}
      {selectedBugDetail && (
        <BugDetailModal
          bug={selectedBugDetail}
          onClose={() => setSelectedBugDetail(null)}
        />
      )}

      {/* Landing Page Mode */}
      {showLanding ? (
        <LandingPage
          onStartExploring={() => {
            setShowLanding(false);
            setCurrentTab('home');
          }}
          onQuickScan={() => {
            setShowLanding(false);
            setCurrentTab('scan');
          }}
        />
      ) : (
        <>
          {/* Top Sticky Header */}
          <Navbar
            stats={stats}
            onOpenSettings={() => setCurrentTab('profile')}
            onToggleLanding={() => setShowLanding(true)}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onNavigate={(tab) => setCurrentTab(tab)}
          />

          {/* Main App Container */}
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3">
            {currentTab === 'home' && (
              <Dashboard
                stats={stats}
                bugs={bugs}
                dailyQuests={dailyQuests}
                onNavigate={(tab) => setCurrentTab(tab)}
                onSelectBug={(bug) => setSelectedBugDetail(bug)}
                onQuickScan={() => setCurrentTab('scan')}
              />
            )}

            {currentTab === 'scan' && (
              <Scanner
                onBugAnalyzed={handleBugAnalyzed}
                onOpenSettings={() => setCurrentTab('profile')}
              />
            )}

            {currentTab === 'result' && currentAnalysis && (
              <BugResult
                analysisData={currentAnalysis.bugData}
                photoUrl={currentAnalysis.photoBase64}
                location={currentAnalysis.location}
                isExisting={currentAnalysis.isExisting}
                xpEarned={currentAnalysis.xpEarned}
                onSaveAndExplore={() => {
                  refreshData();
                }}
                onViewDex={() => {
                  setCurrentTab('bugdex');
                }}
                onScanAnother={() => {
                  setCurrentTab('scan');
                }}
              />
            )}

            {currentTab === 'bugdex' && (
              <BugDex
                bugs={bugs}
                onSelectBug={(bug) => setSelectedBugDetail(bug)}
                onQuickScan={() => setCurrentTab('scan')}
              />
            )}

            {currentTab === 'quests' && (
              <DailyQuests
                quests={dailyQuests}
                onQuestCompleted={handleQuestCompleted}
                onQuickScan={() => setCurrentTab('scan')}
              />
            )}

            {currentTab === 'achievements' && (
              <Achievements
                achievements={achievements}
                uniqueCount={bugs.length}
                streak={stats.streak}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileSettings
                stats={stats}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onDataResetOrSeeded={() => {
                  refreshData();
                }}
                onClose={() => setCurrentTab('home')}
              />
            )}
          </main>

          {/* Fixed Mobile-first Bottom Navigation */}
          <BottomNav
            activeTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />
        </>
      )}
    </div>
  );
}
