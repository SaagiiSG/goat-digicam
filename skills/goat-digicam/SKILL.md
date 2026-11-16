---
name: goat-digicam
description: Y2K Digicam Flash · Флаш камер. Edits the user's phone clips to look shot on a cheap 2000s pocket camera, full screen. Chunky low-res pixels, punchy cool colour, crunchy sharpening, colour speckle in the shadows, a white flash pop on every cut, a quick zoom punch and an orange digital date stamp, with plain white Mongolian captions. Built on HyperFrames. Renders a 1080x1920 MP4 for Reels/TikTok. Best for nails, lash and makeup, fashion boutiques, Gen-Z shops, jewellery and accessories. Use whenever the user wants a digicam, Y2K, 2000s, flash camera, retro digital camera or "хуучин дижитал камер" look, or types /goat-digicam, /флаш, or says "флаштай камер шиг болгоод өг", "огноотой хуучин камерын эффект", "make it look like a digicam", "Y2K flash look", even if they don't name the skill.
---

# Y2K Digicam Flash · Флаш камер

Full-screen footage that looks shot on a cheap 2000s pocket camera: blown-out flash, punchy colour, crunchy sharpening, chunky pixels and an orange digital date in the corner. Every new shot starts with a white flash that fades in 0.2 s, and halfway through each longer shot the picture punches in 8% like a pocket camera's zoom button, its big square pixels staying hard-edged. It is the only GOAT look with hard flash light and an orange date stamp.

**Good for:** nails, lash and makeup, fashion boutiques, Gen-Z shops, jewellery and accessories. Flash shows off gloss and shine.
**Not for:** real estate (flash flattens space), cars, coaching, wide daylight shots. If the user's footage is one of these, say so and suggest another GOAT look.

Talk to the user in the language they write in (usually Mongolian). Keep messages short and plain; many users are not technical. `SKILL_DIR` means this skill's base directory (shown when the skill loads). Run commands from the user's project folder with absolute paths into `SKILL_DIR`. `goat` below means `node SKILL_DIR/scripts/goat.mjs`.

## 1. Setup check (first time on a machine)

**Every new video, first:** run `claude plugin marketplace update goat-digicam`, then `claude plugin update goat-digicam@goat-digicam`. If it installs a new version, tell the user a new version was installed and ask them to type `/reload-plugins` before you go on. If either command fails (offline, or installed from a zip), carry on and don't mention it.

Run `node --version` (needs 22 or newer) and `ffmpeg -version`. If either is missing, show the install command and ask before installing (it is their computer):
- Mac: `brew install node ffmpeg`
- Windows: `winget install OpenJS.NodeJS.LTS` and `winget install Gyan.FFmpeg`, then close and reopen the terminal.

The captions here are words the user writes, not speech, so this look needs no speech model. The first render downloads, once, a private copy of Chrome that draws the frames. Tell the user the first run takes a while; after that it starts at once. Nothing is uploaded: everything runs on their computer, with no account.

**Long steps:** the first `render` (the Chrome download) can run longer than a normal command timeout. Run it in the background, or with a 600000 ms timeout, and wait for it to end. Never stop it and start it again.

**Windows has not been tested yet.** If a step fails there, show the error to the user in plain words.

## 2. Collect the clips and words

Make `raw/` and `output/` in the current folder. Ask for:
1. **The clips.** Drag them into the chat or copy them into `raw/`. Best filmed with the phone flash on, close up, indoors or at night. Photos work too.
2. **The words:** one or two short captions (e.g. "Хумсны шинэ загвар", or the price and phone number the user gave). Never invent a price or phone number. Ask.

If this folder was already edited with `goat-video-editor`, use `output/cut.mp4` as the clip.

Then run `goat probe raw/*`. It prints each file's size, length, whether it has sound, whether it is HDR, and `speech` spans (when someone is talking). Use these to pick shots and time the words.

## 3. Prepare

Write `plan.json` in the project folder (paths are relative to it):

```json
{
  "output": "output/digicam.mp4",
  "clips": [
    {"src": "raw/IMG_0412.MOV", "in": 1.2, "out": 3.2},
    {"src": "raw/IMG_0415.MOV", "in": 0.0, "out": 1.8, "cy": 0.4},
    {"src": "raw/ring.jpg", "dur": 1.5}
  ],
  "texts": [
    {"role": "caption", "text": "Хумсны шинэ загвар", "start": 0, "end": 3.6},
    {"role": "caption", "text": "Хумсны үйлчилгээ\nЦаг захиалга нээлттэй", "start": 3.8}
  ],
  "look": {"punch": true}
}
```

**clips** play in order, full screen. `in`/`out` trim a video (seconds); `dur` sets how long a photo shows. `cx`/`cy` (0–1, default 0.5) choose which part of a wider frame (or a photo of another shape) the phone screen keeps; an upright 9:16 phone clip is kept whole. Add `"sound": false` to mute one clip.

Then run these in order. Each one says what to run first if a step is missing.
1. `goat prep plan.json`: crops every clip to the full 1080x1920 screen, grades it (chunky 480x852 pixels, contrast, punchy colour, cool white balance, over-sharpening, colour speckle, vignette) and joins them into `.work-digicam/main.mp4`. **Run it again whenever `clips` change.**
2. `goat cut plan.json`: this look never cuts pauses; the step only readies the video (`.work-digicam/cut.mp4`) and takes a second.

**Check the framing** before writing the words. For each shot, pull one frame from inside it, 0.4 s after it starts (never at a cut: that frame may already be the next shot, and the first 0.2 s of a shot is the flash). A shot starts where the shots before it end; for the second shot above (2.0 to 3.8 s):
`ffmpeg -y -loglevel error -ss 2.4 -i .work-digicam/cut.mp4 -frames:v 1 output/frame-2.4.jpg`
Read it. The caption sits on the left in the lower middle of the screen (about y 1000–1160 of 1920): if the thing to show (the nails, a face) is right there, pick another moment of that clip (`in`/`out`), or for a wide clip move the crop with `cx`, and run `prep` again.

## 4. Write the words

**texts** (only one caption shows at a time: a later one ends the one before):
- `caption`: plain white bold condensed type (Oswald SemiBold, up to 66 px) with a soft shadow, on the left in the lower middle of the screen, inside the area no app buttons cover. No colour, no pop or bounce: it fades in and out over 0.1 s. Break the line yourself with `\n` (e.g. the price on one row, the phone on the next); **2 rows at most, and at most 28 characters a row** (spaces count). A longer row is refused with a message: shorten it or split it. Long rows shrink to fit: ordinary text stays at about 48 px or more, a row in capitals gets smaller type (about 42 px at 28 letters). Two rows use one size; a second row grows upward.

Each caption shows from `start` to `end` (default: the end of the video).

**The first frame is the Reels thumbnail.** Give the first caption `"start": 0`: it is then already there on frame 0, over the first shot (frame 0 never flashes). Start on a shot worth seeing.

**look** options:
- `date`: the orange 7-segment date stamp, bottom right. Default: today's date as month, day and year, two digits each with a space between: the day the video is made, standing in for the day it was filmed. Write digits with spaces, dots, dashes or colons only (the font has no letters, no apostrophe and no slash). `false` hides it. The stamp is decoration and sits where the app's side buttons may partly cover it: never put a price or phone number in it.
- `punch`: `true` (default) zooms in 8% over 3 frames halfway through every shot of 1 s or longer and holds it to the cut, like a pocket camera's zoom button. `false` turns it off.

**Auto sound effects** (soft, so they sit under the clips' own sound; raise them with `"sfx": {"volume": 1.5}`): a camera shutter on the white flashes, and with `"punch": true` a small click as each zoom punch hits. Never two within 0.5 s, so flashes 1/3 s apart click on every other one.

**Timing:** shots of 1–2.5 s read best. Every cut flashes white, fading over 0.2 s, but never more than 3 flashes a second (seizure safety): a cut less than 1/3 s after the last flash gets none, so only very fast cutting skips some. Shots under 1 s get no zoom punch.

Before rendering, tell the user the plan in plain words: the shot list, the words, and **the date the stamp will show** (today's unless they gave one), so they can change it or turn it off. Write the date they agree to into `look.date`, so a render on another day shows the same one. Ask "OK?". This is the only approval needed.

<!-- audio: this section is copied from core/skill-audio-node.md by build.py; edit it there -->
## Sound effects, voice-over and music

**Sound effects are on by default.** The look adds its own (see "Auto sound effects" above). They are made in code, so there's nothing to license, and they sit quietly under the voice.
- Turn them off: `"sfx": false`. Make them quieter or louder: `"sfx": {"volume": 0.6}`.
- Add one: `"sfx": {"add": [{"sound": "ding", "at": 4.2}]}`. Sounds: whoosh, swish, pop, click, type, shutter, boom, thud, hit, riser, ding, notify, shimmer, paper, tape, marker, projector, tick. `type`, `marker`, `projector` and `riser` also take `"dur"` in seconds; a riser should end on the moment it builds to.
- Let the user hear one render before adding more. Too many sounds feel cheap.

**Voice-over.** If the user wants to talk over the video, ask them to record it on their phone (a voice memo is fine: m4a, mp3 or wav) and copy it into `raw/`. Then add `"voiceover": {"src": "raw/vo.m4a", "at": 0.5}` (`at` = when it starts; optional `"volume"`). While the voice plays, the clips' own sound and the music dip automatically. Run `node SKILL_DIR/scripts/goat.mjs probe raw/vo.m4a` to get its `speech` spans and time the words on screen to them. The clips must add up to at least the voice-over's length (the render warns if not). Recording tips for the user: a small quiet room (a parked car or a wardrobe works), phone about 20 cm from the mouth, read the script out loud once before recording.

**Music.** `"music": {"src": "raw/song.mp3", "volume": 0.25}`. Only use music the user has the rights to. Music added inside the Instagram/TikTok app is the safe choice, so suggest that first.
<!-- /audio -->

## 5. Render and check

`goat render plan.json`

It draws the flashes, zoom punches, captions and date over the graded footage, mixes the sound and writes the MP4 plus a contact sheet (one frame per second) at `.work-digicam/sheet.jpg`. On our test Mac an 8.3 s video with 6 shots took 16–21 s to render (and 11–13 s to prep). Longer videos take longer. Run the next render only after the last one ends. Read the contact sheet, the first frame, one full-size frame inside each shot, 0.4 s after it starts (after its flash), and one at a zoom punch, 0.2 s after the middle of a shot of 1 s or more:
`ffmpeg -y -loglevel error -i output/digicam.mp4 -frames:v 1 output/check-0.jpg`
`ffmpeg -y -loglevel error -ss 2.4 -i output/digicam.mp4 -frames:v 1 output/check-2.4.jpg` (and one per shot)
`ffmpeg -y -loglevel error -ss 3.1 -i output/digicam.mp4 -frames:v 1 output/check-3.1.jpg` (the second shot's punch: its middle 2.9 + 0.2)
Check that:
- the first frame (the thumbnail) shows the footage and the first caption;
- each caption is whole and readable, and doesn't sit on the thing being shown (pick another moment with `in`/`out`);
- nothing important is too dark at the edges (the vignette darkens the corners) or cut off by the punch (it crops 4% off each edge).

If a render fails twice, stop and explain the error in plain words. Don't loop.

## 6. Hand over

Tell the user where the file is (`output/digicam.mp4`) and that it is ready to post. Music can be added in the Instagram/TikTok app.

## Rules

- Every word and graphic on screen comes from what this video says or shows, or from what the user gave you. The examples in this file are only examples: never put them in a video. If the user hasn't given the words, ask.
- Anything the viewer must read (price, phone, offer) goes in a `caption`, which sits inside the area no app buttons cover. Never in the date stamp. Never invent a price, phone number or date; ask.
- Captions stay plain white: no colour, no pop or bounce.
- Use only the fonts bundled in `SKILL_DIR/fonts` (Oswald has Ө ө Ү ү and ₮; DSEG7 is digits only, for the date). Don't swap in other fonts. Emoji and symbols such as ★ can't be drawn.
- The output is 1080x1920, 30 fps, H.264. The clips' own sound (and any voice-over or music) is normalised to -14 LUFS (Instagram/TikTok level); clips without sound stay silent under the effects, so such a reel is quieter than that.
