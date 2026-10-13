# 2.1.0-beta.1 Release Checkpoint

Shane authorized a GitHub beta prerelease and npm publication on October 13,
2026, after accepting the local development build in Apple Home. Publish only
on npm `beta`; keep `latest` at `2.0.0`. Review a successful week of household
soak before stable promotion and Homebridge verification resubmission.

## Candidate and Validation

- Package: `homebridge-http-advanced-platform@2.1.0-beta.1`.
- Branch: `develop/2.1.0`; release tag: `v2.1.0-beta.1`.
- Archive SHA-256:
  `dff5349b9f895ead6923759abd242726610f235d4139024bd026b26bed27c555`.
- 59 packaged files; all 46 runtime, schema and custom UI files are byte-identical
  to the accepted local development archive. Version metadata and release
  documentation distinguish the public beta.
- Typecheck and lint passed. All 113 tests passed on each Node 22.23.3/24.21.0 ×
  Homebridge 1.11.4/2.4.0 combination, totaling 452 successful executions.
- Fresh production-only installation succeeded with eight packages. Installed
  Homebridge loader, loopback control and official custom UI IPC checks passed
  3/3 on both Homebridge versions.
- Production dependency audit reports zero known vulnerabilities.
- The release guard accepts the explicit `beta` tag for this candidate.

Initial sandboxed HTTP tests were blocked from binding loopback ports; the same
suite passed after running with the required loopback permission. These were
environment restrictions, not plugin failures.

## Release Notes and Coverage

The GitHub prerelease body uses `docs/release-notes.md`. Installed Homebridge UI
5.29.0 resolves the chosen npm version and fetches the matching GitHub release,
trying `vVERSION` then `VERSION`. A tag alone is insufficient for its release
notes popup. The packaged `CHANGELOG.md` supplies the full changelog.

The beta includes platform schema correction, legacy JSON editors, requested UI
capitalization and cross-origin redirect header hardening. Release notes explain
that authenticated redirected endpoints on another origin should be configured
directly. Individual per-action command handling remains planned.

Household acceptance covers 44 legacy Switch accessories. Optional platform
modes and other services/mappers have automated and isolated coverage. Do not
claim Homebridge verification, completed beta soak or stable promotion yet.

See the [local installation record](LOCAL-DEV-20261013.md) for backups, preserved
configuration/accessory identities and user-reported Apple Home acceptance.
