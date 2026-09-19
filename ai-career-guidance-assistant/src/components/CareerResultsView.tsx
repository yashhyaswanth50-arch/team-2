import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Filter,
  Search,
  SlidersHorizontal,
  Bookmark,
  PlusCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { CareerPath, StudentProfile } from "../types.js";
import { CareerCard } from "./CareerCard.js";
import { CAREER_DOMAINS } from "../data/constants.js";
import { DisclaimerBanner } from "./DisclaimerBanner.js";

interface CareerResultsViewProps {
  careers: CareerPath[];
  studentProfile: StudentProfile;
  advisorNote?: string;
  clarifyingQuestions: string[];
  savedCareerIds: string[];
  onToggleSaveCareer: (careerId: string) => void;
  onSelectCareer: (career: CareerPath) => void;
  onOpenExploreMore: () => void;
  onOpenClarifyingQuestions: () => void;
  onEditProfile: () => void;
}

export const CareerResultsView: React.FC<CareerResultsViewProps> = ({
  careers,
  studentProfile,
  advisorNote,
  clarifyingQuestions,
  savedCareerIds,
  onToggleSaveCareer,
  onSelectCareer,
  onOpenExploreMore,
  onOpenClarifyingQuestions,
  onEditProfile,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [studyModeFilter, setStudyModeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);

  // Filter careers
  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      // Saved filter
      if (showOnlySaved && !savedCareerIds.includes(c.id)) {
        return false;
      }

      // Domain filter
      if (selectedDomain !== "All Domains" && c.domain?.toLowerCase() !== selectedDomain.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchJob = c.job_titles?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchJob) return false;
      }

      // Study mode filter
      if (studyModeFilter !== "All") {
        const hasMode = c.study_options?.some(
          (o) => o.deliveryMode?.toLowerCase() === studyModeFilter.toLowerCase()
        );
        if (!hasMode) return false;
      }

      return true;
    });
  }, [careers, selectedDomain, studyModeFilter, searchQuery, showOnlySaved, savedCareerIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Greeting & Advisor Note Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Personalized Career Discovery
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {studentProfile.currentYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Curated Pathways for {studentProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Based on your curiosity in{" "}
              <span className="font-semibold text-slate-800">
                {studentProfile.interests.slice(0, 3).join(", ")}
              </span>{" "}
              and favorite subjects{" "}
              <span className="font-semibold text-slate-800">
                {studentProfile.enjoyedSubjects.slice(0, 3).join(", ")}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="results-edit-profile-btn"
              onClick={onEditProfile}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Modify Inputs</span>
            </button>

            <button
              type="button"
              id="results-explore-more-btn"
              onClick={onOpenExploreMore}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore More Angles</span>
            </button>
          </div>
        </div>

        {/* Advisor Warm Message */}
        {advisorNote && (
          <div className="mt-5 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
              {advisorNote}
            </p>
          </div>
        )}

        {/* Clarifying Questions Banner if present */}
        {clarifyingQuestions && clarifyingQuestions.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  Advisor has {clarifyingQuestions.length} clarifying question
                  {clarifyingQuestions.length > 1 ? "s" : ""} to hone these recommendations:
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 line-clamp-1">
                  &ldquo;{clarifyingQuestions[0]}&rdquo;
                </p>
              </div>
            </div>

            <button
              type="button"
              id="answer-clarifying-questions-btn"
              onClick={onOpenClarifyingQuestions}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Answer & Hone
            </button>
          </div>
        )}
      </div>

      {/* Filter and Refinement Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="career-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, job title, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Bookmarks toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              id="filter-saved-toggle"
              onClick={() => setShowOnlySaved(!showOnlySaved)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showOnlySaved
                  ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved Only ({savedCareerIds.length})</span>
            </button>

            {/* Study Mode Selector */}
            <select
              value={studyModeFilter}
              onChange={(e) => setStudyModeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">Study Mode: All</option>
              <option value="Online">Online</option>
              <option value="Offline">In-Person (Offline)</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CAREER_DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain;
            return (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Paths Grid */}
      {filteredCareers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">No career paths match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your domain or search query, or generate alternative angles with the Explore More tool.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedDomain("All Domains");
                setSearchQuery("");
                setShowOnlySaved(false);
                setStudyModeFilter("All");
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onOpenExploreMore}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
            >
              Generate New Angles
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              onSelectCareer={onSelectCareer}
              isSaved={savedCareerIds.includes(career.id)}
              onToggleSave={onToggleSaveCareer}
            />
          ))}
        </div>
      )}

      {/* Safety Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
