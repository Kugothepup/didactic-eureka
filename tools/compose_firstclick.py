"""Compose firstclick.mjs output into one image per site: each stage's screen with its task above and
the numbered candidates (likelihood, predicted first click, below-the-fold) underneath.
   python3 compose_firstclick.py <site dir> [<site dir> ...]   (each holds firstclick/firstclick.json)"""
import json, sys, textwrap, os
from PIL import Image, ImageDraw, ImageFont
F = "/usr/share/fonts/truetype/dejavu/"
fb = ImageFont.truetype(F + "DejaVuSans-Bold.ttf", 22); fr = ImageFont.truetype(F + "DejaVuSans.ttf", 19); fs = ImageFont.truetype(F + "DejaVuSans.ttf", 17)
COL = {"likely": (29, 78, 216), "possible": (180, 83, 9), "unlikely": (107, 114, 128)}
NAMES = {1: "Arrive and orient", 2: "Find the work", 3: "Judge the evidence", 4: "Get in touch", 5: "Reassurance"}
for site in sys.argv[1:]:
    d = json.load(open(f"{site}/firstclick/firstclick.json")); panels = []; W = 960
    for st in sorted(d["stages"], key=lambda x: x["stage"]):
        im = Image.open(f"{site}/firstclick/{st['file']}").convert("RGB").resize((W, 600)); lines = []
        if st["absent"]:
            lines += [(t, (17, 17, 17)) for t in textwrap.wrap("Absent: there's no case study on the site, so there's nothing to click for this task.", 82)]
        for c in st["candidates"]:
            where = "" if c["inView"] else (" (below the first screen)" if c["found"] else " (not found)")
            pred = " · predicted first click" if c["rank"] == 1 else ""
            lines += [(t, COL[c["likelihood"]]) for t in textwrap.wrap(f"{c['rank']}. {c['name']}: {c['likelihood']}{pred}{where}", 82, subsequent_indent="    ")]
        task = textwrap.wrap(st["task"] or "", 88)
        p = Image.new("RGB", (W, 48 + len(task) * 22 + 8 + 600 + 14 + len(lines) * 27 + 18), "white"); dr = ImageDraw.Draw(p)
        title = f"Stage {st['stage']} · {NAMES[st['stage']]}"; dr.text((0, 8), title, fill=(17, 17, 17), font=fb)
        if st["contested"]:
            tw = dr.textlength(title, font=fb); dr.rounded_rectangle((tw + 14, 6, tw + 30 + dr.textlength("Contested", font=fs), 34), 6, fill=(185, 28, 28)); dr.text((tw + 22, 10), "Contested", fill="white", font=fs)
        y = 40
        for t in task: dr.text((0, y), t, fill=(75, 85, 99), font=fs); y += 22
        y += 8; p.paste(im, (0, y)); y += 614
        for t, c in lines: dr.text((0, y), t, fill=c, font=fr); y += 27
        panels.append(p)
    gap = 28; rows = (len(panels) + 1) // 2; rowh = [max(p.height for p in panels[r * 2:r * 2 + 2]) for r in range(rows)]
    sheet = Image.new("RGB", (W * 2 + gap, 70 + sum(rowh) + gap * rows), "white"); dr = ImageDraw.Draw(sheet)
    dr.text((0, 12), f"Predicted first clicks · {d['site']} · judgement, triage not test results", fill=(17, 17, 17), font=fb)
    dr.text((0, 42), "Blue = likely · amber = possible · grey dashed = unlikely · the thick box is the predicted first click", fill=(75, 85, 99), font=fs)
    y = 70
    for r in range(rows):
        for k, p in enumerate(panels[r * 2:r * 2 + 2]): sheet.paste(p, (k * (W + gap), y))
        y += rowh[r] + gap
    out = f"{site}/firstclick/firstclick-{os.path.basename(os.path.normpath(site))}.png"; sheet.save(out, optimize=True); print(out, sheet.size)
