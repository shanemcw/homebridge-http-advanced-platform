# Homebridge HTTP Advanced Platform 2.0.0-alpha.9

> Historical Alpha release notes. For stable 2.0.0, see the [current release notes](release-notes.md) and [changelog](../CHANGELOG.md).

**Alpha.9 is a public testing release, not a stable or Homebridge-verified release.** Confirm its availability in the [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions) and matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.9) before installing.

Alpha.9 adds `additionalServices` to legacy accessories and platform devices, addressing the multi-service/Battery use case in [upstream issue #12](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/12). Each additional service has a stable `id` used as its HomeKit subtype and its own actions and optional characteristics. Authentication and timing can inherit from the containing device. Existing single-service configurations keep their primary service identity. The [Front Door example](../README.md#add-battery-information-to-a-device) shows a Contact Sensor with Battery status and level on one accessory.

This release also adds a declarative `scale` mapper for linear conversion between numeric ranges, including an optional decimal `round` and input `clamp`. It works in getter and setter pipelines without writing an `eval` expression. Invalid getter input is inconclusive; an invalid setter value fails before sending. The [dimmer example](../README.md#scale-a-device-value) shows the inverse ranges needed to read and write a `0` to `255` device through HomeKit Brightness.

An opt-in `lookup` mapper returns exact scalar mappings, including `false`, `0` and empty string. Unknown getter responses are inconclusive, while unknown setter values fail before sending. Legacy `static` mappings keep their existing pass-through semantics. The [relay example](../README.md#look-up-exact-device-states) maps `ON`/`OFF` reads and `true`/`false` writes without JavaScript.

Source tests exercise both adapters, cached platform restoration, duplicate-ID rejection, removal of an added service and both new mappers. Alpha testing is intended to verify paired Apple Home presentation, rooms and automations, physical endpoint behavior, restart and rollback. Report sanitized findings; local and package checks alone cannot establish these live results.

## Published Alpha.8

Alpha.8 adds optional HomeKit Accessory Information metadata from
[upstream PR #46](https://github.com/staromeste/homebridge-http-advanced-accessory/pull/46).
Legacy accessories can now set `manufacturer`, `model` and `serialNumber`.
Platform devices already honored manufacturer and model; they now accept a
separate `serialNumber`. The displayed serial number does not replace a platform
device's stable `id` or alter its HomeKit UUID.

Omitting these fields preserves the previous values. HTTP actions, caching,
configuration aliases, service definitions, package dependencies and runtime
requirements are unchanged. This release does not include other upstream PRs or
issues.

Alpha.6 introduced the public `homebridge-http-advanced-platform` package and
Alpha.7 updated its description, keywords and npm README. The project is a
platform conversion of
[staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory),
retaining the Apache-2.0 license, contributor credit and Git history.

Configuration aliases remain `HttpAdvancedAccessory` and `HttpAdvanced`. The
platform UUID namespace remains the Alpha.5 namespace. Package-qualified
configuration and plugin lists need review when changing packages; changing the
package prefix of a qualified legacy accessory can change its HomeKit UUID. Do
not load both old and new packages. Save the exact legacy `accessories[]` JSON
before uninstalling the old package: Homebridge UI can remove it during uninstall,
and restoring JSON later may not restore Apple Home rooms, scenes or automations.
Follow the [replacement and recovery guide](migration.md) and preserve Homebridge
configuration, cached accessories and pairing data.
Moving a legacy accessory into platform mode remains an explicit manual
conversion that creates a new HomeKit identity.

Requires Node `^22.13.0 || ^24.0.0` and Homebridge `^1.11.4 || ^2.4.0`.
This is an Alpha, not a stable or Homebridge-verified release. npm requires a
`latest` tag, which can also point to an Alpha. Choose the **alpha** row or
**v2.0.0-alpha.9** in Homebridge UI's version chooser, or install
`homebridge-http-advanced-platform@2.0.0-alpha.9` explicitly. Confirm public
availability in the matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases)
and [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions)
before installing.

The publication and exact-package checks are separate from paired Apple Home,
physical device control and unattended live soak. Report versions and sanitized
diagnostics without credentials or unredacted configuration.
