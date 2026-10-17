import fs from 'fs';

let code = fs.readFileSync('decompiled_slater/deobfuscated.js', 'utf8');

// 1. Replace remote hero-video-new with local /assets/hero-video/
code = code.replace(
  /https:\/\/assets\.sondaven\.com\/hero-video-new\/\$\{String\(t\)\.padStart\(3, "0"\)\}\.webp/g,
  '`/assets/${isDayTime ? "hero-video" : "hero-video-dark"}/${String(t).padStart(3, "0")}.webp`'
);

// 2. Replace remote scenes with local /assets/scenes/
code = code.replace(/https:\/\/assets\.sondaven\.com\/scenes\//g, '/assets/scenes/');

// 3. Replace remote sondaven.com assets with local /assets/
code = code.replace(/https:\/\/assets\.sondaven\.com\//g, '/assets/');

// 4. Replace remote cdn.prod.website-files.com avif/images with local /assets/
code = code.replace(
  /https:\/\/cdn\.prod\.website-files\.com\/6940a0abd735a1e3a640d042\/[a-f0-9]+_([a-zA-Z0-9_\-]+\.avif)/g,
  '/assets/$1'
);

// Also handle the filenames with hash prefix that exist in public/assets
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697bfe61104a60fa63e1f7b2_19804f2b1c9ceedd0cd04ed721b36ef6_intro_mauntain.avif',
  '/assets/697bfe61104a60fa63e1f7b2_19804f2b1c9ceedd0cd04ed721b36ef6_intro_mauntain.avif'
);
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697e2b5ea694ae5f751655ec_95efa55632b52e963bc2cbf7f0447122_hero_hay.avif',
  '/assets/697e2b5ea694ae5f751655ec_95efa55632b52e963bc2cbf7f0447122_hero_hay.avif'
);
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697c00f3737120e569370c7a_98c738340828600251b32ef432d3de26_hero_mauntain-bg.avif',
  '/assets/697c00f3737120e569370c7a_98c738340828600251b32ef432d3de26_hero_mauntain-bg.avif'
);
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697656035b94c920c471d4de_ac179cd8d062e41260b178efc691b568_benefits-intro_hole.avif',
  '/assets/697656035b94c920c471d4de_ac179cd8d062e41260b178efc691b568_benefits-intro_hole.avif'
);
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/69ca6aa1e460a649ef2a7972_fin_mounain.avif',
  '/assets/69ca6aa1e460a649ef2a7972_fin_mounain.avif'
);
code = code.replace(
  'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697eaab2cfc366a5bf4bd727_f73b5dcc1687f5e65745b9063965659a_error_bg.avif',
  '/assets/697eaab2cfc366a5bf4bd727_f73b5dcc1687f5e65745b9063965659a_error_bg.avif'
);

// Save mapped production code
fs.writeFileSync('src/sondaven_production.js', code);
console.log('Successfully written src/sondaven_production.js (size:', code.length, 'bytes)');
