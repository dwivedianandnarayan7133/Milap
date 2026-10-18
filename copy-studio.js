// Copies wedding-card/client/dist into client/public/studio if present
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'wedding-card', 'client', 'dist');
const destDir = path.join(__dirname, 'client', 'public', 'studio');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyRecursive(srcDir, destDir);
  console.log('✓ VivahPatra AI Studio bundled into client/public/studio');
} catch (err) {
  console.warn('Notice: Studio bundle copy skipped:', err.message);
}
