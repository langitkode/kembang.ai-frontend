const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const version = pkg.version;

const distDir = path.join(__dirname, '../dist');
const oldFile = path.join(distDir, 'index.global.js');
const newFile = path.join(distDir, `index-${version}.global.js`);

// Rename the built file
if (fs.existsSync(oldFile)) {
  fs.renameSync(oldFile, newFile);
  console.log(`✅ Renamed: index.global.js → index-${version}.global.js`);
} else {
  console.error('❌ Built file not found:', oldFile);
  process.exit(1);
}

// Create a copy as 'latest' (index.global.js)
fs.copyFileSync(newFile, oldFile);
console.log(`📦 Created latest: index.global.js`);

console.log(`\n🎉 Build complete!`);
console.log(`   Versioned: dist/index-${version}.global.js`);
console.log(`   Latest:    dist/index.global.js`);
