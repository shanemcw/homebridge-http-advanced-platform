# 2.1.0 Development and Release Scope

Stable `2.1.0` promoted the runtime and editors previously published as
`2.1.0-beta.2`, after field use of legacy accessories and migrated platform
switches. This page records that released scope. npm `latest` selects `2.1.0`;
Homebridge verification remains a separate step. The next release is described
in the [2.2.0 design and acceptance plan](development-2.2.0.md).

Version policy for this project: functional improvements advance the minor
version (`2.1.0`); the third component is reserved for cosmetic changes. A
working version number alone does not indicate release readiness.

## Implemented: redirect header hardening

GET/HEAD redirects to a different origin now discard every configured header
and device Basic Auth. Custom API-key headers can carry credentials just as
Authorization and Cookie do. Same-origin redirects retain configured headers
and authentication. Original action and device configuration are not mutated.

This carries forward the focused patch from archived commit
`1c158c6cdf9e80a28a0d7ffa67e8dd27067087c0`, rather than merging the obsolete
preparation branch. The regressions cover GET and HEAD, device Basic Auth,
explicit mixed-case Authorization, URL credentials and multiple redirect hops
with a single coordinator slot.

Compatibility change: an endpoint on another origin will no longer receive
custom headers from the starting endpoint. Configure that trusted final
endpoint directly if it needs its own headers. Version `2.0.0` forwards custom
headers across origins; stable `2.1.0` includes the hardening.

The release guard also accepts Alpha/Beta version strings for later release
lines, including `2.1.0-beta.1`, with matching explicit tags. The 2.1.0
prereleases used `publishConfig.tag: beta`; stable `2.1.0` selected `latest`.

## Implemented: platform schema and legacy configuration editors

Homebridge verification requires `pluginType: platform`. The schema now selects
the registered `HttpAdvanced` platform alias and describes a platform at its
root, with the unchanged device schema available as a reusable definition.
Legacy `HttpAdvancedAccessory` registration, configuration and HomeKit identity
remain supported.

The native plugin JSON Config now edits platform definitions. Plugin Config
provides individual expandable JSON editors with add and remove controls for
legacy accessories, alongside platforms and shared settings. Opening the UI
does not migrate or write configuration. Unedited fields, encoded commands,
aliases, child-bridge assignments and unrelated configuration remain preserved
by the existing validated, backed-up save path.

## Implemented in Beta.2: individual platform device editors

Beta.2 splits each platform into
**Edit Platform Settings** and **Edit Configured Devices**. Each device has its
own expandable JSON editor and remove control; **Add Device to “…”** adds only
to that platform and assigns a fresh random ID. The settings editor excludes
`devices` and rejects a competing device array before saving.

Platform headings and enable/add-device controls use the configured platform
name and follow valid name edits in the draft. **Add Platform** creates another
instance; each uses the same plugin alias and a unique name. The UI and schema
explain that names contribute to device identity and stay stable after pairing.

This is a UI change using the existing validated save path. Unedited IDs,
aliases, child-bridge assignments, encoded requests, mappings and unknown fields
are preserved. Devices without an explicit ID retain their name-based identity.
Tests exercise the actual browser handlers against the real configuration
editor, including unchanged byte preservation, independent edits, additions,
removals, duplicate IDs, invalid JSON and pending-change tracking. Publication
and stable promotion remain separate from any local UI deployment.

## Planned: preserve individual HTTP commands

Individual-command handling is now targeted for the next functional release,
`2.2.0`, with `2.2.0-beta.1` implemented for beta field testing. It is not included
in `2.1.0`; physical command acceptance remains a stable-promotion gate.

The [2.2.0 design and acceptance plan](development-2.2.0.md) defines the
per-setter `writeMode`, device ordering, debounce boundaries, bounded queues,
deadlines, failure cancellation and observed-state handling. Existing definitions
retain their behavior unless a device opts into command mode. Custom FanIR/TVIR
services and complete television integration remain separate work.

## Release readiness

Stable `2.1.0` was published after successful field testing of legacy and migrated
platform operation, including scene activation, voice control, physical control
and cached identity persistence across restarts. Those results completed its
earlier field acceptance hold.

Each public candidate must pass the Node 22/24 × Homebridge 1/2 matrix, production
dependency audit and fresh package installation checks. Record deployment and
device acceptance separately. The [stable 2.1.0 release notes](release-notes.md)
describe its scope and the limits of field coverage. Individual command handling
was outside `2.1.0` and is implemented in the separate `2.2.0-beta.1` candidate.

The [branch archive](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/maintenance/platform-release/BRANCH-ARCHIVE-20261004.md)
preserves the old history. Contribution and coordination plans for the original
accessory maintainer are retired.
