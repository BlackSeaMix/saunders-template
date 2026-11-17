// Integration/smoke test for the booking -> Google Calendar flow.
//
// NOT a unit test: it makes real calls to the Google Calendar API, creates
// real events, and deletes them again. Needs real credentials in .env.local
// to run at all, and isn't wired into any CI (this repo doesn't have one) —
// run it manually whenever you want to confirm the calendar integration
// still works, e.g. after rotating the service account key or any Google
// Cloud changes.
//
// Covers:
//   1. A single booking lands as a real event on the calendar.
//   2. Multiple bookings each land as separate events.
//   3. An already-booked timeslot is reported as unavailable by
//      /api/availability (and an untouched slot still shows as available),
//      so the UI never even offers an already-taken slot in the first
//      place — that's what actually prevents a double-booking here.
//
// Usage:
//   npm run test:calendar
//   TEST_URL=https://your-deployment.vercel.app npm run test:calendar

import { JWT } from "google-auth-library";
import { readFileSync, existsSync } from "fs";

const TEST_URL = process.env.TEST_URL || "http://localhost:3000";

function loadEnvLocal() {
  if (!existsSync(".env.local")) {
    return {};
  }
  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split("\n")
      .filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => {
        const idx = l.indexOf("=");
        const key = l.slice(0, idx);
        let val = l.slice(idx + 1);
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        return [key, val];
      })
  );
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const envFile = loadEnvLocal();
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || envFile.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || envFile.GOOGLE_PRIVATE_KEY;
const calendarId = process.env.GOOGLE_CALENDAR_ID || envFile.GOOGLE_CALENDAR_ID;

if (!clientEmail || !privateKeyRaw || !calendarId) {
  fail(
    "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_CALENDAR_ID.\n" +
      "  Set them in .env.local (see README.md's \"One-time Google Calendar setup\")."
  );
}
const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

// Tomorrow, so bookings never collide with anything real on the calendar.
const testDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
const dateStr = testDate.toISOString().slice(0, 10);
const testName = "[Automated Test] verify-calendar-booking.mjs";

const jwtClient = new JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/calendar.events"],
});
const { token } = await jwtClient.getAccessToken();
const authHeaders = { Authorization: `Bearer ${token}` };

async function listTestEvents() {
  const dayStart = new Date(`${dateStr}T00:00:00Z`).toISOString();
  const dayEnd = new Date(new Date(dayStart).getTime() + 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
      `?timeMin=${encodeURIComponent(dayStart)}&timeMax=${encodeURIComponent(dayEnd)}` +
      `&q=${encodeURIComponent("Automated Test")}`,
    { headers: authHeaders }
  );
  if (!res.ok) fail(`Calendar API list request failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return body.items ?? [];
}

async function book(time, label) {
  const res = await fetch(`${TEST_URL}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${testName} ${label}`,
      contact: calendarId,
      service: "[Service name]",
      date: dateStr,
      time,
      notes: "Created by verify-calendar-booking.mjs — safe to delete.",
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.ok) {
    fail(`/api/book returned ${res.status} for ${label} (${time}): ${JSON.stringify(body)}`);
  }
}

async function getAvailability() {
  const res = await fetch(`${TEST_URL}/api/availability?date=${dateStr}`);
  if (!res.ok) fail(`/api/availability returned ${res.status}: ${await res.text()}`);
  const body = await res.json();
  return body.slots ?? [];
}

console.log(`Target: ${TEST_URL}`);
console.log(`Date: ${dateStr}\n`);

const bookedTimes = ["14:00", "16:00", "17:00"];
const untouchedTime = "10:00";

// 1. A single booking lands as a real event on the calendar.
console.log(`1. Booking a single slot (${bookedTimes[0]}) and confirming it lands on the calendar...`);
await book(bookedTimes[0], "#1");
let events = await listTestEvents();
const event1 = events.find((ev) => ev.summary?.includes(`${testName} #1`));
if (!event1) fail("Booking #1 succeeded but no matching event was found on the calendar.");
console.log(`   ✓ Found "${event1.summary}" at ${event1.start?.dateTime}\n`);

// 2. Multiple bookings each land as separate events.
console.log(`2. Booking two more slots (${bookedTimes[1]}, ${bookedTimes[2]}) and confirming each lands separately...`);
await book(bookedTimes[1], "#2");
await book(bookedTimes[2], "#3");
events = await listTestEvents();
const event2 = events.find((ev) => ev.summary?.includes(`${testName} #2`));
const event3 = events.find((ev) => ev.summary?.includes(`${testName} #3`));
if (!event2) fail("Booking #2 succeeded but no matching event was found on the calendar.");
if (!event3) fail("Booking #3 succeeded but no matching event was found on the calendar.");
console.log(`   ✓ Found "${event2.summary}" at ${event2.start?.dateTime}`);
console.log(`   ✓ Found "${event3.summary}" at ${event3.start?.dateTime}\n`);

// 3. Already-booked slots are reported unavailable — this is what actually
// stops a double-booking, since the UI only offers slots /api/availability
// marks as available.
console.log("3. Checking /api/availability reports the booked slots as unavailable...");
const slots = await getAvailability();
for (const time of bookedTimes) {
  const slot = slots.find((s) => s.time === time);
  if (!slot) fail(`/api/availability didn't return a slot for ${time} at all.`);
  if (slot.available) fail(`${time} is booked but /api/availability still reports it as available.`);
}
console.log(`   ✓ ${bookedTimes.join(", ")} all correctly reported as unavailable`);

const untouchedSlot = slots.find((s) => s.time === untouchedTime);
if (!untouchedSlot || !untouchedSlot.available) {
  fail(`${untouchedTime} was never booked but isn't reported as available — availability check looks broken.`);
}
console.log(`   ✓ ${untouchedTime} (never booked) still correctly available\n`);

// 4. Clean up — tests shouldn't leave side effects.
console.log("4. Deleting all test events...");
for (const event of [event1, event2, event3]) {
  const delRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${event.id}`,
    { method: "DELETE", headers: authHeaders }
  );
  if (delRes.status !== 204) {
    fail(`Cleanup failed (status ${delRes.status}) — delete event ${event.id} manually.`);
  }
}
console.log("   ✓ Deleted\n");

console.log("PASS — single and multiple bookings land on the calendar, and booked slots are correctly marked unavailable.");
