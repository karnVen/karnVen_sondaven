import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve({ url, status: 'cached' });
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve({ url, status: `failed (${res.statusCode})` });
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ url, status: 'ok' });
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve({ url, status: `err: ${err.message}` });
    });
  });
}

async function run() {
  console.log('--- Downloading 120 Daytime Hero Frames ---');
  const dayDir = path.join(ROOT, 'public', 'assets', 'hero-video');
  for (let i = 0; i < 120; i++) {
    const idx = String(i).padStart(3, '0');
    const url = `https://assets.sondaven.com/hero-video/${idx}.webp`;
    const dest = path.join(dayDir, `${idx}.webp`);
    process.stdout.write(`\r[Day] ${i + 1}/120 (${idx}.webp)`);
    await downloadFile(url, dest);
  }
  console.log('\nDaytime frames done.');

  console.log('\n--- Downloading 120 Nighttime Hero Frames ---');
  const nightDir = path.join(ROOT, 'public', 'assets', 'hero-video-dark');
  for (let i = 0; i < 120; i++) {
    const idx = String(i).padStart(3, '0');
    const url = `https://assets.sondaven.com/hero-video-dark/${idx}.webp`;
    const dest = path.join(nightDir, `${idx}.webp`);
    process.stdout.write(`\r[Night] ${i + 1}/120 (${idx}.webp)`);
    await downloadFile(url, dest);
  }
  console.log('\nNighttime frames done.');
}

run().catch(console.error);
