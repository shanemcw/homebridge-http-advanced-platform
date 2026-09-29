# Homebridge HTTP Advanced Platform

Connect HTTP/HTTPS-controlled devices and REST APIs to Apple Home (HomeKit) through Homebridge. Read sensor values, control switches and other supported HomeKit services, and map JSON or XML responses with JSONPath or XPath. Shared polling and caching keep reads responsive while HTTP refreshes run in the background.

This is a platform conversion of [staromeste's homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory). The project retains the original Apache-2.0 license, Git history and contributor credit, including the earlier [tasict/homebridge-http-accessory](https://github.com/tasict/homebridge-http-accessory) lineage.

**Use platform devices, retain existing accessory configurations, or migrate manually at your own pace.** Keep your `HttpAdvancedAccessory` entries, encoded command URLs, request bodies, hand-written mappings and other settings. The improvements apply to existing accessories without converting them to a platform or upgrading their web server.

- **Faster HomeKit reads:** shared cached state lets Apple Home read device status promptly while HTTP refreshes run in the background.
- **More resilient HTTP handling:** bounded requests, background recovery and quieter logs accommodate slow or temporarily unavailable servers, including older systems you cannot change.
- **Migration at your pace:** maintain existing accessories through JSON Config, and add platform devices alongside them when useful. The plugin also keeps a requested switch state visible while the server catches up, avoiding a brief reversal caused by stale reads.

**Published release: `2.0.0-alpha.8`. Unpublished development version: `2.0.0-alpha.9`.** Alpha.9 adds optional additional services on one accessory, starting with the Battery use case in [upstream issue #12](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/12), plus declarative `scale` and strict `lookup` mappers. The Alpha.9 source is still under development and cannot yet be selected from npm or Homebridge UI. Alpha.8 added optional accessory information fields from upstream PR #46. Source checks and isolated Homebridge UI acceptance have passed for earlier Alphas; paired Apple Home and live-device soak remain incomplete. [Compatibility details](docs/modernization.md#what-non-breaking-means-here) explain the boundaries.

[User guide](#user-guide) · [Modernization details](#modernization-details) · [Developer reference](docs/modernization.md#development-and-release-policy)

## User guide

### Requirements

| Component | Supported versions |
|---|---|
| Node.js | 22.13 or later in the 22.x line, or 24.x |
| Homebridge | 1.11.4 or later in the 1.x line, or 2.4 or later in the 2.x line |

Older environments need a runtime upgrade before testing this Alpha. Plugin 1.3.0 is the stable compatibility baseline. If you also upgrade Homebridge itself, check the [service compatibility list](docs/service-support.md) for historical services removed by newer HAP versions.

### Install or upgrade

**Replacing `homebridge-http-advanced-accessory`? Save your legacy accessory JSON before using the Homebridge UI.** Make a full Homebridge backup, then separately save the exact `accessories[]` entries from the raw `config.json` editor in a private file. They may contain credentials or private URLs. The UI's **Remove plugin config?** option is enabled by default when uninstalling the old package and can delete those entries; its child-bridge removal option can also remove pairings. This is a separate npm package, not an automatic update to the original accessory package. Follow the [replacement and recovery guide](docs/migration.md) before changing an existing installation.

If the legacy accessories disappear from the new setup, [paste only the missing saved entries back into the current `accessories[]` array](docs/migration.md#if-the-accessories-are-missing). Restoring their JSON does **not** guarantee that Apple Home will recover room assignments, scenes or automations after it has seen the accessories removed; those references may need to be rebuilt. A full Homebridge backup restore also reinstalls the npm plugins recorded in that backup, potentially including the old package.

Check the [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions) and matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases) before installing. Choose a published Alpha; a local candidate archive alone does not establish public availability.

In **Homebridge UI 5.29.0**, open **Plugins** and search for `homebridge-http-advanced-platform`. Choose its install icon, then select the **alpha** row in the version chooser, or the reviewed **v2.0.0-alpha.8** version. After installation, use **Manage Version** to select a later Alpha deliberately. Descriptive searches such as **HTTP Advanced**, **HTTP accessory**, **REST API** or **HTTP JSON** depend on npm indexing and ranking; searching the exact original package name still finds the original accessory package.

For command-line installation, use `homebridge-http-advanced-platform@alpha`, or pin the reviewed version as shown below. Use the same plugin location and account your Homebridge installation already uses; `/var/lib/homebridge` is an example prefix:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts homebridge-http-advanced-platform@2.0.0-alpha.8
```

To install a reviewed archive directly:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts /path/to/homebridge-http-advanced-platform-2.0.0-alpha.8.tgz
```

**This package has no stable release.** npm requires a `latest` tag; for this package, it can point to an Alpha and does not indicate stability. An unqualified install can therefore install an Alpha. The `alpha` and `latest` tags can point to different Alpha versions; choose the explicit `@alpha` tag or reviewed exact version to select the intended release. These tags affect only the new platform package; the original accessory package is separate and does not update automatically to it.

Alpha.7 includes this correction in its packaged README. The earlier published Alpha.6 archive remains unchanged.

Preserve Homebridge storage and bridge identity. Remove the old plugin package as part of the backed-up replacement before starting Homebridge with the new package; loading both would make their shared configuration aliases ambiguous. Check the migration guide before changing any package-qualified identifiers: changing a qualified legacy accessory identifier can change its HomeKit identity. Restart Homebridge and its UI, then verify devices, state updates, controls and existing automations. Installed UI and managed-child-bridge acceptance passed in an isolated Node 24/Homebridge 2 fixture with HAP disabled; paired Apple Home identity and live controls still need acceptance.

### Keep using existing accessories

Existing devices stay in `accessories[]`. Leave unqualified aliases unchanged; see the migration guide before changing an explicitly package-qualified accessory identifier. A basic definition looks like this:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "name": "Example Switch",
  "service": "Switch",
  "urls": {
    "getOn": { "url": "http://device.example/state" },
    "setOn": { "url": "http://device.example/set/{value}" }
  }
}
```

Keep each existing accessory's name, unqualified alias, `uuid_base` when present, service definition and bridge assignment unchanged to give HomeKit the best chance of retaining its identity. Your existing GET/POST methods, bodies, encoded strings, mapper chains, optional characteristics and property settings remain supported. See the [action and HTTP reference](docs/modernization.md#actions-and-http), [mapper reference](docs/modernization.md#mappers) and [legacy examples](docs/legacy-reference.md) for more elaborate configurations.

To customize HomeKit's Accessory Information, optionally add `manufacturer`, `model` and `serialNumber` to an accessory or platform device. Omitted fields keep their previous values. A platform device's `id` still controls its HomeKit identity; `serialNumber` does not replace `id` or change the generated UUID.

### Maintain configuration in the UI or JSON

The plugin settings screen brings three areas together:

| Area | What you maintain |
|---|---|
| **Legacy accessories** | An accessory count and expandable name list, with directions to **JSON Config** for individual editing. |
| **Shared settings** | Timing, request limits and recovery defaults for both accessories and platforms. |
| **Optional platforms** | Separate platform definitions, with an enable checkbox for each. |

To edit, add or delete a legacy accessory, choose **JSON Config** from the plugin menu. Each accessory has its own bounded JSON editor, including custom fields, encoded commands and mappings. **Back to plugin menu** closes Plugin Config after you save any pending changes.

Choose **Save all settings** inside Plugin Config to save shared settings and optional platforms, then restart Homebridge to apply changes. Legacy accessory definitions stay unchanged. A changed save keeps a private configuration backup and preserves unrelated plugins and bridge settings. Avoid editing the same configuration from multiple windows at once.

You can also maintain `config.json` directly through Homebridge's JSON editor. Existing entries remain in `accessories[]`; platform entries use `platforms[]`; shared defaults use the top-level `httpAdvanced` object. Simply opening the UI or starting the plugin does not migrate or rewrite your configuration.

### Add a platform when you choose

Use **Also use as a platform** in the settings screen, or add an `HttpAdvanced` entry to `platforms[]`. You can start with a new device while keeping all existing accessories as they are:

```json
{
  "platform": "HttpAdvanced",
  "name": "HTTP Advanced",
  "enabled": true,
  "devices": [
    {
      "id": "new-platform-light",
      "name": "New Platform Light",
      "service": "Switch",
      "urls": {
        "getOn": { "url": "http://another-device.example/state" },
        "setOn": { "url": "http://another-device.example/set/{value}" }
      }
    }
  ]
}
```

Choose a permanent device `id` before pairing, and keep the platform name stable. The device's display name can then change without changing its platform identity. Disabling a platform keeps its definitions and cached identities but stops device updates.

### Look up exact device states (unpublished Alpha.9)

Use `lookup` when every accepted state has a defined result. Unlike legacy `static`, it returns mapped `false`, `0` and `""` exactly. This switch accepts only `ON` or `OFF` from its getter and sends numeric `1` or `0` for writes:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "name": "Example Relay",
  "service": "Switch",
  "urls": {
    "getOn": {
      "url": "http://device.example/power",
      "mappers": [{ "type": "lookup", "parameters": {
        "mapping": { "ON": true, "OFF": false }
      } }]
    },
    "setOn": {
      "url": "http://device.example/power/{value}",
      "mappers": [{ "type": "lookup", "parameters": {
        "mapping": { "true": 1, "false": 0 }
      } }]
    }
  }
}
```

Keys match exactly, including case and whitespace. An unknown getter response is `inconclusive`, so an optional `inconclusive` action can try another endpoint; an unknown setter value fails before sending. `lookup` supports string, finite number and boolean results. Existing `static` mappings retain their legacy pass-through behavior. See the [mapper reference](docs/modernization.md#mappers).

### Scale a device value (unpublished Alpha.9)

Use `scale` when a device and HomeKit use different numeric ranges. For example, a dimmer that reports and accepts `0` to `255` can map to HomeKit Brightness `0` to `100`:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "name": "Example Dimmer",
  "service": "Lightbulb",
  "optionCharacteristic": ["Brightness"],
  "urls": {
    "getOn": { "url": "http://device.example/power" },
    "setOn": { "url": "http://device.example/power/{value}" },
    "getBrightness": {
      "url": "http://device.example/level",
      "mappers": [{ "type": "scale", "parameters": {
        "inputMin": 0, "inputMax": 255,
        "outputMin": 0, "outputMax": 100,
        "round": 0, "clamp": true
      } }]
    },
    "setBrightness": {
      "url": "http://device.example/level/{value}",
      "mappers": [{ "type": "scale", "parameters": {
        "inputMin": 0, "inputMax": 100,
        "outputMin": 0, "outputMax": 255,
        "round": 0, "clamp": true
      } }]
    }
  }
}
```

The same `urls` work inside a platform device; use its `id`, `name` and `service` instead of the accessory alias. `round` chooses decimal places and `clamp` limits values to the input range; both are optional. Without `clamp`, out-of-range numbers extrapolate. Invalid numeric responses become inconclusive, so a configured `inconclusive` getter action can handle them. Invalid setter values fail before an HTTP request. See the [mapper reference](docs/modernization.md#mappers) for chaining and validation details.

### Add battery information to a device (unpublished Alpha.9)

Add `additionalServices` to a legacy accessory or a platform device. This example is one **platform device** with a Contact Sensor and a Battery service; the endpoint examples return `0` or `1` for contact/low-battery status and `0` through `100` for battery level:

```json
{
  "platform": "HttpAdvanced",
  "name": "HTTP Advanced",
  "devices": [{
    "id": "front-door",
    "name": "Front Door",
    "service": "ContactSensor",
    "urls": {
      "getContactSensorState": { "url": "http://device.example/contact" }
    },
    "additionalServices": [{
      "id": "battery",
      "service": "BatteryService",
      "optionCharacteristic": ["BatteryLevel"],
      "urls": {
        "getStatusLowBattery": { "url": "http://device.example/battery/low" },
        "getBatteryLevel": { "url": "http://device.example/battery/level" }
      }
    }]
  }]
}
```

The Battery service is attached to **Front Door**, not exposed as another accessory. `StatusLowBattery` is the required Battery characteristic; `BatteryLevel` is optional and must be listed in `optionCharacteristic`. Map endpoint output to each characteristic's HomeKit values as needed. Each additional service needs a permanent `id`: Homebridge uses it as that service's subtype, including when two services have the same type. Changing or removing it can change HomeKit service identity and affect automations. The primary device `id`, service type and HomeKit identity remain as before. Additional services have their own `urls`, `optionCharacteristic` and `props`; they inherit device authentication and timing unless overridden. See the [service reference](docs/modernization.md#services-optional-characteristics-and-props).

**Accessories and platforms can coexist for different devices.** Do not define the same physical device in both places. Moving an existing accessory into a platform is an optional, deliberate conversion: it creates a different HomeKit identity and may require reassigning rooms, scenes and automations. There is no automatic identity-preserving migration tool in this Alpha. Follow the [migration guide](docs/migration.md) if you choose to convert devices.

### Tune shared settings

The built-in defaults work with either configuration style; no platform is required. Leave UI fields blank to use them, or add the following top-level object to your existing `config.json`:

```json
{
  "httpAdvanced": {
    "requestTimeout": 10000,
    "uriCallsDelay": 0,
    "setterDelay": 0,
    "writeConfirmationTimeout": 10000,
    "refresh": { "activeInterval": 5, "idleInterval": 60, "idleAfter": 60 },
    "coordinator": { "concurrency": 4, "perOrigin": 2, "maxQueue": 256 },
    "recovery": { "retryInterval": 5, "maxRetryInterval": 30, "quietPeriod": 90, "reminderInterval": 300 }
  }
}
```

Request timeout, request spacing, debounce and write confirmation are **milliseconds**. Refresh and recovery intervals are **seconds**. Existing device/action overrides take precedence over their shared defaults; positive legacy `forceRefreshDelay` still controls the normal polling interval.

| If you need to… | Setting to consider |
|---|---|
| Allow a slow background HTTP response more time | Increase `requestTimeout`; an individual action's `timeout` overrides it. This does not extend HomeKit's own request budget. |
| Space requests to an older server | Increase `uriCallsDelay`, or reduce the shared `coordinator.perOrigin` limit. |
| Allow the server more time to reflect a successful command | Adjust `writeConfirmationTimeout`; the default is 10000 ms after HTTP success. |
| Combine a burst of changes into the last command | Set `setterDelay` to a positive debounce delay. |
| Balance freshness with background traffic | Adjust `refresh.activeInterval` and `refresh.idleInterval`, or retain a device's explicit `forceRefreshDelay`. |

Shared defaults also apply to legacy child bridges. [The technical reference](docs/modernization.md#shared-settings-and-precedence) covers precedence, units and scheduling boundaries.

### What to expect in Apple Home

Device reads return the latest known state promptly. Background HTTP requests refresh it independently, so a fast HomeKit response can still contain an older observation. On startup, a device without saved or newly acquired state reports a communication error until its first usable response.

When you change a value, the plugin keeps the requested value visible during debounce and the HTTP request, then for up to ten seconds by default while waiting for confirmation. A matching getter response ends that window early. If the command fails or the window expires, HomeKit returns to the latest observed state, or an error if none is known. This handles servers that acknowledge a command before reporting its new state. Failed commands are never automatically replayed.

During a temporary outage, the plugin retries background reads with backoff and keeps known state available, unless your configuration explicitly supplies an error fallback. Short interruptions stay quiet in normal logs. Default outage warnings start after 90 seconds, with reminders at most every five minutes. Recovery can continue beyond 30 seconds; the plugin does not require a gateway upgrade or special retry headers.

### Troubleshooting and rollback

| Symptom | Check first |
|---|---|
| Unknown state after startup | Endpoint reachability and getter mapper output. |
| State is older than expected | Refresh interval, cache age, queue depth and outage backoff. |
| A toggle returns to its old state | Whether the write failed, the server applied it, or the confirmation window expired. |
| Busy/error text becomes an unexpected value | The mapper chain and optional `responsePattern`, `requireResponseMatch` or `strictHTTP` settings. See [servers you cannot change](docs/modernization.md#servers-you-cannot-change). |
| Configuration does not load | Service support, action names, mapper syntax and duplicate platform IDs. |
| Legacy accessories are missing after replacing the old package | Inspect the raw `accessories[]` array before editing. If entries were deleted, [restore only the missing saved JSON objects](docs/migration.md#if-the-accessories-are-missing); then check Apple Home rooms, scenes and automations. |

Set `debug: true` on one device to enable a shared diagnostic snapshot every 30 seconds. It includes request timing, queue usage, cache ages and recovery status. Shared messages use **HTTP Advanced** as their log prefix; device-specific messages retain their accessory name. Diagnostics omit URLs, credentials, request bodies and device values, and are not sent externally.

For a report, include plugin, Homebridge and Node versions plus sanitized diagnostics. The [measurement guide](docs/performance.md) explains how to compare responsiveness and freshness together.

To roll back, reinstall the 1.3.0 baseline through the same plugin-management path and restart Homebridge. Legacy-only users retain their definitions and storage. If you introduced platform devices, follow the [rollback instructions](docs/migration.md#rollback) and use the relevant backup. Preserve pairing and identifier storage during an ordinary plugin rollback.

## Modernization details

The [modernization and developer reference](docs/modernization.md) contains the fine print:

- What compatibility preserves, and which runtime behaviors change.
- Shared caching, persistence, polling, request scheduling and outage recovery.
- HTTP actions, older-server response handling, writes, templates, the five legacy mapper types and Alpha.9 `scale`/`lookup`.
- Service support, optional characteristics, configuration editing and platform lifecycle.
- Benchmark interpretation, development commands, test coverage and release policy.

The [Alpha release notes](docs/alpha-release-notes.md) distinguish the unpublished Alpha.9 work from the published Alpha.8 and list remaining release gates. The project retains its existing [Apache-2.0 license](LICENSE) and historical authorship.
