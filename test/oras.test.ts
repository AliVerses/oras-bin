import { spawnSync } from 'child_process';
import oras from '../src/index';
import { strict as assert } from 'assert';

describe('oras binary', function() {
  it('should print version', function() {
    const ext = process.platform === 'win32' ? '.exe' : '';
    const binary = oras.endsWith('.zip') || oras.endsWith('.tar.gz') ? oras : oras + ext;
    const result = spawnSync(binary, ['version'], { encoding: 'utf-8' });
    console.log(result.stdout);
    assert.equal(result.status, 0, `Process exited with code ${result.status}. stderr: ${result.stderr}`);
    assert.match(result.stdout, /version/i, 'Output should mention version');
  });
});
