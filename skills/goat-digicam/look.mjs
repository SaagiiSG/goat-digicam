// 02 Y2K Digicam Flash: full-screen clips that look shot on a cheap 2000s pocket camera. Chunky low-res
// pixels, punchy cool colour, crunchy sharpening and colour speckle (baked by ffmpeg in prep), a white
// flash that fades over 0.2 s at every cut, an 8% zoom punch halfway through each longer shot, an orange
// 7-segment date stamp bottom right and plain white Oswald captions the member writes.
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { missing } from "./scripts/fonts.mjs";
await import("./scripts/goat-lib.js"); // GOAT.spaced, the same one the template uses

export const NAME = "digicam";
export const TALKS = false;

const SKILL_DIR = dirname(fileURLToPath(import.meta.url));
const OSWALD = "Oswald[wght].ttf";
const GRADE = "scale=480:852,scale=1080:1920:flags=neighbor,eq=contrast=1.18:saturation=1.25:gamma=0.95," +
  "colortemperature=temperature=7600,unsharp=5:5:1.4,format=yuv444p,noise=c1s=10:c2s=10:c1f=t:c2f=t,vignette=PI/3.5";
// Longest caption row that fits 660 px (x 120–780) at 48 px, from HarfBuzz widths of Oswald at weight 600:
// mixed Mongolian rows of 28 letters run up to 13.8 em. Rows of capitals (up to 15.9 em) go to about 42 px.
const ROW = 28, ROWS = 2;
const DATE_CHARS = /^[0-9 .:-]+$/; // all a date needs that DSEG7 can draw: no letters, no apostrophe or slash
const PUNCH_MIN = 1; // shots of 1 s or more get the zoom punch halfway through
const EPS = 1e-9;

const isNum = (n) => typeof n === "number" && Number.isFinite(n);

export function validate(plan) {
  const look = plan.look ?? {};
  if (look.punch !== undefined && typeof look.punch !== "boolean") throw new Error('look "punch" must be true or false');
  if (look.date !== undefined && look.date !== false && !(typeof look.date === "string" && look.date.trim() && DATE_CHARS.test(look.date)))
    throw new Error('look "date" must be digits with spaces, dots, dashes or colons, like "11 12 26", or false to hide it. ' +
      "The date font has no letters, no apostrophe and no slash.");
  for (const t of plan.texts ?? []) {
    if (t.role !== "caption") throw new Error(`text role "${t.role}" is not used by this look. Use "caption".`);
    const text = String(t.text ?? "");
    if (!text.trim()) throw new Error('a "caption" text is empty');
    if (t.start !== undefined && !(isNum(t.start) && t.start >= 0)) throw new Error(`"${text}": "start" must be seconds, 0 or more`);
    if (t.end !== undefined && !(isNum(t.end) && t.end > Number(t.start ?? 0))) throw new Error(`"${text}" must end after it starts`);
    const rows = text.split("\n");
    if (rows.length > ROWS) throw new Error(`"${text}" has ${rows.length} rows: a caption takes ${ROWS} rows at most`);
    for (const row of rows)
      if ([...row.trim()].length > ROW)
        throw new Error(`"${row.trim()}" is too long for one caption row (${ROW} characters at most): ` +
          "shorten it, or split it into 2 rows with \\n");
    const bad = missing(text, join(SKILL_DIR, "fonts", OSWALD));
    if (bad.length) throw new Error(`"${text}" uses ${bad.join(" ")}, which Oswald can't draw`);
  }
}

// The v1 grade, unchanged: down to 480x852 and back up with nearest neighbour (the chunky sensor pixels),
// contrast and saturation, a cool white balance, over-sharpening and colour speckle, then the vignette.
export async function clipFilter() {
  return GRADE;
}

// Cuts after the first frame (cuts[0] is the video's start; frame 0 is the thumbnail, so it never flashes).
const real = (cuts) => cuts.filter((c) => c > EPS);

// One white flash at a cut, fading over 0.2 s: one bright pulse, however many frames it fades over.
// At most 3 a second (seizure safety, WCAG 2.3.1): a cut less than 1/3 s after the last flash gets none,
// so two flashes never overlap. Nothing else bright happens near the end, so a late cut still flashes.
export function flashTimes(cuts) {
  return GOAT.spaced(real(cuts), 1 / 3);
}

// The zoom button, pressed halfway through every shot of 1 s or more and held to the shot's end. It starts
// at least 0.5 s after the shot's own flash and ends 0.4 s before the next cut, so it never meets a flash.
export function punches(cuts, dur, on = true) {
  if (!on) return [];
  return cuts.map((s, i) => [s, cuts[i + 1] ?? dur])
    .filter(([s, e]) => Math.round((e - s) * 30) >= PUNCH_MIN * 30) // in whole frames: probe rounds the length
    .map(([s, e]) => ({ at: Math.round(((s + e) / 2) * 1000) / 1000, end: e }));
}

// A pocket camera's date stamp: month day year, two digits each.
export function stampDate(d = new Date()) {
  const two = (n) => String(n).padStart(2, "0");
  return `${two(d.getMonth() + 1)} ${two(d.getDate())} ${two(d.getFullYear() % 100)}`;
}

export async function prepare(ctx) {
  const look = ctx.plan.look ?? {}, cuts = ctx.cuts.length ? ctx.cuts : [0];
  return {
    flashes: flashTimes(cuts),
    punches: punches(cuts, ctx.dur, look.punch !== false),
    date: look.date === false ? null : (look.date ?? stampDate()).trim(),
  };
}

// About 30% of v1's levels (shutter 1.0, click 0.7; Saagii, 16 Nov: "bring the sounds effects down a bit"); members
// raise them with "sfx": {"volume": …}. Never two within 0.5 s: flashes 1/3 s apart click the shutter on every other
// one, and a click gives way to a shutter (only a punch in a shot a frame under 1 s can come that close).
export function sfx(plan, ctx) {
  const cuts = ctx.cuts.length ? ctx.cuts : [0], shutters = GOAT.spaced(flashTimes(cuts), 0.5);
  return [
    ...shutters.map((at) => ({ sound: "shutter", at, volume: 0.3 })),
    ...punches(cuts, ctx.dur, plan.look?.punch !== false).filter((p) => shutters.every((s) => Math.abs(p.at - s) >= 0.5 - 1e-9))
      .map((p) => ({ sound: "click", at: p.at, volume: 0.21 })),
  ];
}
