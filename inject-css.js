const fs = require('fs');
const path = require('path');

// Read the compiled CSS
const cssContent = fs.readFileSync(path.join(__dirname, 'src/css/style.css'), 'utf8');

// Get all HTML files in the src directory
const htmlFiles = fs.readdirSync(path.join(__dirname, 'src'))
  .filter(file => file.endsWith('.html'));

// Process each HTML file
htmlFiles.forEach(htmlFile => {
  const filePath = path.join(__dirname, 'src', htmlFile);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the existing CSS link
  content = content.replace(/<link rel="stylesheet" href="https:\/\/tungstenadvertising\.github\.io\/stanford\/src\/css\/style\.css">/g, '');

  // Check if there's already a style tag
  if (content.includes('<style>')) {
    // Insert our CSS before the first style tag
    content = content.replace('<style>', `<style>${cssContent}\n\n/* Page-specific styles below */\n`);
  } else {
    // No style tag exists, add it before closing head
    content = content.replace('</head>', `<style>${cssContent}</style>\n</head>`);
  }

  // Write the modified content back to the file
  fs.writeFileSync(filePath, content);
});

console.log('CSS injection complete!');
