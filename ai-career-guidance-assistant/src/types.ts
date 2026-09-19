export type StudyType = "Bachelor's" | "Master's" | "Diploma" | "Certificate" | "Bootcamp";
export type ActionType = "Course" | "Project" | "Internship" | "Networking" | "Competition" | "Certification" | "Other";
export type StepStatus = "not_started" | "in_progress" | "done";

export interface StudentProfile {
  id?: string;
  name: string;
  currentYear: string; // e.g. "1st Year (Freshman)"
  major: string; // optional or "Undecided"
  location: string; // e.g. "Chicago, USA" or "Bangalore, India"
  interests: string[]; // multi-select chips
  customInterests?: string; // free-text
  enjoyedSubjects: string[]; // multi-select
  otherSubjects?: string;
  existingSkills: string[]; // free text + chips
  constraints?: string; // e.g. "Prefer non-coding", "Max 15 hrs/week", "Creative focus"
  preferredDomain?: string; // e.g. "Tech", "Design", "Health", "Business", "Arts", "Any"
}

export interface HigherStudyOption {
  name: string;
  type: StudyType;
  duration: string;
  notes: string;
  deliveryMode?: "Online" | "Offline" | "Hybrid";
}

export interface RoadmapStep {
  step: number;
  action: string;
  type: ActionType;
  timeframe: string; // e.g. "0–3 months", "3–6 months", "Year 2"
  notes: string;
  resourceSuggestions?: string[];
  status?: StepStatus;
  userNotes?: string;
}

export interface SkillGapAnalysis {
  have: string[];
  need_to_build: string[];
  transferable_insights?: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  domain: string; // e.g., "Tech", "Design", "Business", "Health", "Science", "Arts"
  match_reasons: string[];
  day_to_day: string[];
  job_titles: string[];
  study_options: HigherStudyOption[];
  skill_gaps: SkillGapAnalysis;
  roadmap: RoadmapStep[];
  salary_range_qualifier?: string; // Safe, qualified range e.g. "Entry-level roles typically range between..."
  work_environment?: string; // e.g. "Hybrid/Office, team-oriented"
  tags?: string[];
}

export interface CounselorComment {
  id: string;
  counselorName: string;
  comment: string;
  date: string;
  referencedStep?: number;
}

export interface SharedRoadmapData {
  id: string;
  createdAt: string;
  studentProfile: StudentProfile;
  selectedCareer: CareerPath;
  savedCareers: CareerPath[];
  counselorComments: CounselorComment[];
}

export interface CareerRecommendationResponse {
  careers: CareerPath[];
  clarifying_questions: string[];
  overall_advisor_note?: string;
}
