export type SupportedPlatform = 'darwin' | 'linux' | 'win32';
export type SupportedArch = 'x64' | 'arm64';
export declare function getBinaryPattern(platform: SupportedPlatform, arch: SupportedArch): string;
export declare function extractBinary(): Promise<void>;
