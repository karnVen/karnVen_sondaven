/**
 * ============================================================================
 * SON DAVEN ASSET DOWNLOADER PIPELINE
 * ============================================================================
 * Usage:
 *   node scripts/download_assets.js --hero
 *   node scripts/download_assets.js --all
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Helper to download a single file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // File already exists
      resolve({ url, status: 'cached' });
      return;
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return resolve({ url, status: `failed (${res.statusCode})` });
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ url, status: 'downloaded' });
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve({ url, status: `error: ${err.message}` });
    });
  });
}

// Download hero frames (Day + Night)
async function downloadHeroFrames() {
  console.log('--- Downloading 120 Daytime Hero Frames ---');
  const dayDir = path.join(ROOT, 'public', 'assets', 'hero-video');
  for (let i = 0; i < 120; i++) {
    const frameIndex = String(i).padStart(3, '0');
    const url = `https://assets.sondaven.com/hero-video/${frameIndex}.webp`;
    const dest = path.join(dayDir, `${frameIndex}.webp`);
    process.stdout.write(`\r[Day] Frame ${i + 1}/120 (${frameIndex}.webp)...`);
    await downloadFile(url, dest);
  }
  console.log('\nDaytime frames complete.');

  console.log('\n--- Downloading 120 Nighttime Hero Frames ---');
  const nightDir = path.join(ROOT, 'public', 'assets', 'hero-video-dark');
  for (let i = 0; i < 120; i++) {
    const frameIndex = String(i).padStart(3, '0');
    const url = `https://assets.sondaven.com/hero-video-dark/${frameIndex}.webp`;
    const dest = path.join(nightDir, `${frameIndex}.webp`);
    process.stdout.write(`\r[Night] Frame ${i + 1}/120 (${frameIndex}.webp)...`);
    await downloadFile(url, dest);
  }
  console.log('\nNighttime frames complete.');
}

// Download Audio
async function downloadAudio() {
  console.log('\n--- Downloading Ambient Audio Soundtrack ---');
  const audioUrl = 'https://assets.sondaven.com/carpathian-whispers-hutsul-ambient.mp3';
  const dest = path.join(ROOT, 'public', 'assets', 'carpathian-whispers-hutsul-ambient.mp3');
  const res = await downloadFile(audioUrl, dest);
  console.log(`Audio: ${res.status}`);
}

(async () => {
  console.log('==============================================');
  console.log('  SON DAVEN ASSET DOWNLOAD PIPELINE');
  console.log('==============================================\n');

  await downloadAudio();
  await downloadHeroFrames();

  console.log('\nAll assets downloaded into public/assets/ directory.');
})();
