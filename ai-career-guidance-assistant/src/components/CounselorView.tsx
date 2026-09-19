import React, { useState } from "react";
import {
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  ArrowLeft,
  Share2,
  BookOpen,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { CareerPath, CounselorComment, StudentProfile } from "../types.js";
import { loadStepProgress } from "../utils/storage.js";

interface CounselorViewProps {
  studentProfile: StudentProfile | null;
  selectedCareer: CareerPath | null;
  allCareers: CareerPath[];
  counselorComments: CounselorComment[];
  onAddCounselorComment: (comment: CounselorComment) => void;
  onBackToStudentView: () => void;
}

export const CounselorView: React.FC<CounselorViewProps> = ({
  studentProfile,
  selectedCareer,
  allCareers,
  counselorComments,
  onAddCounselorComment,
  onBackToStudentView,
}) => {
  const [activeCareerId, setActiveCareerId] = useState<string>(
    selectedCareer?.id || allCareers[0]?.id || ""
  );
  const [counselorName, setCounselorName] = useState("Academic Advisor");
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedStepRef, setSelectedStepRef] = useState<number | undefined>(undefined);

  const stepProgress = loadStepProgress();

  const currentCareer =
    allCareers.find((c) => c.id === activeCareerId) || selectedCareer || allCareers[0];

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comment: CounselorComment = {
      id: "comment-" + Date.now(),
      counselorName: counselorName.trim() || "Counselor",
      comment: newCommentText.trim(),
      date: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      referencedStep: selectedStepRef,
    };

    onAddCounselorComment(comment);
    setNewCommentText("");
    setSelectedStepRef(undefined);
  };

  if (!studentProfile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Student Profile Loaded</h2>
        <p className="text-sm text-slate-500 mt-2">
          Create or load a student profile first to review their recommendations and roadmap.
        </p>
        <button
          type="button"
          onClick={onBackToStudentView}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl"
        >
          Return to Student Mode
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner indicating Counselor Mode */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              College Counselor & Academic Advisor Mode
            </h2>
            <p className="text-xs text-amber-900">
              Read-only review of student inputs and milestones with counselor feedback tools.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="counselor-exit-btn"
          onClick={onBackToStudentView}
          className="px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Exit Counselor View</span>
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{studentProfile.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                {studentProfile.currentYear}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Major: <span className="font-medium text-slate-800">{studentProfile.major}</span> • Location:{" "}
              <span className="font-medium text-slate-800">{studentProfile.location}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Interests & Passions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {studentProfile.interests.map((i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-800 px-2 py-1 rounded-md"
                >
                  {i}
                </span>
              ))}
            </div>
            {studentProfile.customInterests && (
              <p className="text-xs text-slate-600 italic mt-2">
                &ldquo;{studentProfile.customInterests}&rdquo;
              </p>
            )}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Enjoyed Subjects
            </span>
            <div className="flex flex-wrap gap-1.5">
              {studentProfile.enjoyedSubjects.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Existing Skills & Preferences
            </span>
            <div className="flex flex-wrap gap-1.5">
              {studentProfile.existingSkills.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>
            {studentProfile.constraints && (
              <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                <span className="font-semibold">Constraint:</span> {studentProfile.constraints}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Select Which Recommended Path to Inspect */}
      {allCareers.length > 0 && (
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Inspect Student&apos;s Recommended Career Pathways:
          </label>
          <div className="flex flex-wrap gap-2">
            {allCareers.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCareerId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  c.id === currentCareer?.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {c.title} ({c.domain})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Review and Student Progress */}
      {currentCareer && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                {currentCareer.domain}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{currentCareer.title}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">{currentCareer.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Actionable Milestones & Student Progress:
            </h3>

            <div className="space-y-3">
              {currentCareer.roadmap?.map((step) => {
                const key = `${currentCareer.id}_step_${step.step}`;
                const progress = stepProgress[key];
                const status = progress?.status || "not_started";
                const notes = progress?.notes;

                return (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border text-xs sm:text-sm ${
                      status === "done"
                        ? "border-emerald-200 bg-emerald-50/20"
                        : status === "in_progress"
                        ? "border-indigo-300 bg-indigo-50/20"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            status === "done"
                              ? "bg-emerald-600 text-white"
                              : status === "in_progress"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {step.step}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{step.action}</span>
                          <span className="text-xs text-slate-500">
                            {step.timeframe} • {step.type}
                          </span>
                          <p className="text-xs text-slate-600 mt-1">{step.notes}</p>

                          {notes && (
                            <div className="mt-2 p-2 bg-amber-50 rounded-lg text-xs text-slate-700 border border-amber-200/60">
                              <span className="font-semibold text-amber-900">Student Note:</span>{" "}
                              {notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
                          status === "done"
                            ? "bg-emerald-100 text-emerald-800"
                            : status === "in_progress"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Counselor Feedback & Notes Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Leave Feedback / Course Recommendations
          </h3>
        </div>

        <form onSubmit={handlePostComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Role
              </label>
              <input
                type="text"
                value={counselorName}
                onChange={(e) => setCounselorName(e.target.value)}
                placeholder="e.g. Dr. Miller (Freshman Advisor)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {currentCareer && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach to Specific Milestone (Optional)
                </label>
                <select
                  value={selectedStepRef || ""}
                  onChange={(e) =>
                    setSelectedStepRef(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                >
                  <option value="">General Guidance (Overall)</option>
                  {currentCareer.roadmap?.map((s) => (
                    <option key={s.step} value={s.step}>
                      Step {s.step}: {s.action}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Guidance Notes & Recommendations
            </label>
            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="e.g. Maya, make sure to visit our campus design lab in Room 204. Also consider taking COGS 101 next semester..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              id="counselor-submit-note-btn"
              disabled={!newCommentText.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Counselor Note</span>
            </button>
          </div>
        </form>

        {/* Existing Counselor Comments List */}
        {counselorComments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Counselor Comments ({counselorComments.length})
            </h4>
            <div className="space-y-2">
              {counselorComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-slate-900">{comment.counselorName}</span>
                    <span>{comment.date}</span>
                  </div>
                  <p className="leading-relaxed">{comment.comment}</p>
                  {comment.referencedStep && (
                    <span className="text-indigo-600 font-semibold block">
                      Refers to Step {comment.referencedStep}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
