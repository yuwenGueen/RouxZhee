#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import {
  access,
  chmod,
  copyFile,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const isWindows = process.platform === 'win32';
const cacheDir = path.resolve(projectRoot, process.env.ROUXZHEE_TOOLS_CACHE_DIR || '.rouxzhee-tools');
const binDir = path.join(cacheDir, 'bin');
const installedToolPath = path.join(binDir, isWindows ? 'rz-tools.exe' : 'rz-tools');
const installInfoPath = path.join(cacheDir, 'install.json');
const defaultManifestURL = 'https://rz-download.xxdevops.cn/list';

const mode = process.argv[2] || 'dev';
const forwardedArgs = trimSeparator(process.argv.slice(3));

try {
  if (!['dev', 'start', 'build', 'export'].includes(mode)) {
    throw new Error(`Unsupported mode "${mode}". Use dev, start, build, or export.`);
  }

  if (process.env.ROUXZHEE_TOOLS_SKIP_EXPORT === '1') {
    log('Skipping content export because ROUXZHEE_TOOLS_SKIP_EXPORT=1.');
  } else {
    const rzToolsPath = await ensureRzTools();
    await exportContent(rzToolsPath);
  }

  if (mode !== 'export') {
    const astroCommand = mode === 'build' ? 'build' : 'dev';
    await runAstro(astroCommand, forwardedArgs);
  }
} catch (error) {
  console.error(`[rz-start] ${error?.message || String(error)}`);
  process.exit(1);
}

async function ensureRzTools() {
  const envBinary = process.env.ROUXZHEE_TOOLS_BINARY || process.env.RZ_TOOLS_BINARY;
  if (envBinary) {
    const binaryPath = path.resolve(projectRoot, envBinary);
    await assertExecutable(binaryPath);
    log(`Using ROUXZHEE_TOOLS_BINARY: ${binaryPath}`);
    return binaryPath;
  }

  const forceDownload = process.env.ROUXZHEE_TOOLS_FORCE_DOWNLOAD === '1';
  const localBinary = findLocalDevelopmentBinary();

  if (!forceDownload && localBinary) {
    const isCurrent = await isLocalBinaryCurrent(localBinary);
    if (!isCurrent) {
      await installLocalBinary(localBinary);
      log(`Installed local rz-tools from ${path.relative(projectRoot, localBinary)}`);
    } else {
      log(`Using current local rz-tools: ${path.relative(projectRoot, installedToolPath)}`);
    }
    await assertExecutable(installedToolPath);
    return installedToolPath;
  }

  if (!forceDownload && existsSync(installedToolPath)) {
    await assertExecutable(installedToolPath);
    const update = await checkRemoteUpdateForCachedTools();
    if (!update.shouldUpdate) {
      log(`Using cached rz-tools: ${path.relative(projectRoot, installedToolPath)}`);
      return installedToolPath;
    }
    log(update.reason);
    await downloadRzTools(update.remote);
    await assertExecutable(installedToolPath);
    return installedToolPath;
  }

  await downloadRzTools();
  await assertExecutable(installedToolPath);
  return installedToolPath;
}

async function installLocalBinary(sourcePath) {
  await mkdir(binDir, { recursive: true });
  await copyFile(sourcePath, installedToolPath);
  if (!isWindows) {
    await chmod(installedToolPath, 0o755);
  }
  await writeFile(
    path.join(cacheDir, 'install.json'),
    `${JSON.stringify({
      source: 'local',
      sourcePath,
      sourceSha256: await sha256File(sourcePath),
      installedAt: new Date().toISOString(),
      platform: process.platform,
      arch: process.arch,
    }, null, 2)}\n`,
  );
}

async function downloadRzTools(remote) {
  const resolved = remote || await resolveRemoteDownload();
  const { manifestURL, toolInfo, selection } = resolved;
  const archivePath = path.join(cacheDir, 'download', selection.fileName);

  await rm(path.dirname(archivePath), { recursive: true, force: true });
  await mkdir(path.dirname(archivePath), { recursive: true });
  await mkdir(binDir, { recursive: true });

  log(`Downloading ${selection.label}: ${redactURL(selection.url)}`);
  const bytes = await downloadBytes(selection.url);
  await writeFile(archivePath, bytes);

  if (selection.sha256) {
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== selection.sha256) {
      throw new Error(`Checksum mismatch for ${selection.fileName}. Expected ${selection.sha256}, got ${actual}.`);
    }
  }

  if (selection.kind === 'tar.xz') {
    await extractDarwinArchive(archivePath);
  } else {
    await writeFile(installedToolPath, bytes);
  }

  if (!isWindows) {
    await chmod(installedToolPath, 0o755);
  }

  await writeFile(
    installInfoPath,
    `${JSON.stringify({
      ...remoteInstallInfo(resolved),
      installedAt: new Date().toISOString(),
    }, null, 2)}\n`,
  );
  log(`Installed rz-tools to ${path.relative(projectRoot, installedToolPath)}`);
}

async function resolveRemoteDownload() {
  const manifestURL =
    process.env.ROUXZHEE_TOOLS_MANIFEST_URL ||
    process.env.ROUXZHEE_TOOLS_LIST_URL ||
    process.env.RZ_TOOLS_MANIFEST_URL ||
    defaultManifestURL;

  log(`Fetching rz-tools manifest: ${redactURL(manifestURL)}`);
  const manifest = await fetchJSON(manifestURL);
  const toolInfo = manifest['rouxzhee-tools'] || manifest['rz-tools'] || manifest;
  const selection = selectDownload(toolInfo);
  return { manifestURL, toolInfo, selection };
}

async function checkRemoteUpdateForCachedTools() {
  if (process.env.ROUXZHEE_TOOLS_SKIP_UPDATE_CHECK === '1') {
    return { shouldUpdate: false };
  }

  const installInfo = await readInstallInfo();
  if (!installInfo || installInfo.source !== 'remote') {
    try {
      return {
        shouldUpdate: true,
        remote: await resolveRemoteDownload(),
        reason: 'Cached rz-tools has no remote install metadata; refreshing from manifest.',
      };
    } catch (error) {
      log(`Failed to check rz-tools update, using cached binary: ${error?.message || String(error)}`);
      return { shouldUpdate: false };
    }
  }

  try {
    const remote = await resolveRemoteDownload();
    if (isSameRemoteInstall(installInfo, remote)) {
      return { shouldUpdate: false };
    }
    return {
      shouldUpdate: true,
      remote,
      reason: `Updating rz-tools ${formatVersion(installInfo.version)} -> ${formatVersion(remote.toolInfo.version)}.`,
    };
  } catch (error) {
    log(`Failed to check rz-tools update, using cached binary: ${error?.message || String(error)}`);
    return { shouldUpdate: false };
  }
}

async function isLocalBinaryCurrent(sourcePath) {
  if (!existsSync(installedToolPath)) {
    return false;
  }
  await assertExecutable(installedToolPath);
  const [sourceSha256, installedSha256, installInfo] = await Promise.all([
    sha256File(sourcePath),
    sha256File(installedToolPath),
    readInstallInfo(),
  ]);
  return (
    sourceSha256 === installedSha256 &&
    installInfo?.source === 'local' &&
    path.resolve(installInfo.sourcePath || '') === path.resolve(sourcePath)
  );
}

function isSameRemoteInstall(installInfo, remote) {
  const expected = remoteInstallInfo(remote);
  return (
    installInfo.source === expected.source &&
    installInfo.manifestURL === expected.manifestURL &&
    installInfo.downloadURL === expected.downloadURL &&
    installInfo.platform === expected.platform &&
    installInfo.arch === expected.arch &&
    installInfo.version === expected.version &&
    installInfo.sha256 === expected.sha256
  );
}

function remoteInstallInfo({ manifestURL, toolInfo, selection }) {
  return {
    source: 'remote',
    manifestURL: redactURL(manifestURL),
    downloadURL: redactURL(selection.url),
    platform: process.platform,
    arch: process.arch,
    version: toolInfo.version || '',
    label: selection.label,
    fileName: selection.fileName,
    sha256: selection.sha256 || '',
  };
}

async function readInstallInfo() {
  if (!existsSync(installInfoPath)) {
    return null;
  }
  try {
    return JSON.parse(await readFile(installInfoPath, 'utf-8'));
  } catch {
    return null;
  }
}

async function sha256File(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

function formatVersion(version) {
  return version ? `v${version}` : '(unknown version)';
}

function selectDownload(toolInfo) {
  const files = toolInfo.files || {};

  if (process.platform === 'linux') {
    if (process.arch !== 'x64') {
      throw new Error(`Unsupported Linux architecture: ${process.arch}. Current rz-tools release only includes linux/amd64.`);
    }
    const url = toolInfo.linux?.['rz-tools'] || toolInfo.linux?.['rouxzhee-tools'];
    if (!url) {
      throw new Error('The rz-tools manifest does not contain a Linux binary.');
    }
    return {
      kind: 'binary',
      label: 'linux/amd64',
      fileName: 'rz-tools-linux-amd64',
      url,
      sha256: files['linux/rz-tools']?.sha256 || files['linux/rouxzhee-tools']?.sha256,
    };
  }

  if (process.platform === 'win32') {
    if (process.arch !== 'x64') {
      throw new Error(`Unsupported Windows architecture: ${process.arch}. Current rz-tools release only includes windows/amd64.`);
    }
    const url = toolInfo.win?.['rz-tools.exe'] || toolInfo.win?.['rouxzhee-tools.exe'];
    if (!url) {
      throw new Error('The rz-tools manifest does not contain a Windows binary.');
    }
    return {
      kind: 'binary',
      label: 'windows/amd64',
      fileName: 'rz-tools-windows-amd64.exe',
      url,
      sha256: files['win/rz-tools.exe']?.sha256 || files['win/rouxzhee-tools.exe']?.sha256,
    };
  }

  if (process.platform === 'darwin') {
    const arch = process.arch === 'arm64' ? 'arm64' : process.arch === 'x64' ? 'amd64' : '';
    if (!arch) {
      throw new Error(`Unsupported macOS architecture: ${process.arch}.`);
    }
    const darwinInfo = toolInfo.darwin?.[arch] || {};
    const url = darwinInfo['rz-tools.tar.xz'] || darwinInfo['rouxzhee-tools.tar.xz'];
    if (!url) {
      throw new Error(`The rz-tools manifest does not contain a macOS ${arch} archive.`);
    }
    return {
      kind: 'tar.xz',
      label: `darwin/${arch}`,
      fileName: `rz-tools-darwin-${arch}.tar.xz`,
      url,
      sha256:
        files[`darwin/${arch}/rz-tools.tar.xz`]?.sha256 ||
        files[`darwin/${arch}/rouxzhee-tools.tar.xz`]?.sha256,
    };
  }

  throw new Error(`Unsupported platform: ${process.platform}.`);
}

async function extractDarwinArchive(archivePath) {
  const extractDir = path.join(cacheDir, 'extract');
  await rm(extractDir, { recursive: true, force: true });
  await mkdir(extractDir, { recursive: true });
  await run('tar', ['-xJf', archivePath, '-C', extractDir], { cwd: projectRoot });

  const candidates = [
    path.join(extractDir, 'rz-tools'),
    path.join(extractDir, 'rouxzhee-tools'),
  ];
  const binary = candidates.find((candidate) => existsSync(candidate));
  if (!binary) {
    throw new Error('The macOS rz-tools archive did not contain rz-tools or rouxzhee-tools.');
  }
  await copyFile(binary, installedToolPath);
}

async function exportContent(rzToolsPath) {
  const contentDir = path.resolve(projectRoot, process.env.ROUXZHEE_CONTENT_DIR || 'doc');
  const outputDir = path.resolve(projectRoot, process.env.ROUXZHEE_SITE_DATA_DIR || '.site-data');

  if (!existsSync(contentDir)) {
    log(`Content directory not found, skipping export: ${path.relative(projectRoot, contentDir)}`);
    return;
  }

  log(`Exporting Astro content: ${path.relative(projectRoot, contentDir)} -> ${path.relative(projectRoot, outputDir)}`);
  await run(rzToolsPath, [
    'content',
    'export',
    '--framework',
    'astro',
    '--input',
    contentDir,
    '--output',
    outputDir,
  ], { cwd: projectRoot });
}

async function runAstro(command, args) {
  const astroBin = path.join(projectRoot, 'node_modules', '.bin', isWindows ? 'astro.cmd' : 'astro');
  const executable = existsSync(astroBin) ? astroBin : isWindows ? 'npx.cmd' : 'npx';
  const astroArgs = existsSync(astroBin) ? [command, ...args] : ['astro', command, ...args];

  log(`Starting Astro: astro ${[command, ...args].join(' ')}`.trim());
  await run(executable, astroArgs, { cwd: projectRoot });
}

function findLocalDevelopmentBinary() {
  const toolsBinDir = path.resolve(projectRoot, '..', 'rouxzhee-tools', 'bin');
  const candidates = [];

  if (process.platform === 'darwin') {
    candidates.push(path.join(toolsBinDir, `rouxzhee-tools-darwin-${process.arch === 'arm64' ? 'arm64' : 'amd64'}`));
  }
  if (process.platform === 'win32') {
    candidates.push(path.join(toolsBinDir, 'rouxzhee-tools.exe'));
  }
  if (process.platform === 'linux') {
    candidates.push(path.join(toolsBinDir, 'rouxzhee-tools'));
  }

  candidates.push(path.join(toolsBinDir, isWindows ? 'rz-tools.exe' : 'rz-tools'));
  candidates.push(path.join(toolsBinDir, isWindows ? 'rouxzhee-tools.exe' : 'rouxzhee-tools'));

  return candidates.find((candidate) => existsSync(candidate));
}

async function fetchJSON(url) {
  const response = await fetchWithPreviewCookies(url);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Failed to fetch rz-tools manifest: HTTP ${response.status}. ${body.slice(0, 160)}`);
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`The rz-tools manifest is not valid JSON: ${body.slice(0, 160)}`);
  }
}

async function downloadBytes(url) {
  const response = await fetchWithPreviewCookies(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to download rz-tools: HTTP ${response.status}. ${body.slice(0, 160)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function fetchWithPreviewCookies(url) {
  const cookies = new Map();
  let currentURL = new URL(url);
  const cookieOrigin = currentURL.origin;

  for (let index = 0; index < 8; index += 1) {
    const headers = {};
    const cookieHeader = currentURL.origin === cookieOrigin ? cookieHeaderFor(cookies) : '';
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const response = await fetch(currentURL, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(60_000),
    });

    if (currentURL.origin === cookieOrigin) {
      storeCookies(cookies, response.headers);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error(`Redirect from ${redactURL(currentURL.toString())} did not include a Location header.`);
      }
      currentURL = new URL(location, currentURL);
      continue;
    }

    return response;
  }

  throw new Error(`Too many redirects while fetching ${redactURL(url)}.`);
}

function storeCookies(cookies, headers) {
  const values =
    typeof headers.getSetCookie === 'function'
      ? headers.getSetCookie()
      : splitSetCookie(headers.get('set-cookie'));

  for (const value of values) {
    const [pair] = value.split(';');
    const separator = pair.indexOf('=');
    if (separator > 0) {
      cookies.set(pair.slice(0, separator).trim(), pair.slice(separator + 1).trim());
    }
  }
}

function splitSetCookie(value) {
  if (!value) return [];
  return value.split(/,\s*(?=[^;,]+=)/);
}

function cookieHeaderFor(cookies) {
  return [...cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

async function assertExecutable(binaryPath) {
  await access(binaryPath);
  const info = await stat(binaryPath);
  if (!info.isFile()) {
    throw new Error(`rz-tools path is not a file: ${binaryPath}`);
  }
}

function trimSeparator(args) {
  return args[0] === '--' ? args.slice(1) : args;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    // Node.js v24+ on Windows blocks direct spawn of .cmd/.bat with shell: false (CVE-2024-27980).
    // Use `cmd /c` for batch files to avoid EINVAL and deprecation warnings.
    const isBatch = isWindows && (command.endsWith('.cmd') || command.endsWith('.bat'));
    const resolvedCommand = isBatch ? 'cmd' : command;
    const resolvedArgs = isBatch ? ['/c', command, ...args] : args;

    const child = spawn(resolvedCommand, resolvedArgs, {
      cwd: options.cwd || projectRoot,
      stdio: 'inherit',
      shell: false,
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}.`));
      }
    });
  });
}

function redactURL(value) {
  const url = new URL(value);
  for (const key of url.searchParams.keys()) {
    if (/token|key|secret|signature|time/i.test(key)) {
      url.searchParams.set(key, '<redacted>');
    }
  }
  return url.toString();
}

function log(message) {
  console.log(`[rz-start] ${message}`);
}
