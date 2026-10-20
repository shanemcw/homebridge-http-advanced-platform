# Homebridge HTTP Advanced Platform 2.1.0-beta.2

Edit platform devices individually in Plugin Config, with clearer controls for
each named platform. Household testing continues before stable promotion.
Select **beta** or **v2.1.0-beta.2** in Homebridge UI **Manage Version**, or install
`homebridge-http-advanced-platform@2.1.0-beta.2` in your existing plugin location.
npm **latest remains 2.0.0**. This package is not yet Homebridge-verified.

## Changes

- Give each platform device its own expandable JSON editor and remove control,
  alongside separate platform settings. Preserve unedited IDs, encoded requests,
  mappings, custom fields, bridge assignments and unrelated configuration.
- Show the configured platform name in its heading, enable checkbox and
  **Add Device to “…”** button. **Add Platform** creates another instance.
- Assign fresh IDs to new devices, including replacements for removed devices.
  Reject invalid device JSON, duplicate IDs and competing device arrays before
  saving. Keep the existing validated save path and private configuration backup.

The device runtime and dependencies are unchanged from Beta.1. This beta also
includes Beta.1's platform-schema correction, legacy accessory editors and
cross-origin redirect header hardening.

## Before Installing

Make a full Homebridge backup. Keep existing device IDs, platform names,
accessory aliases, storage and bridge assignments unchanged. Platform names and
device IDs contribute to HomeKit identity. Apple Home displays the individual
devices. Opening Plugin Config does not migrate or rewrite configuration, and
this update does not require converting legacy accessories into platform devices.

**Redirect compatibility, carried forward from Beta.1:** an origin changes when
the scheme, hostname or port changes. GET/HEAD redirects to another origin no
longer receive configured headers or device Basic Auth from the starting
endpoint. If a trusted final endpoint needs them, configure its URL directly.

Users replacing the original `homebridge-http-advanced-accessory` package must
follow the [migration guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0-beta.2/docs/migration.md).
Do not load both packages together because their registered aliases overlap.

## Validation and Beta Coverage

Release checks cover Node 22 and 24 with Homebridge 1 and 2, production dependency
audit, fresh package installation, plugin loading, loopback device control and
custom UI IPC. The new editor regressions cover independent edits, unchanged
saves, identity and request preservation, additions/removals and invalid drafts.

Household coverage now includes three migrated platform switches alongside
legacy accessories. One restored Home scene and a physical light's On/Off
transitions have passed; one On command required the existing controller's X10
retry. Repeated household use, another restored scene's live activation and
spoken HomePod Siri checks remain pending. Additional services and new mapper
modes have automated and isolated coverage. Verify your own rooms, scenes,
automations and physical behavior after updating.

Stable promotion and verification resubmission remain separate later steps.
Individual per-action command handling is still planned and is not included.
See the [full changelog](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0-beta.2/CHANGELOG.md).
