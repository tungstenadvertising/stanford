// convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/images');
const destDir = path.join(__dirname, 'build/images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (/\.(jpg|png)$/i.test(file)) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(destDir, file.replace(/\.(jpg|png)$/i, '.webp'));
    sharp(inputPath)
      .toFormat('webp')
      .toFile(outputPath)
      .then(() => console.log(`Converted: ${file} -> ${path.basename(outputPath)}`))
      .catch(err => console.error(`Error converting ${file}:`, err));
  }
});
