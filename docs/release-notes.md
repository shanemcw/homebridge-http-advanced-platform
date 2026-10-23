# Homebridge HTTP Advanced Platform 2.1.0

Maintain platform devices and legacy accessories individually in Plugin Config,
with clearer named platform controls and safer HTTP redirects. This stable
release promotes the Beta.2 runtime and editors after field testing of
legacy accessories and migrated platform switches.

Select **latest** or **v2.1.0** in Homebridge UI **Manage Version**, or install
`homebridge-http-advanced-platform@2.1.0` in your existing plugin location.
Confirm the matching public release is available before installing. This package
is not yet Homebridge-verified.

## Changes Since 2.0.0

- Give each platform device and legacy accessory its own expandable JSON editor
  and remove control. Keep platform settings separate from their device editors.
- Show the configured platform name in its heading, enable checkbox and
  **Add Device to “…”** button. **Add Platform** creates another instance.
- Preserve unedited IDs, encoded requests, mappings, custom fields and bridge
  assignments. Assign fresh IDs to new platform devices, including replacements
  for removed devices. Reject invalid JSON, duplicate IDs and competing device
  arrays before saving through the existing validated, backed-up save path.
- Correct the configuration schema to identify the registered `HttpAdvanced`
  platform and describe a platform at its root. Existing `HttpAdvancedAccessory`
  configurations remain supported.
- Remove all configured headers and device Basic Auth when GET/HEAD requests
  redirect to another origin. Same-origin redirects retain them.

The device runtime, UI, schema, dependencies and HomeKit identity rules are
unchanged from Beta.2. Stable promotion changes release metadata, documentation
and the default publication channel.

## Before Installing

Make a full Homebridge backup. Keep existing device IDs, platform names,
accessory aliases, storage and bridge assignments unchanged. Platform names and
device IDs contribute to HomeKit identity. Opening Plugin Config does not
migrate or rewrite configuration, and this update does not require converting
legacy accessories into platform devices.

**Redirect compatibility:** an origin changes when the scheme, hostname or port
changes. GET/HEAD redirects to another origin no longer receive configured
headers or device Basic Auth from the starting endpoint. If a trusted final
endpoint needs them, configure its URL directly.

Users replacing the original `homebridge-http-advanced-accessory` package must
follow the [migration guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0/docs/migration.md).
Do not load both packages together because their registered aliases overlap.
After a manual legacy-to-platform conversion, verify Apple Home rooms, scenes,
automations and physical controls because the converted device has a new identity.

## Validation

Release validation covers Node 22 and 24 with Homebridge 1 and 2, production
dependency audit, fresh package installation, plugin loading, loopback device
control and custom UI IPC. Editor regressions cover independent edits, unchanged
saves, identity and request preservation, additions/removals and invalid drafts.

Field acceptance covered legacy accessory operation, migrated platform
operation, scene activation, voice control and identity persistence across
restarts. Additional services and new mapper modes retain automated and isolated
coverage. Verify your own rooms, scenes, automations and physical behavior after
updating.

Homebridge verification resubmission is a separate later step. Individual
per-action command handling remains planned and is not included in 2.1.0.
See the [full changelog](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0/CHANGELOG.md).
