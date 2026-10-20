# Beta.2 release checkpoint - October 20, 2026

## Candidate

`homebridge-http-advanced-platform@2.1.0-beta.2` packages the independent platform
device editors and named controls previously tested as local Beta.1 UI patches.
The branch is `develop/2.1.0`. Stable `latest` stays at `2.0.0`; no production
package installation or restart is part of this publication.

The reviewed archive is `homebridge-http-advanced-platform-2.1.0-beta.2.tgz`:

- 59 files; 82,952 bytes.
- SHA-256: `5397773f7dae6b64fc2ac6de3d51b3d62ee19c2fe8f57b810cf6d8a794a8ab91`.
- Every packed file matches its reviewed working-tree source. The allowlist
  contains runtime, UI, schema, sample configuration and public documentation;
  maintenance notes, tests, private configuration and dependencies are excluded.
- All 42 runtime/declaration/map files match the public Beta.1 archive exactly.
  Production dependencies and engine requirements are unchanged.

## Local acceptance

- Normal TypeScript typecheck/build, full ESLint with no warnings, and
  `git diff --check` passed.
- Node 22.23.3 and 24.21.0, each with Homebridge 1.11.4 and 2.4.0:
  119/119 tests per combination, 476 total. The six added UI regressions run
  actual browser handlers against the real configuration editor.
- Fresh archive installation with production dependencies only installed eight
  packages. The Homebridge loader, loopback getter/setter and official custom UI
  IPC smoke checks passed 3/3 in all four combinations, 12 total.
- Production dependency audit: zero vulnerabilities. Release guard accepted the
  explicit `beta` channel.
- Earlier sanitized-browser and installed-UI acceptance is recorded in the
  [device-editor](PLATFORM-DEVICE-UI-20261018.md) and
  [named-control](PLATFORM-LABELS-UI-20261018.md) deployment records.

## Remaining publication checks

Push the reviewed commit and require all four compatibility CI jobs to pass.
Create a matching `v2.1.0-beta.2` GitHub prerelease with `docs/release-notes.md`
and the exact reviewed archive/checksum. Publish that archive with explicit
`--tag beta --access public`, then compare public npm/GitHub archive checksums,
verify `latest` and `alpha` are unchanged, and inspect the actual Homebridge
Manage Version notes popup without installing.

Publication is separate from the continuing platform-device household soak,
remaining scene/voice checks, stable promotion and Homebridge verification.
