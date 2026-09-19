import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Share2,
  Printer,
  Sparkles,
  GraduationCap,
  Briefcase,
  Layers,
  Edit3,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Users,
  Trophy,
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { CareerPath, CounselorComment, RoadmapStep, StepStatus, StudentProfile } from "../types.js";
import { updateStepProgress, loadStepProgress } from "../utils/storage.js";

interface RoadmapViewProps {
  career: CareerPath;
  studentProfile: StudentProfile | null;
  onBack: () => void;
  counselorComments: CounselorComment[];
  onGenerateShareLink: (career: CareerPath) => Promise<string>;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  career,
  studentProfile,
  onBack,
  counselorComments,
  onGenerateShareLink,
}) => {
  const [activeTab, setActiveTab] = useState<"timeline" | "study" | "skills">("timeline");
  const [timeframeFilter, setTimeframeFilter] = useState<string>("All");

  // Local step progress & notes state
  const [stepProgress, setStepProgress] = useState(() => loadStepProgress());
  const [activeNoteStep, setActiveNoteStep] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");

  // Share link state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper for step status
  const getStepStatus = (stepNumber: number): StepStatus => {
    const key = `${career.id}_step_${stepNumber}`;
    return stepProgress[key]?.status || "not_started";
  };

  const getStepNotes = (stepNumber: number): string => {
    const key = `${career.id}_step_${stepNumber}`;
    return stepProgress[key]?.notes || "";
  };

  const handleStatusChange = (stepNumber: number, newStatus: StepStatus) => {
    const updated = updateStepProgress(career.id, stepNumber, newStatus);
    setStepProgress({ ...updated });
  };

  const handleSaveNotes = (stepNumber: number) => {
    const currentStatus = getStepStatus(stepNumber);
    const updated = updateStepProgress(career.id, stepNumber, currentStatus, noteDraft);
    setStepProgress({ ...updated });
    setActiveNoteStep(null);
    setNoteDraft("");
  };

  // Progress summary calculation
  const totalSteps = career.roadmap?.length || 0;
  const doneSteps = career.roadmap?.filter((s) => getStepStatus(s.step) === "done").length || 0;
  const inProgressSteps =
    career.roadmap?.filter((s) => getStepStatus(s.step) === "in_progress").length || 0;
  const percentComplete = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  // Filter roadmap by timeframe
  const filteredSteps = career.roadmap?.filter((step) => {
    if (timeframeFilter === "All") return true;
    if (timeframeFilter === "Short-term (< 3 mo)") {
      return step.timeframe.toLowerCase().includes("0") || step.timeframe.toLowerCase().includes("2") || step.timeframe.toLowerCase().includes("3 month");
    }
    if (timeframeFilter === "Medium-term (3–6 mo)") {
      return step.timeframe.toLowerCase().includes("3") || step.timeframe.toLowerCase().includes("4") || step.timeframe.toLowerCase().includes("6 month");
    }
    if (timeframeFilter === "Long-term (6+ mo / Year 2)") {
      return step.timeframe.toLowerCase().includes("8") || step.timeframe.toLowerCase().includes("9") || step.timeframe.toLowerCase().includes("12") || step.timeframe.toLowerCase().includes("year");
    }
    return true;
  });

  const getActionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "course":
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case "project":
        return <FolderGit2 className="w-4 h-4 text-emerald-600" />;
      case "internship":
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case "networking":
        return <Users className="w-4 h-4 text-sky-600" />;
      case "competition":
        return <Trophy className="w-4 h-4 text-purple-600" />;
      default:
        return <Award className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleShareClick = async () => {
    setIsSharing(true);
    try {
      const url = await onGenerateShareLink(career);
      setShareUrl(url);
    } catch (e) {
      console.error("Failed to share:", e);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(window.location.origin + shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Bar with Back, Print, Share */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          id="roadmap-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Recommended Paths</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="roadmap-print-btn"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download or Print Roadmap"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print / Save PDF</span>
            <span className="sm:hidden">Print</span>
          </button>

          <button
            type="button"
            id="roadmap-share-btn"
            onClick={handleShareClick}
            disabled={isSharing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share with Counselor</span>
          </button>
        </div>
      </div>

      {/* Share Link Drawer / Toast if generated */}
      {shareUrl && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block">
              Counselor & Peer Share Link Ready!
            </span>
            <span className="text-xs text-indigo-700">
              Anyone with this link can view your progress and leave guidance notes.
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              readOnly
              value={window.location.origin + shareUrl}
              className="bg-white border border-indigo-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 font-mono w-full sm:w-64 select-all"
            />
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Career Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {career.domain}
          </span>
          {career.work_environment && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {career.work_environment}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {career.title}
        </h1>

        <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-4xl">
          {career.description}
        </p>

        {career.salary_range_qualifier && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Compensation Context: </span>
            {career.salary_range_qualifier}
          </div>
        )}

        {/* Overall Progress Widget */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Roadmap Completion</span>
            <span>
              {doneSteps} of {totalSteps} Milestones Done ({percentComplete}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Counselor Comments Banner if any exists */}
      {counselorComments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-amber-900 text-sm">
              College Counselor Notes ({counselorComments.length})
            </h3>
          </div>
          <div className="space-y-2">
            {counselorComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white/90 p-3 rounded-xl border border-amber-200/70 text-xs text-slate-800"
              >
                <div className="flex items-center justify-between text-slate-500 mb-1 font-medium">
                  <span className="text-amber-900 font-semibold">{comment.counselorName}</span>
                  <span>{comment.date}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{comment.comment}</p>
                {comment.referencedStep && (
                  <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600">
                    Linked to Step {comment.referencedStep}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Navigation: Timeline Roadmap / Higher Study Options / Skill Gap Analysis */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-8">
        <button
          type="button"
          id="tab-timeline-btn"
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "timeline"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive Roadmap ({career.roadmap?.length || 0})</span>
        </button>

        <button
          type="button"
          id="tab-study-btn"
          onClick={() => setActiveTab("study")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "study"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Higher Study Options ({career.study_options?.length || 0})</span>
        </button>

        <button
          type="button"
          id="tab-skills-btn"
          onClick={() => setActiveTab("skills")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Skill Gap Analysis</span>
        </button>
      </div>

      {/* TAB 1: Step-by-step Timeline Roadmap */}
      {activeTab === "timeline" && (
        <div className="space-y-6">
          {/* Timeframe Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Filter by Horizon:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["All", "Short-term (< 3 mo)", "Medium-term (3–6 mo)", "Long-term (6+ mo / Year 2)"].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTimeframeFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      timeframeFilter === filter
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Timeline Step Cards */}
          <div className="space-y-4">
            {filteredSteps?.map((step) => {
              const status = getStepStatus(step.step);
              const userNotes = getStepNotes(step.step);
              const isEditingNotes = activeNoteStep === step.step;

              return (
                <div
                  key={step.step}
                  id={`roadmap-step-card-${step.step}`}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-xs ${
                    status === "done"
                      ? "border-emerald-200 bg-emerald-50/20"
                      : status === "in_progress"
                      ? "border-indigo-300 bg-indigo-50/20"
                      : "border-slate-200/90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Step number + Info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          status === "done"
                            ? "bg-emerald-600 text-white"
                            : status === "in_progress"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status === "done" ? <CheckCircle2 className="w-5 h-5" /> : step.step}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                            {getActionIcon(step.type)}
                            <span>{step.type}</span>
                          </span>
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{step.timeframe}</span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {step.action}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                          {step.notes}
                        </p>

                        {/* Resource Suggestions */}
                        {step.resourceSuggestions && step.resourceSuggestions.length > 0 && (
                          <div className="pt-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              Suggested Resources:
                            </span>
                            {step.resourceSuggestions.map((res, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Switcher */}
                    <div className="flex items-center gap-1.5 shrink-0 self-start bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(step.step, "not_started")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          status === "not_started"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(step.step, "in_progress")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          status === "in_progress"
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(step.step, "done")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          status === "done"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {/* Personal Notes Section for this step */}
                  <div className="mt-4 pt-3 border-t border-slate-100/80">
                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Write your personal reflections, course links, or questions for your advisor..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveNoteStep(null)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(step.step)}
                            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs text-slate-500">
                          {userNotes ? (
                            <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-slate-800">
                              <span className="font-semibold text-amber-900 block mb-0.5">
                                My Reflection / Plan:
                              </span>
                              <span>{userNotes}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No notes added yet</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNoteStep(step.step);
                            setNoteDraft(userNotes);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{userNotes ? "Edit Note" : "Add Note"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Higher Study Options */}
      {activeTab === "study" && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Counselor Tip: </span>
            Higher study paths range from targeted, low-cost certifications to comprehensive Bachelor&apos;s and Master&apos;s degrees. First-year college students can often pursue online certifications concurrently with their freshman courses.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {career.study_options?.map((option, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {option.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{option.duration}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mt-2">{option.name}</h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {option.notes}
                  </p>
                </div>

                {option.deliveryMode && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Format:</span>
                    <span className="font-semibold text-slate-800">{option.deliveryMode}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Skill Gap Analysis */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills You Already Have */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Skills You Already Have</h3>
                  <span className="text-xs text-slate-500">
                    Recognized from your profile & course interests
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-700">
                {career.skill_gaps?.have?.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills to Build */}
            <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Skills to Build</h3>
                  <span className="text-xs text-slate-500">
                    Targeted in your milestone roadmap
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-slate-700">
                {career.skill_gaps?.need_to_build?.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {career.skill_gaps?.transferable_insights && (
            <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-5 text-xs sm:text-sm text-indigo-950">
              <span className="font-bold block mb-1">Transferable Strengths Insight:</span>
              <p className="leading-relaxed">{career.skill_gaps.transferable_insights}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
