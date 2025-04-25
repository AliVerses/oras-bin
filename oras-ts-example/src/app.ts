// app.ts
import orasBinary from 'oras-bin-wrapper';
import { execSync } from 'child_process';

// Get the binary path
console.log(`ORAS binary path: ${orasBinary}`);

// Execute the binary
try {
  const result = execSync(`${orasBinary} version`, { encoding: 'utf8' });
  console.log('ORAS version:', result.trim());
} catch (error) {
  console.error('Error executing ORAS binary:', error);
}