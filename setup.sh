#!/usr/bin/env bash
# One-off setup for the capture tools: Node packages and Playwright's Chromium.
# Needs Node 20+, Python 3 with Pillow (for the first-click images) and ffmpeg (for video MP4s).
set -euo pipefail
cd "$(dirname "$0")/tools"
npm install --no-audit --no-fund
npx playwright install chromium
python3 -c "import PIL" 2>/dev/null || echo "Note: install Pillow for first-click images (pip install pillow, or your OS package)."
command -v ffmpeg >/dev/null || echo "Note: install ffmpeg so videos are also saved as MP4."
echo "Research Studio tools are ready: node $(pwd)/studio.mjs help"
