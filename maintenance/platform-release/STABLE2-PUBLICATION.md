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
  tested Alpha.9 archive. Stable changes affect
  release metadata, documentation, packaging and publication guards.
- Current packaged Markdown links resolve within the stable archive, including
  the new configuration examples guide, release notes and full changelog.

## Field validation boundary

Field testing exercised legacy Switch configurations, startup restoration,
persistence and recovery after backend interruptions. Additional services,
platform devices and new mapper modes had automated and isolated coverage at
this historical checkpoint. These results do not establish every installation's
physical controls, rooms, scenes or automations. The release was not
Homebridge-verified. See the release notes and migration guide for compatibility
and replacement guidance.
