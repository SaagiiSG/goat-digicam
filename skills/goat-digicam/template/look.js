// 02 Y2K Digicam. Reads window.PLAN (goat.mjs writes it; look.mjs works out every flash, punch and the date)
// and builds one paused GSAP timeline.
const P = window.PLAN;
const $ = (s) => document.querySelector(s);
const tl = gsap.timeline({ paused: true });
const FIRST = 1 / 30, F = 1 / 30;
const at = (t) => Math.max(0, t - 0.001); // frame-exact events land on their frame, not one late

// The flash: the cut's first frame blown out to white, back to the picture over 0.2 s (6 frames, as v1).
// One bright pulse; look.mjs keeps them 1/3 s apart, so at most 3 a second and never two at once.
for (const c of P.flashes) for (let i = 0; i <= 6; i++) tl.set("#flash", { opacity: 1 - i / 6 }, at(c + i * F));

// The zoom button: 8% in over 3 frames halfway through the shot, held to the cut, which resets it.
for (const p of P.punches) {
  tl.fromTo("#zoom", { scale: 1 }, { scale: 1.08, duration: 3 * F, ease: "none", force3D: false, immediateRender: false }, p.at);
  if (p.end < P.dur - 0.01) tl.set("#zoom", { scale: 1, force3D: false }, at(p.end));
}

// Captions: one at a time (a later one ends the one before), 0.1 s fades, no pop or bounce.
const caps = P.texts.filter((t) => t.role === "caption").sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
const els = caps.map((t, i) => {
  const start = t.start ?? 0, end = Math.min(t.end ?? P.dur, caps[i + 1]?.start ?? P.dur);
  const el = $("#captions").appendChild(document.createElement("div"));
  for (const row of String(t.text).split("\n")) el.appendChild(document.createElement("div")).textContent = row.trim();
  if (start < FIRST) gsap.set(el, { opacity: 1 });
  else tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "none", immediateRender: false }, start);
  if (end < P.dur - 0.01) tl.to(el, { opacity: 0, duration: 0.1, ease: "none" }, Math.max(start, end - 0.1));
  return el;
});

const date = $("#date");
date.hidden = !P.date;
date.textContent = P.date ?? "";

tl.set({}, {}, P.dur);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;

// Sizes need the real fonts; the renderer waits for document.fonts.ready before the first frame.
// Date: DSEG7 digits fill the line box exactly (ascent 1 em, no descent), so its baseline sits on y 1240,
// inside the safe box. Captions: Oswald at line-height 1.1 puts a row's baseline 1.002 em below its top;
// the last baseline sits on y 1140, so descenders (0.29 em at 66 px) end 27 px above the date, and a second
// row grows upward. GOAT.fit shrinks a caption to 660 px (left of x 780, clear of TikTok's side buttons):
// rows validate allows (28 letters) stay at 48 px or more, capitals go to about 42; 22 px is a floor that
// even 28 of Oswald's widest glyphs (under 1 em) fit, so no row leaves the frame.
function layout() {
  if (P.date) date.style.top = `${1240 - GOAT.fit(date, 840, 54, 24)}px`;
  for (const el of els) {
    const s = GOAT.fit(el, 660, 66, 22);
    el.style.top = `${1140 - ((el.children.length - 1) * 1.1 + 1.002) * s}px`;
  }
}
layout();
document.fonts.ready.then(layout);
