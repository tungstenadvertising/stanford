const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const cssDir = path.join(buildDir, 'css');

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

  // Inject the CSS as a <style> tag before the first <style> tag in <head>, or before </head> if none exists
  if (/<style[ >]/i.test(html)) {
    html = html.replace(/<style([ >])/i, `<style>${cleanedCssContent}</style>\n<style$1`);
  } else {
    html = html.replace('</head>', `<style>${cleanedCssContent}</style>\n</head>`);
  }

  fs.writeFileSync(filePath, html);
});

console.log('CSS injected into all HTML files in build/ (existing <style> tags preserved).');
