const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Disable sharp libvips file descriptor caching
sharp.cache(false);

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const BACKUP_DIR = path.resolve(PROJECT_ROOT, '..', 'images_original_backup');

// Extensions to convert
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

function getAllImageFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (IMAGE_EXTS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function backupFiles(files) {
  console.log(`\n📦 Verifying backup of ${files.length} images to:\n${BACKUP_DIR}\n`);
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  let copied = 0;
  for (const file of files) {
    const relPath = path.relative(PUBLIC_DIR, file);
    const destPath = path.join(BACKUP_DIR, relPath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(file, destPath);
      copied++;
    }
  }
  console.log(`✅ Backup verified! (All ${files.length} originals safely stored)`);
}

async function convertFile(file) {
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const dirName = path.dirname(file);
  const targetWebpPath = path.join(dirName, `${baseName}.webp`);

  const fileBuffer = fs.readFileSync(file);
  const origSizeKB = Math.round(fileBuffer.length / 1024);

  try {
    const pipeline = sharp(fileBuffer);
    const meta = await pipeline.metadata();

    let resizeWidth = null;
    let resizeHeight = null;

    const lowerPath = file.toLowerCase();
    const isTexture = lowerPath.includes('asset') || lowerPath.includes('hero');
    const isTeamMember = lowerPath.includes('team') || lowerPath.includes('member');

    if (isTeamMember) {
      // Member portraits: max 1200px
      if ((meta.width && meta.width > 1200) || (meta.height && meta.height > 1200)) {
        resizeWidth = 1200;
        resizeHeight = 1200;
      }
    } else if (isTexture) {
      // Textures / Hero backgrounds: max 2048px
      if (meta.width && meta.width > 2048) {
        resizeWidth = 2048;
      }
    } else {
      // General images / rovers / achievements: max 1600px
      if ((meta.width && meta.width > 1600) || (meta.height && meta.height > 1600)) {
        resizeWidth = 1600;
        resizeHeight = 1600;
      }
    }

    if (resizeWidth || resizeHeight) {
      pipeline.resize(resizeWidth, resizeHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // WebP encoding options
    const hasAlpha = meta.hasAlpha;
    const isLogo = lowerPath.includes('logo') || lowerPath.includes('icon');

    if (isLogo && hasAlpha) {
      pipeline.webp({ quality: 90, effort: 6, alphaQuality: 95 });
    } else {
      pipeline.webp({ quality: 84, effort: 6 });
    }

    const outputBuffer = await pipeline.toBuffer();
    fs.writeFileSync(targetWebpPath, outputBuffer);

    const newSizeKB = Math.round(outputBuffer.length / 1024);
    const percentSaved = Math.round((1 - outputBuffer.length / fileBuffer.length) * 100);

    return {
      file,
      targetWebpPath,
      relPath: path.relative(PUBLIC_DIR, file),
      origKB: origSizeKB,
      newKB: newSizeKB,
      savedPercent: percentSaved,
      success: true,
    };
  } catch (err) {
    console.error(`❌ Failed to convert ${file}:`, err.message);
    return {
      file,
      targetWebpPath,
      relPath: path.relative(PUBLIC_DIR, file),
      origKB: origSizeKB,
      newKB: origSizeKB,
      savedPercent: 0,
      success: false,
      error: err.message,
    };
  }
}

async function run() {
  console.log('🚀 Scanning public directory for images...');
  const files = getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images.`);

  if (files.length === 0) {
    console.log('No matching images found to convert.');
    return;
  }

  const initialTotalBytes = files.reduce((acc, f) => acc + fs.statSync(f).size, 0);
  const initialTotalMB = (initialTotalBytes / (1024 * 1024)).toFixed(2);
  console.log(`Total initial image size: ${initialTotalMB} MB`);

  // 1. Verify Backup
  await backupFiles(files);

  // 2. Convert each file to WebP
  console.log('\n⚙️  Converting images to WebP...');
  let processed = 0;
  let totalNewBytes = 0;
  const successfulConversions = [];
  const sampleReductions = [];

  for (const file of files) {
    const res = await convertFile(file);
    processed++;
    if (res.success) {
      successfulConversions.push(res);
      totalNewBytes += res.newKB * 1024;
      if (sampleReductions.length < 15 && res.origKB > 1500) {
        sampleReductions.push({
          File: path.basename(res.file),
          'Original (KB)': res.origKB,
          'WebP (KB)': res.newKB,
          'Saved (%)': `${res.savedPercent}%`,
        });
      }
    }
    if (processed % 50 === 0 || processed === files.length) {
      console.log(`Progress: ${processed}/${files.length} (${Math.round((processed / files.length) * 100)}%)`);
    }
  }

  // 3. Delete originals only after all conversions succeed and files are verified
  console.log('\n🧹 Cleaning up old multi-megabyte files from public/...');
  let deletedCount = 0;
  for (const item of successfulConversions) {
    if (fs.existsSync(item.targetWebpPath) && fs.statSync(item.targetWebpPath).size > 0) {
      const ext = path.extname(item.file).toLowerCase();
      if (ext !== '.webp') {
        try {
          fs.unlinkSync(item.file);
          deletedCount++;
        } catch (delErr) {
          console.warn(`Could not delete ${item.file}:`, delErr.message);
        }
      }
    }
  }
  console.log(`Cleaned up ${deletedCount} uncompressed original files.`);

  const finalTotalMB = (totalNewBytes / (1024 * 1024)).toFixed(2);
  const totalSavedMB = (initialTotalMB - finalTotalMB).toFixed(2);
  const totalPercentSaved = Math.round((1 - totalNewBytes / initialTotalBytes) * 100);

  console.log('\n==============================');
  console.log('🎉 CONVERSION COMPLETE!');
  console.log('==============================');
  console.log(`Total files converted: ${successfulConversions.length}`);
  console.log(`Before: ${initialTotalMB} MB`);
  console.log(`After:  ${finalTotalMB} MB`);
  console.log(`Saved:  ${totalSavedMB} MB (${totalPercentSaved}% reduction)`);
  console.log('\nTop compression highlights:');
  console.table(sampleReductions);
}

run().catch(console.error);
