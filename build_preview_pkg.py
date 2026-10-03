#!/usr/bin/env python3
"""Build a trimmed preview copy of the site for Vercel preview deploy.

- Excludes: node_modules, .next, .git, package-lock.json, app/apparel/
- Converts public/moremi/*.png over 90KB to WebP (preview-only) and rewrites refs
- Drops other files over 90KB (main-site media not needed for the /moremi preview)
The real repo is untouched; everything happens in /tmp/moremi-preview/.
"""
import os, re, shutil, subprocess

SRC = "/home/hatch/workspace/silk-studio-site"
DST = "/tmp/moremi-preview"
LIMIT = 90 * 1024

shutil.rmtree(DST, ignore_errors=True)

def ignore(d, names):
    return [n for n in names if n in ("node_modules", ".next", ".git")]

shutil.copytree(SRC, DST, ignore=ignore)
print("copied")

# 1. drop un-uploadable / unneeded big things
shutil.rmtree(os.path.join(DST, "app/apparel"), ignore_errors=True)
for f in ["package-lock.json", "build-moremi-port.py", "deploy_preview.py"]:
    p = os.path.join(DST, f)
    if os.path.exists(p):
        os.remove(p)

# 2. optimize big moremi pngs -> webp, rewrite refs
from PIL import Image
converted = {}
moremi_dir = os.path.join(DST, "public/moremi")
for nm in os.listdir(moremi_dir):
    p = os.path.join(moremi_dir, nm)
    if not nm.lower().endswith(".png") or os.path.getsize(p) <= LIMIT:
        continue
    im = Image.open(p).convert("RGBA")
    im.thumbnail((640, 640), Image.LANCZOS)
    webp_nm = nm[:-4] + ".webp"
    im.save(os.path.join(moremi_dir, webp_nm), "WEBP", quality=80)
    os.remove(p)
    converted[nm] = webp_nm
    print(f"  {nm} -> {webp_nm}")

page = os.path.join(DST, "app/moremi/page.tsx")
t = open(page).read()
for old, new in converted.items():
    t = t.replace(f"/moremi/{old}", f"/moremi/{new}")
open(page, "w").write(t)

layout = os.path.join(DST, "app/moremi/layout.tsx")
t = open(layout).read()
for old, new in converted.items():
    t = t.replace(f"/moremi/{old}", f"/moremi/{new}")
open(layout, "w").write(t)

# 3. drop remaining oversize files (not needed for /moremi preview)
dropped = []
for root, dirs, names in os.walk(DST):
    for nm in names:
        p = os.path.join(root, nm)
        if os.path.getsize(p) > LIMIT:
            dropped.append(os.path.relpath(p, DST))
            os.remove(p)
print(f"dropped {len(dropped)} oversize files:")
for d in sorted(dropped)[:20]:
    print("  ", d)

# 3b. preview-only env placeholders (2026-10-03). The project's real env vars
# are production-scoped, so preview builds crash at build time (e.g.
# `new Resend(undefined)`). These harmless placeholders let the preview build;
# production is untouched. MUST live in this script — DST is wiped on rebuild.
with open(os.path.join(DST, ".env"), "w") as f:
    f.write(
        "RESEND_API_KEY=preview-placeholder\n"
        "NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co\n"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=preview-placeholder\n"
        "TURNSTILE_SECRET_KEY=preview-placeholder\n"
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY=preview-placeholder\n"
        "TURNSTILE_ENFORCE=false\n"
        "CLOUDINARY_API_KEY=preview-placeholder\n"
        "CLOUDINARY_API_SECRET=preview-placeholder\n"
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=preview-placeholder\n"
        "GEMINI_API_KEY=preview-placeholder\n"
        "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=preview-placeholder\n"
        "NEXT_PUBLIC_SITE_URL=https://preview.local\n"
    )
print("wrote preview .env placeholders")

# 4. final inventory
files = []
for root, dirs, names in os.walk(DST):
    for nm in names:
        files.append(os.path.relpath(os.path.join(root, nm), DST))
big = [f for f in files if os.path.getsize(os.path.join(DST, f)) > LIMIT]
print(f"final: {len(files)} files, oversize remaining: {len(big)}")
assert not big, big
