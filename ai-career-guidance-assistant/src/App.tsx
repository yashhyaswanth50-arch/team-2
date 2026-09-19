import React, { useState, useEffect } from "react";
import { Header } from "./components/Header.js";
import { HeroLanding } from "./components/HeroLanding.js";
import { OnboardingWizard } from "./components/OnboardingWizard.js";
import { CareerResultsView } from "./components/CareerResultsView.js";
import { RoadmapView } from "./components/RoadmapView.js";
import { CounselorView } from "./components/CounselorView.js";
import { ExploreMoreModal } from "./components/ExploreMoreModal.js";
import { ClarifyingQuestionsModal } from "./components/ClarifyingQuestionsModal.js";
import { CareerPath, CounselorComment, StudentProfile, CareerRecommendationResponse } from "./types.js";
import {
  loadStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  loadStoredCareers,
  saveStoredCareers,
  loadSavedCareerIds,
  toggleSavedCareerId,
  loadLocalCounselorComments,
  addLocalCounselorComment,
} from "./utils/storage.js";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

type ActiveView = "landing" | "wizard" | "results" | "roadmap" | "counselor";

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>("landing");
  const [profile, setProfile] = useState<StudentProfile | null>(() => loadStoredProfile());
  const [careers, setCareers] = useState<CareerPath[]>(() => loadStoredCareers());
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [savedCareerIds, setSavedCareerIds] = useState<string[]>(() => loadSavedCareerIds());
  const [counselorComments, setCounselorComments] = useState<CounselorComment[]>(() =>
    loadLocalCounselorComments()
  );

  const [advisorNote, setAdvisorNote] = useState<string>("");
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Analyzing your interests and skills...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isClarifyingModalOpen, setIsClarifyingModalOpen] = useState(false);
  const [isCounselorMode, setIsCounselorMode] = useState(false);

  // Check URL parameters for shared counselor link on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("sharedId");
    if (sharedId) {
      loadSharedRoadmap(sharedId);
    } else if (profile && careers.length > 0) {
      setCurrentView("results");
    }
  }, []);

  const loadSharedRoadmap = async (sharedId: string) => {
    setIsLoading(true);
    setLoadingMessage("Loading shared student roadmap...");
    try {
      const res = await fetch(`/api/share/${sharedId}`);
      if (!res.ok) throw new Error("Roadmap link expired or not found");
      const data = await res.json();
      setProfile(data.studentProfile);
      setSelectedCareer(data.selectedCareer);
      setCareers(data.savedCareers?.length > 0 ? data.savedCareers : [data.selectedCareer]);
      setCounselorComments(data.counselorComments || []);
      setIsCounselorMode(true);
      setCurrentView("counselor");
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Failed to load shared roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit profile to AI Career discovery engine
  const handleGenerateRecommendations = async (userProfile: StudentProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingMessage("Mapping your curiosity to tailored careers and higher-study options...");

    try {
      // Save profile immediately to local storage
      setProfile(userProfile);
      saveStoredProfile(userProfile);

      const response = await fetch("/api/careers/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations. Please try again.");
      }

      const data: CareerRecommendationResponse = await response.json();

      if (!data.careers || data.careers.length === 0) {
        throw new Error("No career pathways could be generated. Please try broadening your inputs.");
      }

      setCareers(data.careers);
      saveStoredCareers(data.careers);
      setAdvisorNote(data.overall_advisor_note || "");
      setClarifyingQuestions(data.clarifying_questions || []);

      setCurrentView("results");
    } catch (err: any) {
      console.error("Discovery error:", err);
      setErrorMessage(err.message || "An error occurred while connecting to the career counselor service.");
    } finally {
      setIsLoading(false);
    }
  };

  // Explore more with custom emphasis
  const handleExploreMore = async (emphasis: string) => {
    if (!profile) return;
    setIsLoading(true);
    setLoadingMessage(`Generating pathways emphasizing "${emphasis}"...`);

    try {
      const response = await fetch("/api/careers/explore-more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, emphasis }),
      });

      if (!response.ok) throw new Error("Failed to explore alternative paths");
      const data = await response.json();

      if (data.careers && data.careers.length > 0) {
        const merged = [...data.careers, ...careers];
        setCareers(merged);
        saveStoredCareers(merged);
      }
    } catch (e: any) {
      console.error(e);
      alert("Could not generate alternate pathways at this time. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clarifying questions refinement
  const handleAnswerClarifyingQuestions = async (answers: Record<number, string>) => {
    if (!profile) return;
    const answerStrings = Object.entries(answers)
      .map(([idx, ans]) => `Q${Number(idx) + 1}: ${ans}`)
      .join("; ");

    const updatedProfile: StudentProfile = {
      ...profile,
      constraints: profile.constraints
        ? `${profile.constraints} (Clarifications: ${answerStrings})`
        : `Clarifications: ${answerStrings}`,
    };

    await handleGenerateRecommendations(updatedProfile);
  };

  // Generate shareable link
  const handleGenerateShareLink = async (career: CareerPath): Promise<string> => {
    if (!profile) return window.location.pathname;
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentProfile: profile,
          selectedCareer: career,
          savedCareers: careers,
          counselorComments,
        }),
      });
      const data = await res.json();
      return `?sharedId=${data.shareId}`;
    } catch (e) {
      console.error("Share error:", e);
      return window.location.pathname;
    }
  };

  // Add counselor comment
  const handleAddCounselorComment = async (comment: CounselorComment) => {
    if (!selectedCareer && careers.length > 0) {
      setSelectedCareer(careers[0]);
    }
    const careerId = selectedCareer?.id || careers[0]?.id || "general";
    const updated = addLocalCounselorComment(careerId, comment);
    setCounselorComments(updated);

    // Also inform server if shared
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("sharedId");
    if (sharedId) {
      try {
        await fetch("/api/counselor/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shareId: sharedId,
            counselorName: comment.counselorName,
            comment: comment.comment,
            referencedStep: comment.referencedStep,
          }),
        });
      } catch (err) {
        console.error("Server comment sync error:", err);
      }
    }
  };

  const handleToggleSaveCareer = (careerId: string) => {
    const updated = toggleSavedCareerId(careerId);
    setSavedCareerIds(updated);
  };

  const handleResetProfile = () => {
    if (window.confirm("Start fresh? This will clear your current profile and recommendations.")) {
      clearStoredProfile();
      setProfile(null);
      setCareers([]);
      setSelectedCareer(null);
      setSavedCareerIds([]);
      setCurrentView("landing");
    }
  };

  const handleToggleCounselorMode = () => {
    if (isCounselorMode) {
      setIsCounselorMode(false);
      setCurrentView(selectedCareer ? "roadmap" : profile ? "results" : "landing");
    } else {
      setIsCounselorMode(true);
      setCurrentView("counselor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === "counselor") {
            setIsCounselorMode(true);
          } else {
            setIsCounselorMode(false);
          }
          setCurrentView(view);
        }}
        profile={profile}
        savedCount={savedCareerIds.length}
        onResetProfile={handleResetProfile}
        isCounselorMode={isCounselorMode}
        onToggleCounselorMode={handleToggleCounselorMode}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7 animate-pulse text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">AI Counselor at Work</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {loadingMessage}
            </p>
            <div className="flex justify-center pt-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {errorMessage && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <span className="font-bold">Notice: </span>
                {errorMessage}
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-700 underline hover:text-rose-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View 1: Landing Page */}
        {currentView === "landing" && (
          <HeroLanding
            onStartWizard={() => setCurrentView("wizard")}
            onSelectSampleProfile={(sample) => {
              setProfile(sample);
              handleGenerateRecommendations(sample);
            }}
            hasExistingProfile={!!profile && careers.length > 0}
            onContinueExisting={() => setCurrentView("results")}
          />
        )}

        {/* View 2: Onboarding Wizard */}
        {currentView === "wizard" && (
          <OnboardingWizard
            initialProfile={profile}
            onSubmitProfile={handleGenerateRecommendations}
            onCancel={() => setCurrentView(profile ? "results" : "landing")}
          />
        )}

        {/* View 3: Career Results List */}
        {currentView === "results" && profile && (
          <CareerResultsView
            careers={careers}
            studentProfile={profile}
            advisorNote={advisorNote}
            clarifyingQuestions={clarifyingQuestions}
            savedCareerIds={savedCareerIds}
            onToggleSaveCareer={handleToggleSaveCareer}
            onSelectCareer={(career) => {
              setSelectedCareer(career);
              setCurrentView("roadmap");
            }}
            onOpenExploreMore={() => setIsExploreModalOpen(true)}
            onOpenClarifyingQuestions={() => setIsClarifyingModalOpen(true)}
            onEditProfile={() => setCurrentView("wizard")}
          />
        )}

        {/* View 4: Detailed Interactive Roadmap */}
        {currentView === "roadmap" && selectedCareer && (
          <RoadmapView
            career={selectedCareer}
            studentProfile={profile}
            onBack={() => setCurrentView("results")}
            counselorComments={counselorComments}
            onGenerateShareLink={handleGenerateShareLink}
          />
        )}

        {/* View 5: Counselor View */}
        {currentView === "counselor" && (
          <CounselorView
            studentProfile={profile}
            selectedCareer={selectedCareer}
            allCareers={careers}
            counselorComments={counselorComments}
            onAddCounselorComment={handleAddCounselorComment}
            onBackToStudentView={() => {
              setIsCounselorMode(false);
              setCurrentView(selectedCareer ? "roadmap" : profile ? "results" : "landing");
            }}
          />
        )}
      </main>

      {/* Modals */}
      <ExploreMoreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        onExplore={handleExploreMore}
        isLoading={isLoading}
      />

      <ClarifyingQuestionsModal
        isOpen={isClarifyingModalOpen}
        questions={clarifyingQuestions}
        onClose={() => setIsClarifyingModalOpen(false)}
        onSubmitAnswers={handleAnswerClarifyingQuestions}
        isLoading={isLoading}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            AI Career Guidance Assistant • Empowering college students to explore with clarity.
          </p>
          <div className="flex items-center gap-4">
            <span>Non-promissory Educational Guidance</span>
            <span>•</span>
            <button
              type="button"
              onClick={handleToggleCounselorMode}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isCounselorMode ? "Switch to Student View" : "Counselor Portal"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
