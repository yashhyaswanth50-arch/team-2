import React from "react";
import { Compass, BookOpen, UserCheck, Sparkles, RotateCcw, ShieldCheck } from "lucide-react";
import { StudentProfile } from "../types.js";

interface HeaderProps {
  currentView: "landing" | "wizard" | "results" | "roadmap" | "counselor";
  onNavigate: (view: "landing" | "wizard" | "results" | "roadmap" | "counselor") => void;
  profile: StudentProfile | null;
  savedCount: number;
  onResetProfile: () => void;
  isCounselorMode: boolean;
  onToggleCounselorMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  profile,
  savedCount,
  onResetProfile,
  isCounselorMode,
  onToggleCounselorMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          id="brand-logo-btn"
          onClick={() => onNavigate(profile ? "results" : "landing")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-indigo-100 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900">
                AI Career Guidance
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-block">
                College Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              For first-year explorers finding their true direction
            </p>
          </div>
        </div>

        {/* Center / Navigation items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {profile && (
            <>
              <button
                id="nav-results-btn"
                onClick={() => onNavigate("results")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === "results" || currentView === "roadmap"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">My Pathways</span>
                <span className="sm:hidden">Paths</span>
              </button>

              <button
                id="nav-profile-edit-btn"
                onClick={() => onNavigate("wizard")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === "wizard"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Profile</span>
              </button>
            </>
          )}

          {/* Counselor Mode Toggle */}
          <button
            id="toggle-counselor-mode-btn"
            onClick={onToggleCounselorMode}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border ${
              isCounselorMode
                ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                : "text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
            title="Switch between Student Mode and College Counselor View"
          >
            <UserCheck className={`w-3.5 h-3.5 ${isCounselorMode ? "text-amber-600" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Counselor View</span>
            <span className="sm:hidden">Counselor</span>
          </button>

          {/* Profile Reset / Sign Out */}
          {profile && (
            <div className="relative flex items-center pl-1 border-l border-slate-200 ml-1">
              <button
                id="reset-profile-btn"
                onClick={onResetProfile}
                title="Start fresh with a new profile"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
