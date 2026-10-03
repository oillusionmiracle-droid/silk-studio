#!/usr/bin/env python3
"""Preview-deploy the silk-studio Next.js site (with /moremi) to Vercel.

Target is PREVIEW only — production (silkstudios.com.ng) is never touched.
"""
import base64, hashlib, json, subprocess, sys, os

SITE = "/tmp/moremi-preview"
VERCEL = "/opt/hatch/bin/vercel"

EXCLUDE_DIRS = set()
EXCLUDE_FILES = set()

def call_tool(name, args):
    p = subprocess.run(
        [VERCEL, "call-tool", "--name", name,
         "--arguments-json", json.dumps(args)],
        capture_output=True, text=True, timeout=300,
    )
    if p.returncode != 0:
        print("TOOL ERROR", name, p.stderr[:300], file=sys.stderr)
        sys.exit(1)
    out = json.loads(p.stdout)
    if not out.get("ok"):
        print("NOT OK", name, p.stdout[:300], file=sys.stderr)
        sys.exit(1)
    content = out["result"]["content"][0]
    if out["result"].get("isError"):
        print("API ERROR:", content["text"][:500], file=sys.stderr)
        sys.exit(1)
    inner = json.loads(content["text"])
    return inner["result"]

# collect files
files = []
for root, dirs, names in os.walk(SITE):
    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
    for nm in names:
        if nm in EXCLUDE_FILES:
            continue
        full = os.path.join(root, nm)
        rel = os.path.relpath(full, SITE)
        files.append(rel)
files.sort()
total = sum(os.path.getsize(os.path.join(SITE, f)) for f in files)
print(f"{len(files)} files, {total/1e6:.1f} MB")

uploaded = []
for i, f in enumerate(files):
    path = os.path.join(SITE, f)
    raw = open(path, "rb").read()
    sha = hashlib.sha1(raw).hexdigest()
    b64 = base64.b64encode(raw).decode()
    res = call_tool("upload_file", {
        "requestBody": b64,
        "contentLength": len(raw),
        "xVercelDigest": sha,
    })
    # {} means already staged (sha dedupe) — not a failure
    url = res.get("urls", [None])[0] if isinstance(res, dict) else None
    got_sha = url.rstrip("/").split("/")[-1] if url else sha
    if got_sha != sha:
        print(f"SHA MISMATCH {f}", file=sys.stderr)
        sys.exit(1)
    uploaded.append({"file": f, "sha": sha, "size": len(raw)})
    if (i + 1) % 25 == 0 or i == len(files) - 1:
        print(f"  {i+1}/{len(files)} uploaded", flush=True)

print("creating PREVIEW deployment...", flush=True)
dep = call_tool("create_deployment", {
    "forceNew": "1",
    "requestBody": {
        "name": "silk-studio",
        "target": "preview",
        "projectSettings": {"framework": "nextjs"},
        "files": uploaded,
    },
})
print(json.dumps(dep, indent=2)[:2500])
