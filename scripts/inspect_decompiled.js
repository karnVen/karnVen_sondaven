import fs from 'fs';

const code = fs.readFileSync('decompiled_slater/deobfuscated.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('function initScrollVideo') ||
    l.includes('function initCanvasEffect') ||
    l.includes('function createCanvasInstance') ||
    l.includes('function initSceneManager') ||
    l.includes('function initAllScenes') ||
    l.includes('function initScripts')
  ) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});
