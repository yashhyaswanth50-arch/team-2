import { CareerPath, CounselorComment, StudentProfile } from "../types.js";

const PROFILE_KEY = "ai_career_guidance_profile_v1";
const CAREERS_KEY = "ai_career_guidance_careers_v1";
const SAVED_CAREER_IDS_KEY = "ai_career_guidance_saved_ids_v1";
const STEP_PROGRESS_KEY = "ai_career_guidance_step_progress_v1";
const COUNSELOR_COMMENTS_KEY = "ai_career_guidance_comments_v1";

export interface StepProgressRecord {
  status: "not_started" | "in_progress" | "done";
  notes?: string;
  updatedAt: string;
}

export function loadStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load stored profile:", e);
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

export function clearStoredProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(CAREERS_KEY);
  localStorage.removeItem(STEP_PROGRESS_KEY);
}

export function loadStoredCareers(): CareerPath[] {
  try {
    const raw = localStorage.getItem(CAREERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load stored careers:", e);
    return [];
  }
}

export function saveStoredCareers(careers: CareerPath[]): void {
  try {
    localStorage.setItem(CAREERS_KEY, JSON.stringify(careers));
  } catch (e) {
    console.error("Failed to save careers:", e);
  }
}

export function loadSavedCareerIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_CAREER_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function toggleSavedCareerId(careerId: string): string[] {
  const current = loadSavedCareerIds();
  const exists = current.includes(careerId);
  const updated = exists ? current.filter((id) => id !== careerId) : [...current, careerId];
  localStorage.setItem(SAVED_CAREER_IDS_KEY, JSON.stringify(updated));
  return updated;
}

export function loadStepProgress(): Record<string, StepProgressRecord> {
  try {
    const raw = localStorage.getItem(STEP_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function updateStepProgress(
  careerId: string,
  stepNumber: number,
  status: "not_started" | "in_progress" | "done",
  notes?: string
): Record<string, StepProgressRecord> {
  const all = loadStepProgress();
  const key = `${careerId}_step_${stepNumber}`;
  all[key] = {
    status,
    notes: notes !== undefined ? notes : all[key]?.notes,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STEP_PROGRESS_KEY, JSON.stringify(all));
  return all;
}

export function loadLocalCounselorComments(careerId?: string): CounselorComment[] {
  try {
    const raw = localStorage.getItem(COUNSELOR_COMMENTS_KEY);
    if (!raw) return [];
    const list: (CounselorComment & { careerId?: string })[] = JSON.parse(raw);
    if (careerId) {
      return list.filter((c) => !c.careerId || c.careerId === careerId);
    }
    return list;
  } catch (e) {
    return [];
  }
}

export function addLocalCounselorComment(careerId: string, comment: CounselorComment): CounselorComment[] {
  const current = loadLocalCounselorComments();
  const updated = [...current, { ...comment, careerId }];
  localStorage.setItem(COUNSELOR_COMMENTS_KEY, JSON.stringify(updated));
  return updated;
}
