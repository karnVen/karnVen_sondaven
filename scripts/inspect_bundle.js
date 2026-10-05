import fs from 'fs';

const code = fs.readFileSync('scripts/sondaven_bundle.js', 'utf8');

// Find all URLs
const urls = code.match(/https?:\/\/[^\s"'`<>]+/g) || [];
console.log('URLs in bundle:', [...new Set(urls)]);

// Find all asset paths
const assetPaths = code.match(/["'`]([^"'`]+\.(mp3|mp4|bin|webp|png|jpg|svg|json|wasm))["'`]/gi) || [];
console.log('Asset paths in bundle:', [...new Set(assetPaths)]);

// Search for shaders / three / canvas functions
const canvasMatches = code.match(/[a-zA-Z0-9_$]+(\.initCanvas|\.createScene|ActiveFrame|Audio|Sound|lenis|ScrollTrigger|Barba)[a-zA-Z0-9_$.]*/gi) || [];
console.log('Key animation/framework tokens:', [...new Set(canvasMatches)]);
