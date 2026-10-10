import React from "react";
import { BarChart3, User, Trophy, ShoppingCart } from "lucide-react";
import { audio } from "../../services/audio/audio-manager";
import { haptics } from "../../services/haptics/haptics-manager";

export type NavigationTab = "home" | "player" | "achievements" | "store";

interface BottomNavigationDockProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  className?: string;
}

export const BottomNavigationDock: React.FC<BottomNavigationDockProps> = ({
  activeTab,
  onNavigate,
  className = "",
}) => {
  const handleTabClick = (tab: NavigationTab) => {
    audio.play("click");
    haptics.trigger("light");
    if (tab !== activeTab) {
      onNavigate(tab);
    }
  };

  return (
    <footer className={`relative z-20 w-full max-w-sm mx-auto px-4 pb-3 pt-2 flex-shrink-0 ${className}`}>
      <div className="w-full rounded-3xl bg-[#14062B]/90 border border-purple-500/25 backdrop-blur-xl px-3 py-2 flex items-center justify-around shadow-2xl">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleTabClick("home")}
          className={`flex flex-col items-center group cursor-pointer transition-colors ${
            activeTab === "home" ? "text-white font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <BarChart3
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === "home"
                ? "text-[#FF2A6D] scale-105"
                : "text-white/60 group-hover:text-white group-hover:scale-105"
            }`}
          />
          <span
            className={`text-[10px] tracking-wide ${
              activeTab === "home" ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. My Player */}
        <button
          type="button"
          onClick={() => handleTabClick("player")}
          className={`flex flex-col items-center group cursor-pointer transition-colors ${
            activeTab === "player" ? "text-white font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <User
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === "player"
                ? "text-[#FF2A6D] scale-105"
                : "text-white/60 group-hover:text-white group-hover:scale-105"
            }`}
          />
          <span
            className={`text-[10px] tracking-wide ${
              activeTab === "player" ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
            }`}
          >
            My Player
          </span>
        </button>

        {/* 3. Achievements */}
        <button
          type="button"
          onClick={() => handleTabClick("achievements")}
          className={`flex flex-col items-center group cursor-pointer transition-colors ${
            activeTab === "achievements" ? "text-white font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <Trophy
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === "achievements"
                ? "text-[#FF2A6D] scale-105"
                : "text-white/60 group-hover:text-white group-hover:scale-105"
            }`}
          />
          <span
            className={`text-[10px] tracking-wide ${
              activeTab === "achievements" ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
            }`}
          >
            Achievements
          </span>
        </button>

        {/* 4. Store */}
        <button
          type="button"
          onClick={() => handleTabClick("store")}
          className={`flex flex-col items-center group cursor-pointer transition-colors ${
            activeTab === "store" ? "text-white font-semibold" : "text-white/60 hover:text-white"
          }`}
        >
          <ShoppingCart
            className={`w-5 h-5 mb-0.5 transition-transform ${
              activeTab === "store"
                ? "text-[#FF2A6D] scale-105"
                : "text-white/60 group-hover:text-white group-hover:scale-105"
            }`}
          />
          <span
            className={`text-[10px] tracking-wide ${
              activeTab === "store" ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
            }`}
          >
            Store
          </span>
        </button>
      </div>
    </footer>
  );
};
