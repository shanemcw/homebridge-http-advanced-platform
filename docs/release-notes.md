# Homebridge HTTP Advanced Platform 2.2.0

Stable release, November 7, 2026. Preserve individual button commands while
retaining target-value debounce for controls such as brightness sliders.

Select **latest** or **v2.2.0** in Homebridge Manage Version, or install
`homebridge-http-advanced-platform@2.2.0` in the existing plugin location.
Requires Node 22.13 or later in the 22.x line, or Node 24.x, and Homebridge 1.11.4
or later in the 1.x line, or Homebridge 2.4 or later in the 2.x line.
Homebridge verification is tracked separately.

Back up Homebridge before upgrading. Keep existing device IDs, platform names,
service subtypes and bridge assignments. Follow the [migration guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.2.0/docs/migration.md)
when replacing the original accessory package.

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

## Validation and device reports

Source and clean-install checks cover Node 22 and 24 with Homebridge 1 and 2.
They exercise repeated writes, mixed targets and commands, deadlines, failure
cancellation, shutdown, feedback and editor round-trips. Household field use
covered ordinary switches and migrated platform devices. Command mode has
automated and loopback coverage. Physical command-device results are welcome.

Please [open a GitHub issue](https://github.com/shanemcw/homebridge-http-advanced-platform/issues/new)
with the device and controller models, Node and Homebridge versions, a sanitized
setter configuration, the sequence you sent and what the device actually did.
Keep credentials, private URLs and request bodies out of the report.

See the [design and validation plan](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.2.0/docs/development-2.2.0.md)
and [changelog](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.2.0/CHANGELOG.md).
