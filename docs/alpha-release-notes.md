# Homebridge HTTP Advanced Platform 2.0.0-alpha.6

Local, unpublished packaging candidate based on preserved `2.0.0-alpha.5`.
Installation acceptance, public launch and live soak remain pending.

This is a platform conversion of [staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory). It retains the original Apache-2.0 license, contributor credit and Git history.

The release changes the public package to `homebridge-http-advanced-platform`, updates branding and search metadata, and retains Alpha.5 device behavior: shared cached reads, bounded background HTTP requests, recovery, write confirmation, legacy accessories and optional platform devices. No parent issue/PR fixes or dependency updates are included in this packaging milestone.

Configuration aliases remain `HttpAdvancedAccessory` and `HttpAdvanced`. The platform UUID namespace remains the Alpha.5 namespace. Package-qualified configuration and plugin lists must use the new package name; do not load both old and new packages. Follow the [replacement and rollback guide](migration.md), preserving configuration, storage and bridge identity.

Moving a legacy accessory into a platform remains an explicit manual conversion with a new HomeKit identity. No automatic conversion tool is included.

Requirements remain Node `^22.13.0 || ^24.0.0` and Homebridge `^1.11.4 || ^2.4.0`. Installation, managed child bridges, native UI editing, live controls and pairing/automation acceptance must be checked before deployment and publication.

Public publication will use an explicit `alpha` npm tag and a GitHub prerelease. First-publication search and installation behavior must be verified; this new package has no existing stable release. Its tags do not modify the original accessory package's tags. Homebridge verification will be pursued separately after publication; this candidate is not verified.

Report versions and sanitized diagnostics. Do not include credentials, pairing PINs or unredacted configuration.
