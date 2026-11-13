# /// script
# requires-python = ">=3.10,<3.13"
# dependencies = ["pillow>=10.4", "numpy>=1.26"]
# ///
"""Y2K Digicam Flash · Флаш камер.

Full-screen footage that looks shot on a cheap 2000s pocket camera: chunky low-res pixels, punchy cool colour,
crunchy sharpening, shadow speckle, a white flash pop on every cut, a 3-frame zoom punch and an orange date stamp.
Usage: uv run render.py plan.json
"""
import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import goatcut as g  # noqa: E402
from PIL import Image  # noqa: E402

NAME = "digicam"
GRADE = ("scale=480:852,scale=1080:1920:flags=neighbor,eq=contrast=1.18:saturation=1.25:gamma=0.95,"
         "colortemperature=temperature=7600,unsharp=5:5:1.4,format=yuv444p,"
         "noise=c1s=10:c2s=10:c1f=t:c2f=t,vignette=PI/3.5")
ORANGE = (255, 138, 28)
FLASH_S = 0.2               # white flash pop at the start of a clip fades out over this long
PUNCH, PUNCH_FRAMES = 1.08, 3
OSWALD, DSEG = "Oswald[wght].ttf", "DSEG7Classic-Bold.ttf"
DATE_CHARS = set("0123456789 .-:")  # all DSEG7 can draw that a date needs: no letters, no apostrophe
CAP_X, CAP_Y, CAP_W = 120, 1094, 660  # below y 840 captions stay left of x 780 (TikTok's side buttons)


def setup(ctx):
    if not isinstance(ctx.opt("punch", True), bool):
        g.die("look.punch must be true or false")
    date = ctx.opt("date", datetime.date.today().strftime("%m %d %y"))
    if date is not False and (not isinstance(date, str) or not date.strip() or set(date) - DATE_CHARS):
        g.die('look.date must be digits with spaces, dots, dashes or colons, like "11 12 26", or false to hide it. '
              "The date font has no letters and no apostrophe.")
    ctx.date = date and g.text_sprite(date.strip(), ctx.font(DSEG, 54), fill=ORANGE + (255,),
                                      shadow=(0, 0, 4, ORANGE + (217,)), tracking=0.06)
    # at most 3 flashes a second: a clip starting less than 1/3 s after the last flash gets none
    ctx.flash_clips, last = set(), -1.0
    for i, c in enumerate(ctx.cuts):
        if c - last >= 0.34:
            ctx.flash_clips.add(i)
            last = c
    ctx.white = Image.new("RGB", (g.W, g.H), (255, 255, 255))


def SFX(ctx):
    # a camera shutter on every flash; a small click when the zoom button is pressed
    ev = [{"sound": "shutter", "at": ctx.cuts[i]} for i in sorted(ctx.flash_clips)]
    if ctx.opt("punch", True):
        ev += [{"sound": "click", "at": c + x["dur"] / 2, "volume": 0.7}
               for c, x in zip(ctx.cuts, ctx.clips) if x["dur"] >= 1]
    return ev


def caption_sprite(ctx, text):
    f = ctx.fit(text, OSWALD, CAP_W, 66, min_size=36, axes={"wght": 600})
    return g.text_sprite(text, f, align="left", spacing=0.1, shadow=(0, 0, 10, (0, 0, 0, 115)))


def frame(img, t, ctx):
    i, lt = ctx.clip_at(t)
    dur = ctx.clips[i]["dur"]
    if ctx.opt("punch", True) and dur >= 1:  # the zoom button, pressed halfway through the shot
        z = 1 + (PUNCH - 1) * g.clamp((lt - dur / 2) * g.FPS / PUNCH_FRAMES)
        if z > 1:
            cw, ch = g.W / z, g.H / z
            img = img.resize((g.W, g.H), Image.NEAREST,
                             box=((g.W - cw) / 2, (g.H - ch) / 2, (g.W + cw) / 2, (g.H + ch) / 2))
    if i in ctx.flash_clips and lt < FLASH_S:
        img = Image.blend(img, ctx.white, 1 - lt / FLASH_S)

    canvas = img.convert("RGBA")
    for item in ctx.active(t, "caption")[-1:]:
        s = ctx.cache(("caption", item["text"]), lambda: caption_sprite(ctx, item["text"]))
        g.paste(canvas, s, CAP_X, CAP_Y, g.fade(t, item, 0.1, 0.1))
    if ctx.date:
        g.paste(canvas, ctx.date, 1000 - ctx.date.width, 1651)
    return canvas


if __name__ == "__main__":
    g.run(sys.modules[__name__])
