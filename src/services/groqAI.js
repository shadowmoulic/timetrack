export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export function getGroqApiKey() {
  return localStorage.getItem('timetrack_groq_key') || import.meta.env.VITE_GROQ_API_KEY || "";
}

export function setGroqApiKey(key) {
  if (key) localStorage.setItem('timetrack_groq_key', key.trim());
}

/**
 * Send prompt & analytics data to Groq AI API
 */
export async function analyzeProductivityWithGroq(prompt, analyticsData, customKey = null) {
  const apiKey = customKey || getGroqApiKey();

  if (!apiKey) {
    throw new Error("No Groq API Key provided. Please enter your Groq API Key in Settings or AI Copilot.");
  }

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const systemMessage = `You are an expert AI Productivity Copilot & Time Architect.
You have access to the user's personal time tracking and Google Calendar analytics data.
Analyze their data, answer their questions concisely, suggest optimal schedule adjustments, highlight time sinks, and suggest keyword rules.
Always give explicit, specific data points (e.g. state exact peak productive hours like 10:00 AM - 12:00 PM, 3:00 PM - 5:00 PM, exact category hours).
Keep responses concise, action-oriented, clear, and formatted in Markdown.`;

  // Sample hourly peak insights
  const peakHoursSummary = "Peak Productive Hours: Morning Block 09:30 AM - 12:30 PM (Deep Work Dev) & Evening Learning Block 05:30 PM - 07:00 PM.";

  const userContext = `
[User Analytics Context]
Total Tracked Hours: ${analyticsData.totalHours || 0} hrs
Productive Hours: ${analyticsData.productiveHours || 0} hrs
Unproductive Hours: ${analyticsData.unproductiveHours || 0} hrs
Productivity Score: ${analyticsData.productivityScore || 0}%
Categories Breakdown: ${JSON.stringify(analyticsData.categoryBreakdown || [])}
${peakHoursSummary}

User Question/Request: ${prompt}
`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_GROQ_MODEL,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userContext }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Groq API Error (${res.status})`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (err) {
    console.error("Groq AI Error:", err);
    throw err;
  }
}
