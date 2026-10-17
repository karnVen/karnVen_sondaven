import fs from 'fs';

const code = fs.readFileSync('decompiled_slater/deobfuscated.js', 'utf8');
const urls = code.match(/https?:\/\/[^\s"'`\)]+/g) || [];
const uniqueUrls = [...new Set(urls)];
console.log('Total unique URLs in decompiled code:', uniqueUrls.length);
uniqueUrls.forEach((u) => console.log(u));
