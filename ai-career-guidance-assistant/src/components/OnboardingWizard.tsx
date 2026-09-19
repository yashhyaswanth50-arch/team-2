import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Sparkles,
  HelpCircle,
  BookOpen,
  Wrench,
  Sliders,
  User,
} from "lucide-react";
import { StudentProfile } from "../types.js";
import {
  PRESET_INTERESTS,
  PRESET_SUBJECTS,
  SKILL_SUGGESTIONS,
  CAREER_DOMAINS,
} from "../data/constants.js";

interface OnboardingWizardProps {
  initialProfile?: StudentProfile | null;
  onSubmitProfile: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

const TOTAL_STEPS = 5;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onSubmitProfile,
  onCancel,
}) => {
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState(initialProfile?.name || "");
  const [currentYear, setCurrentYear] = useState(initialProfile?.currentYear || "1st Year (Freshman)");
  const [major, setMajor] = useState(initialProfile?.major || "");
  const [location, setLocation] = useState(initialProfile?.location || "");

  const [interests, setInterests] = useState<string[]>(initialProfile?.interests || []);
  const [customInterests, setCustomInterests] = useState(initialProfile?.customInterests || "");

  const [enjoyedSubjects, setEnjoyedSubjects] = useState<string[]>(initialProfile?.enjoyedSubjects || []);
  const [otherSubjects, setOtherSubjects] = useState(initialProfile?.otherSubjects || "");

  const [existingSkills, setExistingSkills] = useState<string[]>(initialProfile?.existingSkills || []);
  const [skillInput, setSkillInput] = useState("");

  const [constraints, setConstraints] = useState(initialProfile?.constraints || "");
  const [preferredDomain, setPreferredDomain] = useState(initialProfile?.preferredDomain || "All Domains");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chip toggle handlers
  const toggleInterest = (item: string) => {
    setErrorMessage(null);
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSubject = (subj: string) => {
    setErrorMessage(null);
    setEnjoyedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const toggleSkillSuggestion = (skill: string) => {
    setErrorMessage(null);
    setExistingSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (skillInput.trim()) {
      const trimmed = skillInput.trim();
      if (!existingSkills.includes(trimmed)) {
        setExistingSkills((prev) => [...prev, trimmed]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setExistingSkills((prev) => prev.filter((s) => s !== skill));
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!name.trim()) {
        setErrorMessage("Please share your name so the advisor can address you.");
        return false;
      }
    } else if (step === 2) {
      if (interests.length === 0 && !customInterests.trim()) {
        setErrorMessage("Please pick at least one interest or write what you enjoy doing.");
        return false;
      }
    } else if (step === 3) {
      if (enjoyedSubjects.length === 0 && !otherSubjects.trim()) {
        setErrorMessage("Please pick at least one subject you enjoy or enter your favorite.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (step < TOTAL_STEPS) {
        setStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = () => {
    const profile: StudentProfile = {
      name: name.trim(),
      currentYear,
      major: major.trim() || "Undecided / Exploring",
      location: location.trim() || "Unspecified",
      interests,
      customInterests: customInterests.trim(),
      enjoyedSubjects,
      otherSubjects: otherSubjects.trim(),
      existingSkills,
      constraints: constraints.trim(),
      preferredDomain: preferredDomain === "All Domains" ? "" : preferredDomain,
    };
    onSubmitProfile(profile);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Wizard Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>
            {step === 1 && "About You"}
            {step === 2 && "Interests & Curiosity"}
            {step === 3 && "Subjects You Enjoy"}
            {step === 4 && "Skills & Tools"}
            {step === 5 && "Preferences & Goals"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Personal Profile */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Let&apos;s get to know you</h2>
              <p className="text-sm text-slate-500 mt-1">
                Tell us about your current academic standing. It&apos;s completely fine if you haven&apos;t declared a major yet!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  What is your name? <span className="text-rose-500">*</span>
                </label>
                <input
                  id="wizard-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Johnson"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Current Year in College
                  </label>
                  <select
                    id="wizard-year-select"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 bg-white"
                  >
                    <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                    <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                    <option value="Incoming Freshman">Incoming Freshman</option>
                    <option value="Community College / Transfer">Community College / Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Current or Intended Major
                  </label>
                  <input
                    id="wizard-major-input"
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g., Undecided, Biology, or CS"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">Leave blank or &apos;Undecided&apos; if open</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Location (City / Country)
                </label>
                <input
                  id="wizard-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Chicago, USA or London, UK"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
                <span className="text-xs text-slate-400 mt-1 block">
                  Helps the advisor provide regional study & internship context.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">What naturally excites you?</h2>
              <p className="text-sm text-slate-500 mt-1">
                Select the activities or challenges that energize you, even if they aren&apos;t formal classes.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Choose what applies to you (multi-select):
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Anything else you enjoy doing? (In your own words)
              </label>
              <textarea
                id="wizard-custom-interests-input"
                rows={2}
                value={customInterests}
                onChange={(e) => setCustomInterests(e.target.value)}
                placeholder="e.g., I enjoy editing short videos for clubs, organizing community fundraisers, or tweaking game mods..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Subjects Enjoyed */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Subjects You Enjoy</h2>
              <p className="text-sm text-slate-500 mt-1">
                Which classes in high school or college have felt engaging or sparked your curiosity?
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select your favorite subjects:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_SUBJECTS.map((subj) => {
                  const isSelected = enjoyedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-100"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Other subjects or niche topics:
              </label>
              <input
                id="wizard-other-subjects-input"
                type="text"
                value={otherSubjects}
                onChange={(e) => setOtherSubjects(e.target.value)}
                placeholder="e.g., Neuroscience, Microeconomics, Journalism, Astronomy..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Existing Skills */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Existing Skills & Tools</h2>
              <p className="text-sm text-slate-500 mt-1">
                Even basic familiarity counts! Don&apos;t worry if you&apos;re just a beginner in any of these.
              </p>
            </div>

            {/* Selected Skills Tags */}
            {existingSkills.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Your Selected Skills ({existingSkills.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {existingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Skill Input */}
            <div className="flex items-center gap-2">
              <input
                id="wizard-add-skill-input"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSkill(e);
                  }
                }}
                placeholder="Type a skill and press Enter (e.g. Canva, Spanish, SQL)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Click to add popular suggestions:
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.map((skill) => {
                  const isSelected = existingSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkillSuggestion(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Preferences & Constraints */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Preferences & Boundaries</h2>
              <p className="text-sm text-slate-500 mt-1">
                Setting constraints helps the AI avoid paths you definitely don&apos;t want.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Domain (Optional):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CAREER_DOMAINS.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setPreferredDomain(domain)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                      preferredDomain === domain
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-slate-100"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Constraints or Dealbreakers (Optional):
              </label>
              <textarea
                id="wizard-constraints-input"
                rows={3}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g., Don't want heavy coding; prefer working with people; prefer hybrid or remote roles; interested in short certifications before committing to a 4-year degree..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                The counselor will strictly respect these preferences when generating your paths.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            id="wizard-back-btn"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? "Cancel" : "Back"}</span>
          </button>

          <button
            type="button"
            id="wizard-next-btn"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate My Career Pathways</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
