# 2.2.0-beta.1 publication - October 24, 2026

## Public release

- Source: `a2a17afe45422abf76ccfc8025befd11000ba42b`; annotated tag `v2.2.0-beta.1` resolves to this commit.
- [npm Beta.1](https://www.npmjs.com/package/homebridge-http-advanced-platform/v/2.2.0-beta.1)
  is publicly available. npm beta selects `2.2.0-beta.1`; latest remains `2.1.0`.
- [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.2.0-beta.1)
  is public with archive and SHA-256 assets. The latest regular release remains
  `v2.1.0`. The release body retains the packaged notes' prose and resolves the
  design link to its version-pinned GitHub source.
- Reviewed archive: `homebridge-http-advanced-platform-2.2.0-beta.1.tgz`.
  SHA-256: `9660ae3a13486a20167c151498bfae604d295acef53f8667392829dfd14e63de`.
  The public npm archive and both GitHub assets match the reviewed files exactly.
- npm accepted the exact archive after normal authentication and processing.
  Publication used explicit `--tag beta --access public`; stable latest was not moved.

## Validation

- [Branch CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/40109269399)
  and [tag CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/40109269292) passed all four Node 22/24 x Homebridge 1/2 jobs,
  including typecheck, lint, 148 source tests per job, production audit and pack checks.
- Local acceptance passed 592 source-test executions and 16 production-only
  installed-package checks. Production dependency audit found zero known
  vulnerabilities. Installed checks covered loading/aliases, target controls,
  official custom UI IPC and repeated commands with observed feedback.
- Final publication edits changed Markdown only relative to the fully validated
  candidate. Packed files matched the reviewed source; package/example tests,
  private-environment scan, whitespace and packaged documentation checks passed.
- Public registry versions are now stable `2.0.0`, stable `2.1.0` and Beta.1
  `2.2.0-beta.1`. The six obsolete prereleases remain retired; no alpha tag exists.

## Acceptance boundary

Representative physical command-device/controller testing remains required before
stable `2.2.0` promotion, including mixed targets/commands, failures, restart and
existing household switch/scene/voice behavior. Homebridge verification remains
separate. This publication did not install a package, restart Homebridge or
change any running device configuration.
