import React, { useState } from "react";
import { HelpCircle, Sparkles, X, ArrowRight, Loader2 } from "lucide-react";

interface ClarifyingQuestionsModalProps {
  questions: string[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswers: (answers: Record<number, string>) => Promise<void>;
  isLoading: boolean;
}

export const ClarifyingQuestionsModal: React.FC<ClarifyingQuestionsModalProps> = ({
  questions,
  isOpen,
  onClose,
  onSubmitAnswers,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!isOpen || !questions || questions.length === 0) return null;

  const handleTextChange = (idx: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: text }));
  };

  const handleRefine = async () => {
    await onSubmitAnswers(answers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hone Your Guidance</h3>
              <p className="text-xs text-slate-500">
                Your advisor has 1–2 quick clarifying questions
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

        {/* Questions Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {questions.map((q, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800 leading-snug">
                {idx + 1}. {q}
              </label>
              <textarea
                rows={2}
                value={answers[idx] || ""}
                onChange={(e) => handleTextChange(idx, e.target.value)}
                placeholder="Type your preference or thoughts here..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleRefine}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Refine Guidance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
