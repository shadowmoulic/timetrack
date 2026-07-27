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
  
  // Prompt user for Google OAuth consent
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
