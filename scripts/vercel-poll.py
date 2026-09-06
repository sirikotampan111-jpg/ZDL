#!/usr/bin/env python3
"""ZDL — poll latest production deployment until READY/ERROR."""
import json, os, sys, time, urllib.request

VT = os.environ["VERCEL_TOKEN"]
TEAM = "team_IUsrSwkqoTj0vfT6FNUNkVFE"
PRJ = "prj_F9SMl9uMEcdqu8p7jkg6IC6NtLmE"

def get(url):
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {VT}"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

# find latest production deployment via project detail (v6 list is 403 for this token)
p = get(f"https://api.vercel.com/v9/projects/{PRJ.replace('prj_','') if False else 'zdl-my-id'}?teamId={TEAM}")
deps = [x for x in (p.get("latestDeployments") or []) if x.get("target") == "production"]
if not deps:
    print("no prod deployments found"); sys.exit(1)
dep = max(deps, key=lambda x: x.get("createdAt", 0))
uid = dep["uid"]
print("latest:", uid, "|", (dep.get("meta") or {}).get("githubCommitMessage", "")[:60], flush=True)

start = time.time()
last = ""
while time.time() - start < 500:
    dep = get(f"https://api.vercel.com/v13/deployments/{uid}?teamId={TEAM}")
    state = dep.get("readyState")
    line = f"[{int(time.time()-start)}s] {state}"
    if line != last:
        print(line, flush=True)
        last = line
    if state in ("READY", "ERROR", "CANCELED"):
        sys.exit(0 if state == "READY" else 2)
    time.sleep(15)
print("TIMEOUT")
sys.exit(3)
