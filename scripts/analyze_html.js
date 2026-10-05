import fs from 'fs';

const html = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');

// Search for all data attributes
const dataAttrs = html.match(/data-[a-zA-Z0-9_-]+(="[^"]*")?/g) || [];
console.log('Unique data attributes:', [...new Set(dataAttrs)].slice(0, 40));

// Search for all audio/video/canvas elements
const canvasTags = html.match(/<canvas[^>]*>/gi) || [];
console.log('Canvas tags:', canvasTags);

const videoTags = html.match(/<video[^>]*>[\s\S]*?<\/video>/gi) || [];
console.log('Video tags:', videoTags);

const audioTags = html.match(/<audio[^>]*>[\s\S]*?<\/audio>/gi) || [];
console.log('Audio tags:', audioTags);

// Search for custom attributes like theme, scroll, slider, etc.
const customAttrs = html.match(/\s(theme|bg|scroll|slider|cursor|sound|preloader|barba)[^=\s>]*(="[^"]*")?/gi) || [];
console.log('Custom attributes:', [...new Set(customAttrs.map(s => s.trim()))].slice(0, 40));
