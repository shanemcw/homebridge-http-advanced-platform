# Alpha.9 publication and testing handoff

Recorded: 2026-09-29 (America/New_York).

## Release identity

- Release commit: `d40114d90daf524b20120e734dcfebea8c128273` on `alpha9-multiservice`; tag `v2.0.0-alpha.9` resolves to that commit.
- [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.9) is public, marked as a prerelease, and has the reviewed tarball and checksum asset.
- npm `homebridge-http-advanced-platform@2.0.0-alpha.9` is public. The `alpha` tag points to Alpha.9; the required `latest` tag remains on Alpha.8. The original accessory package remains separate.
- Reviewed tarball: 56 files, 78,314 compressed bytes. SHA-256: `f83a6711ded25c728640a40e4e88cd22d144a873b2596e75596f5797c34747c5`. npm integrity: `sha512-cSbLbGMZv+Ayp0KpYs+Lb1f12fE+UlCC2raq78tdYNKTDNmoIB2xy2Ew3tph+XGS5EyYhnjLTSgn28SUJpSflw==`.
- The public npm tarball downloaded by exact version has the same SHA-256 as the reviewed local archive and GitHub release asset.

## Validation

- Local Node 24 typecheck, lint and 110 source tests passed. The production dependency audit reported zero known vulnerabilities.
- [Release-commit CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36576549720) passed all four Node 22/24 by Homebridge 1/2 jobs, including the production audit and package dry run.
- A fresh isolated local-tarball installation added eight packages. Homebridge loader and both public aliases, loopback HTTP adapters, and official custom UI IPC passed 3/3. All 56 installed plugin files matched the reviewed archive.
- npm exact-version metadata, `alpha` and `latest` tags, GitHub prerelease state, release target and uploaded asset digests were checked after publication.

## Alpha acceptance boundary

Publication enables installation and testing through Homebridge UI. The user's actual UI install, paired Apple Home presentation, rooms, scenes, automations, physical endpoint reads and writes, restart behavior, recovery, rollback and unattended soak have not been tested in this release task. Existing production Homebridge and Apple Home were not changed.

Replacing the old accessory package can remove legacy `accessories[]` JSON through Homebridge UI's uninstall option. Save those exact entries separately before replacement; restoring JSON after Apple Home sees accessories disappear may not restore its references. Follow the [migration guide](../../docs/migration.md).

The public default `main` branch still points to Alpha.8. [PR #3](https://github.com/shanemcw/homebridge-http-advanced-platform/pull/3) contains the Alpha.9 source and current README for review; the prerelease tag remains on the exact validated release commit.
