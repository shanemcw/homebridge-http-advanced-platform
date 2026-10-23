# Stable 2.1.0 publication

Recorded: October 23, 2026.

## Published release

- Source: `882bb65559689d8fc282b8e84d97f2d702fba7d8`.
  The annotated `v2.1.0` tag resolves to this exact reviewed commit.
- [GitHub stable release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.1.0)
  is public and latest, with the reviewed archive and checksum assets.
- [npm 2.1.0](https://www.npmjs.com/package/homebridge-http-advanced-platform/v/2.1.0)
  is public. `latest` selects `2.1.0`; `beta` retains `2.1.0-beta.2` and `alpha`
  retains `2.0.0-alpha.9`.
- npm accepted the archive after normal authentication, then processed it before
  exposing the new version. Public availability and tags were checked afterward.
- Archive: `homebridge-http-advanced-platform-2.1.0.tgz`.
  SHA-256: `7bfc361ee9e8d551e4f351da7b94c27f4008eed92901745ae5beef13e23bf64e`.
  The public npm download and GitHub asset match the reviewed archive exactly.

## Validation

- Isolated locked-dependency source passed typecheck, lint and 119 tests in each
  Node 22/24 by Homebridge 1/2 combination: 476 source-test executions.
- Fresh production-only archive installation matched its packed files. Loader,
  loopback adapters and official custom UI IPC passed in every combination:
  12 installed smoke-test executions.
- Production dependency audit reported zero known vulnerabilities.
- Runtime, UI, schema, sample configuration and license files match public Beta.2
  byte for byte. Dependencies and engine requirements are unchanged.
- Exact-release compatibility CI passed on the
  [development branch](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/40001858967),
  [main branch](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/40002039042)
  and [release tag](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/40002038876).
  Each run passed every Node/Homebridge combination, audit and package check.
- Current and historical Markdown and structured documentation were reviewed for
  private environment details and inventory. Packaged documentation passed the
  same scan; examples use reserved domains. Relative documentation links and
  whitespace checks passed.

## Acceptance boundary

Field acceptance covered legacy and migrated platform operation, scenes, voice
control and identity persistence across restarts. Additional services and new
mapper modes retain automated and isolated coverage. Homebridge verification
resubmission and planned per-action command handling remain separate work.

Homebridge Manage Version displayed stable 2.1.0 on latest and rendered the
complete matching sanitized release notes, including redirect compatibility,
identity guidance, validation boundaries and planned features. Verification
stopped before Continue; no package installation occurred.
Package publication did not include deployment, restart or configuration changes.
