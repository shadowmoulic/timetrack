import { CALENDAR_SCOPES } from '../config';

let tokenClient = null;

/**
 * Initialize Google Token Client
 */
export function initGoogleAuth(clientId, onTokenReceived, onError) {
  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    console.warn("Google Identity Services SDK not yet loaded.");
    return false;
  }

  try {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: CALENDAR_SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          console.error("OAuth Error:", tokenResponse);
          if (onError) onError(tokenResponse.error_description || tokenResponse.error);
          return;
        }
        if (tokenResponse.access_token) {
          if (onTokenReceived) onTokenReceived(tokenResponse.access_token, tokenResponse.expires_in);
        }
      },
      error_callback: (err) => {
        console.error("Token Client Error:", err);
        if (onError) onError("Google Sign-In was cancelled or encountered an error.");
      }
    });
    return true;
  } catch (err) {
    console.error("Error initializing Google Auth:", err);
    if (onError) onError(err.message);
    return false;
  }
}

/**
 * Request Access Token from Google
 */
export function requestGoogleAccessToken(clientId, onTokenReceived, onError) {
  if (!tokenClient) {
    const initialized = initGoogleAuth(clientId, onTokenReceived, onError);
    if (!initialized) {
      if (onError) onError("Google Identity Services script is loading. Please try again in a moment.");
      return;
    }
  }
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 * Fetch calendar events from Google Calendar API
 */
export function fetchGoogleCalendarEvents(accessToken, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const timeMin = new Date(startDate).toISOString();
    const timeMax = new Date(endDate).toISOString();

    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
    url.searchParams.append('timeMin', timeMin);
    url.searchParams.append('timeMax', timeMax);
    url.searchParams.append('singleEvents', 'true');
    url.searchParams.append('orderBy', 'startTime');
    url.searchParams.append('maxResults', '250');

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Google session expired. Please sign in again.");
        }
        return res.json().then(errData => {
          throw new Error(errData.error?.message || `Google API error (${res.status})`);
        });
      }
      return res.json();
    })
    .then(data => {
      const items = (data.items || []).map(item => ({
        id: item.id,
        summary: item.summary || '(No Title)',
        description: item.description || '',
        start: item.start,
        end: item.end,
        htmlLink: item.htmlLink,
        status: item.status,
        source: 'google'
      }));
      resolve(items);
    })
    .catch(err => {
      reject(err);
    });
  });
}

/**
 * Create a new event on Google Calendar (2-Way Sync)
 */
export async function createGoogleCalendarEvent(accessToken, eventData) {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  
  const body = {
    summary: eventData.summary,
    description: eventData.description || '',
    start: eventData.start,
    end: eventData.end
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create event on Google Calendar (${res.status})`);
  }

  return await res.json();
}

/**
 * Update an existing event on Google Calendar
 */
export async function updateGoogleCalendarEvent(accessToken, eventId, eventData) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;

  const body = {
    summary: eventData.summary,
    description: eventData.description || '',
    start: eventData.start,
    end: eventData.end
  };

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to update Google Calendar event (${res.status})`);
  }

  return await res.json();
}

/**
 * Delete an event from Google Calendar
 */
export async function deleteGoogleCalendarEvent(accessToken, eventId) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!res.ok && res.status !== 410) { // 410 means already deleted
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to delete Google Calendar event (${res.status})`);
  }

  return true;
}
