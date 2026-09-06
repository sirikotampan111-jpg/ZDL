#!/usr/bin/env python3
"""ZDL — Process uploaded logo for site integration.
1. public/logo.png      : full 1536x1024 landscape original
2. public/logo-mark.png : center square crop -> 512x512 (navbar/footer mark)
3. src/app/icon.png     : same 512x512 square (favicon via app-router convention)
"""
from PIL import Image
import os

ROOT = "/home/z/my-project"
SRC = os.path.join(ROOT, "upload", "logo.png")

im = Image.open(SRC).convert("RGBA")
W, H = im.size
print(f"source: {W}x{H}")

# 1) full landscape original -> public/logo.png
im.save(os.path.join(ROOT, "public", "logo.png"), "PNG", optimize=True)

# 2) center square crop
side = min(W, H)
left = (W - side) // 2
top = (H - side) // 2
square = im.crop((left, top, left + side, top + side))
print(f"square crop: {square.size} (box: {left},{top},{left+side},{top+side})")

# resize to 512 for mark + favicon
sq512 = square.resize((512, 512), Image.LANCZOS)
sq512.save(os.path.join(ROOT, "public", "logo-mark.png"), "PNG", optimize=True)
sq512.save(os.path.join(ROOT, "src", "app", "icon.png"), "PNG", optimize=True)

for p in ["public/logo.png", "public/logo-mark.png", "src/app/icon.png"]:
    f = os.path.join(ROOT, p)
    print(f"{p}: {os.path.getsize(f)/1024:.0f} KB")
print("done")
