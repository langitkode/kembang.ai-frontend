const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

const version = packageJson.version;

// Update tsup config to include version in filename
const tsupConfig = `import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["iife"],
  globalName: "KembangAI",
  dts: false,
  minify: true,
  clean: true,
  target: "esnext",
  outDir: "dist",
  noExternal: [/@kembang\\/\\.*/, "zustand", "axios"],
  entryNames: "[name]-${version}",
});
`;

fs.writeFileSync(path.join(__dirname, '../tsup.config.ts'), tsupConfig);

// Update index.html with version
const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(
  /<script src="\.\\/dist\/index\.global\.js"><\/script>/,
  `<script src="./dist/index-${version}.global.js"></script>`
);
indexHtml = indexHtml.replace(
  /Widget <span class="kb-brand">Playground<\/span>/,
  `Widget <span class="kb-brand">Playground</span> v${version}`
);
fs.writeFileSync(indexPath, indexHtml);

console.log(`✅ Version ${version} configured`);
console.log(`📦 Output file: dist/index-${version}.global.js`);
console.log(`🔗 CDN URL: https://cdn.kembang.ai/widget-${version}.js`);
console.log(`🔗 Unpkg URL: https://unpkg.com/@kembang/widget@${version}/dist/index.global.js`);
