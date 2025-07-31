#!/usr/bin/env node

// Generate placeholder icon files for PWA
const fs = require('fs');
const path = require('path');

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'images', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon template
const generateSVG = (size) => `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.1}"/>
  <text x="${size/2}" y="${size/2 + size * 0.05}" font-family="Arial, sans-serif" font-size="${size * 0.15}" font-weight="bold" fill="white" text-anchor="middle">PM</text>
</svg>`;

// Generate icons for each size
iconSizes.forEach(size => {
  const svgContent = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated ${filename}`);
});

// Generate favicon files
const faviconSizes = [16, 32];
faviconSizes.forEach(size => {
  const svgContent = generateSVG(size);
  const filename = `favicon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Generated ${filename}`);
});

// Generate apple-touch-icon
const appleTouchIcon = generateSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('Generated apple-touch-icon.svg');

// Generate Open Graph image
const ogImage = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad1)"/>
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">PrepMate</text>
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" opacity="0.9">Master Coding Interviews</text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" opacity="0.7">Expert Mentorship • Practice Challenges • Real-time Collaboration</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'images', 'prepmate-og-image.svg'), ogImage);
console.log('Generated prepmate-og-image.svg');

console.log('All placeholder icons generated successfully!');
console.log('Note: For production, replace these SVG files with proper PNG/JPG images.');
