# Stable 2.0.0 publication

Recorded: 2026-10-04 (America/New_York).

- Release source: `4439c1fb56ec0703698a3c466f79fde193e4aa62` on `main`;
  `v2.0.0` resolves to that exact commit.
- [GitHub release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0)
  is public, stable and latest, with the reviewed archive and checksum assets.
- [npm package](https://www.npmjs.com/package/homebridge-http-advanced-platform)
  has `latest -> 2.0.0` and `alpha -> 2.0.0-alpha.9`. Browser inspection confirms
  the npm README displays the stable version and updated install guidance.
- Archive: 58 files, 76,922 compressed bytes. SHA-256:
  `f3dbb4222ac60485bf751ee73a93a7d6c0ec7f785318a74ed1d0dd596d2ac88e`.
  The exact-version public npm download and GitHub asset match the reviewed
  archive; all 58 files in the isolated installation match it.

## Validation

- A fresh locked-dependency environment passed typecheck, lint and 111 tests.
  The original checkout's typechecker stalled on local file reads; its two
  validation processes were stopped after the isolated check passed.
- [Release-commit CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/37197901034)
  passed all four Node 22/24 by Homebridge 1/2 jobs.
- Fresh production-only installation added eight packages. Loader/registration,
  loopback HTTP adapters and official custom UI IPC passed 3/3 on each Homebridge
  version. The production dependency audit reported zero known vulnerabilities.
- All 48 runtime/UI/configuration/license files match public Alpha.9, as does the
  household Alpha.9 install's complete 56-file archive. Stable changes affect
  release metadata, documentation, packaging and publication guards.
- Current packaged Markdown links resolve within the stable archive, including
  the new configuration examples guide, release notes and full changelog.

## Production and field boundary

Read-only household inspection found Alpha.9 installed since September 29,
Homebridge 2.4.0 on the logged Node 24.21.0 runtime, 44 unqualified legacy Switch
definitions, no original accessory package and no duplicate legacy names.
Homebridge was active with zero automatic systemd service restarts; the retained
log also records deliberate supervisor/process restarts. All recorded Alpha.9
startups restore 44/44 cached getters. Backend interruptions show successful
background recovery, with no plugin error mentions in the retained log window.
All 44 state files had recent write times; their private contents and detailed
success ages were inaccessible through the inspection account.

Production remains on Alpha.9. No production package, configuration, pairing or
service changes were made. Its configuration does not exercise platform devices,
additional services or `scale`/`lookup`; those paths retain automated/isolated
coverage. Read-only checks do not independently verify physical controls or
Apple Home rooms, scenes and automations. The release is not Homebridge-verified.
See the public release notes for these limits and the migration guide for safe
replacement of the original accessory package.
