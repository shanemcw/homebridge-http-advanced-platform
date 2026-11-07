# Stable 2.2.0 publication

Recorded November 7, 2026.

- The annotated `v2.2.0` tag resolves to `47d319de10be8549091373bebba13f355fd66bdc`.
- [GitHub stable release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.2.0)
  is public and latest. [npm 2.2.0](https://www.npmjs.com/package/homebridge-http-advanced-platform/v/2.2.0)
  is public on `latest`. The `beta` tag retains `2.2.0-beta.1`.
- The reviewed tarball matches the public npm download and GitHub asset.
  SHA-256 is `9bdd115c5c0954a5ead44865676ab9855b7e6df46284834c3e74e3b8d55240f5`.
- The archive differs from Beta.1 only in documentation and package version
  and channel metadata. Runtime, UI, schema and dependencies match Beta.1.

## Validation

- On Node 22 and 24 with Homebridge 1 and 2, 148 source tests and four clean-install
  checks passed per combination. Typecheck and lint passed. The production
  dependency audit reported zero known vulnerabilities.
- Compatibility CI passed on the
  [release branch](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/42381229911),
  [main](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/42381400042)
  and the [release tag](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/42381400152).
- The 64 packed files matched the clean install. Packaged relative links and
  Markdown anchors resolved.

## Field coverage

Household use covered ordinary switches and migrated platform devices.
Command mode has automated and loopback coverage. The maintainer chose to
make the release available through the default install and gather physical
command-device results through [GitHub issues](https://github.com/shanemcw/homebridge-http-advanced-platform/issues/new).
The release notes explain what to include in a sanitized report.
