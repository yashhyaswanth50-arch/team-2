import React from "react";
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  GraduationCap,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { CareerPath } from "../types.js";

interface CareerCardProps {
  career: CareerPath;
  onSelectCareer: (career: CareerPath) => void;
  isSaved: boolean;
  onToggleSave: (careerId: string) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onSelectCareer,
  isSaved,
  onToggleSave,
}) => {
  // Domain color theme helper
  const getDomainBadge = (domain: string) => {
    switch (domain?.toLowerCase()) {
      case "tech":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "design":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "business":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "health":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "science":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "arts & media":
      case "arts":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getDomainBadge(
                career.domain
              )}`}
            >
              {career.domain}
            </span>
            {career.roadmap?.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-500" />
                <span>{career.roadmap.length} Milestones</span>
              </span>
            )}
          </div>

          <button
            type="button"
            id={`bookmark-btn-${career.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(career.id);
            }}
            title={isSaved ? "Remove from saved" : "Save this path"}
            className={`p-2 rounded-xl transition-colors ${
              isSaved
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {career.title}
        </h3>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
          {career.description}
        </p>

        {/* Why it matches this student */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Why it matches your profile</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {career.match_reasons?.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Day-to-Day Teaser */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Day-to-day work</span>
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2">
            {career.day_to_day?.[0] || "Collaborating with teams and solving real-world challenges."}
          </p>
        </div>

        {/* Common Job Titles */}
        {career.job_titles?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {career.job_titles.slice(0, 3).map((title, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer with CTA */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>{career.study_options?.length || 2} Higher Study Options</span>
        </div>

        <button
          type="button"
          id={`view-roadmap-btn-${career.id}`}
          onClick={() => onSelectCareer(career)}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group-hover:translate-x-0.5"
        >
          <span>View Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
