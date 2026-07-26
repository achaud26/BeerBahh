import type { CrowdLevel } from "@/data/bars";

const BLOCKED =
  /\b(onlyfans|meet up for sex|send nudes|hookup tonight|dm me for dates?)\b/i;

const PACKED =
  /\b(packed|slammed|insane|line (is )?(wrapped|wrapping|long)|no room|can't get in|cant get in|herd is in)\b/i;
const BUZZING =
  /\b(buzzing|filling up|getting good|starting to fill|solid crowd|moving)\b/i;
const CHILL =
  /\b(chill|lowkey|quiet but|warm(ing)? up|not packed|easy to get in)\b/i;
const DEAD =
  /\b(dead|ghost(ed| town)?|empty|nobody here|no one here|waste(d)? (the )?uber)\b/i;

export type ModResult =
  | { ok: true; crowdHint: CrowdLevel | null }
  | { ok: false; reason: string };

export function moderateChatText(text: string): ModResult {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (cleaned.length < 1) {
    return { ok: false, reason: "Empty message." };
  }
  if (cleaned.length > 240) {
    return { ok: false, reason: "Keep it under 240 characters." };
  }
  if (BLOCKED.test(cleaned)) {
    return {
      ok: false,
      reason: "Keep it about the bar — dating/spam gets dropped.",
    };
  }
  // Same char spam
  if (/^(.)\1{8,}$/.test(cleaned)) {
    return { ok: false, reason: "Spam blocked." };
  }

  let crowdHint: CrowdLevel | null = null;
  if (PACKED.test(cleaned)) crowdHint = "packed";
  else if (DEAD.test(cleaned)) crowdHint = "dead";
  else if (BUZZING.test(cleaned)) crowdHint = "buzzing";
  else if (CHILL.test(cleaned)) crowdHint = "chill";

  return { ok: true, crowdHint };
}

export function minutesAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 60000));
}
