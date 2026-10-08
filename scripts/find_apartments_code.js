import fs from 'fs';

const code = fs.readFileSync('scripts/slater_full_bundle.js', 'utf8');

// Find all function names
const funcs = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/g) || [];
console.log('All functions in bundle:', funcs.map(f => f.replace(/function\s+|\s*\(/g, '')));

// Search specifically for apartment, gallery, or tab switching logic
const aptMatch = code.match(/slider="studio"[\s\S]{1,1000}/g) || code.match(/apartments[\s\S]{1,1000}/gi) || [];
console.log('Apartment code snippet:', aptMatch.slice(0, 2));
