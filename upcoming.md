# oras-bin-wrapper

[![npm version](https://badge.fury.io/js/oras-bin-wrapper.svg)](https://badge.fury.io/js/oras-bin-wrapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Node.js wrapper for the [oras](https://github.com/oras-project/oras) CLI binaries. Automatically downloads and selects the correct binary for your OS and architecture during installation.

## Installation

```sh
npm install oras-bin-wrapper
# or
yarn add oras-bin-wrapper
```

## Usage

The module exports the path to the installed `oras` binary. You can use it with Node.js's `child_process` module.

```javascript
const orasBinaryPath = require('oras-bin-wrapper');
const { spawnSync, execSync } = require('child_process');

// Example 1: Print oras version
console.log('--- ORAS Version ---');
try {
  const versionResult = spawnSync(orasBinaryPath, ['version'], { encoding: 'utf-8' });
  if (versionResult.error) throw versionResult.error;
  if (versionResult.status !== 0) throw new Error(`oras exited with code ${versionResult.status}: ${versionResult.stderr}`);
  console.log(versionResult.stdout);
} catch (error) {
  console.error('Error getting ORAS version:', error.message);
}

// Example 2: Push a file (replace with your actual registry, repo, tag, and file)
// NOTE: Ensure you are authenticated with the target registry beforehand.
console.log('\n--- ORAS Push (Example) ---');
const registry = 'your-registry.com';
const repo = 'your-repo';
const tag = 'latest';
const fileToPush = 'myfile.txt:application/octet-stream'; // Example file with media type
try {
  // Ensure the file exists, e.g., using fs.writeFileSync('myfile.txt', 'Hello ORAS!');
  const pushCommand = `${orasBinaryPath} push ${registry}/${repo}:${tag} ${fileToPush}`;
  console.log(`Executing: ${pushCommand}`);
  // Using execSync for simplicity, consider spawn for better stream handling
  const pushOutput = execSync(pushCommand, { encoding: 'utf-8' });
  console.log('Push successful:', pushOutput);
} catch (error) {
  console.error('Error pushing artifact:', error.message);
  // stderr might contain more details from the oras cli
  if (error.stderr) {
    console.error('ORAS stderr:', error.stderr);
  }
}

// Example 3: Pull an artifact (replace with actual reference)
// console.log('\n--- ORAS Pull (Example) ---');
// try {
//   const pullCommand = `${orasBinaryPath} pull ${registry}/${repo}:${tag}`;
//   console.log(`Executing: ${pullCommand}`);
//   const pullOutput = execSync(pullCommand, { encoding: 'utf-8' });
//   console.log('Pull successful:', pullOutput);
// } catch (error) {
//   console.error('Error pulling artifact:', error.message);
//   if (error.stderr) {
//     console.error('ORAS stderr:', error.stderr);
//   }
// }

```

**Important:** When using `spawnSync` or `execSync`, always check the `status` (or `code`) and `stderr` properties of the result/error object to handle potential issues from the `oras` CLI execution.

## How it works
- On `npm install`, the `postinstall.js` script determines your OS and architecture.
- It downloads the appropriate `oras` binary release from GitHub releases.
- The binary is extracted and placed into a `./node_modules/oras-bin-wrapper/bin/` directory (relative to your project root).
- Only the binary matching your platform is kept.
- The main module (`index.js`) resolves and exports the path to this executable binary.

## Updating Binaries
- The specific ORAS version downloaded is managed within the `postinstall.js` script.
- To update the ORAS version used by this package, a new version of `oras-bin-wrapper` needs to be published with updated download logic/URLs in `postinstall.js`.

## Testing

```sh
npm test
```

## Publishing
- Versioning and publishing are automated via GitHub Actions. See `.github/workflows/publish.yml`.

---

MIT License
