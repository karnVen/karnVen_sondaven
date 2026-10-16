import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

console.log('--- Checking Canvas Hooks in index.html ---');
console.log('Has #hero-canvas:', html.includes('hero-canvas'));
console.log('Has #dither-canvas:', html.includes('dither-canvas'));
console.log('Has data-scroll-video:', html.includes('data-scroll-video'));
console.log('All canvas tags found:');
const canvases = html.match(/<canvas[^>]*>/g) || [];
canvases.forEach(c => console.log(' ', c));

console.log('\n--- Checking Season Slider in index.html ---');
console.log('Has season-summer:', html.includes('season-summer'));
console.log('Has data-line-animation:', html.includes('data-line-animation'));
console.log('Has season tags:');
const seasonMatches = html.match(/<[^>]+(season|summer|winter)[^>]*>/gi) || [];
seasonMatches.slice(0, 10).forEach(s => console.log(' ', s));

console.log('\n--- Checking Map in index.html ---');
console.log('Has [data-map]:', html.includes('data-map'));
console.log('Has [map]:', html.includes('map'));
console.log('Has [pin]:', html.includes('pin'));

console.log('\n--- Checking Sound Toggle in index.html ---');
console.log('Has [data-sound-toggle]:', html.includes('data-sound-toggle'));
console.log('Has sound toggle hooks:');
const soundMatches = html.match(/<[^>]+(sound|audio|equalizer)[^>]*>/gi) || [];
soundMatches.forEach(s => console.log(' ', s));
