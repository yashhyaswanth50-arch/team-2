import React from "react";
import { Info } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-100/80 border border-slate-200/90 rounded-xl p-3.5 sm:p-4 text-slate-700 text-xs sm:text-sm flex items-start gap-3">
      <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold text-slate-900">Advisory Guidance Disclaimer: </span>
        This tool provides educational exploration and curated milestones, not guaranteed admissions or employment outcomes. Salary qualifiers reflect general market ranges. Always consult your college academic advisor, career center counselors, and conduct personal research before committing to academic tracks.
      </div>
    </div>
  );
};
