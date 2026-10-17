import fs from 'fs';

const code = fs.readFileSync('decompiled_slater/deobfuscated.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('framesPromise')) {
    console.log(`Line ${i + 1}: ${l}`);
  }
});
