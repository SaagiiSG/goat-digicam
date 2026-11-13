---
name: goat-digicam
description: Y2K Digicam Flash · Флаш камер. Edits the user's phone clips to look shot on a cheap 2000s pocket camera, full screen. Chunky low-res pixels, punchy cool colour, crunchy sharpening, colour speckle in the shadows, a white flash pop on every cut, a quick zoom punch and an orange digital date stamp in the corner, with plain white Mongolian captions. Renders a 1080x1920 MP4 for Reels/TikTok. Best for nails, lash and makeup, fashion boutiques, Gen-Z shops, jewellery and accessories. Use whenever the user wants a digicam, Y2K, 2000s, flash camera, retro digital camera or "хуучин дижитал камер" look, or types /goat-digicam, /флаш, or says "флаштай камер шиг болгоод өг", "огноотой хуучин камерын эффект", "make it look like a digicam", "Y2K flash look", even if they don't name the skill.
---

# Y2K Digicam Flash · Флаш камер

Full-screen footage that looks shot on a cheap 2000s pocket camera: blown-out flash, punchy colour, crunchy sharpening, chunky pixels and an orange digital date in the corner. Every new shot starts with a white flash pop. It is the only GOAT look with hard flash light and an orange date stamp.

**Good for:** nails, lash and makeup, fashion boutiques, Gen-Z shops, jewellery and accessories. Flash shows off gloss and shine.
**Not for:** real estate (flash flattens space), cars, coaching, wide daylight shots. If the user's footage is one of these, say so and suggest another GOAT look.

Talk to the user in the language they write in (usually Mongolian). Keep messages short and plain; many users are not technical. `SKILL_DIR` means this skill's base directory (shown when the skill loads). Run commands from the user's project folder with absolute paths into `SKILL_DIR`.

## 1. Setup check (first time on a machine)

Run `ffmpeg -version` and `uv --version`. If either is missing, show the install command and ask before installing (it is their computer):
- Mac: `brew install ffmpeg uv`
- Windows: `winget install Gyan.FFmpeg` and `winget install astral-sh.uv`, then close and reopen the terminal.

The first render downloads a small Python package (Pillow) once. After that it is instant.

## 2. Collect the clips and words

Make `raw/` and `output/` in the current folder. Ask for:
1. **The clips.** Drag them into the chat or copy them into `raw/`. Best filmed with the phone flash on, close up, indoors or at night. Photos work too.
2. **The words:** one or two short captions (e.g. "Хумсны шинэ загвар", or a price and phone number). Never invent a price, phone number or date. Ask.

If this folder was already edited with `goat-video-editor`, use `output/cut.mp4` as the clip and `transcript/cut_words.json` for word times.

Then run: `uv run SKILL_DIR/scripts/goatcut.py probe raw/*`
It prints each file's size, length, whether it has sound, whether it is HDR, and `speech` spans (when someone is talking). Use these to pick shots and time the words.

## 3. Write plan.json

Write `plan.json` in the project folder. Paths are relative to it.

```json
{
  "output": "output/digicam.mp4",
  "clips": [
    {"src": "raw/IMG_0412.MOV", "in": 1.2, "out": 3.2},
    {"src": "raw/IMG_0415.MOV", "in": 0.0, "out": 2.0, "cy": 0.4},
    {"src": "raw/ring.jpg", "dur": 1.5}
  ],
  "texts": [
    {"role": "caption", "text": "Хумсны шинэ загвар", "start": 0.3, "end": 3.8},
    {"role": "caption", "text": "Үйлчилгээ 35 000₮\n9911-2233", "start": 4.0, "end": 5.5}
  ],
  "music": {"src": "raw/song.mp3", "volume": 0.25},
  "look": {"date": "11 12 26", "punch": true}
}
```

**clips** play in order. `in`/`out` trim a video (seconds); `dur` sets how long a photo shows. `cx`/`cy` (0–1, default 0.5) choose which part of a wide frame the phone screen keeps. Add `"sound": false` to mute one clip.
**texts:** `caption` is plain white bold condensed type (Oswald SemiBold) with a soft shadow, left-aligned in the lower middle of the screen, inside the area no app buttons cover. Only one shows at a time. Keep it to two short lines: break the line yourself with `\n` (e.g. price on one line, phone on the next). Long lines shrink to fit.
**Auto sound effects:** a camera shutter on every white flash; with `"punch": true`, a small click as each zoom punch hits.
**look** options:
- `date`: the orange date stamp, bottom-right. Default: today's date as month day year, like `"11 12 26"`. Write digits with spaces, dots, dashes or colons only (the 7-segment font has no letters and no apostrophe). `false` hides it. The stamp is decoration: app buttons may cover part of it, so never put a price or phone number in it.
- `punch`: `true` (default) zooms in 8% in 3 frames halfway through every shot of 1 s or longer, like a pocket camera's zoom button. `false` turns it off.

**Timing:** shots of 1–2.5 s. Every shot starts with a white flash that fades in 0.2 s. To stay seizure-safe there are never more than 3 flashes a second: a shot that starts less than 1/3 s after the last flash gets none.

Before rendering, tell the user the plan in plain words (shot list + the words + the date) and ask "OK?". This is the only approval needed.

<!-- audio: this section is copied from core/skill-audio.md by build.py; edit it there -->
## Sound effects, voice-over and music

**Sound effects are on by default.** The look adds its own (see "Auto sound effects" above). They are made in code, so there's nothing to license, and they sit quietly under the voice.
- Turn them off: `"sfx": false`. Make them quieter or louder: `"sfx": {"volume": 0.6}`.
- Add one: `"sfx": {"add": [{"sound": "ding", "at": 4.2}]}`. Sounds: whoosh, swish, pop, click, type, shutter, boom, thud, hit, riser, ding, notify, shimmer, paper, tape, marker, projector, tick. `type`, `marker`, `projector` and `riser` also take `"dur"` in seconds; a riser should end on the moment it builds to.
- Let the user hear one render before adding more. Too many sounds feel cheap.

**Voice-over.** If the user wants to talk over the video, ask them to record it on their phone (a voice memo is fine: m4a, mp3 or wav) and copy it into `raw/`. Then add `"voiceover": {"src": "raw/vo.m4a", "at": 0.5}` (`at` = when it starts; optional `"volume"`). While the voice plays, the clips' own sound and the music dip automatically. Run `goatcut.py probe raw/vo.m4a` to get its `speech` spans and time the words on screen to them. The clips must add up to at least the voice-over's length (the render warns if not). Recording tips for the user: a small quiet room (a parked car or a wardrobe works), phone about 20 cm from the mouth, read the script out loud once before recording.

**Music.** `"music": {"src": "raw/song.mp3", "volume": 0.25}`. Only use music the user has the rights to. Music added inside the Instagram/TikTok app is the safe choice, so suggest that first.
<!-- /audio -->

## 4. Render and check

`uv run SKILL_DIR/scripts/render.py plan.json`

A 30 s video takes about 50 s. Then look at three frames before saying it is done:
`ffmpeg -y -loglevel error -ss 2 -i output/digicam.mp4 -frames:v 1 output/check-1.jpg` (and two more times; avoid the first 0.2 s of a shot, which is the flash). Read them. Check that captions are not cut off and nothing important is too dark at the edges (the vignette darkens corners).

If a render fails twice, stop and explain the error in plain words. Don't loop.

## 5. Hand over

Tell the user where the file is (`output/digicam.mp4`) and that it is ready to post. Music can be added in the Instagram/TikTok app.

## Rules

- Anything the viewer must read (price, phone, offer) goes in a `caption`, which sits inside the area no app buttons cover. Never in the date stamp.
- Captions stay plain white: no colour, no pop or bounce.
- Use only the fonts bundled in `SKILL_DIR/fonts` (Oswald has Ө ө Ү ү and ₮; DSEG7 is digits only). Don't swap in other fonts.
- The output is 1080x1920, 30 fps, H.264, sound normalised to -14 LUFS (Instagram/TikTok level).
