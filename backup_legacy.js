const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- BACKING UP LEGACY WEBSITE TO GITHUB BRANCH: backup-legacy-site ---');

try {
  fs.writeFileSync('.gitignore', 'UMRT_NEW/\n.git/\nnode_modules/\n');
  execSync('git init', { stdio: 'inherit' });
  execSync('git config user.name "Mahin Hasan Upol"', { stdio: 'inherit' });
  execSync('git config user.email "marsrover@uiu.ac.bd"', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Backup of legacy HTML/CSS website prior to Next.js migration"', { stdio: 'inherit' });
  execSync('git branch -M backup-legacy-site', { stdio: 'inherit' });
  try {
    execSync('git remote add origin https://github.com/uiumarsrover/uiumarsrover.github.io.git', { stdio: 'inherit' });
  } catch(err) {}
  execSync('git push -u origin backup-legacy-site --force', { stdio: 'inherit' });
  console.log('✅ Legacy website backup branch pushed successfully to GitHub!');
} catch (e) {
  console.error('Error during backup:', e.message);
}
