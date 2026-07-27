// Default configuration for TimeTrack
export const DEFAULT_CLIENT_ID = "335758397056-jquomn9ed970v0emsugrkp7a1jljg3f0.apps.googleusercontent.com";

export const CALENDAR_SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export const DEFAULT_CATEGORIES = [
  { id: "deep-work", name: "Deep Work / Dev", type: "productive", color: "#6366f1", bg: "rgba(99, 102, 241, 0.15)" },
  { id: "work", name: "Work & Meetings", type: "productive", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
  { id: "learning", name: "Learning & Reading", type: "productive", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  { id: "health", name: "Health & Fitness", type: "productive", color: "#ec4899", bg: "rgba(236, 72, 153, 0.15)" },
  { id: "admin", name: "Admin & Logistics", type: "neutral", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" },
  { id: "personal", name: "Personal & Rest", type: "neutral", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  { id: "distraction", name: "Unproductive / Distraction", type: "unproductive", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" }
];

export const DEFAULT_RULES = [
  { id: "rule-1", keyword: "code", categoryId: "deep-work" },
  { id: "rule-2", keyword: "coding", categoryId: "deep-work" },
  { id: "rule-3", keyword: "github", categoryId: "deep-work" },
  { id: "rule-4", keyword: "dev", categoryId: "deep-work" },
  { id: "rule-5", keyword: "build", categoryId: "deep-work" },
  { id: "rule-6", keyword: "meeting", categoryId: "work" },
  { id: "rule-7", keyword: "call", categoryId: "work" },
  { id: "rule-8", keyword: "sync", categoryId: "work" },
  { id: "rule-9", keyword: "presentation", categoryId: "work" },
  { id: "rule-10", keyword: "client", categoryId: "work" },
  { id: "rule-11", keyword: "study", categoryId: "learning" },
  { id: "rule-12", keyword: "course", categoryId: "learning" },
  { id: "rule-13", keyword: "book", categoryId: "learning" },
  { id: "rule-14", keyword: "read", categoryId: "learning" },
  { id: "rule-15", keyword: "gym", categoryId: "health" },
  { id: "rule-16", keyword: "workout", categoryId: "health" },
  { id: "rule-17", keyword: "run", categoryId: "health" },
  { id: "rule-18", keyword: "exercise", categoryId: "health" },
  { id: "rule-19", keyword: "yoga", categoryId: "health" },
  { id: "rule-20", keyword: "email", categoryId: "admin" },
  { id: "rule-21", keyword: "inbox", categoryId: "admin" },
  { id: "rule-22", keyword: "bills", categoryId: "admin" },
  { id: "rule-23", keyword: "netflix", categoryId: "distraction" },
  { id: "rule-24", keyword: "gaming", categoryId: "distraction" },
  { id: "rule-25", keyword: "youtube", categoryId: "distraction" },
  { id: "rule-26", keyword: "reels", categoryId: "distraction" },
  { id: "rule-27", keyword: "social", categoryId: "distraction" },
  { id: "rule-28", keyword: "dinner", categoryId: "personal" },
  { id: "rule-29", keyword: "lunch", categoryId: "personal" },
  { id: "rule-30", keyword: "break", categoryId: "personal" }
];
