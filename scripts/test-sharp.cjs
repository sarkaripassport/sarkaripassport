const sharp = require('sharp');
const fs = require('fs');
async function run() {
  try {
    const originalBuffer = fs.readFileSync('public/logo.svg');
    const optimizedBuffer = await sharp(originalBuffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    console.log("Sharp Success, buffer length:", optimizedBuffer.length);
  } catch (err) {
    console.error("Sharp Error:", err);
  }
}
run();
