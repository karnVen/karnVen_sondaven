import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching https://sondaven.com/en ...');
  const html = await fetchUrl('https://sondaven.com/en');
  fs.writeFileSync(path.join(__dirname, 'sondaven_raw.html'), html, 'utf8');
  console.log('Saved raw HTML, size:', html.length);

  // Extract all CDN URLs
  const cdnMatches = html.match(/https:\/\/cdn\.prod\.website-files\.com\/[^\s"'>]+/g) || [];
  const uniqueUrls = [...new Set(cdnMatches.map(u => u.replace(/["'\\]/g, '')))];
  console.log(`Found ${uniqueUrls.length} unique CDN asset URLs.`);

  // Categorize
  const images = uniqueUrls.filter(u => /\.(webp|png|jpg|jpeg|svg|gif)($|\?)/i.test(u));
  const scripts = uniqueUrls.filter(u => /\.js($|\?)/i.test(u));
  const styles = uniqueUrls.filter(u => /\.css($|\?)/i.test(u));
  const audioVideo = uniqueUrls.filter(u => /\.(mp3|mp4|webm|wav|ogg)($|\?)/i.test(u));
  const other = uniqueUrls.filter(u => !images.includes(u) && !scripts.includes(u) && !styles.includes(u) && !audioVideo.includes(u));

  console.log(`- Images/SVGs: ${images.length}`);
  console.log(`- Scripts: ${scripts.length}`);
  console.log(`- Stylesheets: ${styles.length}`);
  console.log(`- Audio/Video: ${audioVideo.length}`);
  console.log(`- Other/Data: ${other.length}`);

  // Also extract other scripts and asset links
  const allScriptTags = html.match(/<script[^>]*src="([^"]+)"[^>]*>/g) || [];
  console.log('Script tags count:', allScriptTags.length);

  const manifest = {
    images,
    scripts,
    styles,
    audioVideo,
    other,
    allScriptTags
  };

  fs.writeFileSync(path.join(__dirname, 'asset_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Saved asset manifest to scripts/asset_manifest.json');
}

run().catch(console.error);
