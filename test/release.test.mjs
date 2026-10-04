import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {validateRelease} from '../scripts/release-guard.mjs';
import {pluginVersion} from '../dist/metadata.js';
import {Runtime} from '../dist/runtime.js';
import {silentLog} from './helpers.mjs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
test('prerelease guard matches alpha and beta versions to their tag, never latest', () => {
  for (const version of ['2.0.0', '2.1.0', '3.0.0']) {
    for (const channel of ['alpha', 'beta']) {
      const candidate = {...pkg, version: `${version}-${channel}.1`};
      assert.doesNotThrow(() => validateRelease(candidate, channel));
      for (const tag of [undefined, 'latest', channel === 'alpha' ? 'beta' : 'alpha']) assert.throws(() => validateRelease(candidate, tag));
    }
  }
  for (const version of ['2.0.0', '2.0.0-rc.1', '2.0.0-beta.1extra', '02.1.0-beta.1', '2.1.0-beta.01']) assert.throws(() => validateRelease({...pkg, version}, 'beta'));
  assert.throws(() => validateRelease({...pkg, name: 'another-plugin'}, 'alpha'));
  assert.throws(() => validateRelease({...pkg, name: 'homebridge-http-advanced-accessory'}, 'alpha'));
  const run = tag => spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/release-guard.mjs', import.meta.url))], {env: {...process.env, npm_config_tag: tag}, encoding: 'utf8'});
  assert.equal(run(pkg.publishConfig.tag).status, 0);
  assert.notEqual(run(pkg.publishConfig.tag === 'latest' ? 'alpha' : 'latest').status, 0);
});

test('stable platform releases require latest and reject prerelease channels or malformed versions', () => {
  for (const version of ['1.0.0', '2.0.0', '2.1.0', '3.0.1']) {
    const candidate = {...pkg, version};
    assert.doesNotThrow(() => validateRelease(candidate, 'latest'));
    for (const tag of [undefined, 'alpha', 'beta']) assert.throws(() => validateRelease(candidate, tag));
  }
  for (const version of ['02.0.0', '2.00.0', '2.0.01', '2.0.0-rc.1', '2.0.0extra', '2.0']) {
    assert.throws(() => validateRelease({...pkg, version}, 'latest'));
  }
  for (const name of ['another-plugin', 'homebridge-http-advanced-accessory']) {
    assert.throws(() => validateRelease({...pkg, name, version: '2.0.0'}, 'latest'));
  }
});

test('runtime startup identifies the actual package version', t => {
  const messages = [];
  const runtime = new Runtime({...silentLog, info: message => messages.push(message)});
  t.after(() => runtime.shutdown());
  runtime.start();
  assert.equal(pluginVersion, pkg.version);
  assert.ok(messages[0].startsWith(`HTTP Advanced ${pkg.version}:`));
});
