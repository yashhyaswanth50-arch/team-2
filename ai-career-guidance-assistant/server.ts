import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import type { CareerRecommendationResponse, SharedRoadmapData, CounselorComment } from "./src/types.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// In-memory store for shared roadmaps (accessible via unique share IDs for counselors & students)
const sharedRoadmapsStore = new Map<string, SharedRoadmapData>();

// Helper to get Gemini client lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback high-quality recommendations in case API key is unconfigured or rate limited
function generateIntelligentFallback(payload: any): CareerRecommendationResponse {
  const name = payload.name || "Student";
  const interests = (payload.interests || []).join(", ") || "creative problem-solving";
  const subjects = (payload.enjoyedSubjects || []).join(", ") || "general sciences & tech";
  const skills = (payload.existingSkills || []).join(", ") || "writing, basic research";

  return {
    overall_advisor_note: `Welcome ${name}! Starting college can feel overwhelming with all the choices ahead, but having curiosity in ${interests} and strengths in ${subjects} gives you an excellent springboard. Here are 3 carefully curated paths matching your strengths.`,
    clarifying_questions: [
      "Are you more energized by building tangible systems, interacting directly with people, or crafting visual experiences?",
      "Do you prefer coursework that culminates in academic degrees (BS/MS) or hands-on certifications and portfolio projects?",
    ],
    careers: [
      {
        id: "path-ux-product",
        title: "UX / Product Designer",
        description: "Creates intuitive, enjoyable digital applications and interfaces by understanding student and customer pain points, creating wireframes, and collaborating with developers.",
        domain: "Design",
        match_reasons: [
          `Directly leverages your interest in ${interests || "solving puzzles and design"}.`,
          "Balances creative empathy with analytical problem-solving.",
          `Builds naturally on your communication and ${skills || "analytical"} skills.`,
        ],
        day_to_day: [
          "Conducting usability interviews with real users and reviewing behavioral heatmaps.",
          "Iterating on interactive Figma wireframes and high-fidelity clickable prototypes.",
          "Collaborating with engineering and product managers in agile design critique sessions.",
        ],
        job_titles: ["Junior UX Designer", "Product Design Intern", "UI/UX Researcher", "Interaction Designer"],
        study_options: [
          {
            name: "B.S. in Human-Computer Interaction (HCI) or Cognitive Science",
            type: "Bachelor's",
            duration: "3–4 years",
            notes: "Comprehensive foundation in human factors, ergonomics, and interactive systems.",
            deliveryMode: "Offline",
          },
          {
            name: "Google UX Design Professional Certificate",
            type: "Certificate",
            duration: "3–6 months",
            notes: "Practical, project-based certification covering Figma, user testing, and portfolio creation.",
            deliveryMode: "Online",
          },
          {
            name: "M.S. in Interaction Design & Digital Media",
            type: "Master's",
            duration: "1–2 years",
            notes: "Advanced specialization for research-focused or leadership design careers.",
            deliveryMode: "Hybrid",
          },
        ],
        skill_gaps: {
          have: ["Empathy for user problems", "Creative ideation", "Communication and presentation basics"],
          need_to_build: ["Figma & interactive component prototyping", "Information Architecture", "Design Systems & User Testing"],
          transferable_insights: "Your current curiosity in human behavior translates directly into user empathy.",
        },
        roadmap: [
          {
            step: 1,
            action: "Design Fundamentals & Figma Basics",
            type: "Course",
            timeframe: "0–2 months",
            notes: "Learn typographic hierarchy, auto-layout, components, and color contrast principles.",
            resourceSuggestions: ["Figma Free Education Plan", "Refactoring UI book", "Coursera UX Basics"],
            status: "in_progress",
          },
          {
            step: 2,
            action: "Redesign an Everyday App (Case Study 1)",
            type: "Project",
            timeframe: "2–4 months",
            notes: "Pick a frustrating university portal or mobile app; interview 5 peers and prototype a cleaner flow.",
            resourceSuggestions: ["Medium UX Collective", "Mobbin.com for pattern inspiration"],
            status: "not_started",
          },
          {
            step: 3,
            action: "Learn Usability Testing & Analytics Basics",
            type: "Course",
            timeframe: "4–6 months",
            notes: "Practice running 15-minute think-aloud usability sessions and synthesizing feedback.",
            resourceSuggestions: ["Steve Krug's 'Don't Make Me Think'", "Maze.co testing tool"],
            status: "not_started",
          },
          {
            step: 4,
            action: "Join College Design Club or Hackathons",
            type: "Networking",
            timeframe: "6–9 months",
            notes: "Pair up with student software developers to design the UI for a weekend project.",
            resourceSuggestions: ["Devpost student hackathons", "University design chapter"],
            status: "not_started",
          },
          {
            step: 5,
            action: "Build Web Portfolio with 2 Case Studies",
            type: "Project",
            timeframe: "9–12 months",
            notes: "Host your work on Framer, Notion, or personal domain showing problem, process, and outcome.",
            resourceSuggestions: ["Cofolios (intern design portfolios)", "Framer free tier"],
            status: "not_started",
          },
          {
            step: 6,
            action: "Apply for Summer Product Design Internships",
            type: "Internship",
            timeframe: "Year 2 (12–15 months)",
            notes: "Seek junior internships at tech startups, non-profits, or university labs.",
            resourceSuggestions: ["LinkedIn Early Careers", "Handshake university portal"],
            status: "not_started",
          },
        ],
        salary_range_qualifier: "Junior roles typically range between $65,000–$85,000 in the US or regional equivalent, varying with company size and portfolio strength.",
        work_environment: "Collaborative, cross-functional, and frequently offers flexible hybrid remote options.",
      },
      {
        id: "path-data-analytics",
        title: "Data Analyst & Insights Specialist",
        description: "Transforms raw numbers and behavioral data into clear stories and actionable recommendations that guide organizational strategy.",
        domain: "Tech",
        match_reasons: [
          `Appeals to your interest in ${interests || "solving analytical puzzles"}.`,
          `Leverages analytical thinking from ${subjects || "math and sciences"}.`,
          "Provides immediate high market demand across healthcare, tech, finance, and sports.",
        ],
        day_to_day: [
          "Querying relational databases using SQL to extract metrics and cohort trends.",
          "Building executive dashboards and visual reports in Power BI, Tableau, or Python.",
          "Presenting data summaries to marketing, product, and leadership stakeholders.",
        ],
        job_titles: ["Junior Data Analyst", "Business Intelligence Associate", "Operations Analyst", "Reporting Specialist"],
        study_options: [
          {
            name: "B.S. in Information Systems, Statistics, or Computer Science",
            type: "Bachelor's",
            duration: "3–4 years",
            notes: "Deep grounding in statistical inference, database theory, and computing.",
            deliveryMode: "Offline",
          },
          {
            name: "IBM / Google Data Analytics Certificate",
            type: "Certificate",
            duration: "4–6 months",
            notes: "Hands-on curriculum covering SQL, spreadsheets, Tableau, and R/Python.",
            deliveryMode: "Online",
          },
          {
            name: "Master of Science in Business Analytics (MSBA)",
            type: "Master's",
            duration: "1–2 years",
            notes: "Prepares candidates for senior forecasting and data governance roles.",
            deliveryMode: "Hybrid",
          },
        ],
        skill_gaps: {
          have: ["Logical reasoning", "Basic spreadsheet awareness", "Inquisitive mindset"],
          need_to_build: ["SQL querying & Joins", "Data visualization tools (Tableau/PowerBI)", "Python data libraries (pandas, matplotlib)"],
          transferable_insights: "Your patience for puzzles makes database query debugging second nature.",
        },
        roadmap: [
          {
            step: 1,
            action: "Master Advanced Excel & Google Sheets",
            type: "Course",
            timeframe: "0–2 months",
            notes: "Learn XLOOKUP, Pivot Tables, SUMIFS, and dynamic charting.",
            resourceSuggestions: ["Coursera Excel for Business", "freeCodeCamp spreadsheet guides"],
            status: "not_started",
          },
          {
            step: 2,
            action: "Learn SQL from Scratch",
            type: "Course",
            timeframe: "2–4 months",
            notes: "Practice SELECT, WHERE, GROUP BY, aggregations, and multi-table JOINS on interactive sandboxes.",
            resourceSuggestions: ["SQLBolt", "LeetCode Database Easy Problems", "Mode SQL Tutorial"],
            status: "not_started",
          },
          {
            step: 3,
            action: "Analyze an Open Public Dataset",
            type: "Project",
            timeframe: "4–6 months",
            notes: "Download movie ratings, Spotify tracks, or sports data from Kaggle and answer 3 core business questions.",
            resourceSuggestions: ["Kaggle Datasets", "Data.gov public repository"],
            status: "not_started",
          },
          {
            step: 4,
            action: "Build a Public Tableau or Power BI Dashboard",
            type: "Project",
            timeframe: "6–8 months",
            notes: "Publish an interactive dashboard with filtering, clean KPI cards, and clear storytelling text.",
            resourceSuggestions: ["Tableau Public Free Profile", "MakeoverMonday data challenges"],
            status: "not_started",
          },
          {
            step: 5,
            action: "Python Basics for Data Exploration",
            type: "Course",
            timeframe: "8–11 months",
            notes: "Learn pandas DataFrame operations and exploratory data analysis (EDA).",
            resourceSuggestions: ["Kaggle Intro to Python", "Jupyter Notebooks"],
            status: "not_started",
          },
          {
            step: 6,
            action: "Target On-Campus Research or Part-time Data Roles",
            type: "Internship",
            timeframe: "Year 2",
            notes: "Offer to assist a campus department or local business with enrollment/sales reporting.",
            resourceSuggestions: ["University Career Fair", "Faculty research assistant board"],
            status: "not_started",
          },
        ],
        salary_range_qualifier: "Junior data roles typically offer $60,000–$80,000 entry salary depending on geographical market and technical depth.",
        work_environment: "Analytical, deadline-structured, with heavy collaboration across non-technical teams.",
      },
      {
        id: "path-digital-product-manager",
        title: "Product Coordinator & Tech Solutions Specialist",
        description: "Bridges the gap between users, engineers, and business leaders to define product features, organize timelines, and ensure student/customer satisfaction.",
        domain: "Business",
        match_reasons: [
          "Combines interpersonal coordination with strategic problem-solving.",
          `Aligns with your interest in helping people and ${interests || "organizing systems"}.`,
          "Requires low pure coding while granting high influence over technology direction.",
        ],
        day_to_day: [
          "Writing user stories and acceptance criteria for software engineering sprints.",
          "Prioritizing feature backlogs using customer feedback and team capacity.",
          "Running weekly standups and stakeholder demo sessions.",
        ],
        job_titles: ["Associate Product Manager (APM)", "Product Operations Specialist", "Scrum Master / Agile Coordinator", "Tech Project Assistant"],
        study_options: [
          {
            name: "B.A. / B.S. in Business Administration or Management Information Systems",
            type: "Bachelor's",
            duration: "3–4 years",
            notes: "Balanced exposure to organizational psychology, finance, and technical architectures.",
            deliveryMode: "Offline",
          },
          {
            name: "Certified Scrum Product Owner (CSPO) / CAPM",
            type: "Certificate",
            duration: "2–4 months",
            notes: "Recognized credential demonstrating mastery of Agile product delivery.",
            deliveryMode: "Online",
          },
        ],
        skill_gaps: {
          have: ["Interpersonal communication", "High-level curiosity", "Organizational clarity"],
          need_to_build: ["Agile/Scrum ceremonies", "Writing PRDs (Product Requirement Docs)", "Basic tech fluency (APIs, databases)"],
          transferable_insights: "Your extracurricular leadership and communication directly apply to cross-functional alignment.",
        },
        roadmap: [
          {
            step: 1,
            action: "Understand How Software Is Built (Tech for Non-Engineers)",
            type: "Course",
            timeframe: "0–2 months",
            notes: "Learn client-server architecture, APIs, frontend vs backend, and Git without heavy coding.",
            resourceSuggestions: ["CS50 for Business Professionals", "Exponent PM free guides"],
            status: "not_started",
          },
          {
            step: 2,
            action: "Master Agile & Scrum Fundamentals",
            type: "Course",
            timeframe: "2–4 months",
            notes: "Learn sprint planning, user story mapping, and Jira/Trello board management.",
            resourceSuggestions: ["Atlassian Agile Coach", "Coursera Product Management"],
            status: "not_started",
          },
          {
            step: 3,
            action: "Lead a Student Club Project or Campus Initiative",
            type: "Project",
            timeframe: "4–8 months",
            notes: "Manage a 3-person team building a campus app, event website, or student publication.",
            resourceSuggestions: ["Student Government", "Google Developer Student Clubs (GDSC)"],
            status: "not_started",
          },
          {
            step: 4,
            action: "Write a Product Teardown & Spec",
            type: "Project",
            timeframe: "8–11 months",
            notes: "Select an app you use daily (e.g. Duolingo or Spotify) and propose a detailed feature improvement.",
            resourceSuggestions: ["ProductHunt", "Lenny's Newsletter templates"],
            status: "not_started",
          },
          {
            step: 5,
            action: "Apply for APM (Associate Product Manager) Internships",
            type: "Internship",
            timeframe: "Year 2",
            notes: "Participate in early career APM rotational programs designed specifically for undergraduates.",
            resourceSuggestions: ["APM List (apmlist.com)", "Campus Career Center"],
            status: "not_started",
          },
        ],
        salary_range_qualifier: "Associate PM entry salaries typically vary from $70,000–$95,000 in technology centers.",
        work_environment: "Dynamic, meeting-intensive, and communicative.",
      },
    ],
  };
}

// 1. Generate Career Recommendations
app.post("/api/careers/recommend", async (req, res) => {
  try {
    const profile = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      console.log("No GEMINI_API_KEY available or using placeholder. Returning intelligent fallback.");
      return res.json(generateIntelligentFallback(profile));
    }

    const systemInstruction = `You are an experienced, encouraging career counselor and education advisor for first-year college students.
Your job is to map a student's interests, enjoyed subjects, existing skills, and constraints to 3 to 5 realistic, inspiring career paths, higher-study options, and actionable step-by-step roadmaps.
Rules:
- Be encouraging, specific, and practical.
- Avoid overpromising; do not make definitive salary or job guarantees; use qualifiers like "typically", "varies by region".
- Tailor suggestions directly to the student's constraints (e.g., if they say 'don't want heavy coding', suggest design, product, operations, or biotech instead of software engineering).
- If the student inputs are very sparse or vague (e.g. only 1 word), include 1-3 gentle clarifying questions.
- For each path, include 2-4 higher study options (degrees, diplomas, certifications) and a detailed 6-10 step roadmap with realistic timeframes (0-3 months, 3-6 months, 6-12 months, Year 2).
- Return strictly valid JSON adhering to the provided schema.`;

    const userPrompt = `Student Profile for Career Counseling:
- Name: ${profile.name || "Student"}
- Academic Status: ${profile.currentYear || "1st Year College"}
- Declared/Intended Major: ${profile.major || "Undecided"}
- Location/Country: ${profile.location || "Global/Unspecified"}
- Core Interests: ${(profile.interests || []).join(", ")} ${profile.customInterests ? `(Details: ${profile.customInterests})` : ""}
- Enjoyed Subjects: ${(profile.enjoyedSubjects || []).join(", ")} ${profile.otherSubjects ? `(Others: ${profile.otherSubjects})` : ""}
- Existing Skills: ${(profile.existingSkills || []).join(", ")}
- Constraints & Preferences: ${profile.constraints || "None provided"}
- Preferred Domain: ${profile.preferredDomain || "Any domain that fits"}

Generate 3 to 5 diverse, highly tailored career recommendations with complete study options and actionable student roadmaps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall_advisor_note: {
              type: Type.STRING,
              description: "Warm, encouraging 2-3 sentence introductory message to the first-year student addressing them by name and celebrating their unique mix of interests.",
            },
            clarifying_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "1-3 gentle questions to help narrow down choices if inputs are vague or multifaceted.",
            },
            careers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  domain: { type: Type.STRING, description: "e.g. Tech, Design, Business, Health, Science, Arts, Social Sciences" },
                  match_reasons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 clear bullet points explaining why this matches their specific inputs.",
                  },
                  day_to_day: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-3 bullets illustrating real day-to-day work tasks.",
                  },
                  job_titles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3-5 common entry/mid job titles.",
                  },
                  salary_range_qualifier: {
                    type: Type.STRING,
                    description: "Qualified, non-promissory realistic compensation range indicator.",
                  },
                  work_environment: {
                    type: Type.STRING,
                    description: "e.g. Laboratory, remote-friendly studio, collaborative corporate office.",
                  },
                  study_options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, description: "Bachelor's | Master's | Diploma | Certificate" },
                        duration: { type: Type.STRING, description: "e.g. 3-4 years, 6 months" },
                        notes: { type: Type.STRING },
                        deliveryMode: { type: Type.STRING, description: "Online | Offline | Hybrid" },
                      },
                      required: ["name", "type", "duration", "notes"],
                    },
                  },
                  skill_gaps: {
                    type: Type.OBJECT,
                    properties: {
                      have: { type: Type.ARRAY, items: { type: Type.STRING } },
                      need_to_build: { type: Type.ARRAY, items: { type: Type.STRING } },
                      transferable_insights: { type: Type.STRING },
                    },
                    required: ["have", "need_to_build"],
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        step: { type: Type.INTEGER },
                        action: { type: Type.STRING },
                        type: { type: Type.STRING, description: "Course | Project | Internship | Networking | Competition | Certification | Other" },
                        timeframe: { type: Type.STRING, description: "e.g. 0–3 months, 3–6 months, Year 2" },
                        notes: { type: Type.STRING },
                        resourceSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["step", "action", "type", "timeframe", "notes"],
                    },
                  },
                },
                required: ["id", "title", "description", "domain", "match_reasons", "day_to_day", "job_titles", "study_options", "skill_gaps", "roadmap"],
              },
            },
          },
          required: ["careers"],
        },
      },
    });

    const parsed: CareerRecommendationResponse = JSON.parse(response.text || "{}");
    // Ensure every career has an id and defaults
    parsed.careers = (parsed.careers || []).map((c, idx) => ({
      ...c,
      id: c.id || `career-${idx + 1}-${Date.now()}`,
      roadmap: (c.roadmap || []).map((r, sIdx) => ({
        ...r,
        step: r.step || sIdx + 1,
        status: "not_started" as const,
      })),
    }));

    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini recommendation error:", error);
    // Return graceful fallback so user can still continue
    return res.json(generateIntelligentFallback(req.body));
  }
});

// 2. Explore More with Emphasis
app.post("/api/careers/explore-more", async (req, res) => {
  try {
    const { profile, emphasis } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallback = generateIntelligentFallback(profile);
      return res.json({ careers: fallback.careers });
    }

    const prompt = `Student Profile:
- Interests: ${(profile.interests || []).join(", ")}
- Subjects: ${(profile.enjoyedSubjects || []).join(", ")}
- Skills: ${(profile.existingSkills || []).join(", ")}
- Current Special Emphasis/Direction requested by student: "${emphasis || "explore different perspective"}"

Suggest 2 to 3 ALTERNATIVE career paths that strongly embody this new emphasis: "${emphasis}". Provide full details, study options, and step-by-step roadmaps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a career counselor providing alternative pathways tailored to student's new emphasis. Return structured JSON with 'careers' array matching the standard schema.",
      },
    });

    const data = JSON.parse(response.text || "{}");
    const careers = (data.careers || []).map((c: any, i: number) => ({
      ...c,
      id: c.id || `alt-${i}-${Date.now()}`,
      roadmap: (c.roadmap || []).map((r: any, sIdx: number) => ({
        ...r,
        step: r.step || sIdx + 1,
        status: "not_started",
      })),
    }));

    res.json({ careers });
  } catch (err: any) {
    console.error("Explore more error:", err);
    res.status(500).json({ error: "Failed to generate alternatives" });
  }
});

// 3. Share Roadmap & Counselor View Store
app.post("/api/share", (req, res) => {
  const { studentProfile, selectedCareer, savedCareers, counselorComments = [] } = req.body;
  const shareId = "share-" + Math.random().toString(36).substring(2, 9);

  const sharedData: SharedRoadmapData = {
    id: shareId,
    createdAt: new Date().toISOString(),
    studentProfile,
    selectedCareer,
    savedCareers: savedCareers || [],
    counselorComments: counselorComments || [],
  };

  sharedRoadmapsStore.set(shareId, sharedData);
  res.json({ shareId, shareUrl: `/counselor/${shareId}` });
});

app.get("/api/share/:id", (req, res) => {
  const { id } = req.params;
  const data = sharedRoadmapsStore.get(id);
  if (!data) {
    return res.status(404).json({ error: "Shared roadmap not found or expired" });
  }
  res.json(data);
});

app.post("/api/counselor/comment", (req, res) => {
  const { shareId, counselorName, comment, referencedStep } = req.body;
  const data = sharedRoadmapsStore.get(shareId);
  if (!data) {
    return res.status(404).json({ error: "Shared roadmap not found" });
  }

  const newComment: CounselorComment = {
    id: "comment-" + Date.now(),
    counselorName: counselorName || "College Counselor",
    comment: comment.trim(),
    date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    referencedStep,
  };

  data.counselorComments.push(newComment);
  sharedRoadmapsStore.set(shareId, data);
  res.json({ success: true, comment: newComment });
});

// Vite middleware / SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Career Guidance Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
