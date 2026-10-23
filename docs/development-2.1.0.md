# 2.1.0 Development and Release Scope

The stable `2.1.0` candidate promotes the runtime and editors published as
`2.1.0-beta.2`, after field use of legacy accessories and migrated platform
switches. Stable publication selects npm `latest`; the earlier beta remains on
`beta`. Confirm the exact public version before installing. A local development
build was evaluated before preparing the beta. Homebridge verification
resubmission remains a separate later step. Development continues in the
maintained platform repository.

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
endpoint directly if it needs its own headers. Stable `2.0.0` still forwards
custom headers across origins; the beta includes the hardening.

The release guard also accepts Alpha/Beta version strings for later release
lines, including `2.1.0-beta.1`, with matching explicit tags. The beta package
defaults to `publishConfig.tag: beta`, keeping stable `latest` unchanged.

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

This is a feature plan, not an implemented configuration option. Three
deliberate volume-up presses should send three commands. By contrast, combining
rapid changes to a target brightness can be useful. Today, `setterDelay` applies
at device or shared-default level; positive values retain only the last write.

The proposed platform feature should:

- Opt in per setter action, with omission preserving current behavior. Choose
  the field name and specify its validation before implementation.
- Bypass target-value debounce for individual commands. Define ordering across
  commands and target writes on the same configured device, including its
  additional services, while retaining pacing and independent-device progress.
- Retain queue bounds, total delivery deadlines and shutdown cancellation.
  Rejected or expired commands must not execute later. Failed or uncertain
  commands must not be replayed automatically; a timeout can follow delivery.
- Keep acknowledgements and observed state separate. An increment/toggle code
  must not become a requested target or confirm resulting device state.
  Command-only endpoints need no invented getter.
- Preserve both adapters, configuration round-trips, mappings, aliases and
  HomeKit identities. Do not infer command behavior from HTTP method or name.

Acceptance must cover repeated and alternating commands, mixed target/command
ordering, shared debounce overrides, pacing, queue pressure, expiry, failures,
shutdown, feedback handling, additional services and both Homebridge versions.
Representative device and Apple Home behavior will need separate validation.
Custom FanIR/TVIR service definitions and complete TV integration are outside
this proposal.

## Release readiness

Stable preparation follows successful field testing of legacy and migrated
platform operation. Acceptance covers scene activation, voice control, physical
control and cached identity persistence across restarts. These results complete
the earlier field acceptance hold; publication remains a separate release step.

Each public candidate must pass the Node 22/24 × Homebridge 1/2 matrix, production
dependency audit and fresh package installation checks. Record deployment and
device acceptance separately. The [beta release notes](release-notes.md) describe
the released scope and the limits of field coverage. Optional per-action
command handling is not a release requirement for this beta.

The [branch archive](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/maintenance/platform-release/BRANCH-ARCHIVE-20261004.md)
preserves the old history. Contribution and coordination plans for the original
accessory maintainer are retired.
