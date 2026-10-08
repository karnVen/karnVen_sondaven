import fs from 'fs';

const rawHtml = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');

// Replace remote CDN video and audio links with local downloaded assets
let fullHtml = rawHtml
  .replace(/https:\/\/assets\.sondaven\.com\/carpathian-whispers-hutsul-ambient\.mp3/g, '/assets/carpathian-whispers-hutsul-ambient.mp3')
  .replace(/https:\/\/assets\.sondaven\.com\/preloader_sheep\.mp4/g, '/assets/preloader_sheep.mp4')
  .replace(/https:\/\/assets\.sondaven\.com\/son-daven_short\.mp4/g, '/assets/son-daven_short.mp4')
  .replace(/https:\/\/assets\.sondaven\.com\/son-daven\.MP4/g, '/assets/son-daven.MP4')
  .replace(/https:\/\/assets\.sondaven\.com\/scenes\//g, '/assets/scenes/')
  .replace(/https:\/\/assets\.sondaven\.com\/hero-video\//g, '/assets/hero-video/')
  .replace(/https:\/\/assets\.sondaven\.com\/hero-video-dark\//g, '/assets/hero-video-dark/');

// Remove external Slater script loader and replace with our local main.js module
fullHtml = fullHtml.replace(
  /<script>document\.addEventListener\("DOMContentLoaded",[\s\S]*?<\/script>\s*<!-- Google Tag Manager/i,
  '<script type="module" src="/main.js"></script>\n<!-- Google Tag Manager'
);

// Ensure style.css is linked in the head
if (!fullHtml.includes('<link rel="stylesheet" href="/style.css">') && !fullHtml.includes('href="/style.css"')) {
  fullHtml = fullHtml.replace('</head>', '  <link rel="stylesheet" href="/style.css">\n</head>');
}

fs.writeFileSync('index.html', fullHtml, 'utf8');
console.log('Successfully updated index.html with full 17-section layout, size:', fullHtml.length);
