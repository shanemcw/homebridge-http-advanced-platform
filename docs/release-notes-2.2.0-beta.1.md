# Homebridge HTTP Advanced Platform 2.2.0-beta.1

Beta testing release, October 24, 2026. Preserve individual button commands while
retaining target-value debounce for controls such as brightness sliders.

Select **beta** or **v2.2.0-beta.1** in Homebridge Manage Version after confirming
the matching public npm version and GitHub prerelease. npm **latest stays at
2.1.0**. This package is not Homebridge-verified. Representative physical-command
field acceptance remains pending before stable `2.2.0` promotion.

This publication does not install the package or restart an existing Homebridge
instance. Back up Homebridge before beta installation and keep existing device
IDs, platform names, service subtypes and bridge assignments unchanged.

## Individual commands

Set `writeMode: "command"` on an individual setter action when every received
write represents a separate operation, such as a Volume Up press. Repeated and
alternating presses are preserved and delivered in order. Omit the field, or
use `"target"`, to retain target-value behavior such as brightness debounce.

Example action fragment for a service that already exposes VolumeSelector:

```json
{
  "setVolumeSelector": {
    "url": "http://device.example/volume/{value}",
    "writeMode": "command",
    "mappers": [
      { "type": "lookup", "parameters": { "mapping": { "0": "up", "1": "down" } } }
    ]
  }
}
```

Add this inside the service's `urls` object and expose its optional
`VolumeSelector` characteristic where appropriate. Adapt the endpoint and
mapping to the device. This is not a complete accessory definition or a new
television integration. The feature preserves writes received by the plugin;
the HomeKit controller must actually generate the repeated writes.

## Behavior when enabled

- A command action bypasses device/shared `setterDelay`. It still obeys
  `uriCallsDelay`, queue capacity, origin limits and its delivery deadline.
- Any command action enables one ordered write queue for its containing device,
  across primary and additional services. Other devices remain independent.
- Adjacent target writes for the same action may coalesce while their debounce
  window is open. A command or different action forms an ordering boundary;
  an earlier target's debounce can delay a later command.
- A command's timeout begins when its setter is received and includes all queue
  waiting and HTTP delivery. Expired writes are removed before delivery. Queue
  rejection/expiry is reported as failure rather than silently dropping a press.
- Command success requires a 2xx HTTP response and any configured response guard.
  Commands never follow redirects, even for GET. Configure the final command URL
  directly. Explicit `strictHTTP: false` is invalid in command mode.
- An execution failure cancels that device's already-waiting writes. A subsequent
  explicit write can start fresh; other devices continue. Commands are never
  automatically retried or restored after restart. A timeout/abort after dispatch
  may leave physical delivery unknown.
- Command arguments do not become requested target values or persisted observed
  state. Readable command characteristics require explicit getters; write-only
  characteristics need none. Real feedback supplies device state, while HTTP
  success acknowledges delivery only.

Existing target-only configurations retain their scheduling, mapping, HTTP and
confirmation behavior. Opted-in devices gain serialized writes and the ordering
boundaries above. Registration aliases, HomeKit UUIDs and service identities are
preserved. The feature works through both legacy and platform adapters.

## Validation and field acceptance

Automated acceptance covers configuration, ordered/coalesced delivery, deadlines,
shared capacity, failure cancellation, shutdown, HTTP status/redirects, feedback
races, persistence and editor round-trips. Local release validation passed 148 tests on each Node 22/24 x Homebridge 1/2
combination (592 source test executions), typecheck/lint, zero known production
dependency vulnerabilities and 16 isolated installed-package checks covering
plugin loading, target controls, UI IPC and repeated commands.

Before stable promotion, record field acceptance with a representative command
device/controller, mixed commands and targets, endpoint failures and restart.
Recheck existing household switch/scene/voice behavior using a backed-up test
installation. Automated loopback checks do not establish physical acceptance.
See the [design and acceptance gates](development-2.2.0.md).
