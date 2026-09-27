Homebridge HTTP Advanced Platform is a platform conversion of
[staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory),
retaining the Apache-2.0 license, Git history and tasict/staromeste contributor credit.

This opt-in Alpha packages the preserved Alpha.5 behavior under
`homebridge-http-advanced-platform`: shared cached reads, bounded background HTTP
requests, recovery, write confirmation, existing legacy accessories and optional
platform devices. Existing accessory definitions remain supported. Converting an
accessory to a platform device is optional, manual and creates a new HomeKit identity.

Install **`homebridge-http-advanced-platform@2.0.0-alpha.6`**, or select
**alpha / v2.0.0-alpha.6** in Homebridge UI 5.29.0's install version chooser.
**This is an Alpha, with no stable release.** npm requires a `latest` tag and
assigned it to this first Alpha alongside `alpha`; both resolve to
`2.0.0-alpha.6`. An unqualified install also installs this Alpha. The original
accessory package's tags are separate, so its users receive no automatic update.

The immutable Alpha.6 archive and npm-page README retain a prepublication
"no latest" assumption. These release notes and the current GitHub README
correct that statement. npm requires a new package version to update its page's
README; the reviewed Alpha.6 runtime and archive remain unchanged.

Back up Homebridge before replacing the original package. Preserve storage and
bridge identity, remove the old package before starting with the new one, and
update any package-qualified entries or plugin lists. Do not load both packages.
The aliases `HttpAdvancedAccessory` and `HttpAdvanced` and the Alpha.5 platform
UUID namespace remain unchanged. Follow the
[replacement and rollback guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/docs/migration.md).

Requires Node 22.13+ in the 22.x line or 24.x, and Homebridge 1.11.4+ in the 1.x
line or 2.4+ in the 2.x line. Source and installed-package checks passed across
Node 22/24 and Homebridge 1/2. Rendered UI, native editing, managed child bridges
and replacement/rollback passed in an isolated Node 24/Homebridge 2 fixture with
HAP disabled. Actual Apple Home pairing, scenes, automations, physical controls
and live soak remain to be checked.

Homebridge verification follows public launch and soak. This Alpha is not verified;
parent issue/PR fixes and dependency updates are separate future work.

See the [README](https://github.com/shanemcw/homebridge-http-advanced-platform#readme)
for configuration and install details. Report versions and sanitized diagnostics
through the repository's issue tracker.
