import fs from 'fs';

const html = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  const fullTag = match[0];
  const srcMatch = fullTag.match(/src=["']([^"']+)["']/i);
  console.log(`Script ${i}:`, srcMatch ? srcMatch[1] : `[inline ${match[1].length} chars] -> ${match[1].slice(0, 80).replace(/\s+/g, ' ')}`);
  i++;
}
