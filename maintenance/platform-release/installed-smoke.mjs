// isolated tarball acceptance; host APIs come from development dependencies
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import { makeAPI, fakeServer, silentLog } from '../../test/helpers.mjs';

assert.ok(process.env.HTTP_ADVANCED_INSTALLED_ROOT, 'Provide an isolated installed package root');
const installedRoot = resolve(process.env.HTTP_ADVANCED_INSTALLED_ROOT);
const pkg = JSON.parse(readFileSync(join(installedRoot, 'package.json'), 'utf8'));
const require = createRequire(import.meta.url);
const host = process.env.HB_TEST_VERSION === '1' ? 'homebridge-v1' : 'homebridge';
const { Plugin } = await import(pathToFileURL(require.resolve(host).replace(/index\.js$/, 'plugin.js')).href);
const { sharedRuntime } = await import(pathToFileURL(join(installedRoot, 'dist/runtime.js')).href);

async function loadPlugin(api) {
  const plugin = new Plugin(pkg.name, installedRoot, pkg);
  await plugin.load();
  await plugin.initialize(api);
  return plugin;
}

test('production-only tarball loads through Homebridge and registers both public aliases', async t => {
  const api = await makeAPI(t), calls = [];
  api.registerAccessory = (...args) => calls.push(args.slice(0, 2));
  api.registerPlatform = (...args) => calls.push(args.slice(0, 2));
  await loadPlugin(api);
  assert.equal(pkg.name, 'homebridge-http-advanced-platform');
  assert.deepEqual(calls, [[pkg.name, 'HttpAdvancedAccessory'], [pkg.name, 'HttpAdvanced']]);
});

test('installed adapters read and write loopback devices using package-qualified constructors', async t => {
  const api = await makeAPI(t), server = await fakeServer(t);
  api.registerAccessory = () => {}; api.registerPlatform = () => {};
  const plugin = await loadPlugin(api);
  const { LegacyAccessory } = await import(pathToFileURL(join(installedRoot, 'dist/accessory.js')).href);
  const { HTTPPlatform } = await import(pathToFileURL(join(installedRoot, 'dist/platform.js')).href);
  // exercise the host's constructor lookup with the public package prefixes
  plugin.registerAccessory('HttpAdvancedAccessory', LegacyAccessory);
  plugin.registerPlatform('HttpAdvanced', HTTPPlatform);
  const config = name => ({name, service: 'Switch', urls: {
    getOn: {url: `${server.url}/${name}/state`}, setOn: {url: `${server.url}/${name}/set/{value}`},
  }});
  const Legacy = plugin.getAccessoryConstructor(`${pkg.name}.HttpAdvancedAccessory`);
  const Platform = plugin.getPlatformConstructor(`${pkg.name}.HttpAdvanced`);
  const legacy = new Legacy(silentLog, config('Legacy'), api);
  new Platform(silentLog, {platform: 'HttpAdvanced', name: 'Installed Fixture', devices: [config('Platform')]}, api).discover();
  const runtime = sharedRuntime(api, silentLog);
  await Promise.all([...runtime.entries.values()].map(entry => runtime.refresh(entry)));
  for (const service of [legacy.getServices()[1], api.registrations[0].getService(api.hap.Service.Switch)]) {
    const on = service.getCharacteristic(api.hap.Characteristic.On);
    assert.equal(await on.handleGetRequest(), true); await on.handleSetRequest(false);
  }
  assert.equal(server.requests.filter(request => request.url.endsWith('/set/false')).length, 2);
});

test('installed official custom UI IPC preserves qualified config, bridge fields and unrelated settings', {timeout: 10000}, async t => {
  const api = await makeAPI(t), configPath = api.user.configPath();
  const config = {bridge: {name: 'Isolated UI fixture'}, unrelated: {keep: true},
    accessories: [{accessory: `${pkg.name}.HttpAdvancedAccessory`, name: 'Fixture Legacy', service: 'Switch'}],
    platforms: [{platform: `${pkg.name}.HttpAdvanced`, name: 'Fixture Platform', enabled: false, devices: []}]};
  writeFileSync(configPath, JSON.stringify(config), {mode: 0o600});
  const schema = JSON.parse(readFileSync(join(installedRoot, 'config.schema.json'), 'utf8'));
  assert.equal(schema.pluginAlias, 'HttpAdvancedAccessory'); assert.equal(schema.pluginType, 'accessory');
  assert.equal(schema.customUi, true);
  const child = fork(join(installedRoot, 'homebridge-ui/server.js'), [], {
    env: {...process.env, HOMEBRIDGE_CONFIG_PATH: configPath}, stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });
  t.after(() => child.kill());
  const [ready] = await once(child, 'message'); assert.equal(ready.action, 'ready');
  const request = async (path, body) => {
    child.send({action: 'request', path, requestId: 'fixture', body});
    const [response] = await once(child, 'message'); assert.equal(response.payload.success, true);
    return response.payload.data;
  };
  const loaded = await request('/settings/load');
  assert.equal(loaded.draft.accessories.length, 1); assert.equal(loaded.draft.platforms.length, 1);
  loaded.draft.settings = {requestTimeout: 30000}; loaded.draft.platforms[0].enabled = true;
  assert.equal((await request('/settings/save', loaded)).changed, true);
  const saved = JSON.parse(readFileSync(configPath, 'utf8'));
  assert.deepEqual(saved.accessories, config.accessories); assert.deepEqual(saved.bridge, config.bridge);
  assert.deepEqual(saved.unrelated, config.unrelated); assert.equal(saved.platforms[0].enabled, true);
});
