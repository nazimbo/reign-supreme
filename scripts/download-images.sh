#!/usr/bin/env bash
# Downloads Wikipedia portrait images to public/leaders/ and updates leaders.json photo paths
# Uses 400px thumbnail size (valid Wikimedia step; 320px is blocked)
# Usage: bash scripts/download-images.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LEADERS_JSON="$SCRIPT_DIR/../src/leaders.json"
OUTPUT_DIR="$SCRIPT_DIR/../public/leaders"

node - "$LEADERS_JSON" "$OUTPUT_DIR" <<'NODEEOF'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const leadersPath = process.argv[2];
const outputDir = process.argv[3];
fs.mkdirSync(outputDir, { recursive: true });

const leaders = JSON.parse(fs.readFileSync(leadersPath, 'utf8'));
let updated = 0, failed = 0, skipped = 0;

for (const leader of leaders) {
  if (!leader.photo || leader.photo.startsWith('/leaders/')) {
    console.log(`[${leader.id}] ${leader.name} — already local, skipping`);
    skipped++;
    continue;
  }

  // Replace thumbnail size with 400px (valid Wikimedia step)
  const url = leader.photo.replace(/\/\d+px-/, '/400px-');

  // Determine extension from URL
  const cleanUrl = url.split('?')[0];
  const match = cleanUrl.match(/\.(\w+)\/\d+px-/);
  let ext = match ? '.' + match[1].toLowerCase() : path.extname(cleanUrl) || '.jpg';
  if (!['.jpg','.jpeg','.png','.webp'].includes(ext)) ext = '.jpg';

  const filename = `${leader.id}${ext}`;
  const destPath = path.join(outputDir, filename);
  const localPath = `/leaders/${filename}`;

  process.stdout.write(`[${leader.id}] ${leader.name} ... `);
  try {
    execSync(
      `curl -sS -L --retry 3 --retry-delay 3 --max-time 30 ` +
      `-H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ` +
      `-H "Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8" ` +
      `-H "Accept-Language: en-US,en;q=0.9" ` +
      `-o ${JSON.stringify(destPath)} ` +
      JSON.stringify(url),
      { stdio: 'pipe' }
    );

    const stat = fs.statSync(destPath);
    if (stat.size < 1000) {
      const content = fs.readFileSync(destPath, 'utf8').slice(0, 80);
      fs.unlinkSync(destPath);
      throw new Error(`file too small (${stat.size}B): ${content.trim()}`);
    }
    leader.photo = localPath;
    updated++;
    console.log(`OK (${Math.round(stat.size/1024)}KB)`);
  } catch (e) {
    failed++;
    console.log(`FAILED: ${e.message.slice(0, 120)}`);
    try { fs.unlinkSync(destPath); } catch {}
  }

  // Polite delay to avoid rate limiting
  execSync('sleep 1');
}

fs.writeFileSync(leadersPath, JSON.stringify(leaders, null, 2) + '\n');
console.log(`\nDone — ${updated} downloaded, ${failed} failed, ${skipped} skipped.`);
NODEEOF
