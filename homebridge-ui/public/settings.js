/* global homebridge, document, crypto */
(() => {
  const $ = id => document.getElementById(id);
  const fields = [
    ['requestTimeout', 'Request timeout (ms)', 10000],
    ['uriCallsDelay', 'Request spacing per device (ms)', 0],
    ['setterDelay', 'Setter debounce (ms)', 0],
    ['writeConfirmationTimeout', 'Write confirmation window (ms)', 10000],
    ['refresh.activeInterval', 'Active refresh interval (seconds)', 5],
    ['refresh.idleInterval', 'Idle refresh interval (seconds)', 60],
    ['refresh.idleAfter', 'Idle after (seconds)', 60],
    ['recovery.retryInterval', 'First recovery retry (seconds)', 5],
    ['recovery.maxRetryInterval', 'Maximum recovery retry (seconds)', 30],
    ['recovery.quietPeriod', 'Wait before outage warning (seconds)', 90],
    ['recovery.reminderInterval', 'Outage reminder interval (seconds)', 300],
    ['coordinator.concurrency', 'Concurrent requests per process', 4],
    ['coordinator.perOrigin', 'Concurrent requests per endpoint', 2],
    ['coordinator.maxQueue', 'Maximum queued requests', 256],
  ];
  let loaded;
  let hasChanges = false;
  let saving = false;
  let accessoryEditors = [];
  let nextAccessoryID = 0;
  let platformEditors = [];
  const message = (text, error = false) => {
    $('status').textContent = text; $('status').className = error ? 'text-danger' : '';
    if (error) { $('status').tabIndex = -1; $('status').focus(); }
  };
  const parse = (editor, label) => {
    try { return JSON.parse(editor.value); }
    catch { throw new Error(`${label} contains invalid JSON; no changes saved`); }
  };
  const updateAccessoryCount = () => {
    $('legacy-count').textContent = `(${accessoryEditors.length})`;
    $('legacy-details').hidden = accessoryEditors.length === 0;
  };
  const addAccessory = block => {
    const index = ++nextAccessoryID;
    const container = document.createElement('details'); container.className = 'legacy-accessory';
    const summary = document.createElement('summary');
    const describe = value => { summary.textContent = `${value?.name ?? 'New accessory'} — ${value?.service ?? 'Choose a service'}`; };
    describe(block);
    const label = document.createElement('label'); label.htmlFor = `accessory-${index}`; label.textContent = `Legacy accessory ${index} configuration (JSON object):`;
    const editor = document.createElement('textarea'); editor.id = label.htmlFor; editor.className = 'form-control'; editor.spellcheck = false; editor.autocomplete = 'off'; editor.value = JSON.stringify(block, null, 2);
    editor.addEventListener('input', () => { try { describe(JSON.parse(editor.value)); } catch { /* allow incomplete JSON while editing */ } });
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn btn-outline-danger'; remove.textContent = 'Remove This Accessory';
    remove.addEventListener('click', () => {
      accessoryEditors = accessoryEditors.filter(item => item !== editor); container.remove(); updateAccessoryCount(); hasChanges = true;
    });
    container.append(summary, label, editor, remove); $('legacy-accessories').append(container);
    accessoryEditors.push(editor); updateAccessoryCount();
    return container;
  };
  const addPlatform = block => {
    const index = platformEditors.length + 1;
    if (!block || typeof block !== 'object' || Array.isArray(block) || !Array.isArray(block.devices)) {
      throw new Error(`Platform ${index}: devices must be an array; correct it in JSON Config, then reopen Plugin Config`);
    }
    const container = document.createElement('div'); container.className = 'platform';
    const heading = document.createElement('h3');
    const enabledLabel = document.createElement('label');
    const enabled = document.createElement('input'); enabled.type = 'checkbox'; enabled.checked = block.enabled !== false;
    const enabledText = document.createElement('span');
    enabledLabel.append(enabled, enabledText);
    const settingsDetails = document.createElement('details'); settingsDetails.className = 'platform-settings';
    const settingsSummary = document.createElement('summary'); settingsSummary.textContent = 'Edit Platform Settings';
    const label = document.createElement('label'); label.htmlFor = `platform-${index}`; label.textContent = `Platform ${index} settings (JSON object, excluding devices):`;
    const { devices, ...settings } = block;
    const editor = document.createElement('textarea'); editor.id = label.htmlFor; editor.className = 'form-control'; editor.spellcheck = false; editor.autocomplete = 'off'; editor.value = JSON.stringify(settings, null, 2);
    settingsDetails.append(settingsSummary, label, editor);
    const note = document.createElement('p'); note.textContent = 'After restart, disabling retains definitions and cached identities but reports devices unavailable for reads and commands. Its name and device IDs determine HomeKit identity.';
    const limitsNote = document.createElement('p');
    limitsNote.textContent = 'When enabled, this platform’s coordinator overrides affect all HTTP Advanced devices in the same Homebridge process. For uniform limits, keep them in Shared settings and remove coordinator from this platform.';
    const showOverrides = value => { limitsNote.hidden = !value?.coordinator || !Object.keys(value.coordinator).length; };
    const describePlatform = value => {
      const name = typeof value?.name === 'string' && value.name.trim() ? `“${value.name}”` : `${index} (name required)`;
      heading.textContent = `Platform ${name} — ${deviceEditors.length} ${deviceEditors.length === 1 ? 'device' : 'devices'}`;
      enabledText.textContent = ` Enable platform ${name}:`;
      label.textContent = `Settings for platform ${name} (JSON object, excluding devices):`;
      add.textContent = `Add Device to ${name}`;
    };
    const platformSettings = () => {
      const value = parse(editor, `Platform ${index} settings`);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Platform ${index} settings must be an object; no changes saved`);
      if (Object.hasOwn(value, 'devices')) throw new Error(`Platform ${index}: edit devices in their individual editors below, and remove devices from platform settings; no changes saved`);
      return value;
    };
    const deviceDetails = document.createElement('details'); deviceDetails.className = 'platform-devices';
    const deviceSummary = document.createElement('summary');
    const deviceList = document.createElement('div');
    deviceDetails.append(deviceSummary, deviceList);
    let deviceEditors = [];
    let nextDeviceID = 0;
    const updateDevices = () => {
      deviceSummary.textContent = `Edit Configured Devices (${deviceEditors.length})`;
      deviceDetails.hidden = deviceEditors.length === 0;
      for (const [deviceIndex, item] of deviceEditors.entries()) item.label.textContent = `Platform ${index}, device ${deviceIndex + 1} configuration (JSON object):`;
      try { describePlatform(JSON.parse(editor.value)); } catch { /* retain the title while editing incomplete JSON */ }
    };
    const addDevice = device => {
      const details = document.createElement('details'); details.className = 'platform-device';
      const summary = document.createElement('summary');
      const describe = value => { summary.textContent = `${value?.name ?? 'New device'} — ${value?.service ?? 'Choose a service'}${value?.id ? ` (${value.id})` : ''}`; };
      describe(device);
      const deviceLabel = document.createElement('label'); deviceLabel.htmlFor = `platform-${index}-device-${++nextDeviceID}`;
      const deviceEditor = document.createElement('textarea'); deviceEditor.id = deviceLabel.htmlFor; deviceEditor.className = 'form-control'; deviceEditor.spellcheck = false; deviceEditor.autocomplete = 'off'; deviceEditor.value = JSON.stringify(device, null, 2);
      deviceEditor.addEventListener('input', () => { try { describe(JSON.parse(deviceEditor.value)); } catch { /* allow incomplete JSON while editing */ } });
      const item = { editor: deviceEditor, label: deviceLabel };
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn btn-outline-danger'; remove.textContent = 'Remove This Device';
      remove.addEventListener('click', () => {
        deviceEditors = deviceEditors.filter(entry => entry !== item); details.remove(); updateDevices(); hasChanges = true;
      });
      details.append(summary, deviceLabel, deviceEditor, remove); deviceList.append(details);
      deviceEditors.push(item); updateDevices();
      return details;
    };
    const add = document.createElement('button'); add.type = 'button'; add.className = 'btn btn-outline-primary';
    add.addEventListener('click', () => {
      const configured = deviceEditors.map(item => { try { return JSON.parse(item.editor.value); } catch { return undefined; } });
      let number = 1; let name = 'HTTP Device';
      while (configured.some(value => value?.name === name)) name = `HTTP Device ${++number}`;
      // assign a fresh identity even when a device was removed in an earlier save
      let id;
      do { id = 'http-device-' + Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join(''); }
      while (configured.some(value => (value?.id ?? value?.name) === id));
      addDevice({ id, name, service: 'Switch', urls: {} }).open = true;
      deviceDetails.open = true; hasChanges = true;
    });
    showOverrides(block);
    enabled.addEventListener('change', () => {
      try {
        const value = platformSettings();
        value.enabled = enabled.checked; editor.value = JSON.stringify(value, null, 2);
        hasChanges = true;
      } catch (error) { enabled.checked = !enabled.checked; message(error.message, true); }
    });
    editor.addEventListener('input', () => { try { const value = JSON.parse(editor.value); enabled.checked = value?.enabled !== false; showOverrides(value); describePlatform(value); } catch { /* allow incomplete JSON while editing */ } });
    devices.forEach(addDevice); updateDevices();
    container.append(heading, enabledLabel, note, limitsNote, settingsDetails, deviceDetails, add); $('platforms').append(container);
    platformEditors.push({
      editor,
      collect: () => ({ ...platformSettings(), devices: deviceEditors.map((item, deviceIndex) => parse(item.editor, `Platform ${index}, device ${deviceIndex + 1}`)) }),
    });
  };
  const render = result => {
    loaded = result;
    const accessories = result.draft.accessories;
    $('legacy-summary').textContent = accessories.length
      ? 'These accessories use the shared settings below. Each definition stays in accessories[].'
      : 'Add a legacy accessory here, or use an optional platform below.';
    accessoryEditors = []; nextAccessoryID = 0; $('legacy-accessories').replaceChildren();
    accessories.forEach(addAccessory); updateAccessoryCount();
    $('timings').replaceChildren();
    for (const [key, title, fallback] of fields) {
      const box = document.createElement('div'); const label = document.createElement('label');
      label.htmlFor = key; label.textContent = `${title}:`;
      const input = document.createElement('input'); input.id = key; input.className = 'form-control'; input.type = 'number'; input.step = key.startsWith('coordinator.') ? '1' : 'any'; input.min = key.startsWith('coordinator.') ? '1' : '0'; input.placeholder = String(fallback);
      const value = key.split('.').reduce((v, k) => v?.[k], result.draft.settings);
      input.value = value === undefined ? '' : String(value);
      const validate = () => {
        const zeroAllowed = ['uriCallsDelay', 'setterDelay', 'writeConfirmationTimeout', 'recovery.quietPeriod'].includes(key);
        input.setCustomValidity(input.value !== '' && !zeroAllowed && Number(input.value) <= 0 ? `${title} must be greater than zero` : '');
      };
      input.addEventListener('input', validate); validate();
      box.append(label, input); $('timings').append(box);
    }
    platformEditors = []; $('platforms').replaceChildren(); result.draft.platforms.forEach(addPlatform);
    $('settings').hidden = false;
    hasChanges = false;
  };
  $('settings').addEventListener('input', () => { hasChanges = true; });
  $('legacy-config').addEventListener('click', () => {
    if (hasChanges) {
      message('Save your changes below before returning to the plugin menu. To discard them, use the dialog’s Close button.', true);
      return;
    }
    homebridge.closeSettings();
  });
  $('add-accessory').addEventListener('click', () => {
    const names = accessoryEditors.map(editor => { try { return JSON.parse(editor.value).name; } catch { return undefined; } });
    let number = 1; let name = 'HTTP Accessory';
    while (names.includes(name)) name = `HTTP Accessory ${++number}`;
    addAccessory({ accessory: 'HttpAdvancedAccessory', name, service: 'Switch', urls: {} }).open = true;
    $('legacy-details').open = true;
    hasChanges = true;
  });
  $('add-platform').addEventListener('click', () => {
    const names = platformEditors.map(item => { try { return JSON.parse(item.editor.value).name; } catch { return undefined; } });
    let number = 1; let name = 'HTTP Advanced';
    while (names.includes(name)) name = `HTTP Advanced ${++number}`;
    addPlatform({ platform: 'HttpAdvanced', name, enabled: true, devices: [] });
    hasChanges = true;
  });
  $('settings').addEventListener('submit', async event => {
    event.preventDefault();
    if (saving || !$('settings').reportValidity()) return;
    saving = true; $('settings-fields').disabled = true;
    message('Saving settings…');
    try {
      const draft = structuredClone(loaded.draft);
      draft.accessories = accessoryEditors.map((editor, index) => parse(editor, `Legacy accessory ${index + 1}`));
      draft.platforms = platformEditors.map(item => item.collect());
      for (const [key] of fields) {
        const input = $(key).value;
        const keys = key.split('.'); const property = keys.pop();
        let target = draft.settings;
        for (const section of keys) { target[section] ??= {}; target = target[section]; }
        if (input === '') delete target[property]; else target[property] = Number(input);
        // blank settings should not materialize empty sections in an unchanged config
        if (keys.length && !Object.keys(target).length && loaded.draft.settings[keys[0]] === undefined) delete draft.settings[keys[0]];
      }
      const result = await homebridge.request('/settings/save', { revision: loaded.revision, draft });
      render(result); message(result.changed ? 'Saved. Restart Homebridge to apply these settings.' : 'No changes to save.');
    } catch (error) { message(error.message || 'Could not save settings; no changes saved', true); }
    finally { saving = false; $('settings-fields').disabled = false; }
  });
  homebridge.addEventListener('ready', async () => {
    // the standard save path handles only one plugin alias/type, so both sections use our bounded editor
    homebridge.disableSaveButton();
    try { render(await homebridge.request('/settings/load')); message('Configuration loaded. Changes stay here until you save.'); }
    catch (error) { message(error.message || 'Could not load settings', true); }
  }, { once: true });
})();
