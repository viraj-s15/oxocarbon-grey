import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { accent } from '../palette.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

for (const file of ['herdr/oxocarbon-grey.toml', 'herdr/oxocarbon-grey.json']) {
  test(`--check fails when ${file} is stale or missing`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'herdr-'));
    try {
      cpSync(join(root, 'src'), join(dir, 'src'), { recursive: true });
      cpSync(join(root, 'herdr'), join(dir, 'herdr'), { recursive: true });
      const check = () => spawnSync(process.execPath, [join(dir, 'src/herdr/build.mjs'), '--check'], { encoding: 'utf8' });
      assert.equal(check().status, 0);
      const committed = readFileSync(join(root, file), 'utf8');
      assert.ok(committed.includes(accent.purple));
      writeFileSync(join(dir, file), committed.replace(accent.purple, '#ffff00'));
      let result = check();
      assert.equal(result.status, 1);
      assert.match(result.stderr, new RegExp(`${file} is out of date`));
      rmSync(join(dir, file));
      result = check();
      assert.equal(result.status, 1);
      assert.match(result.stderr, new RegExp(`${file} is missing`));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
