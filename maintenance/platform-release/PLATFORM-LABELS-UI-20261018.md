# Named platform controls - October 18, 2026

## Behavior

The platform heading and controls now show the configured instance name:

- **Platform “Home Control” - 2 devices**
- **Enable platform “Home Control”:**
- **Add Device to “Home Control”**
- **Add Platform** creates another instance, replacing **Also Use as a Platform**.

Headings, checkbox labels, platform-settings labels and add-device buttons follow
valid name edits in the draft. Missing names are shown as required. Buttons wrap
long names rather than overflowing their containers.

The UI, schema and guides explain that `platform: "HttpAdvanced"` is the shared
plugin alias. Each HTTP Advanced instance needs a unique `name`; its name and
device IDs contribute to HomeKit identity, so existing names remain stable after
pairing. Apple Home receives the individual devices, not a platform accessory.
No production configuration values were changed.

## Verification

- All 22 affected UI, configuration-editor and schema/package tests passed on
  Node 24.19.0. Existing UI tests now check separate named controls and updates
  after a draft name edit, alongside definition/identity preservation.
- Full repository ESLint and `git diff --check` passed. No TypeScript or runtime
  source changed; the preceding UI deployment records the broader build/matrix
  checks separately.
- In the sanitized browser fixture, a draft name change updated both the enable
  checkbox and add-device button. Restoring the original name and saving was an
  unchanged save. **Add Platform** created a named empty instance; its own
  add-device button added only to that instance. No console errors occurred.
- A fresh authenticated production Plugin Config displayed all four updated
  labels, with Mischief and Movie Time still present as separate devices.
  Production configuration was not saved. A screenshot is retained locally in
  Downloads as `platform-labels-installed-20261018.jpg`.

## Local deployment and rollback

This is a second out-of-npm UI patch on the installed `2.1.0-beta.1` package.
Only the schema, UI HTML and UI JavaScript changed. The guarded helper checked
the preceding patch's asset hashes and the current configuration hash, retained
the original assets plus its own source/payload, then replaced the three assets.

Private backup directory:
`/var/lib/homebridge/.project-maintenance/platform-labels-ui-20261018/`

| Asset | Installed SHA-256 |
| --- | --- |
| `config.schema.json` | `9ea4d7fc6364acc3c323302bdd2f837700156278681da8e789f769e8a2582a05` |
| `homebridge-ui/public/index.html` | `9b295026d102319ebbdc66c6332e010dc19b91d787f1b3c44e6c9b132c78ebf6` |
| `homebridge-ui/public/settings.js` | `3ee86df3cdfbeb3890e99a27a0f09f3537589e36ba9b56c5041296d265550338` |

The retained helper passed `--verify`: runtime-file hashes, configuration bytes,
identifier cache and the identities of all 70 cached accessories were unchanged.
The configuration SHA-256 remained
`6ac47d1a9c8aad180d4012935fe0620bf9f19befe04460216b14d564471d2657`.
No Homebridge restart, device command, npm publication or release promotion was
performed. Reinstalling the published package would overwrite these local edits.

To restore the preceding UI patch, run in the authenticated Homebridge terminal:

```sh
python3 /var/lib/homebridge/.project-maintenance/platform-labels-ui-20261018/deploy-platform-labels-ui-20261018.py --rollback
```

The earlier [device-editor deployment record](PLATFORM-DEVICE-UI-20261018.md)
documents the first patch and its separate rollback. Roll back this label patch
first if the goal is to restore the original npm UI through both guarded helpers.
