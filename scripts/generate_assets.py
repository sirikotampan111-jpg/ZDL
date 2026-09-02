#!/usr/bin/env python3
"""Generate ZDL brand assets: OG image + placeholder images."""
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = "/home/z/my-project/public"
VIOLET = (124, 58, 237)
VIOLET_L = (139, 92, 246)
CYAN = (34, 211, 238)
DARK = (10, 10, 15)
DARK2 = (18, 18, 28)

DEJAVU_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DEJAVU = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def diag_gradient(size, c1, c2, c3=None):
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        for x in range(0, w, 1):
            t = (x / w * 0.65 + (1 - y / h) * 0.35)
            if c3 is None:
                r = int(c1[0] + (c2[0] - c1[0]) * t)
                g = int(c1[1] + (c2[1] - c1[1]) * t)
                b = int(c1[2] + (c2[2] - c1[2]) * t)
            else:
                if t < 0.5:
                    tt = t / 0.5
                    r = int(c1[0] + (c2[0] - c1[0]) * tt)
                    g = int(c1[1] + (c2[1] - c1[1]) * tt)
                    b = int(c1[2] + (c2[2] - c1[2]) * tt)
                else:
                    tt = (t - 0.5) / 0.5
                    r = int(c2[0] + (c3[0] - c2[0]) * tt)
                    g = int(c2[1] + (c3[1] - c2[1]) * tt)
                    b = int(c2[2] + (c3[2] - c2[2]) * tt)
            px[x, y] = (r, g, b)
    return img


def glow_blobs(img, blobs):
    """blobs: list of (cx, cy, radius, color, alpha)"""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for cx, cy, rad, color, alpha in blobs:
        d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(120))
    img = img.convert("RGBA")
    img.alpha_composite(layer)
    return img.convert("RGB")


def draw_z_mark(img, cx, cy, size, color=(255, 255, 255)):
    """Draw geometric Z mark centered at cx,cy with overall size (width)."""
    d = ImageDraw.Draw(img)
    s = size / 224.0  # scale from 224 design space
    # polygon points in design space (224x224 box, origin at top-left of Z)
    pts = [
        (0, 10), (216, 10), (216, 74), (114, 142), (216, 142),
        (216, 206), (0, 206), (0, 142), (102, 74), (0, 74),
    ]
    ox, oy = cx - size / 2, cy - size / 2
    poly = [(ox + p[0] * s, oy + p[1] * s) for p in pts]
    d.polygon(poly, fill=color)


def rounded_rect_img(size, radius, fill):
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=fill)
    return img


# ---------------------------------------------------------------- OG IMAGE
def make_og():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), DARK)
    img = glow_blobs(img, [
        (180, 120, 320, VIOLET, 110),
        (1050, 520, 340, CYAN, 80),
        (900, 80, 260, VIOLET_L, 70),
    ])
    d = ImageDraw.Draw(img)
    # subtle grid
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)

    # logo mark card
    mark = diag_gradient((128, 128), VIOLET_L, CYAN)
    mask = Image.new("L", (128, 128), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, 127, 127], radius=30, fill=255)
    img.paste(mark, (72, 88), mask)
    draw_z_mark(img, 72 + 64, 88 + 64, 84)

    # brand text
    f_brand = ImageFont.truetype(DEJAVU_BOLD, 64)
    f_small = ImageFont.truetype(DEJAVU_BOLD, 26)
    f_body = ImageFont.truetype(DEJAVU, 30)
    f_tag = ImageFont.truetype(DEJAVU_BOLD, 40)

    d.text((232, 92), "ZDL", font=f_brand, fill=(255, 255, 255))
    w = d.textlength("ZDL", font=f_brand)
    d.text((232 + w + 18, 116), "ZHENG DIGITAL LAB", font=f_small, fill=(160, 160, 180))

    d.text((72, 280), "Build Digital Solutions", font=f_tag, fill=(255, 255, 255))
    d.text((72, 336), "That Move Your Business Forward.", font=f_tag, fill=(167, 139, 250))

    d.text((72, 430), "Web & App Development  •  Digital Solutions", font=f_body, fill=(190, 190, 205))
    d.text((72, 476), "zdl.my.id", font=f_body, fill=(34, 211, 238))

    img.save(f"{OUT}/og-image.png", quality=92)
    print("og-image.png done")


# ------------------------------------------------------ PORTFOLIO PLACEHOLDERS
CATS = {
    "website": ("Website", "WX"),
    "web-app": ("Web App", "WA"),
    "mobile-app": ("Mobile App", "MA"),
    "e-commerce": ("E-Commerce", "EC"),
    "saas": ("SaaS", "SA"),
    "dashboard": ("Dashboard", "DB"),
    "cms": ("CMS", "CM"),
    "game": ("Game", "GM"),
    "automation": ("Automation", "AU"),
    "other": ("Project", "PR"),
}


def make_placeholder(key, label, abbr):
    W, H = 1200, 800
    seed = sum(ord(c) for c in key) % 3
    if seed == 0:
        base = Image.new("RGB", (W, H), DARK)
        img = glow_blobs(base, [(150, 650, 300, VIOLET, 120), (1050, 150, 320, CYAN, 70)])
    elif seed == 1:
        base = Image.new("RGB", (W, H), DARK2)
        img = glow_blobs(base, [(1000, 620, 340, VIOLET, 110), (200, 180, 300, CYAN, 60)])
    else:
        base = Image.new("RGB", (W, H), (12, 12, 20))
        img = glow_blobs(base, [(600, 400, 420, VIOLET, 80), (1050, 100, 260, CYAN, 55)])

    d = ImageDraw.Draw(img)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 5), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 5), width=1)

    # central card with abbr
    card = diag_gradient((360, 360), VIOLET_L, CYAN)
    mask = Image.new("L", (360, 360), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, 359, 359], radius=72, fill=255)
    cx, cy = W // 2, H // 2 - 70
    img.paste(card, (cx - 180, cy - 180), mask)

    f_abbr = ImageFont.truetype(DEJAVU_BOLD, 130)
    tw = d.textlength(abbr, font=f_abbr)
    d.text((cx - tw / 2, cy - 85), abbr, font=f_abbr, fill=(255, 255, 255))

    # label
    f_label = ImageFont.truetype(DEJAVU_BOLD, 54)
    tw = d.textlength(label, font=f_label)
    d.text((cx - tw / 2, cy + 210), label, font=f_label, fill=(235, 235, 245))

    f_sub = ImageFont.truetype(DEJAVU, 28)
    sub = "ZDL  •  Zheng Digital Lab  •  zdl.my.id"
    tw = d.textlength(sub, font=f_sub)
    d.text((cx - tw / 2, H - 90), sub, font=f_sub, fill=(150, 150, 170))

    img.save(f"{OUT}/placeholders/portfolio-{key}.png", quality=88)
    print(f"portfolio-{key}.png done")


# ---------------------------------------------------------- JOURNAL COVERS
def make_journal(idx, title_hint):
    W, H = 1200, 675
    base = Image.new("RGB", (W, H), DARK)
    hues = [VIOLET, CYAN, VIOLET_L, (52, 211, 153)]
    img = glow_blobs(base, [
        (150 + idx * 180, 500, 320, hues[idx % 4], 110),
        (1050 - idx * 120, 160, 300, hues[(idx + 1) % 4], 75),
    ])
    d = ImageDraw.Draw(img)
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 5), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 5), width=1)

    d.text((72, 72), "ZDL JOURNAL", font=ImageFont.truetype(DEJAVU_BOLD, 30), fill=(167, 139, 250))
    d.text((72, 540), title_hint, font=ImageFont.truetype(DEJAVU_BOLD, 46), fill=(245, 245, 250))
    d.text((72, 608), "zdl.my.id/journal", font=ImageFont.truetype(DEJAVU, 26), fill=(140, 140, 165))

    # decorative code lines
    f_code = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 22)
    lines = ["const project = await zdl.build({", "  quality: 'premium',", "  support: 'ongoing'", "})"]
    y = 150
    for ln in lines:
        d.text((900, y), ln, font=f_code, fill=(120, 220, 232))
        y += 34
    img.save(f"{OUT}/placeholders/journal-{idx}.png", quality=88)
    print(f"journal-{idx}.png done")


if __name__ == "__main__":
    make_og()
    for k, (label, abbr) in CATS.items():
        make_placeholder(k, label, abbr)
    make_journal(0, "Web Development")
    make_journal(1, "Digital Growth")
    make_journal(2, "Business System")
    make_journal(3, "Technology")
    print("ALL DONE")
