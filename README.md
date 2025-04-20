# oras-bin

Node.js wrapper for the [oras](https://github.com/oras-project/oras) CLI binaries. Automatically selects the correct binary for your OS and architecture after install.

## Installation

```sh
npm install oras-bin
```

## Usage

```js
const oras = require('oras-bin');
const { spawnSync } = require('child_process');

// Example: print oras version
const result = spawnSync(oras, ['version'], { encoding: 'utf-8' });
console.log(result.stdout);
```

## How it works
- On install, only the binary matching your platform is kept in the `.bin/` folder.
- The module exports the path to the binary for use with `child_process`.

## Updating Binaries
- To update the oras binary, just replace the files in `.bin/` with new versions (keep the naming convention). No code changes required.

## Testing

```sh
npm test
```

## Publishing
- Versioning and publishing are automated via GitHub Actions. See `.github/workflows/publish.yml`.

---

MIT License
