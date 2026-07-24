#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  utimes,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const releaseDir = path.join(projectRoot, '.release');
const stageDir = path.join(releaseDir, '.theme-staging');
const normalizedTime = new Date('2000-01-01T00:00:00.000Z');

const theme = await readJSON('theme.json');
const packageJSON = await readJSON('package.json');
const versionInfo = await readJSON('version.json');

validateVersions(theme, packageJSON, versionInfo);

const packageName = `${theme.id}-${theme.version}.rztheme`;
const outputPath = path.join(releaseDir, packageName);
const checksumPath = `${outputPath}.sha256`;

const includes = [
  'theme.json',
  'theme.schema.json',
  'package.json',
  'package-lock.json',
  'version.json',
  'astro.config.mjs',
  'tsconfig.json',
  'README.md',
  'src',
  'public',
  'scripts',
];

await rm(stageDir, { recursive: true, force: true });
await mkdir(stageDir, { recursive: true });

try {
  for (const entry of includes) {
    const source = path.join(projectRoot, entry);
    await access(source);
    await cp(source, path.join(stageDir, entry), {
      recursive: true,
      preserveTimestamps: false,
      filter: shouldInclude,
    });
  }

  const files = await listFiles(stageDir);
  const entries = [];
  for (const file of files) {
    const fullPath = path.join(stageDir, file);
    const fileStat = await stat(fullPath);
    entries.push({
      path: file,
      size: fileStat.size,
      sha256: await sha256File(fullPath),
    });
  }

  const packageManifest = {
    format: 'rouxzhee.theme.publisher/v1',
    packageType: 'publisher-source',
    themeId: theme.id,
    version: theme.version,
    framework: theme.framework,
    renderModes: theme.renderModes,
    deliveryPackaging: 'marketplace-personalized',
    files: entries,
  };
  await writeFile(
    path.join(stageDir, 'package.manifest.json'),
    `${JSON.stringify(packageManifest, null, 2)}\n`,
  );

  const archiveFiles = await listFiles(stageDir);
  await Promise.all(archiveFiles.map(async (file) => {
    await utimes(path.join(stageDir, file), normalizedTime, normalizedTime);
  }));

  await rm(outputPath, { force: true });
  await createZip(outputPath, archiveFiles);

  const archiveHash = await sha256File(outputPath);
  await writeFile(checksumPath, `${archiveHash}  ${packageName}\n`);

  const archiveStat = await stat(outputPath);
  console.log(`Theme package: ${outputPath}`);
  console.log(`Size: ${archiveStat.size} bytes`);
  console.log(`SHA256: ${archiveHash}`);
} finally {
  await rm(stageDir, { recursive: true, force: true });
}

function shouldInclude(source) {
  const relativePath = path.relative(projectRoot, source).split(path.sep).join('/');
  const excluded = [
    'src/config/.config',
    'public/pagefind',
    'scripts/package-theme.mjs',
  ];
  return !excluded.some((entry) => relativePath === entry || relativePath.startsWith(`${entry}/`));
}

function validateVersions(themeManifest, npmPackage, versionFile) {
  const versions = [
    ['theme.json', themeManifest.version],
    ['package.json', npmPackage.version],
    ['version.json', versionFile.version],
  ];
  const expected = versions[0][1];
  const mismatched = versions.filter(([, version]) => version !== expected);
  if (mismatched.length > 0) {
    throw new Error(`Theme versions must match: ${versions.map(([file, version]) => `${file}=${version}`).join(', ')}`);
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(expected)) {
    throw new Error(`Theme version must be SemVer: ${expected}`);
  }
  if (!Array.isArray(themeManifest.renderModes) || themeManifest.renderModes.length === 0) {
    throw new Error('theme.json must declare at least one render mode.');
  }
}

async function readJSON(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), 'utf8'));
}

async function listFiles(root, current = '') {
  const directory = path.join(root, current);
  const names = await readdir(directory);
  const files = [];
  for (const name of names.sort((left, right) => left.localeCompare(right, 'en'))) {
    const relativePath = current ? `${current}/${name}` : name;
    const fileStat = await stat(path.join(root, relativePath));
    if (fileStat.isDirectory()) {
      files.push(...await listFiles(root, relativePath));
    } else if (fileStat.isFile()) {
      files.push(relativePath);
    }
  }
  return files;
}

async function sha256File(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

function createZip(outputFile, files) {
  return new Promise((resolve, reject) => {
    const child = spawn('zip', ['-X', '-q', '-9', outputFile, '-@'], {
      cwd: stageDir,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    child.on('error', (error) => {
      reject(new Error(`Unable to run zip: ${error.message}`));
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`zip exited with code ${code}`));
      }
    });
    child.stdin.end(`${files.join('\n')}\n`);
  });
}
