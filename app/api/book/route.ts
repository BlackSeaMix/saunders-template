import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarEnv,
  getCalendarAccessToken,
  getBusyRanges,
  rangesOverlap,
} from "@/app/lib/google-calendar";
import { BOOKING_DURATION_MINUTES } from "@/app/content";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, contact, service, date, time, notes } = body as Record<string, unknown>;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof contact !== "string" || !contact.trim() ||
    typeof service !== "string" || !service.trim() ||
    typeof date !== "string" || !date.trim() ||
    typeof time !== "string" || !time.trim()
  ) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  // Spam protection — no-op unless RECAPTCHA_SECRET_KEY is configured, so a
  // fresh template still works without it set up yet.
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";
    if (!captchaToken) {
      return NextResponse.json({ error: "Please complete the captcha." }, { status: 400 });
    }
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: recaptchaSecret, response: captchaToken }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }
  }

  const env = getCalendarEnv();
  if (!env) {
    console.error("Booking received but Google Calendar isn't configured:", {
      name,
      contact,
      service,
      date,
      time,
      notes,
    });
    return NextResponse.json(
      { error: "Booking isn't wired up to the calendar yet. Please call us instead." },
      { status: 503 }
    );
  }

  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
  }
  const end = new Date(start.getTime() + BOOKING_DURATION_MINUTES * 60 * 1000);

  try {
    const token = await getCalendarAccessToken(env.clientEmail, env.privateKey);

    // Re-check for conflicts right before booking — the UI already hides
    // booked slots, but this is the real guard against two people racing to
    // book the same slot within seconds of each other.
    const busy = await getBusyRanges(env.calendarId, token, start.toISOString(), end.toISOString());
    if (busy.some((b) => rangesOverlap(start, end, new Date(b.start), new Date(b.end)))) {
      return NextResponse.json(
        { error: "That time was just booked by someone else — please pick another slot." },
        { status: 409 }
      );
    }

    // Note: this deliberately does NOT add `contact` as a calendar attendee.
    // Google rejects attendee invites from a bare service account with
    // "Service accounts cannot invite attendees without Domain-Wide
    // Delegation of Authority" — which only exists for Google Workspace, not
    // the personal Gmail calendars this template targets. The booker gets an
    // "Add to Google Calendar" link in the UI instead (see page.tsx).
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `${service} — ${name}`,
          description: [`Contact: ${contact}`, notes ? `Notes: ${notes}` : null]
            .filter(Boolean)
            .join("\n"),
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
        }),
      }
    );

    if (!res.ok) {
      console.error("Google Calendar error:", await res.text());
      return NextResponse.json(
        { error: "Failed to add booking to the calendar. Please call us instead." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Google Calendar request failed:", err);
    return NextResponse.json(
      { error: "Failed to add booking to the calendar. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
