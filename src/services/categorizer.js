import { DEFAULT_CATEGORIES } from '../config';

/**
 * Categorize a calendar event based on keyword rules
 */
export function categorizeEvent(event, rules, categories = DEFAULT_CATEGORIES, overrides = {}) {
  // Check if manual override exists for this event ID
  if (overrides[event.id]) {
    const cat = categories.find(c => c.id === overrides[event.id]);
    if (cat) return { category: cat, matchedKeyword: 'Manual Override' };
  }

  const textToMatch = `${event.summary || ''} ${event.description || ''}`.toLowerCase();

  // Match against rules in order
  for (const rule of rules) {
    if (!rule.keyword) continue;
    const kw = rule.keyword.trim().toLowerCase();
    
    // Regex or simple substring check
    const regex = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
    if (regex.test(textToMatch) || textToMatch.includes(kw)) {
      const cat = categories.find(c => c.id === rule.categoryId);
      if (cat) {
        return { category: cat, matchedKeyword: rule.keyword };
      }
    }
  }

  // Fallback category
  const fallback = categories.find(c => c.id === 'personal') || categories[0];
  return { category: fallback, matchedKeyword: null };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate duration in hours between start and end date
 */
export function getEventDurationHours(event) {
  if (event.durationHours !== undefined) return event.durationHours;
  
  const start = new Date(event.start?.dateTime || event.start?.date || event.start);
  const end = new Date(event.end?.dateTime || event.end?.date || event.end);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1.0; // fallback

  const diffMs = Math.max(0, end - start);
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
}

/**
 * Aggregate summary metrics across all processed events
 */
export function calculateAnalytics(events, rules, categories = DEFAULT_CATEGORIES, overrides = {}) {
  let totalHours = 0;
  let productiveHours = 0;
  let neutralHours = 0;
  let unproductiveHours = 0;

  const categoryBreakdown = {};
  categories.forEach(cat => {
    categoryBreakdown[cat.id] = {
      ...cat,
      hours: 0,
      count: 0
    };
  });

  const dailyTrendMap = {};

  const processedEvents = events.map(evt => {
    const duration = getEventDurationHours(evt);
    const { category, matchedKeyword } = categorizeEvent(evt, rules, categories, overrides);

    totalHours += duration;

    if (category.type === 'productive') {
      productiveHours += duration;
    } else if (category.type === 'unproductive') {
      unproductiveHours += duration;
    } else {
      neutralHours += duration;
    }

    if (categoryBreakdown[category.id]) {
      categoryBreakdown[category.id].hours += duration;
      categoryBreakdown[category.id].count += 1;
    } else {
      categoryBreakdown[category.id] = {
        ...category,
        hours: duration,
        count: 1
      };
    }

    // Daily grouping
    const dateKey = new Date(evt.start?.dateTime || evt.start?.date || evt.start).toISOString().split('T')[0];
    if (!dailyTrendMap[dateKey]) {
      dailyTrendMap[dateKey] = { date: dateKey, productive: 0, neutral: 0, unproductive: 0, total: 0 };
    }
    dailyTrendMap[dateKey].total += duration;
    if (category.type === 'productive') dailyTrendMap[dateKey].productive += duration;
    else if (category.type === 'unproductive') dailyTrendMap[dateKey].unproductive += duration;
    else dailyTrendMap[dateKey].neutral += duration;

    return {
      ...evt,
      durationHours: duration,
      category,
      matchedKeyword
    };
  });

  // Calculate Productivity Score (0 - 100%)
  // Score = (Productive Hours / (Productive Hours + Unproductive Hours)) * 100
  // Or weighted formula: (Productive + 0.5 * Neutral) / Total * 100
  const evaluatedHours = productiveHours + unproductiveHours;
  const productivityScore = evaluatedHours > 0 
    ? Math.round((productiveHours / evaluatedHours) * 100) 
    : (totalHours > 0 ? 50 : 0);

  const dailyTrends = Object.values(dailyTrendMap).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    productiveHours: Math.round(productiveHours * 10) / 10,
    neutralHours: Math.round(neutralHours * 10) / 10,
    unproductiveHours: Math.round(unproductiveHours * 10) / 10,
    productivityScore,
    categoryBreakdown: Object.values(categoryBreakdown).filter(c => c.hours > 0),
    dailyTrends,
    processedEvents
  };
}
