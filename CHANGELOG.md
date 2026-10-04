# Changelog

## 2.1.0 - In progress

Working development version; not published. Stable npm `latest` remains `2.0.0`.

- Strip all configured headers, including custom API-key headers, when GET/HEAD
  requests redirect to another origin. Preserve headers and authentication on
  same-origin redirects.
- Extend the publication guard to recognize Alpha/Beta versions of later
  releases, while retaining package-name and matching-channel checks.
- Track optional per-action command handling as planned work; it is not yet
  implemented. See the [development plan](docs/development-2.1.0.md).

## 2.0.0 - 2026-10-04

First stable release of `homebridge-http-advanced-platform`, promoting the
published Alpha.9 runtime after household use. The original
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
requirements are unchanged from Alpha.9. Household soak covers 44 legacy Switch
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
