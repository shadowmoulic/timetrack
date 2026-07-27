/**
 * Realistic Mock Data Generator for Demo Mode
 */
export function generateMockEvents() {
  const now = new Date();
  const events = [];
  let idCounter = 100;

  // Generate events for past 14 days + today
  for (let i = 14; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dateStr = day.toISOString().split('T')[0];

    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

    if (!isWeekend) {
      // Morning Gym
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Morning Gym & Workout",
        description: "Leg day and 20 min cardio workout",
        start: { dateTime: `${dateStr}T07:00:00.000Z` },
        end: { dateTime: `${dateStr}T08:30:00.000Z` },
        source: "mock"
      });

      // Morning Coding Session
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Deep Work: React & Backend Dev",
        description: "Building authentication flow & GitHub PR reviews",
        start: { dateTime: `${dateStr}T09:30:00.000Z` },
        end: { dateTime: `${dateStr}T12:30:00.000Z` },
        source: "mock"
      });

      // Lunch & Break
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Lunch Break & Walk",
        description: "Rest and relaxation",
        start: { dateTime: `${dateStr}T12:30:00.000Z` },
        end: { dateTime: `${dateStr}T13:30:00.000Z` },
        source: "mock"
      });

      // Team Sync Meeting
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Sprint Sync Call with Client",
        description: "Discussion on project milestones and deliverables",
        start: { dateTime: `${dateStr}T14:00:00.000Z` },
        end: { dateTime: `${dateStr}T15:00:00.000Z` },
        source: "mock"
      });

      // Admin / Emails
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Email & Inbox Cleanup",
        description: "Clearing inbox and scheduling meetings",
        start: { dateTime: `${dateStr}T15:30:00.000Z` },
        end: { dateTime: `${dateStr}T16:30:00.000Z` },
        source: "mock"
      });

      // Evening Learning / Reading
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Study System Architecture Book",
        description: "Reading chapter 4 on microservices",
        start: { dateTime: `${dateStr}T17:30:00.000Z` },
        end: { dateTime: `${dateStr}T19:00:00.000Z` },
        source: "mock"
      });

      // Night Distraction / Relaxation
      if (i % 2 === 0) {
        events.push({
          id: `mock-${idCounter++}`,
          summary: "Netflix & Youtube Reels",
          description: "Watching documentaries and scrolling social media",
          start: { dateTime: `${dateStr}T20:30:00.000Z` },
          end: { dateTime: `${dateStr}T22:30:00.000Z` },
          source: "mock"
        });
      } else {
        events.push({
          id: `mock-${idCounter++}`,
          summary: "Gaming Session with Friends",
          description: "Overwatch & Steam games",
          start: { dateTime: `${dateStr}T21:00:00.000Z` },
          end: { dateTime: `${dateStr}T23:00:00.000Z` },
          source: "mock"
        });
      }
    } else {
      // Weekend Events
      events.push({
        id: `mock-${idCounter++}`,
        summary: "Weekend Outdoor Run & Yoga",
        description: "5k park run and mobility exercises",
        start: { dateTime: `${dateStr}T08:00:00.000Z` },
        end: { dateTime: `${dateStr}T10:00:00.000Z` },
        source: "mock"
      });

      events.push({
        id: `mock-${idCounter++}`,
        summary: "Build Side Project App",
        description: "Coding new feature for personal timetrack tool",
        start: { dateTime: `${dateStr}T11:00:00.000Z` },
        end: { dateTime: `${dateStr}T14:00:00.000Z` },
        source: "mock"
      });

      events.push({
        id: `mock-${idCounter++}`,
        summary: "Family Dinner & Movies",
        description: "Quality time with family",
        start: { dateTime: `${dateStr}T18:00:00.000Z` },
        end: { dateTime: `${dateStr}T21:30:00.000Z` },
        source: "mock"
      });
    }
  }

  return events;
}
