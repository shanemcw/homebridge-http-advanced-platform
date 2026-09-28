# Homebridge HTTP Advanced Platform 2.0.0-alpha.8

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
configuration and plugin lists must use the new package name; do not load both
old and new packages. Follow the [replacement and rollback guide](migration.md)
and preserve Homebridge configuration, cached accessories and pairing data.
Moving a legacy accessory into platform mode remains an explicit manual
conversion that creates a new HomeKit identity.

Requires Node `^22.13.0 || ^24.0.0` and Homebridge `^1.11.4 || ^2.4.0`.
This is an Alpha, not a stable or Homebridge-verified release. npm requires a
`latest` tag, which can also point to an Alpha. Choose the **alpha** row or
**v2.0.0-alpha.8** in Homebridge UI's version chooser, or install
`homebridge-http-advanced-platform@2.0.0-alpha.8` explicitly. Confirm public
availability in the matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases)
and [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions)
before installing.

The publication and exact-package checks are separate from paired Apple Home,
physical device control and unattended live soak. Report versions and sanitized
diagnostics without credentials or unredacted configuration.
