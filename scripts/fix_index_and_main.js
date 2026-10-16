import fs from 'fs';

// 1. Update index.html to use local stylesheet
let html = fs.readFileSync('index.html', 'utf8');

// Replace external Webflow CSS with local downloaded version
html = html.replace(
  /<link href="https:\/\/cdn\.prod\.website-files\.com\/[^"]+\.css"[^>]*>/,
  '<link href="/assets/sondaven.min.css" rel="stylesheet" type="text/css">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('1. Updated index.html with local /assets/sondaven.min.css');

// 2. Update main.js to bind to the authentic DOM selectors
let mainJs = fs.readFileSync('main.js', 'utf8');

// Replace #hero-canvas with [data-scroll-video] and container with [data-scroll-video-container]
mainJs = mainJs.replace("canvas: '#hero-canvas'", "canvas: '[data-scroll-video]'");
mainJs = mainJs.replace("container: '#hero-canvas-track'", "container: '[data-scroll-video-container]'");

fs.writeFileSync('main.js', mainJs, 'utf8');
console.log('2. Updated main.js with authentic hero canvas selectors [data-scroll-video]');
