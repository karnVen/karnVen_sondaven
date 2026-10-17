import fs from 'fs';

const html = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');
const styles = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) || [];
console.log(`Found ${styles.length} style blocks:`);

styles.forEach((s, idx) => {
  console.log(`\n=== STYLE BLOCK ${idx} (Length: ${s.length}) ===`);
  console.log(s.slice(0, 1500));
});
