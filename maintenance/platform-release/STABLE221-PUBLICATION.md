# Stable 2.2.1 publication

Recorded November 12, 2026. The candidate and its packaged release notes were
prepared November 11; public publication completed November 12.

- [PR #8](https://github.com/shanemcw/homebridge-http-advanced-platform/pull/8)
  merged as `1977e4264aac2c641c47676de68abaa27fcf2cb6`. The annotated `v2.2.1`
  tag resolves to that commit.
- [GitHub stable release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.2.1)
  is public and latest. [npm 2.2.1](https://www.npmjs.com/package/homebridge-http-advanced-platform/v/2.2.1)
  is public on `latest`; `beta` retains `2.2.0-beta.1`. Stable `2.2.0` remains
  available. The published 2.2.1 metadata has no `deprecated` property.
- The public npm and GitHub archives match the reviewed candidate byte for byte.
  SHA-256 is `f5e721132e11223585cd6458e94b7e40a25bcef76c4c3ed097386f84a645f3af`.
- The package declares Node `^22.13.0 || ^24.0.0 || ^26.0.0`. Compared with 2.2.0,
  all 64 archive paths are preserved; only package metadata and documentation
  differ. Runtime, UI and schema bytes and dependency versions are unchanged.

## Validation

- Typecheck, lint, 148 source tests and four installed-package checks passed in
  each combination of Node 22.23.5, 24.21.0 and 26.13.1 with Homebridge 1.11.4
  and 2.4.0. The production dependency audit reported zero known vulnerabilities.
- Six-job compatibility CI passed for the
  [PR](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/43151194701),
  [merged main](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/43253280605)
  and [release tag](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/43253393575).
- After publication, a fresh install of the exact public npm version passed all
  four installed-package checks on Node 26.13.1 with Homebridge 2.4.0.

## Installation boundary

Publication did not install or restart household Homebridge, change its Node
runtime or configuration, or exercise physical devices. Existing 2.2.0 field
coverage still applies; Node 26 acceptance here is automated and isolated.
