import fs from 'fs';

const code = fs.readFileSync('scripts/slater_full_bundle.js', 'utf8');

function extractFunction(name) {
  const startIdx = code.indexOf(`function ${name}`);
  if (startIdx === -1) return null;
  // find next function or end of block
  const nextFuncIdx = code.indexOf('function init', startIdx + 10);
  return code.slice(startIdx, nextFuncIdx === -1 ? startIdx + 3000 : nextFuncIdx);
}

const targets = [
  'initTabs',
  'initTabsHilight',
  'initTabsText',
  'initSlider',
  'initSliderFreemode',
  'initAccordion',
  'initModalCta',
  'initModalMedia',
  'initModalMenu',
  'initMagneticEffect',
  'initMapPins'
];

targets.forEach(t => {
  const fnCode = extractFunction(t);
  if (fnCode) {
    fs.writeFileSync(`scripts/extracted_${t}.js`, fnCode, 'utf8');
    console.log(`Extracted ${t} (${fnCode.length} chars)`);
  }
});
