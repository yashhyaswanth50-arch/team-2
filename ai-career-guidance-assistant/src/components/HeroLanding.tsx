import React from "react";
import { ArrowRight, Sparkles, Compass, GraduationCap, MapPin, CheckCircle2, User, ChevronRight } from "lucide-react";
import { SAMPLE_PROFILES } from "../data/constants.js";
import { StudentProfile } from "../types.js";

interface HeroLandingProps {
  onStartWizard: () => void;
  onSelectSampleProfile: (profile: StudentProfile) => void;
  hasExistingProfile: boolean;
  onContinueExisting: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartWizard,
  onSelectSampleProfile,
  hasExistingProfile,
  onContinueExisting,
}) => {
  return (
    <div className="py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs sm:text-sm font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Built for first-year college students feeling undecided</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Turn your curiosity into a clear, realistic career roadmap
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          You don&apos;t need to have your entire life figured out in freshman year. Tell us what subjects you actually enjoy, what problems you like solving, and your current skills — our AI advisor charts realistic careers, higher-study options, and semester-by-semester next steps.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            id="hero-start-discovery-btn"
            onClick={onStartWizard}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all hover:translate-y-[-1px] active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Career Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {hasExistingProfile && (
            <button
              id="hero-continue-saved-btn"
              onClick={onContinueExisting}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Resume My Saved Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Share Your Interests & Skills</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Select what you like doing (e.g., puzzles, design, helping people), subjects you enjoy, and any basic skills you have without pressure.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
            2
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Discover 3–5 Matching Paths</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unpack realistic roles, day-to-day routines, skill gaps, and degree or certification options (Bachelor&apos;s, Master&apos;s, Diplomas).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
            3
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Actionable Step-by-Step Milestones</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Track courses, projects, and internships with checklist progress, personal notes, and counselor shareable links.
          </p>
        </div>
      </div>

      {/* Try with Sample Persona Section */}
      <div className="bg-slate-100/80 border border-slate-200/90 rounded-2xl p-6 sm:p-8 my-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Want to test it first? Try a sample freshman profile:</h2>
            <p className="text-sm text-slate-600 mt-1">
              Select one of our preset student scenarios to see instant recommendations and interactive roadmaps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_PROFILES.map((sample, idx) => (
            <div
              key={idx}
              id={`sample-profile-card-${idx}`}
              onClick={() => onSelectSampleProfile(sample.profile)}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold">
                    {sample.profile.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {sample.label}
                    </h4>
                    <span className="text-xs text-slate-500">{sample.profile.major}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
                <span>Load this scenario</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
