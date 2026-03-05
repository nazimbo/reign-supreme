// Downloads Wikipedia portrait images to public/leaders/ and updates photo paths in leaders.json
// Usage: node scripts/download-photos.mjs

import { readFileSync, writeFileSync, createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const leadersPath = join(__dirname, '../src/leaders.json');
const outputDir = join(__dirname, '../public/leaders');

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://en.wikipedia.org/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });

    request.on('error', (err) => { file.close(); reject(err); });
    file.on('error', (err) => { file.close(); reject(err); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getExtension(url) {
  const clean = url.split('?')[0];
  const match = clean.match(/\.(\w+)\/\d+px-/);
  if (match) return '.' + match[1].toLowerCase();
  const ext = extname(clean);
  return ext || '.jpg';
}

async function main() {
  const leaders = JSON.parse(readFileSync(leadersPath, 'utf8'));
  let updated = 0;
  let failed = 0;

  for (const leader of leaders) {
    if (!leader.photo || leader.photo.startsWith('/leaders/')) {
      console.log(`[${leader.id}] ${leader.name} — skipped`);
      continue;
    }

    const ext = getExtension(leader.photo);
    const localPath = `/leaders/${leader.id}${ext}`;
    const destPath = join(outputDir, `${leader.id}${ext}`);

    process.stdout.write(`[${leader.id}] ${leader.name} ... `);
    try {
      await downloadFile(leader.photo, destPath);
      leader.photo = localPath;
      updated++;
      console.log('OK');
    } catch (e) {
      failed++;
      console.log(`FAILED: ${e.message} (kept remote URL)`);
    }
    await sleep(12000);
  }

  writeFileSync(leadersPath, JSON.stringify(leaders, null, 2) + '\n');
  console.log(`\nDone — ${updated} downloaded, ${failed} failed. leaders.json updated.`);
}

main();
