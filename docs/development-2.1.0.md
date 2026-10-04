# 2.1.0 — in progress

The working version is `2.1.0`, on `develop/2.1.0`. It is not published or
deployed. Stable npm `latest` remains `2.0.0`. Development continues in the owned
`shanemcw/homebridge-http-advanced-platform` repository.

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
endpoint directly if it needs its own headers. Published `2.0.0` still forwards
custom headers across origins; this hardening has not been distributed yet.

The release guard also accepts Alpha/Beta version strings for later release
lines, including `2.1.0-alpha.1`, with matching explicit tags. This does not
publish a candidate or change any registry tag.

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

Before distributing this changed runtime, review the final scope, run the
Node 22/24 × Homebridge 1/2 matrix, inspect and install the package in isolation,
and validate relevant device behavior. Record any prerelease or production
deployment separately from this development checkpoint.

The [branch archive](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/maintenance/platform-release/BRANCH-ARCHIVE-20261004.md)
preserves the old history. Contribution and coordination plans for the original
accessory maintainer are retired.
