# Individual command candidate - October 24, 2026

Local candidate: `2.2.0-beta.1`, targeting stable `2.2.0` after beta field
acceptance. Publication and physical command-device acceptance remain pending.
No running Homebridge installation was changed for these checks.

## Scope

Implement per-setter command mode, bounded per-device ordering across services,
ordered target debounce boundaries, shared queue reservations, total delivery
deadlines, failure cancellation and shutdown cleanup. Commands require 2xx
acknowledgements, never follow redirects and never replay. Observed state stays
separate from command arguments and Homebridge completion writes.

Pre-delivery expiry fails only its own command, including expiry inside network
admission; it does not cancel valid followers or retire earlier target holds.
Feedback generations and target holds change at actual HTTP dispatch boundaries.
Execution failures cancel the device's existing waiting batch. New explicit
intent and independent devices can continue.

## Local acceptance

- Node 22.23.3 / 24.21.0 x Homebridge 1 / 2: 148 source tests per
  combination, 592 test executions; typecheck and lint passed in all four.
- Fresh production-only tarball install matched every archive file byte for byte.
  Four installed checks per combination passed: plugin loading/aliases, loopback
  target controls, official custom UI IPC and repeated command delivery with
  observed feedback (16 installed test executions).
- Production dependency audit: zero known vulnerabilities.
- Packaged Markdown relative file targets and JSON examples passed validation.
- Existing target fixtures, adapters, configuration preservation, cache and
  identity regressions pass. Additional command tests cover admission, expiry,
  coalescing/ordering, cancellation, shutdown, mapping, feedback and persistence.

These checks exercise local uncommitted source based on `0154382`; they do not
establish remote CI, public release availability or physical device acceptance.

## Reviewed artifact

Archive: `homebridge-http-advanced-platform-2.2.0-beta.1.tgz`.
SHA-256: `9660ae3a13486a20167c151498bfae604d295acef53f8667392829dfd14e63de`.

## Remaining release work

Review/commit the candidate and validate remote CI before publishing the exact
reviewed archive as Beta.1. Keep stable latest unchanged. Record representative
command/controller field acceptance, mixed target/command use, endpoint failure,
restart and household switch/scene/voice regression behavior with backup and
rollback before stable promotion. A representative physical command device has
not yet been selected. No constant getters, custom IR services, full television
integration or general action sequences are included.

## Documentation refresh - October 24, 2026

The README now presents the platform additions and individual-command value near
its top, with links to open parent requests addressed by the existing features.
Current 2.1.0 guides no longer describe the stable release as beta. Historical
notes remain identified as historical; 2.2.0-beta.1 remains a candidate.

Seven package/example tests and 76 local file/anchor checks passed. Only Markdown
bytes changed in the refreshed archive; runtime, UI, schema, dependencies and
package metadata match the previously validated candidate exactly. The source
matrix, installed-package acceptance and audit above remain applicable.

## npm retirement documentation refresh - October 24, 2026

Following verified removal of the six obsolete npm prereleases, the README,
current guide, changelog and historical Alpha banner describe the remaining
stable versions and sole latest tag. Only Markdown bytes changed in the new
archive; runtime, UI, schema, dependencies and package metadata are unchanged.
Seven package/example tests and packed relative-link/JSON checks passed. The
2.2.0-beta.1 candidate remains unpublished and physical acceptance remains pending.

## Publication preparation - October 24, 2026

The maintainer authorized Beta.1 publication. Public release wording replaces
local/unpublished labels, and the exact archive/checksum above is selected for
publication after commit and GitHub compatibility CI. Runtime, UI, schema,
dependencies and package metadata match the fully validated candidate; only
Markdown changed. Package/example tests, packed-file matching, JSON/link checks
and the explicit Beta release guard pass. Physical command acceptance remains
required before stable promotion.
