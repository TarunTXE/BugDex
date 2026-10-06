import React from 'react';
import { Home, Camera, Grid, Target, User } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function BottomNav({ activeTab, onSelectTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bugdex', label: 'BugDex', icon: Grid },
    { id: 'scan', label: 'Scan Bug', icon: Camera, isCenter: true },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNav = (tabId) => {
    playSound('click');
    onSelectTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-lg mx-auto px-4 pb-3">
        <div className="pointer-events-auto glass-panel-highlight rounded-2xl p-1.5 shadow-2xl shadow-black/80 flex items-center justify-around border border-nature-600/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  aria-label="Scan Bug"
                  className="relative -top-5 flex flex-col items-center group focus:outline-none"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-nature-600 via-nature-400 to-emerald-300 p-1 shadow-lg shadow-nature-500/40 group-hover:scale-110 group-active:scale-95 transition-transform">
                    <div className="w-full h-full rounded-full bg-nature-950 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-nature-400/20 rounded-full animate-ping opacity-75" />
                      <Camera className="w-6 h-6 text-nature-300 relative z-10 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-nature-300 tracking-wide mt-1 drop-shadow">
                    SCAN
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'text-nature-300 bg-nature-800/60 font-bold'
                    : 'text-emerald-100/60 hover:text-emerald-200 hover:bg-white/5 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-nature-400' : ''}`} />
                <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-nature-400 mt-0.5 shadow-sm shadow-nature-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
