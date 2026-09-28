# Alpha.8 publication and UI install-path acceptance

Recorded: 2026-09-28 (America/New_York).

## Release identity

- Scope: optional `manufacturer`, `model` and `serialNumber` Accessory
  Information fields based on upstream PR #46. Platform `id` and HomeKit UUID
  remain stable. No other upstream fix, dependency update or HTTP behavior change
  was included.
- Release commit: `ad1d910c4c1b6cc9e028878da30f1de78d312cc4` on both `main` and
  `package-http-advanced-platform`. Annotated tag: `v2.0.0-alpha.8`.
- GitHub prerelease: <https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.8>.
  It is public, not a draft, and has the reviewed archive and checksum asset.
- Reviewed archive SHA-256:
  `bcc529d9ffbe0175fc3f7f00d1278f66721f37ddcad890fb7cdb47a7953ac3c4`.
  The GitHub asset digest and the public npm download match these exact bytes.
- npm `homebridge-http-advanced-platform@2.0.0-alpha.8` is public. Both `alpha`
  and the existing required `latest` tag point to Alpha.8. npm integrity:
  `sha512-ZapCvXo/puyZzXKodlmRV9qaRyC5AIz5u6jcO7sCI1ozS4BIBwKebVM+OiEEeF+gZrIBtTGDES8/6CyKlvGMJA==`.

## Validation

- Local Node 24 typecheck, lint and 99 source tests passed. Production
  dependency audit reported zero known vulnerabilities. The 56-file archive
  differs from Alpha.7 only in metadata runtime, schema, sample and docs.
- Both release-commit CI matrices passed all four Node 22/24 by Homebridge 1/2
  jobs: [main](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36471556153)
  and [packaging](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36471556307).
- A fresh public exact-version installation under
  `/private/tmp/http-advanced-platform-alpha8-public-20260928/installed` added
  eight packages. All 56 installed plugin files match the reviewed archive.
  `installed-smoke.mjs` passed 3/3: Homebridge loader and both aliases, loopback
  HTTP adapters, and custom UI IPC.
- The existing pinned Homebridge UI 5.29.0 chooser acceptance passed 3/3 with
  Alpha.8 metadata. An additional live-registry check used that installed UI's
  exact-package lookup and available-version service, then its pinned chooser
  component and install backend. The lookup reported `latestVersion` Alpha.8;
  `alpha` and `latest` rows both resolved to Alpha.8; selecting the `alpha` row
  produced the exact install argument
  `homebridge-http-advanced-platform@2.0.0-alpha.8`. The live check script is
  under `/private/tmp/http-advanced-platform-alpha8-public-20260928/`.
- The npm publication required the user's browser authentication and fingerprint
  approval. No authentication links, codes or credentials are recorded here.

## Boundary

The UI service and chooser path, registry installation and isolated runtime
passed. An actual click through the user's production Homebridge UI, replacement
of its installed Alpha.7, paired Apple Home behavior, physical controls and live
soak were not performed in this release task. Existing production configuration
was read only; no production package, Homebridge process or device changed.
Ordinary descriptive search ranking remains an independent discovery check.
