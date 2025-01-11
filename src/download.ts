import { platform, arch } from 'os';
import { createWriteStream, chmodSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { extract } from 'tar';
import unzipper from 'unzipper';

async function configureOras() {
  const osPlatform = platform();
  const osArch = arch();
  const version = '1.2.2'; // specify the version of oras
  let binaryName = 'oras';
  let archivePath = '';

  switch (osPlatform) {
    case 'linux':
      archivePath = join(__dirname, '..', '..', 'bin', `oras_${version}_linux_${osArch}.tar.gz`);
      break;
    case 'win32':
      archivePath = join(__dirname, '..', '..', 'bin', `oras_${version}_windows_${osArch}.zip`);
      binaryName = 'oras.exe';
      break;
    case 'darwin':
      archivePath = join(__dirname, '..', '..', 'bin', `oras_${version}_darwin_${osArch}.tar.gz`);
      break;
    default:
      throw new Error(`Unsupported platform: ${osPlatform}`);
  }

  const destDir = `./bin/${osPlatform}`;
  const dest = join(destDir, binaryName);

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  if (archivePath.endsWith('.tar.gz')) {
    await extract({ file: archivePath, cwd: destDir });
  } else if (archivePath.endsWith('.zip')) {
    await unzipper.Open.file(archivePath).then(d => d.extract({ path: destDir }));
  } else {
    throw new Error(`Unsupported archive format: ${archivePath}`);
  }

  chmodSync(dest, '755');

  // Remove non-related binaries
  const platforms = ['linux', 'win32', 'darwin'];
  platforms.forEach((platform) => {
    if (platform !== osPlatform) {
      const otherBinary = join(`./bin/${platform}`, platform === 'win32' ? 'oras.exe' : 'oras');
      if (existsSync(otherBinary)) {
        unlinkSync(otherBinary);
      }
    }
  });

  // Make the binary globally executable
  const globalBinPath = join(__dirname, '..', '..', 'node_modules', '.bin', 'oras');
  if (existsSync(globalBinPath)) {
    unlinkSync(globalBinPath);
  }
  createWriteStream(globalBinPath).write(dest);
  chmodSync(globalBinPath, '755');
}

export { configureOras };