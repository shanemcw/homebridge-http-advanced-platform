Homebridge HTTP Advanced Platform connects HTTP/HTTPS-controlled devices and REST
APIs to Apple Home through Homebridge, with JSON/XML response mapping, JSONPath,
XPath, polling and shared cached reads. It supports switches, sensors and other
supported HomeKit services, legacy accessories and optional platform devices.

This is a platform conversion of
[staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory),
retaining the Apache-2.0 license, Git history and tasict/staromeste contributor credit.

Alpha.7 updates functionality descriptions, search keywords and installation
guidance. It packages the README correction for npm's required `latest` tag.
Runtime, custom UI, schema, retained aliases, UUID namespace and dependency bytes
remain unchanged from Alpha.6. A repository-only timing check now measures
execution spacing instead of server receive timestamps; its configured delay
and timeout checks are retained. No parent fixes or dependency updates are included.

Install **`homebridge-http-advanced-platform@2.0.0-alpha.7`**, or select the
**alpha** row in Homebridge UI 5.29.0's install version chooser.
**This is an Alpha, with no stable release.** npm requires `latest`, which can
point to an Alpha. `alpha` and `latest` can point to different prerelease versions;
choose the explicit Alpha tag or reviewed exact version. The original accessory
package is separate and receives no automatic update to this package.

Back up Homebridge before replacing the original package. Preserve storage and
bridge identity, remove the old package before starting with the new one, and
update any package-qualified entries or plugin lists. The `HttpAdvancedAccessory`
and `HttpAdvanced` aliases remain supported. Converting an accessory to a platform
device remains optional, manual and creates a new HomeKit identity. Follow the
[replacement and rollback guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/docs/migration.md).

Requires Node 22.13+ in the 22.x line or 24.x, and Homebridge 1.11.4+ in the 1.x
line or 2.4+ in the 2.x line. Earlier source and installed-package checks passed
across Node 22/24 and Homebridge 1/2. Rendered UI, native editing, managed child
bridges and replacement/rollback passed in an isolated Node 24/Homebridge 2
fixture with HAP disabled. Paired Apple Home, physical controls and live soak
remain separate acceptance. This Alpha is not Homebridge verified.

Search metadata improves matching but public indexing and ranking depend on the
registry. If a descriptive search does not find the package, search the exact
new package name. See the
[README](https://github.com/shanemcw/homebridge-http-advanced-platform#readme)
for configuration and install details, and report sanitized diagnostics through
our issue tracker.
