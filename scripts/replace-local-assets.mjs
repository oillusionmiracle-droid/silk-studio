import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const mapPath = path.join(projectRoot, 'cloudinary-url-map.json');
const roots = ['app', 'components', 'lib'];
const extensions = new Set(['.ts', '.tsx', '.css', '.mjs']);
const dryRun = process.argv.includes('--dry-run');

const mapDocument = JSON.parse(await fs.readFile(mapPath, 'utf8'));
const urlMap = mapDocument.urlMap || {};
const entries = Object.entries(urlMap).sort(([left], [right]) => right.length - left.length);

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(filePath));
    else if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(filePath);
  }
  return files;
}

let changedFiles = 0;
let replacements = 0;
const report = [];

for (const root of roots) {
  const absoluteRoot = path.join(projectRoot, root);
  const files = await walk(absoluteRoot);
  for (const filePath of files) {
    const original = await fs.readFile(filePath, 'utf8');
    let updated = original;
    let fileReplacements = 0;

    for (const [localPath, cloudinaryUrl] of entries) {
      const matches = updated.split(localPath).length - 1;
      if (matches > 0) {
        updated = updated.split(localPath).join(cloudinaryUrl);
        fileReplacements += matches;
      }
    }

    if (fileReplacements === 0) continue;
    changedFiles += 1;
    replacements += fileReplacements;
    report.push({ file: path.relative(projectRoot, filePath).replaceAll(path.sep, '/'), replacements: fileReplacements });
    if (!dryRun) await fs.writeFile(filePath, updated, 'utf8');
  }
}

console.log(`${dryRun ? 'Dry run: would change' : 'Changed'} ${changedFiles} files with ${replacements} asset replacements.`);
for (const item of report) console.log(`${item.file}: ${item.replacements}`);
