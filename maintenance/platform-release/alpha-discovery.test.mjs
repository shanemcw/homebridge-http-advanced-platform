// exercise Homebridge UI 5.29.0 against synthetic Alpha-only registry data
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

assert.ok(process.env.HTTP_ADVANCED_UI_ROOT, 'Provide the isolated Homebridge UI package root');
assert.ok(process.env.HTTP_ADVANCED_UI_SOURCE_ROOT, 'Provide pinned v5.29.0 version-chooser sources');
const uiRoot = resolve(process.env.HTTP_ADVANCED_UI_ROOT);
const sourceRoot = resolve(process.env.HTTP_ADVANCED_UI_SOURCE_ROOT);
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
assert.equal(JSON.parse(readFileSync(join(uiRoot, 'package.json'), 'utf8')).version, '5.29.0');
for (const [file, expected] of Object.entries({
  'plugin-card.component.html': 'c4464103ec84ce592577d92f49ae4d01f64e79996e1ac16eeaf0564716e2d953',
  'manage-version.component.ts': 'dbc527f74f244d76f69d412460474dc9338c8a2b7d9bde6314a1875acc2e1093',
  'manage-version.component.html': '2c14c7caa07a1cf2f8900349f3d8cd1cfcbdef7f857c3e7c09cf28a28c87547d',
})) {
  assert.equal(createHash('sha256').update(readFileSync(join(sourceRoot, file))).digest('hex'), expected, file);
}
const hostRequire = createRequire(join(uiRoot, 'package.json'));
const { of } = hostRequire('rxjs');
const { PluginsService } = await import(pathToFileURL(join(uiRoot, 'dist/modules/plugins/plugins.service.js')));
const require = createRequire(import.meta.url);
const ts = require('typescript');
const packument = {
  ...pkg,
  'dist-tags': { alpha: pkg.version },
  versions: { [pkg.version]: pkg },
  time: { modified: '2026-09-26T00:00:00Z' },
  maintainers: [{ name: 'shanemcw' }],
};

function makeService() {
  // omit the constructor's external registry refresh and recurring timer
  const service = Object.create(PluginsService.prototype);
  Object.assign(service, {
    installedPlugins: [], npmPluginCache: new Map(),
    hiddenPlugins: [], hiddenScopes: [], unmaintainedPlugins: [],
    pluginNames: {}, pluginAuthors: {}, pluginIcons: {}, newScopePlugins: {},
    scopedPluginNames: [], verifiedPlugins: [], verifiedPlusPlugins: [],
    pluginListUrl: new URL('https://example.invalid/'),
    logger: { error: message => assert.fail(message) },
    httpService: { get: url => {
      const data = url.includes('/-/v1/search?')
        ? { objects: [{ package: { ...pkg, date: packument.time.modified, links: {} } }] }
        : packument;
      return of({ data: structuredClone(data) });
    } },
  });
  return service;
}

function state(initial) {
  let value = initial;
  const accessor = () => value;
  accessor.set = next => { value = next; };
  return accessor;
}

function makeChooser(plugin, service, selections) {
  const source = readFileSync(join(sourceRoot, 'manage-version.component.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    experimentalDecorators: true,
  } }).outputText;
  const exported = {};
  // stub Angular rendering/injection only; run the upstream component methods
  runInNewContext(compiled, {
    exports: exported,
    require: name => name === 'semver' ? require(name)
      : name === '@angular/core' ? {
        Component: () => target => target, ChangeDetectionStrategy: { OnPush: 0 },
      } : {},
    console,
  });
  const chooser = Object.create(exported.ManageVersionComponent.prototype);
  Object.assign(chooser, {
    plugin, _versionSelect: state(plugin.latestVersion),
    versions: state([]), versionsWithTags: state([]), loading: state(true),
    $api: { get: path => {
      assert.equal(path, `/plugins/lookup/${pkg.name}/versions`);
      return service.getAvailablePluginVersions(pkg.name);
    } },
    $activeModal: { close: selection => selections.push(selection), dismiss: () => assert.fail('Chooser dismissed') },
    $toastr: { error: message => assert.fail(message) },
    $translate: { instant: text => text },
  });
  return chooser;
}

test('exact new-package lookup keeps an Alpha-only plugin discoverable without latest', async () => {
  const results = await makeService().searchNpmRegistry(pkg.name);
  assert.equal(results.length, 1);
  assert.equal(results[0].name, pkg.name);
  assert.equal(results[0].publicPackage, true);
  assert.equal(results[0].supportsHap, true);
  assert.equal(results[0].latestVersion, undefined);
  assert.equal(results[0].verifiedPlugin, false);
});

test('indexed candidate metadata matches descriptive HTTP, mapping and device searches', async () => {
  for (const query of ['HTTP Advanced', 'HTTP accessory', 'HTTP Advanced Platform', 'REST API', 'HTTP JSON', 'JSONPath', 'XML', 'XPath', 'polling', 'HTTP switch', 'HTTP sensor']) {
    const results = await makeService().searchNpmRegistry(query);
    assert.equal(results.length, 1, query);
    assert.equal(results[0].name, pkg.name);
  }
});

test('actual version chooser selects Alpha and backend preserves its exact npm version', async () => {
  const service = makeService();
  const [plugin] = await service.searchNpmRegistry(pkg.name);
  const selections = [], commands = [];
  const chooser = makeChooser(plugin, service, selections);
  await chooser.lookupVersions();
  assert.equal(chooser.loading(), false);
  assert.deepEqual(JSON.parse(JSON.stringify(chooser.versionsWithTags())), [{ version: pkg.version, tag: 'alpha' }]);
  assert.equal(chooser.versions()[0].version, pkg.version);
  chooser.doInstall(chooser.versionsWithTags()[0].version);
  assert.equal(selections.length, 1);
  assert.equal(selections[0].version, pkg.version);
  assert.equal(selections[0].action, 'install');

  // the upstream templates wire first installation to this tagged-version flow
  const card = readFileSync(join(sourceRoot, 'plugin-card.component.html'), 'utf8');
  assert.match(card, /@if \(plugin\(\)\.publicPackage && !plugin\(\)\.installedVersion\) \{\s*<button[\s\S]*?\(click\)="installAlternateVersion\(\)"/);
  const template = readFileSync(join(sourceRoot, 'manage-version.component.html'), 'utf8');
  assert.match(template, /@for \(version of versionsWithTags\(\);[\s\S]*?\(click\)="doInstall\(version\.version\)"/);

  service.configService = { name: 'homebridge-config-ui-x', customPluginPath: resolve(uiRoot, '..') };
  service.getInstalledPlugins = async () => [];
  service.isPluginBundleAvailable = async () => false;
  service.applyAllowScripts = async () => {};
  service.cleanNpmCache = async () => {};
  service.ensureCustomPluginDirExists = async () => {};
  service.getNpmModuleLatestVersion = async () => assert.fail('Alpha selection must not resolve latest');
  Object.defineProperty(service, 'npm', { value: ['npm'] });
  service.runNpmCommand = async command => { commands.push(command); };
  await service.doManagePlugin('install', { ...selections[0] }, { emit() {} });
  assert.equal(commands.length, 1);
  assert.equal(commands[0].at(-1), `${pkg.name}@${pkg.version}`);
  assert.ok(commands[0].includes('--omit=dev'));
});
