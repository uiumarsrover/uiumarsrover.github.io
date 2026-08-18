const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('--- DEPLOYING STATIC EXPORT TO GH-PAGES BRANCH ---');

const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  console.error('out/ directory does not exist!');
  process.exit(1);
}

// Make sure .nojekyll exists
fs.writeFileSync(path.join(outDir, '.nojekyll'), '\n');

// Initialize git repo in out/
try {
  execSync('git init', { cwd: outDir, stdio: 'inherit' });
  execSync('git config user.name "Mahin Hasan Upol"', { cwd: outDir, stdio: 'inherit' });
  execSync('git config user.email "marsrover@uiu.ac.bd"', { cwd: outDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: outDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy UMRT Next.js Production Static Build to GitHub Pages"', { cwd: outDir, stdio: 'inherit' });
  execSync('git branch -M gh-pages', { cwd: outDir, stdio: 'inherit' });
  try {
    execSync('git remote add origin https://github.com/uiumarsrover/uiumarsrover.github.io.git', { cwd: outDir, stdio: 'inherit' });
  } catch(e) {}
  execSync('git push -u origin gh-pages --force', { cwd: outDir, stdio: 'inherit' });
  console.log('✅ gh-pages branch deployed successfully to GitHub!');
} catch (err) {
  console.error('Error deploying gh-pages:', err.message);
}
