import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarEnv,
  getCalendarAccessToken,
  getBusyRanges,
  rangesOverlap,
} from "@/app/lib/google-calendar";
import { BOOKING_HOURS, BOOKING_SLOT_MINUTES, BOOKING_DURATION_MINUTES } from "@/app/content";

function generateSlots(date: string): { time: string; start: Date; end: Date }[] {
  const dayStart = new Date(`${date}T${BOOKING_HOURS.start}:00`);
  const dayEnd = new Date(`${date}T${BOOKING_HOURS.end}:00`);

  const slots: { time: string; start: Date; end: Date }[] = [];
  let cursor = dayStart;
  while (cursor.getTime() + BOOKING_DURATION_MINUTES * 60_000 <= dayEnd.getTime()) {
    slots.push({
      time: cursor.toTimeString().slice(0, 5),
      start: cursor,
      end: new Date(cursor.getTime() + BOOKING_DURATION_MINUTES * 60_000),
    });
    cursor = new Date(cursor.getTime() + BOOKING_SLOT_MINUTES * 60_000);
  }
  return slots;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
    return NextResponse.json({ error: "Invalid or missing date." }, { status: 400 });
  }

  const futureSlots = generateSlots(date).filter((s) => s.start > new Date());

  const env = getCalendarEnv();
  if (!env) {
    // No calendar configured — can't check real availability, so don't block
    // the form. The booking POST's own "not configured" error is what
    // actually surfaces this to the person submitting.
    return NextResponse.json({
      slots: futureSlots.map((s) => ({ time: s.time, available: true })),
    });
  }

  try {
    const token = await getCalendarAccessToken(env.clientEmail, env.privateKey);
    const dayStart = new Date(`${date}T00:00:00`).toISOString();
    const dayEnd = new Date(new Date(dayStart).getTime() + 24 * 60 * 60 * 1000).toISOString();
    const busy = await getBusyRanges(env.calendarId, token, dayStart, dayEnd);

    const slots = futureSlots.map((s) => ({
      time: s.time,
      available: !busy.some((b) => rangesOverlap(s.start, s.end, new Date(b.start), new Date(b.end))),
    }));
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("Availability check failed:", err);
    // Fail open — the booking POST's own conflict check is the real guard,
    // this is just the UI hint.
    return NextResponse.json({
      slots: futureSlots.map((s) => ({ time: s.time, available: true })),
    });
  }
}
