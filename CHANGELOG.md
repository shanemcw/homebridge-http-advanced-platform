# Changelog

## 2.2.0-beta.1 - 2026-10-24

- Add per-setter `writeMode: "command"` to preserve repeated and alternating
  commands without debounce; retain existing behavior for target-only devices.
- Order writes across each opted-in device's primary and additional services.
  Coalesce adjacent target adjustments only within their open debounce window.
- Share bounded queue admission with transport; include device waiting in command
  deadlines and remove expired writes before delivery. Cancel the waiting device
  batch after an execution failure; never retry or persist commands.
- Require 2xx command acknowledgements, honor response guards and reject redirects
  without following them. Retain target actions' existing HTTP behavior.
- Keep command arguments out of requested targets, mapper state and persisted
  observations; refresh real feedback and handle Homebridge completion races.
- Validate mode values/placement and runtime writable-characteristic bindings;
  preserve configuration round-trips, aliases and HomeKit identities.

This Beta targets the next functional release, `2.2.0`. Representative physical
command acceptance remains pending before stable promotion. Stable latest stays
at `2.1.0`. See the
[Beta notes](docs/release-notes-2.2.0-beta.1.md) and
[design and acceptance gates](docs/development-2.2.0.md).

## npm prerelease retirement - 2026-10-24

Retire obsolete `2.0.0-alpha.6` through `2.0.0-alpha.9`, plus `2.1.0-beta.1`
and `2.1.0-beta.2`, from npm after retaining verified local archives. Their
registry tarballs now return HTTP 404 and the old Alpha/Beta tags are removed.
Stable `2.0.0` and `2.1.0` remain downloadable; `latest` stays at `2.1.0`.
The `2.2.0-beta.1` candidate is not published by this cleanup. Earlier release
entries below describe availability at their original publication dates.

## 2.1.0 - 2026-10-23

Promote the Beta.2 runtime and configuration editors after field testing of
legacy accessories and migrated platform switches.

- Edit platform devices and legacy accessories independently in Plugin Config,
  with add/remove controls, named platform headings and separate platform settings.
- Preserve existing IDs, encoded requests, custom fields and bridge assignments;
  give newly added devices fresh IDs and reject conflicting device drafts.
- Correct the platform schema used by Homebridge verification while retaining
  existing accessory configurations and both registration aliases.
- Strip configured headers and device Basic Auth on cross-origin GET/HEAD
  redirects; configure trusted final endpoints directly if they require them.
- Select stable `2.1.0` through npm `latest`. Beta.2 remains available on `beta`.

Runtime, UI, schema, dependencies and HomeKit identity rules are unchanged from
Beta.2. Additional services and new mapper modes retain automated and isolated
coverage. Per-action command handling remains planned. Homebridge verification
is a separate later step. See the [release notes](docs/release-notes.md).

## 2.1.0-beta.2 - 2026-10-20

Individual platform-device editors and clearer named platform controls. npm
`beta` selects this version; stable npm `latest` remains `2.0.0`. The device
runtime, dependencies and HomeKit identity rules are unchanged from Beta.1.

- Name each platform in its heading and enable/add-device controls, and use
  **Add Platform** for creating another instance. Explain the shared plugin
  identifier, unique instance names and their role in HomeKit identity.
- Edit each platform device independently in Plugin Config, with expandable JSON
  editors and per-platform add/remove controls. Keep platform settings separate
  while preserving IDs, encoded requests, custom fields and unrelated devices.
- Assign a fresh ID to each newly added platform device, including replacements
  for previously removed devices. Reject conflicting device arrays in the
  platform settings editor before saving.

## 2.1.0-beta.1 - 2026-10-13

Beta release for a week of field testing before stable promotion. npm `beta`
selects this version; stable npm `latest` remains `2.0.0`.

- Strip all configured headers, including custom API-key headers, when GET/HEAD
  requests redirect to another origin. Preserve headers and authentication on
  same-origin redirects.
- Extend the publication guard to recognize Alpha/Beta versions of later
  releases, while retaining package-name and matching-channel checks.
- Identify the registered `HttpAdvanced` platform in the configuration schema
  and expose the platform schema at its root for Homebridge verification.
- Keep individual legacy accessory editing in Plugin Config with expandable
  JSON editors and add/remove controls; native JSON Config edits platforms.
- Use title case for settings headings and buttons, and sentence case with a
  colon for field labels. Prevent the Homebridge theme from capitalizing buttons.

**Redirect compatibility:** if a trusted endpoint on another origin needs
configured headers or authentication, configure that final endpoint directly.
Existing accessory configurations remain supported without platform conversion.
See the [Beta.1 release notes](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0-beta.1/docs/release-notes.md). Per-action command handling
remains planned and is not included in this beta.

## 2.0.0 - 2026-10-04

First stable release of `homebridge-http-advanced-platform`, promoting the
published Alpha.9 runtime after field use. The original
`homebridge-http-advanced-accessory` package remains a separate project.

- Support existing `HttpAdvancedAccessory` definitions and optional `HttpAdvanced`
  platforms through the shared HTTP, polling, cache and recovery core.
- Include optional accessory information, additional HomeKit services, and the
  declarative `scale` and strict `lookup` mappers introduced during Alpha testing.
- Publish stable `2.0.0` on npm `latest`; retain Alpha.9 on `alpha`.
- Update installation, migration and release documentation for stable use.
- Include the current configuration examples guide and full changelog in the
  package. Historical Alpha release notes remain available separately.
- Allow stable publication through the release guard while retaining checks for
  the platform package name and matching prerelease/stable tags.

The device runtime, configuration aliases, platform UUID namespace and dependency
requirements are unchanged from Alpha.9. Field soak covers legacy Switch
accessories; platform devices, additional services and new mappers have automated
and isolated coverage. This package is not Homebridge-verified. See the
[release notes](docs/release-notes.md) and [migration guide](docs/migration.md).

## 2.0.0-alpha.9 - 2026-09-29

- Add optional `additionalServices` with stable service subtypes and separate
  action state on legacy accessories and platform devices.
- Add numeric `scale` and exact scalar `lookup` mappers.
- Explain Homebridge UI configuration removal and HomeKit identity risks during
  replacement of the original accessory package.

## 2.0.0-alpha.8 - 2026-09-28

- Add optional manufacturer, model and serial-number information while retaining
  existing defaults and device identities.

## 2.0.0-alpha.7 - 2026-09-27

- Update public search metadata, lineage and npm installation/tag guidance.

## 2.0.0-alpha.6 - 2026-09-26

- Introduce the public platform package from the preserved Alpha.5 lineage,
  retaining legacy accessory support and both configuration aliases.
