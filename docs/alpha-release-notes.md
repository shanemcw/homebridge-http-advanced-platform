# Homebridge HTTP Advanced Platform 2.0.0-alpha.7

Opt-in Alpha based on preserved `2.0.0-alpha.5`. Confirm availability in the
matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases)
and [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions).

This is a platform conversion of [staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory). It retains the original Apache-2.0 license, contributor credit and Git history.

Alpha.6 introduced the public `homebridge-http-advanced-platform` package. Alpha.7 updates its description, keywords and README to explain HTTP/HTTPS devices, REST APIs, JSON/XML response mapping, JSONPath, XPath, polling, shared caching, switches and sensors. It also packages the corrected explanation of npm's required `latest` tag. Search metadata helps matching but does not guarantee public indexing or ranking.

Distributable runtime, custom UI, schema, configuration aliases, UUID namespace and dependency declarations are unchanged from Alpha.6. This retains Alpha.5 device behavior: shared cached reads, bounded background HTTP requests, recovery, write confirmation, legacy accessories and optional platform devices. No parent issue/PR fixes or dependency updates are included.

A repository-only timing assertion now checks scheduled execution spacing rather than server receive timestamps, which include connection delays. Its configured delay and timeout checks are retained. Tests and maintenance reports are not shipped in the npm archive.

Configuration aliases remain `HttpAdvancedAccessory` and `HttpAdvanced`. The platform UUID namespace remains the Alpha.5 namespace. Package-qualified configuration and plugin lists must use the new package name; do not load both old and new packages. Follow the [replacement and rollback guide](migration.md), preserving configuration, storage and bridge identity.

Moving a legacy accessory into a platform remains an explicit manual conversion with a new HomeKit identity. No automatic conversion tool is included.

Requirements remain Node `^22.13.0 || ^24.0.0` and Homebridge `^1.11.4 || ^2.4.0`. Source checks and installed loader/adapters/custom UI IPC passed across Node 22/24 and Homebridge 1/2. Rendered Homebridge UI 5.29.0, native editing, managed child bridges and backed-up replacement/rollback passed in an isolated Node 24/Homebridge 2 fixture. HAP was disabled in that fixture; paired Apple Home, physical controls, rooms/scenes/automations and live soak remain separate acceptance.

The publication channel is the explicit `alpha` npm tag with a matching GitHub prerelease; this package has no stable release. npm also requires a `latest` tag, which can point to an Alpha and does not indicate stability. The `alpha` and `latest` tags can point to different Alpha versions, so choose the **alpha** row or reviewed **v2.0.0-alpha.7** in Homebridge UI 5.29.0's install version chooser, or install `homebridge-http-advanced-platform@alpha` (exact version: `@2.0.0-alpha.7`). Its tags do not modify the original accessory package's tags. Homebridge verification will be pursued separately after publication; this Alpha is not verified.

Alpha.7 includes the npm tag correction in its packaged README. The published Alpha.6 archive and its release tag remain unchanged.

Report versions and sanitized diagnostics. Do not include credentials, pairing PINs or unredacted configuration.
