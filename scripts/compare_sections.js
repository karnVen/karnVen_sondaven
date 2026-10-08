import fs from 'fs';

const rawHtml = fs.readFileSync('scripts/sondaven_raw.html', 'utf8');
const currentHtml = fs.readFileSync('index.html', 'utf8');

// Extract all sections from raw HTML
const rawSections = rawHtml.match(/<section[^>]*>[\s\S]*?<\/section>/gi) || [];
console.log(`Live site total <section> blocks: ${rawSections.length}`);

rawSections.forEach((s, idx) => {
  const idMatch = s.match(/id="([^"]+)"/);
  const classMatch = s.match(/class="([^"]+)"/);
  const headingMatch = s.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  console.log(`Section ${idx + 1}: ID=${idMatch ? idMatch[1] : 'none'}, Class=${classMatch ? classMatch[1] : 'none'}, Heading=${headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : 'none'}`);
});

// Extract all custom widgets/components
const sliders = rawHtml.match(/slider(-id)?="[^"]*"/g) || [];
console.log('Unique slider IDs / hooks on live site:', [...new Set(sliders)]);

const modals = rawHtml.match(/modal[^=">\s]*/gi) || [];
console.log('Modal elements found:', [...new Set(modals)]);

const forms = rawHtml.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
console.log(`Forms found on live site: ${forms.length}`);
