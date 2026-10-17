import https from 'https';
import fs from 'fs';
import path from 'path';

const fonts = [
  {
    name: 'KTFMetro-Roman.otf',
    url: 'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/6940a0abd735a1e3a640d078_KTFMetro-Roman.otf'
  },
  {
    name: 'KTFMetro-Blueline.otf',
    url: 'https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/6940a0abd735a1e3a640d079_KTFMetro-Blueline.otf'
  }
];

fs.mkdirSync('public/assets/fonts', { recursive: true });

fonts.forEach((f) => {
  const dest = path.join('public/assets/fonts', f.name);
  const file = fs.createWriteStream(dest);
  https.get(f.url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Saved ${dest} (${fs.statSync(dest).size} bytes)`);
    });
  });
});
