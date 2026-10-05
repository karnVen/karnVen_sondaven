import fs from 'fs';

const html = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');
const urls = html.match(/https?:\/\/[^\s"'>]+/g) || [];
const filtered = urls.filter(u => 
  u.includes('sondaven') || 
  /\.(mp4|webm|mp3|bin|wasm|json|webp|avif|jpg|png|svg|woff|woff2)/i.test(u)
);

const unique = [...new Set(filtered.map(u => u.replace(/["'\\]/g, '')))];
console.log(`Total filtered URLs: ${unique.length}`);
console.log(JSON.stringify(unique, null, 2));

fs.writeFileSync('scripts/all_media_urls.json', JSON.stringify(unique, null, 2), 'utf8');
