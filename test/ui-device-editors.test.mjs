import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { ConfigEditor } from '../dist/ui-config.js';

// run the actual browser event handlers against a small DOM and the real save path
class Element extends EventTarget {
  constructor(tagName, document) { super(); this.tagName = tagName; this.document = document; this.children = []; this.value = ''; }
  append(...nodes) { for (const node of nodes) { if (node instanceof Element) node.parentNode = this; this.children.push(node); } }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  remove() { this.parentNode.children = this.parentNode.children.filter(node => node !== this); }
  set textContent(value) { this.replaceChildren(String(value)); }
  get textContent() { return this.children.map(node => node instanceof Element ? node.textContent : node).join(''); }
  focus() { this.document.activeElement = this; }
  setCustomValidity(value) { this.validationMessage = value; }
  reportValidity() { return !elements(this).some(node => node.validationMessage); }
  dispatchEvent(event) {
    const result = super.dispatchEvent(event);
    if (event.bubbles && this.parentNode) this.parentNode.dispatchEvent(event);
    return result;
  }
}
const elements = root => [root, ...root.children.flatMap(node => node instanceof Element ? elements(node) : [])];
const click = node => node.dispatchEvent(new Event('click', { bubbles: true }));
const edit = (node, value) => { node.value = value; node.dispatchEvent(new Event('input', { bubbles: true })); };

async function setup(t) {
  const root = mkdtempSync(join(tmpdir(), 'http-platform-device-ui-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const path = join(root, 'config.json');
  const device = { id: 'first-device', name: 'First Device', service: 'Switch',
    urls: { getOn: { url: 'http://example.invalid/?command=%24home%7B%22Lamp%22%7D%3D1%3B&literal=%2520' },
      setOn: { url: 'http://example.invalid', httpMethod: 'PUSH', body: '${value}%2B{value}',
        mappers: [{ type: 'eval', parameters: { expression: 'value ? "x%20y" : "x+y"' } }] } },
    additionalServices: [{ id: 'battery', service: 'Battery', urls: {} }], custom: { nested: [1, false, 'keep'] } };
  const config = { bridge: { name: 'Fixture' }, accessories: [{ accessory: 'Other', name: 'Unrelated' },
    { accessory: 'HttpAdvancedAccessory', name: 'Legacy Fixture', service: 'Switch', urls: {} }],
    platforms: [{ platform: 'Other', name: 'Unrelated Platform' },
      { platform: 'homebridge-http-advanced-platform.HttpAdvanced', name: 'First Platform', devices: [device,
        { id: 'second-device', name: 'Second Device', service: 'Switch', urls: {} }],
      _bridge: { username: '00:00:00:00:00:03', port: 43210 }, coordinator: { perOrigin: 1 }, custom: { keep: true } },
      { platform: 'HttpAdvanced', name: 'Second Platform', enabled: false, devices: [structuredClone(device)] }],
    unrelated: { keep: ['exactly', false] } };
  writeFileSync(path, JSON.stringify(config, null, 4) + '\n');
  const document = { createElement: tag => new Element(tag, document) };
  document.root = document.createElement('div');
  document.getElementById = id => elements(document.root).find(node => node.id === id);
  const add = (tag, id, parent = document.root) => { const node = document.createElement(tag); node.id = id; parent.append(node); return node; };
  add('p', 'status');
  const form = add('form', 'settings');
  const fieldset = add('fieldset', 'settings-fields', form);
  for (const id of ['legacy-count', 'legacy-summary', 'legacy-config', 'add-accessory', 'timings', 'platforms', 'add-platform', 'save']) add('div', id, fieldset);
  add('div', 'legacy-accessories', add('details', 'legacy-details', fieldset));
  const editor = new ConfigEditor(path);
  const homebridge = new EventTarget();
  const saves = [];
  homebridge.disableSaveButton = () => {};
  homebridge.closeSettings = () => { homebridge.closed = true; };
  homebridge.request = async (route, body) => {
    if (route === '/settings/load') return editor.load();
    assert.equal(route, '/settings/save');
    const input = JSON.parse(JSON.stringify(body)); // match JSON IPC across browser/server realms
    saves.push(input);
    return editor.save(input);
  };
  runInNewContext(readFileSync(new URL('../homebridge-ui/public/settings.js', import.meta.url), 'utf8'),
    { homebridge, document, structuredClone, crypto: webcrypto });
  homebridge.dispatchEvent(new Event('ready'));
  await nextTurn();
  const $ = document.getElementById;
  const save = async () => { form.dispatchEvent(new Event('submit', { cancelable: true })); await nextTurn(); };
  const platformBox = index => $(`platform-${index}`).parentNode.parentNode;
  const button = (index, text) => elements(platformBox(index)).find(node => node.tagName === 'button' && node.textContent === text);
  return { $, path, config, saves, save, platformBox, button, document, homebridge, read: () => JSON.parse(readFileSync(path, 'utf8')) };
}

test('individual platform editors save an unchanged configuration without rewriting it', async t => {
  const ui = await setup(t);
  const before = readFileSync(ui.path, 'utf8');
  assert.equal(JSON.parse(ui.$('platform-1').value).devices, undefined);
  assert.equal(JSON.parse(ui.$('platform-1-device-1').value).id, 'first-device');
  assert.equal(JSON.parse(ui.$('platform-2-device-1').value).id, 'first-device');
  await ui.save();
  assert.equal(ui.$('status').textContent, 'No changes to save.');
  assert.equal(readFileSync(ui.path, 'utf8'), before);
});

test('editing one platform device preserves its identity, requests, peers and platform fields', async t => {
  const ui = await setup(t);
  const changed = { ...ui.config.platforms[1].devices[0], manufacturer: 'Edited Fixture' };
  edit(ui.$('platform-1-device-1'), JSON.stringify(changed));
  await ui.save();
  const expected = structuredClone(ui.config);
  expected.platforms[1].devices[0] = changed;
  assert.deepEqual(ui.read(), expected);
  assert.match(ui.$('status').textContent, /^Saved/);
});

test('adding and removing devices is scoped to one platform and assigns fresh identities', async t => {
  const ui = await setup(t);
  click(ui.button(1, 'Add Device to “First Platform”'));
  const first = JSON.parse(ui.$('platform-1-device-3').value);
  click(ui.button(1, 'Add Device to “First Platform”'));
  const second = JSON.parse(ui.$('platform-1-device-4').value);
  assert.notEqual(first.id, second.id);
  assert.notEqual(first.name, second.name);
  const secondBox = ui.$('platform-1-device-2').parentNode;
  click(elements(secondBox).find(node => node.tagName === 'button'));
  await ui.save();
  const expected = structuredClone(ui.config);
  expected.platforms[1].devices = [expected.platforms[1].devices[0], first, second];
  assert.deepEqual(ui.read(), expected);
  // a newly opened editor must not recycle a removed default device's identity
  const addedBox = ui.$('platform-1-device-2').parentNode;
  click(elements(addedBox).find(node => node.tagName === 'button'));
  await ui.save();
  click(ui.button(1, 'Add Device to “First Platform”'));
  const replacement = JSON.parse(ui.$('platform-1-device-3').value);
  assert.notEqual(replacement.id, first.id);
});

test('malformed device JSON and conflicting platform device arrays never reach disk', async t => {
  const ui = await setup(t);
  const before = readFileSync(ui.path, 'utf8');
  edit(ui.$('platform-1-device-2'), '{');
  await ui.save();
  assert.match(ui.$('status').textContent, /Platform 1, device 2 contains invalid JSON/);
  assert.equal(ui.saves.length, 0);
  assert.equal(ui.document.activeElement, ui.$('status'));
  assert.equal(ui.$('platform-1-device-2').value, '{');
  edit(ui.$('platform-1-device-2'), JSON.stringify(ui.config.platforms[1].devices[1]));
  const settings = JSON.parse(ui.$('platform-1').value);
  settings.devices = [];
  edit(ui.$('platform-1'), JSON.stringify(settings));
  await ui.save();
  assert.match(ui.$('status').textContent, /edit devices in their individual editors/);
  assert.equal(ui.saves.length, 0);
  assert.equal(readFileSync(ui.path, 'utf8'), before);
});

test('duplicate device IDs are rejected by the real validator without losing the draft', async t => {
  const ui = await setup(t);
  const before = readFileSync(ui.path, 'utf8');
  const changed = { ...ui.config.platforms[1].devices[1], id: 'first-device' };
  edit(ui.$('platform-1-device-2'), JSON.stringify(changed));
  await ui.save();
  assert.match(ui.$('status').textContent, /Platform 1, device 2/);
  assert.equal(JSON.parse(ui.$('platform-1-device-2').value).id, 'first-device');
  assert.equal(readFileSync(ui.path, 'utf8'), before);
});

test('platform settings and the enable control preserve devices and track pending changes', async t => {
  const ui = await setup(t);
  const checkbox = elements(ui.platformBox(1)).find(node => node.tagName === 'input' && node.type === 'checkbox');
  assert.equal(checkbox.parentNode.textContent, ' Enable platform “First Platform”:');
  assert.ok(ui.button(2, 'Add Device to “Second Platform”'));
  checkbox.checked = false;
  checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  click(ui.$('legacy-config'));
  assert.equal(ui.homebridge.closed, undefined);
  assert.match(ui.$('status').textContent, /Save your changes/);
  const settings = JSON.parse(ui.$('platform-1').value);
  settings.coordinator.perOrigin = 2;
  settings.name = 'Renamed Fixture';
  edit(ui.$('platform-1'), JSON.stringify(settings));
  assert.equal(checkbox.parentNode.textContent, ' Enable platform “Renamed Fixture”:');
  assert.ok(ui.button(1, 'Add Device to “Renamed Fixture”'));
  await ui.save();
  const expected = structuredClone(ui.config);
  expected.platforms[1].enabled = false;
  expected.platforms[1].coordinator.perOrigin = 2;
  expected.platforms[1].name = 'Renamed Fixture';
  assert.deepEqual(ui.read(), expected);
  click(ui.$('legacy-config'));
  assert.equal(ui.homebridge.closed, true);
});
