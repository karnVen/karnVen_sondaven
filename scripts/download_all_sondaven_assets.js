import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function download(url, dest) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      return resolve({ url, status: 'cached' });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve({ url, status: `failed (${res.statusCode})` });
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ url, status: 'ok' });
      });
    });

    req.on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve({ url, status: `err: ${err.message}` });
    });
  });
}

const mediaUrls = [
  'https://assets.sondaven.com/carpathian-whispers-hutsul-ambient.mp3',
  'https://assets.sondaven.com/son-daven.MP4',
  'https://assets.sondaven.com/preloader_sheep.mp4',
  'https://assets.sondaven.com/son-daven_short.mp4',
  'https://assets.sondaven.com/scenes/hero_tree-c.mp4',
  'https://assets.sondaven.com/scenes/hero_sheeps-c.mp4',
  'https://assets.sondaven.com/scenes/claudes_02.mp4',
  'https://assets.sondaven.com/scenes/birds_04.hevc.mp4',
  'https://assets.sondaven.com/scenes/claudes_03.mp4',
  'https://assets.sondaven.com/scenes/birds_03.hevc.mp4',
  'https://assets.sondaven.com/scenes/prolog-l-c.mp4',
  'https://assets.sondaven.com/scenes/prolog-r-c.mp4',
  'https://assets.sondaven.com/scenes/birds_02-c.mp4',
  'https://assets.sondaven.com/scenes/about_stork-c.mp4',
  'https://assets.sondaven.com/scenes/seasons_summer.mp4',
  'https://assets.sondaven.com/scenes/seasons_winter.mp4',
  'https://assets.sondaven.com/scenes/benefits-intro_persons-cc.mp4',
  'https://assets.sondaven.com/scenes/benefits-intro_birds-c.mp4',
  'https://assets.sondaven.com/scenes/benefits-outro_sheeps.mp4',
  'https://assets.sondaven.com/scenes/birds_05-c.mp4',
  'https://assets.sondaven.com/scenes/benefits-outro_tree-c.mp4',
  'https://assets.sondaven.com/scenes/claudes_01.mp4',
  'https://assets.sondaven.com/scenes/factoids_river-c.mp4',
  'https://assets.sondaven.com/scenes/factoids_sheeps-c.mp4',
  'https://assets.sondaven.com/scenes/factoids_person-cc.mp4',
  'https://assets.sondaven.com/scenes/footer_mountain.hevc.mp4',
  'https://assets.sondaven.com/scenes/footer_sheeps-c.mp4',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697bfe61104a60fa63e1f7b2_19804f2b1c9ceedd0cd04ed721b36ef6_intro_mauntain.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697e2b5ea694ae5f751655ec_95efa55632b52e963bc2cbf7f0447122_hero_hay.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697c00f3737120e569370c7a_98c738340828600251b32ef432d3de26_hero_mauntain-bg.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697656035b94c920c471d4de_ac179cd8d062e41260b178efc691b568_benefits-intro_hole.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/69ca6aa1e460a649ef2a7972_fin_mounain.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697eaab2cfc366a5bf4bd727_f73b5dcc1687f5e65745b9063965659a_error_bg.avif',
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/69f28364671bf58d2d6aed7a_preloader_sheep-1.avif'
];

async function run() {
  console.log(`Starting download of ${mediaUrls.length} key media & scene assets...`);
  const publicDir = path.join(ROOT, 'public', 'assets');

  for (let i = 0; i < mediaUrls.length; i++) {
    const u = mediaUrls[i];
    const urlObj = new URL(u);
    const filename = path.basename(urlObj.pathname);
    const subfolder = urlObj.pathname.includes('/scenes/') ? 'scenes' : '';
    const targetPath = path.join(publicDir, subfolder, filename);

    process.stdout.write(`[${i+1}/${mediaUrls.length}] ${filename}... `);
    const res = await download(u, targetPath);
    console.log(res.status);
  }

  console.log('\n--- Key Media Download Complete ---');
}

run().catch(console.error);
