# Alpha.9 multi-service development checkpoint

Recorded: 2026-09-28 (America/New_York). Branch: `alpha9-multiservice`.
This is an unpublished local development milestone. The installable release remains
`2.0.0-alpha.8`; no Alpha.9 tag, GitHub release, npm publication or production
deployment has been made.

## Scope

- Add `additionalServices` to legacy accessories and platform devices for
  [upstream issue #12](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/12).
- Give each additional service a stable `id` as its HAP subtype. Preserve the
  containing accessory UUID and the primary service UUID/subtype. Keep each
  service's actions and mapper state separate while sharing inherited device
  authentication, timing and request spacing.
- Reconcile cached platform services by UUID and subtype. Retain existing services
  on invalid inventory and remove obsolete additional services after valid
  reconciliation.
- Document a Contact Sensor with Battery status and level, update the schema,
  and distinguish unpublished Alpha.9 from published Alpha.8 throughout the
  current documentation. Historical release reports retain their dated results.

## Local verification

- `npm run check`: typecheck, lint and 101/101 tests passed on Node 24 with
  Homebridge 2.4.0.
- `HB_TEST_VERSION=1 npm test`: 101/101 tests passed on Node 24 with
  Homebridge 1.11.4.
- Focused tests cover legacy/platform Battery actions, inherited credentials and
  pacing, duplicate service IDs, cached restoration, service removal, primary
  AID/IID continuity and schema validation.
- `npm pack --dry-run --json` completed with an isolated npm cache: 56 files,
  including the updated schema, README, public docs and built adapters.
- Relative Markdown file links and `git diff --check` passed.

## Numeric mapper milestone

Recorded: 2026-09-29 (America/New_York). The local Alpha.9 source also adds a
declarative `scale` mapper for getters and setters. It validates finite numeric
ranges, accepts complete decimal response strings, supports optional decimal
rounding and input clamping, and rejects invalid setter values before sending.
The README now has an inverse-range dimmer example; the schema, mapper reference
and draft release notes describe this unpublished feature.

- `npm run check`: typecheck, lint and 106/106 tests passed on Node 24 with
  Homebridge 2.4.0.
- `HB_TEST_VERSION=1 npm test`: 106/106 tests passed on Node 24 with
  Homebridge 1.11.4.
- Focused tests cover chained mapping, clamping, rounding, invalid values,
  configuration validation, the documented example and HTTP read/write behavior.
- `npm pack --dry-run --json` completed with an isolated npm cache: 56 files,
  including the schema, README, mapper reference, release notes and built mapper.

## Strict lookup milestone

Recorded: 2026-09-29 (America/New_York). The local Alpha.9 source now adds an
opt-in `lookup` mapper that returns mapped false, zero and empty string exactly.
An unknown getter key is inconclusive; an unknown setter key fails before the
HTTP request. Legacy `static` behavior is unchanged. The README contains a
relay example with both getter and setter mappings; the schema and mapper
reference describe exact matching and the scalar value constraint.

- `npm run check`: typecheck, lint and 110/110 tests passed on Node 24 with
  Homebridge 2.4.0.
- `HB_TEST_VERSION=1 npm test`: 110/110 tests passed on Node 24 with
  Homebridge 1.11.4.
- Focused tests cover falsey values, unknown/prototype keys, fallback reads,
  zero-valued writes, configuration validation and the README example.
- `npm pack --dry-run --json` completed with an isolated npm cache: 56 files,
  including the schema, README, mapper reference, release notes and built mapper.

## Before publication

Review the final Alpha.9 diff and archive, then run the Node 22/24 by Homebridge
1/2 CI matrix on the intended release commit. Exercise a fresh installed Alpha.9
in the actual Homebridge UI and a paired Apple Home setup: check that Battery
information appears on the primary device, survives restart and rename, and
that removing/changing an added service has the documented automation impact.
Test physical endpoint mapping and an outage with the intended device. Complete
the existing live-soak and rollback gates before calling this release ready.
Update public installation wording and release notes only after publication is
approved and the exact version is available.
