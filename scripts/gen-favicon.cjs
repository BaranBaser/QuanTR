const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a simple 32x32 favicon from the logo using canvas-free approach
// Since we can't use sharp/canvas in this env, we'll create a minimal ICO file

// Minimal ICO format: header + directory entry + BMP data
function createMinimalFavicon() {
  // ICO file format
  const width = 32;
  const height = 32;
  
  // Create a simple colored square as BMP (BGRA format, bottom-up)
  const pixelData = Buffer.alloc(width * height * 4);
  
  // Fill with primary color (#3b82f6 = blue)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = ((height - 1 - y) * width + x) * 4;
      // BGRA format
      pixelData[offset + 0] = 0xf6; // B
      pixelData[offset + 1] = 0x82; // G
      pixelData[offset + 2] = 0x3b; // R
      pixelData[offset + 3] = 0xff; // A
    }
  }
  
  // Create "SB" text pattern in the center
  const drawPixel = (x, y) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const offset = ((height - 1 - y) * width + x) * 4;
      pixelData[offset + 0] = 0xff; // B
      pixelData[offset + 1] = 0xff; // G
      pixelData[offset + 2] = 0xff; // R
      pixelData[offset + 3] = 0xff; // A
    }
  };
  
  // Simple "S" shape
  for (let i = 6; i <= 14; i++) { drawPixel(i, 8); } // top bar
  for (let i = 8; i <= 11; i++) { drawPixel(6, i); } // left top
  for (let i = 8; i <= 11; i++) { drawPixel(i, 12); } // mid bar
  for (let i = 12; i <= 15; i++) { drawPixel(14, i); } // right bottom
  for (let i = 6; i <= 14; i++) { drawPixel(i, 16); } // bottom bar
  
  // Simple "B" shape  
  for (let i = 18; i <= 26; i++) { drawPixel(i, 8); } // top bar
  drawPixel(18, 9); drawPixel(18, 10); drawPixel(18, 11); drawPixel(18, 12); // left
  for (let i = 8; i <= 11; i++) { drawPixel(22, i); } // mid bar
  drawPixel(18, 13); drawPixel(18, 14); drawPixel(18, 15); drawPixel(18, 16); // left
  for (let i = 8; i <= 16; i++) { drawPixel(26, i); } // right
  for (let i = 18; i <= 26; i++) { drawPixel(i, 16); } // bottom bar
  
  // AND mask (all zeros = fully visible)
  const andMask = Buffer.alloc(Math.ceil(width / 8) * height, 0);
  
  // BMP info header (BITMAPINFOHEADER)
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0);        // header size
  bmpHeader.writeInt32LE(width, 4);       // width
  bmpHeader.writeInt32LE(height * 2, 8);  // height (doubled for ICO)
  bmpHeader.writeUInt16LE(1, 12);         // planes
  bmpHeader.writeUInt16LE(32, 14);        // bits per pixel
  bmpHeader.writeUInt32LE(0, 16);         // compression (none)
  bmpHeader.writeUInt32LE(pixelData.length + andMask.length, 20); // image size
  
  const imageData = Buffer.concat([bmpHeader, pixelData, andMask]);
  
  // ICO header
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);   // reserved
  icoHeader.writeUInt16LE(1, 2);   // type (ICO)
  icoHeader.writeUInt16LE(1, 4);   // count
  
  // ICO directory entry
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(width, 0);    // width
  dirEntry.writeUInt8(height, 1);   // height
  dirEntry.writeUInt8(0, 2);        // colors
  dirEntry.writeUInt8(0, 3);        // reserved
  dirEntry.writeUInt16LE(1, 4);     // planes
  dirEntry.writeUInt16LE(32, 6);    // bpp
  dirEntry.writeUInt32LE(imageData.length, 8); // size
  dirEntry.writeUInt32LE(6 + 16, 12); // offset
  
  const ico = Buffer.concat([icoHeader, dirEntry, imageData]);
  
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), ico);
  console.log('favicon.ico created (' + ico.length + ' bytes)');
}

createMinimalFavicon();
