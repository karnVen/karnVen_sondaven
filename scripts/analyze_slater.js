import fs from 'fs';

const code = fs.readFileSync('scripts/slater_full_bundle.js', 'utf8');

// Find all URLs inside the bundle
const urls = code.match(/https?:\/\/[^\s"'`<>]+/g) || [];
console.log('URLs in custom bundle:', [...new Set(urls)]);

// Find all asset paths
const assets = code.match(/["'`]([^"'`]+\.(mp3|mp4|bin|webp|png|jpg|svg|json|wasm))["'`]/gi) || [];
console.log('Asset paths in custom bundle:', [...new Set(assets)]);

// Extract module exports or function names
const matches = code.match(/class\s+([A-Za-z0-9_$]+)|function\s+([A-Za-z0-9_$]+)|const\s+([A-Za-z0-9_$]+)\s*=/g) || [];
console.log('Top functions/classes:', matches.slice(0, 50));
