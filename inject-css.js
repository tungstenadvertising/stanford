const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const cssDir = path.join(buildDir, 'css');

console.log('Current working directory:', process.cwd());
console.log('Looking for build directory at:', buildDir);
console.log('Looking for CSS directory at:', cssDir);

// Find the built CSS file (e.g., style.css)
const cssFile = fs.readdirSync(cssDir).find(f => f.endsWith('.css'));
if (!cssFile) {
  console.error('No built CSS file found in build/css.');
  process.exit(1);
}
const cssPath = path.join(cssDir, cssFile);
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Remove Tailwind license comment from CSS
const cleanedCssContent = cssContent.replace(/\/\*! tailwindcss[^*]*\*\/\s*/i, '');

// Find all HTML files in build
const htmlFiles = fs.readdirSync(buildDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(htmlFile => {
  const filePath = path.join(buildDir, htmlFile);
  let html = fs.readFileSync(filePath, 'utf8');

  // Remove any <link rel="stylesheet" ... href="css/style.css" ...> or href="/css/style.css" ...>
  html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']\/?css\/style\.css["'][^>]*>/gi, '');
  html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']\/?css\/input\.css["'][^>]*>/gi, '');

  // If a <style> tag exists in <head>, prepend the injected CSS to its contents
  const styleTagRegex = /(<style[^>]*>)([\s\S]*?)(<\/style>)/i;
  if (styleTagRegex.test(html)) {
    html = html.replace(styleTagRegex, (match, open, content, close) => {
      return `${open}${cleanedCssContent}\n${content}${close}`;
    });
  } else {
    // Otherwise, inject as a new <style> tag before </head>
    html = html.replace('</head>', `<style>${cleanedCssContent}</style>\n</head>`);
  }

  console.log('Processing HTML file:', filePath);
  fs.writeFileSync(filePath, html);
});

console.log('CSS injected and merged with existing <style> tags in build/.');
