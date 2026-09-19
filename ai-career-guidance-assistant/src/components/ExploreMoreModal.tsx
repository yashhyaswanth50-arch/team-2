import React, { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";

interface ExploreMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: (emphasis: string) => Promise<void>;
  isLoading: boolean;
}

const EMPHASIS_PRESETS = [
  {
    title: "More Creative & Visual",
    description: "Focus on UI/UX, visual design, multimedia storytelling, and content.",
  },
  {
    title: "More Analytical & Numbers-driven",
    description: "Emphasize quantitative problem solving, data analytics, economics, and metrics.",
  },
  {
    title: "Non-Technical / Less Heavy Coding",
    description: "Highlight product management, operations, consulting, people coordination, and design.",
  },
  {
    title: "People-Facing & Community Impact",
    description: "Explore human services, education, health coordination, counseling, and public policy.",
  },
  {
    title: "Scientific Research & Discovery",
    description: "Focus on lab exploration, biotechnology, environmental science, and academic inquiry.",
  },
];

export const ExploreMoreModal: React.FC<ExploreMoreModalProps> = ({
  isOpen,
  onClose,
  onExplore,
  isLoading,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customEmphasis, setCustomEmphasis] = useState<string>("");

  if (!isOpen) return null;

  const handleApply = async () => {
    const emphasis = customEmphasis.trim() || selectedPreset;
    if (!emphasis) return;
    await onExplore(emphasis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Explore More Career Angles</h3>
              <p className="text-xs text-slate-500">
                Generate alternate paths emphasizing a specific dimension
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Choose an emphasis:
            </label>
            <div className="space-y-2">
              {EMPHASIS_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.title && !customEmphasis;
                return (
                  <div
                    key={preset.title}
                    onClick={() => {
                      setSelectedPreset(preset.title);
                      setCustomEmphasis("");
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-800"
                    }`}
                  >
                    <div className="text-sm font-semibold">{preset.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{preset.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Or specify a custom focus:
            </label>
            <input
              type="text"
              value={customEmphasis}
              onChange={(e) => setCustomEmphasis(e.target.value)}
              placeholder="e.g. 'Careers related to sports technology' or 'More outdoor field work'"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="apply-explore-more-btn"
            onClick={handleApply}
            disabled={isLoading || (!selectedPreset && !customEmphasis.trim())}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Generate Alternative Paths</span>
          </button>
        </div>
      </div>
    </div>
  );
};
