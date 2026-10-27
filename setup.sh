#!/usr/bin/env bash
# One-off setup for the capture tools: Node packages and Playwright's Chromium.
# Needs Node 20+, Python 3 with the venv module (for NetworkX and Pillow) and ffmpeg (for video MP4s).
set -euo pipefail
cd "$(dirname "$0")/tools"
npm install --no-audit --no-fund
npx playwright install chromium
# NetworkX (link graphs) and Pillow (first-click images) live in a venv beside the tools.
if python3 -m venv .venv 2>/dev/null; then
  .venv/bin/pip install --quiet networkx numpy scipy pillow
else
  echo "Note: could not create a Python venv (try: sudo apt install python3-venv). Needed for 'studio graph' and first-click images."
fi
command -v ffmpeg >/dev/null || echo "Note: install ffmpeg so videos are also saved as MP4."
echo "Research Studio tools are ready: node $(pwd)/studio.mjs help"
