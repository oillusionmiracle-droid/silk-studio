import fs from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, 'public');
const mapPath = path.join(projectRoot, 'cloudinary-url-map.json');
const allowedRoots = ['images', 'videos', 'icons', 'illustrations', 'animations'];
const skippedExtensions = new Set(['.svg', '.json', '.ico', '.webmanifest', '.webp']);
const isDryRun = process.argv.includes('--dry-run');
const videosOnly = process.argv.includes('--videos-only');
const mapOnly = process.argv.includes('--map-only');

function loadLocalEnv() {
  const envPath = path.join(projectRoot, '.env.local');
  return fs.readFile(envPath, 'utf8').then((contents) => {
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  });
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    else files.push(absolutePath);
  }
  return files;
}

function publicIdFor(absolutePath) {
  const relative = path.relative(publicRoot, absolutePath).replaceAll(path.sep, '/');
  const withoutExtension = relative.replace(/\.[^/.]+$/, '');
  return `silk-studio/${withoutExtension}`;
}

function shouldUpload(absolutePath) {
  const relative = path.relative(publicRoot, absolutePath).replaceAll(path.sep, '/');
  const root = relative.split('/')[0];
  const extension = path.extname(absolutePath).toLowerCase();
  return allowedRoots.includes(root) && !skippedExtensions.has(extension);
}

function deliveryUrl(absolutePath) {
  const relative = path.relative(publicRoot, absolutePath).replaceAll(path.sep, '/');
  const resourceType = path.extname(absolutePath).toLowerCase() === '.mp4' ? 'video' : 'image';
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${publicIdFor(absolutePath)}${path.extname(absolutePath).toLowerCase()}`;
}

async function uploadFile(absolutePath) {
  const relative = `/${path.relative(publicRoot, absolutePath).replaceAll(path.sep, '/')}`;
  const publicId = publicIdFor(absolutePath);
  const resourceType = path.extname(absolutePath).toLowerCase() === '.mp4' ? 'video' : 'image';

  if (isDryRun) {
    return { localPath: relative, publicId, resourceType, secureUrl: deliveryUrl(absolutePath), dryRun: true };
  }

  const uploadOptions = {
    public_id: publicId,
    resource_type: resourceType,
    overwrite: false,
    use_filename: false,
    unique_filename: false,
    invalidate: false,
  };
  const result = resourceType === 'video'
    ? await cloudinary.uploader.upload_large(absolutePath, { ...uploadOptions, chunk_size: 20 * 1024 * 1024 })
    : await cloudinary.uploader.upload(absolutePath, uploadOptions);

  return {
    localPath: relative,
    publicId,
    resourceType,
    secureUrl: result.secure_url || deliveryUrl(absolutePath),
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

await loadLocalEnv();

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary credentials are missing from .env.local.');
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

const allFiles = await walk(publicRoot);
const files = allFiles.filter(shouldUpload).filter((file) => {
  if (!videosOnly) return true;
  return path.extname(file).toLowerCase() === '.mp4';
});
const existingMap = await fs.readFile(mapPath, 'utf8').then(JSON.parse).catch(() => ({}));
if (mapOnly) {
  const urlMap = {};
  for (const file of allFiles.filter(shouldUpload)) {
    const relative = `/${path.relative(publicRoot, file).replaceAll(path.sep, '/')}`;
    urlMap[relative] = deliveryUrl(file);
  }
  await fs.writeFile(mapPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), dryRun: false, uploaded: [], failed: [], urlMap }, null, 2)}\n`, 'utf8');
  console.log(`Generated URL map for ${Object.keys(urlMap).length} uploaded assets.`);
  process.exit(0);
}
const uploaded = [];
const failed = [];

console.log(`${isDryRun ? 'Dry run' : 'Uploading'} ${files.length} assets to Cloudinary...`);

for (const file of files) {
  const relative = `/${path.relative(publicRoot, file).replaceAll(path.sep, '/')}`;
  try {
    const item = await uploadFile(file);
    uploaded.push(item);
    if (item.secureUrl) existingMap[relative] = item.secureUrl;
    console.log(`${isDryRun ? 'Would upload' : 'Uploaded'} ${relative}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failed.push({ localPath: relative, error: message });
    console.error(`Failed ${relative}: ${message}`);
  }
}

await fs.writeFile(
  mapPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), dryRun: isDryRun, uploaded, failed, urlMap: existingMap }, null, 2)}\n`,
  'utf8'
);

console.log(`Completed: ${uploaded.length} succeeded, ${failed.length} failed.`);
console.log(`Mapping written to ${path.relative(projectRoot, mapPath)}.`);
if (failed.length > 0) process.exitCode = 1;
