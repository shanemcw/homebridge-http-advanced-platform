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

## Initial publication checklist

Push the reviewed commit and require all four compatibility CI jobs to pass.
Create a matching `v2.1.0-beta.2` GitHub prerelease with `docs/release-notes.md`
and the exact reviewed archive/checksum. Publish that archive with explicit
`--tag beta --access public`, then compare public npm/GitHub archive checksums,
verify `latest` and `alpha` are unchanged, and inspect the actual Homebridge
Manage Version notes popup without installing.

Publication is separate from the continuing platform-device field soak,
remaining scene/voice checks, stable promotion and Homebridge verification.

## Public publication and Homebridge acceptance

Published from commit `e8a8af3706d9202a812f872625de35e7369f9d86`, tagged
`v2.1.0-beta.2`. Both the branch and tag compatibility runs passed all four jobs:

- [Branch CI 39463819685](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/39463819685).
- [Tag CI 39463948170](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/39463948170).
- [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.1.0-beta.2),
  with the reviewed archive and SHA-256 asset. Its body matches the packaged
  release notes. GitHub's latest regular release remains `v2.0.0`.
- [npm Beta.2](https://www.npmjs.com/package/homebridge-http-advanced-platform/v/2.1.0-beta.2).
  The exact reviewed tarball was published with `--tag beta --access public`.
  npm's automated validation initially held availability; it completed, and the
  public registry then exposed `beta=2.1.0-beta.2`, `latest=2.0.0` and
  `alpha=2.0.0-alpha.9`.
- The public npm beta tarball and both GitHub assets match the local reviewed
  files exactly, including the SHA-256 recorded above.
- Actual Homebridge UI 5.29.0 Manage Version showed Beta.2 alongside stable 2.0.0.
  Its following confirmation dialog rendered the complete matching release
  notes, including the editor changes, backup/identity guidance, redirect
  compatibility and limits of live coverage. Stopped before **Continue**.
  Screenshot evidence is retained locally in Downloads as
  `http-advanced-beta2-release-notes-20261020.jpg`.

Automatic approval review initially blocked the version-selection click because
its label might initiate installation. Official UI 5.29.0 source confirmed that
an already-installed plugin takes the Update route: the initial dialog loads
notes, and a separate Continue invokes the update. After this evidence, the
read-only dialog-opening action was accepted. No installation was performed.

Read-only checks confirmed that viewing release notes did not change the
installed package, configuration or running service. Publication was separate
from field testing, package installation and stable promotion.
