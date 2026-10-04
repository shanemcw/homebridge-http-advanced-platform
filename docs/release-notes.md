# Homebridge HTTP Advanced Platform 2.0.0

First stable release of `homebridge-http-advanced-platform`, published on npm's
`latest` channel. This is a platform conversion of
[staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory),
retaining the Apache-2.0 license, history and contributor credit. The original
accessory package does not automatically update to this separate package.

## Behavior and installation

2.0.0 promotes the Alpha.9 device runtime without changes to HTTP handling,
polling, caching, recovery, write confirmation, configuration aliases or the
platform UUID namespace. It includes optional accessory information,
`additionalServices`, and the `scale` and `lookup` mappers. Current configuration
examples and the changelog are included in the published package.

Select `latest` or `2.0.0` in Homebridge UI, or install
`homebridge-http-advanced-platform@2.0.0` through the same account and plugin
location your Homebridge installation uses. The `alpha` channel retains the
earlier Alpha.9 release. Requires Node `^22.13.0 || ^24.0.0` and Homebridge
`^1.11.4 || ^2.4.0`.

Existing platform-package Alpha users can upgrade in place while keeping their
configuration and storage. Users replacing the original accessory package must
follow the [migration guide](migration.md): back up Homebridge, separately save
the exact legacy accessory JSON, and preserve configuration and pairing data
when removing the old package. Both packages register the same aliases and must
not be loaded together. Changing package-qualified legacy identifiers or moving
a device into platform mode can change its HomeKit identity.

## Validation and field coverage

The release review compares local source, GitHub compatibility CI, a fresh
production-dependency installation and the installed household package. The
household Alpha.9 installation matches all 56 files in the public Alpha.9 archive.
Its retained logs show 44 legacy Switch accessories restoring all 44 cached
getters after restarts, and successful background recovery after temporary
backend outages. The household owner reports sustained use of this release line.

Household configuration uses legacy switches, without platform devices,
additional services or the new mapper modes. Those optional paths have
automated and isolated package/UI coverage rather than household soak. Read-only
inspection does not independently verify physical actuation, Apple Home rooms,
scenes or automations. Detailed cache values and success ages could not be read
through the production inspection account; state-file writes and restoration
logs provide narrower evidence. This package is not Homebridge-verified.

Preserve backups and verify your own device controls and HomeKit references
after installation. The [historical Alpha notes](alpha-release-notes.md) describe
the development milestones; the [changelog](../CHANGELOG.md) describes stable
release changes.
