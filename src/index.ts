import * as path from 'path';
import * as fs from 'fs';

/**
 * Returns the absolute path to the oras binary in the .bin directory.
 * Throws if the oras binary is not present.
 */
export function getOrasBinaryPath(): string {
  const binDir = path.resolve(__dirname, '../.bin');
  const files = fs.readdirSync(binDir).filter(f => !f.startsWith('.'));
  const binaryName = process.platform === 'win32' ? 'oras.exe' : 'oras';
  const orasPath = files.find(f => f === binaryName);
  if (!orasPath) {
    throw new Error(`oras binary (${binaryName}) not found in .bin. Files present: ${files.join(', ')}`);
  }
  return path.join(binDir, orasPath);
}

// Default export for convenience
const oras: string = getOrasBinaryPath();
export default oras;
