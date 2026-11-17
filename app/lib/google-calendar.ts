import { JWT } from "google-auth-library";

// calendar.events alone covers creating/deleting events, but freeBusy.query
// returns 403 "insufficient authentication scopes" without calendar.readonly
// too — confirmed against a real Google Calendar API error.
const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export function getCalendarEnv() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !privateKey || !calendarId) {
    return null;
  }
  return { clientEmail, privateKey, calendarId };
}

export async function getCalendarAccessToken(clientEmail: string, privateKey: string) {
  const jwtClient = new JWT({ email: clientEmail, key: privateKey, scopes: CALENDAR_SCOPES });
  const { token } = await jwtClient.getAccessToken();
  if (!token) {
    throw new Error("Failed to get a Google Calendar access token.");
  }
  return token;
}

export async function getBusyRanges(
  calendarId: string,
  token: string,
  timeMin: string,
  timeMax: string
): Promise<{ start: string; end: string }[]> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
  });

  if (!res.ok) {
    throw new Error(`Calendar freeBusy request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.calendars?.[calendarId]?.busy ?? [];
}

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}
