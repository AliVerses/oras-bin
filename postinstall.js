"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryPattern = getBinaryPattern;
exports.extractBinary = extractBinary;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const tar = __importStar(require("tar"));
const unzipper = __importStar(require("unzipper"));
/**
 * Skips binary extraction in CI/CD and dev environments.
 * Ensures postinstall only runs for end users, never in CI or during publish.
 */
function isDevInstall() {
    console.log('[oras-bin] Checking if this is a dev install...', process.env);
    // return !(
    //   process.env.ORAS_BIN_DEV ||
    //   process.env.npm_lifecycle_event === 'build' ||
    //   process.env.npm_config_argv?.includes('link')
    // )
    return process.env.ORAS_BIN_DEV === 'true';
}
function getBinaryPattern(platform, arch) {
    if (platform === 'darwin') {
        if (arch === 'arm64')
            return 'darwin_arm64';
        if (arch === 'x64')
            return 'darwin_amd64';
    }
    else if (platform === 'linux') {
        if (arch === 'x64')
            return 'linux_amd64';
        if (arch === 'arm64')
            return 'linux_arm64';
    }
    else if (platform === 'win32') {
        if (arch === 'x64')
            return 'windows_amd64';
    }
    throw new Error(`Unsupported platform/arch: ${platform}/${arch}`);
}
async function extractBinary() {
    if (isDevInstall()) {
        console.log('[oras-bin] Skipping binary extraction/cleanup (dev mode/CI detected)');
        return;
    }
    const libDir = path.resolve(__dirname, '../lib');
    const binDir = path.resolve(__dirname, '../.bin');
    if (!fs.existsSync(libDir)) {
        console.error('[oras-bin] ERROR: lib directory does not exist. Please add compressed oras binaries to lib/.');
        return;
    }
    if (!fs.existsSync(binDir))
        fs.mkdirSync(binDir);
    const platform = os.platform();
    const arch = os.arch();
    const pattern = getBinaryPattern(platform, arch);
    const files = fs.readdirSync(libDir);
    console.log(`[oras-bin] Files in lib:`, files);
    console.log(`[oras-bin] Extracting binary for platform: ${platform}, arch: ${arch}, pattern: ${pattern}`);
    if (files.length === 0) {
        console.error('[oras-bin] ERROR: No files found in lib directory.');
        return;
    }
    const archive = files.find(f => f.includes(pattern));
    if (!archive) {
        console.error(`[oras-bin] ERROR: No file found matching pattern '${pattern}'. Files present:`, files);
        throw new Error(`No matching oras binary archive found for pattern: ${pattern}`);
    }
    const archivePath = path.join(libDir, archive);
    // Extract based on file type
    if (archive.endsWith('.tar.gz')) {
        await tar.x({
            file: archivePath,
            cwd: binDir
        });
    }
    else if (archive.endsWith('.zip')) {
        await fs.createReadStream(archivePath)
            .pipe(unzipper.Extract({ path: binDir }))
            .promise();
    }
    else {
        throw new Error('Unsupported archive format: ' + archive);
    }
    // Set executable permission for all files in .bin
    const binFiles = fs.readdirSync(binDir);
    for (const f of binFiles) {
        const fullPath = path.join(binDir, f);
        if (fs.statSync(fullPath).isFile()) {
            fs.chmodSync(fullPath, 0o755);
        }
    }
    // Clean up lib folder
    for (const f of files) {
        if (!f.startsWith('.'))
            fs.rmSync(path.join(libDir, f));
    }
}
// Await extraction and handle errors
extractBinary().catch((err) => {
    console.error('[oras-bin] Extraction failed:', err);
    process.exit(1);
});
