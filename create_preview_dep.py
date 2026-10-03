#!/usr/bin/env python3
"""Create the preview deployment from already-uploaded files (no `target`
-> Vercel treats it as a preview deployment with a unique URL)."""
import hashlib, json, os, subprocess, sys

SITE = "/tmp/moremi-preview"
VERCEL = "/opt/hatch/bin/vercel"

def call_tool(name, args):
    p = subprocess.run(
        [VERCEL, "call-tool", "--name", name,
         "--arguments-json", json.dumps(args)],
        capture_output=True, text=True, timeout=300,
    )
    out = json.loads(p.stdout)
    content = out["result"]["content"][0]
    if not out.get("ok") or out["result"].get("isError"):
        print("FAILED:", content["text"][:600], file=sys.stderr)
        sys.exit(1)
    return json.loads(content["text"])["result"]

files = []
for root, dirs, names in os.walk(SITE):
    for nm in names:
        full = os.path.join(root, nm)
        rel = os.path.relpath(full, SITE)
        raw = open(full, "rb").read()
        files.append({"file": rel,
                      "sha": hashlib.sha1(raw).hexdigest(),
                      "size": len(raw)})
files.sort(key=lambda f: f["file"])
print(f"{len(files)} files")

dep = call_tool("create_deployment", {
    "forceNew": "1",
    "requestBody": {
        "name": "silk-studio",
        "projectSettings": {"framework": "nextjs"},
        "files": files,
    },
})
print("id:", dep.get("id"))
print("url:", dep.get("url"))
print("target:", dep.get("target"))
print("readyState:", dep.get("readyState"))
json.dump(dep, open("/tmp/preview-dep.json", "w"), indent=1)
