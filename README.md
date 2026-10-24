# Homebridge HTTP Advanced Platform

Connect HTTP/HTTPS-controlled devices and REST APIs to Apple Home (HomeKit) through Homebridge. Read sensor values, control switches and other supported HomeKit services, and map JSON or XML responses with JSONPath or XPath. Shared polling and caching keep reads responsive while HTTP refreshes run in the background.

This is a platform conversion of [staromeste's homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory). The project retains the original Apache-2.0 license, Git history and contributor credit, including the earlier [tasict/homebridge-http-accessory](https://github.com/tasict/homebridge-http-accessory) lineage.

**Use platform devices, retain existing accessory configurations, or migrate manually at your own pace.** Keep your `HttpAdvancedAccessory` entries, encoded command URLs, request bodies, hand-written mappings and other settings. The improvements apply to existing accessories without converting them to a platform or upgrading their web server.

**Stable release: `2.1.0`.** The improvements listed below are included unless marked as a 2.2.0 Beta feature. This package is not Homebridge-verified. See the [stable GitHub release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.1.0) for validation and field coverage, and the [compatibility details](docs/modernization.md#what-non-breaking-means-here) before upgrading.

**Beta testing release: `2.2.0-beta.1`.** Individual command handling is ready for beta field testing toward `2.2.0`. Representative physical-device acceptance remains pending. Stable `latest` stays at `2.1.0`; confirm the matching public npm version and GitHub prerelease before installing the Beta.

[What's new](#what-this-platform-adds) · [Individual commands](#every-button-press-counts-220-candidate) · [User guide](#user-guide) · [Configuration examples](docs/configuration-examples.md) · [Developer reference](docs/modernization.md)

## What this platform adds

This project builds on the original plugin's HTTP actions, JSON/XML mappings, polling and templates. Compared with the original `1.3.0` accessory plugin, these additions give new and existing users more responsive controls, easier configuration and broader device integration.

### Available in stable 2.1.0

| Addition | Practical value |
|---|---|
| [Optional platform management](#add-a-platform-when-you-choose) | Manage devices together with stable IDs, cached accessory restoration and an enable/disable control, while continuing to use existing accessory definitions. |
| [Individual configuration editors](#maintain-configuration-in-the-ui-or-json) | Add, edit and remove devices independently, with named platform controls and shared settings. Changed saves retain a backup, detect conflicting edits and preserve unedited custom fields and bridge assignments. |
| [Fast cached reads and restored state](docs/modernization.md#how-reads-and-freshness-work) | HomeKit reads known status without waiting for each HTTP request. Background refresh keeps observations current, and saved observations can restore known state after a restart. |
| [Coordinated HTTP traffic](docs/modernization.md#shared-settings-and-precedence) | Shared timing, concurrency limits, request spacing and timeouts help protect devices from bursts of requests while keeping other devices moving. |
| [Quieter outage recovery](docs/modernization.md#how-reads-and-freshness-work) | Unavailable endpoints back off and recover in the background, with fewer repeated warnings and continued access to known state where available. |
| [Smoother control feedback](docs/modernization.md#sets-and-templates) | A short confirmation window keeps a requested setting visible while the device catches up, reducing controls that briefly flip back after a successful write. |
| [Multiple services on one accessory](#add-battery-information-to-a-device) | Attach battery information or other supported services to the device they belong to, instead of exposing each service as a separate accessory. |
| [Declarative numeric scaling](#scale-a-device-value) | Convert device ranges such as brightness 0–255 into HomeKit's 0–100 range, with optional rounding and clamping, without writing JavaScript. |
| [Exact value lookup](#look-up-exact-device-states) | Map device responses to exact values, including `false`, `0` and empty strings, and reject unknown inputs when the accepted vocabulary is fixed. |
| [Custom accessory information](#keep-using-existing-accessories) | Set manufacturer, model and serial-number information without changing a platform device's identity. |
| [Request headers and response checks](docs/modernization.md#actions-and-http) | Configure API-key or Bearer headers and opt into stricter HTTP, response-pattern and extraction checks so unexpected replies are less likely to become apparent device state. |
| [Safer HTTP redirects](docs/modernization.md#actions-and-http) | Redirects to another origin discard configured headers and device credentials, including custom API-key headers. Configure a trusted final endpoint directly when it needs those credentials. |
| [Current Homebridge support](#requirements) | Support Node 22/24 and Homebridge 1/2 through a maintained runtime and compatibility matrix, including canonical characteristic names and historical aliases. |
| [Useful diagnostics](#troubleshooting-and-rollback) | Inspect request timing, queue use, cache ages and recovery status without exposing URLs, credentials, request bodies or device values in the diagnostic snapshot. |

**Addresses requests from the original project.** Several additions address longstanding open requests and issues in the parent repository, including [multiple services and battery information (#12)](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/12), [brightness conversion (#2)](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/2), [header authentication (#26)](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/26), [custom accessory information (PR #46)](https://github.com/staromeste/homebridge-http-advanced-accessory/pull/46) and [Homebridge 2 readiness (#58)](https://github.com/staromeste/homebridge-http-advanced-accessory/issues/58).

### Every button press counts: 2.2.0 candidate

Individual command handling makes each button press count: three Volume Up presses are kept as three separate commands in order. Controls such as brightness sliders can still combine rapid adjustments into the final setting. Expired or failed commands are reported and are not automatically replayed, and an HTTP acknowledgement is kept separate from confirmed device state. Existing configurations keep their current behavior unless you enable the new option.

The `2.2.0-beta.1` Beta adds per-setter `writeMode: "command"` to both legacy accessories and platform devices, including additional services. See the [Beta notes and configuration example](docs/release-notes-2.2.0-beta.1.md) for ordering, deadlines, failure handling and field acceptance. Choose **beta** or **v2.2.0-beta.1** in Homebridge Manage Version after confirming public availability.

## User guide

### Requirements

| Component | Supported versions |
|---|---|
| Node.js | 22.13 or later in the 22.x line, or 24.x |
| Homebridge | 1.11.4 or later in the 1.x line, or 2.4 or later in the 2.x line |

Older environments need a runtime upgrade before installing this release. The original accessory plugin 1.3.0 remains the historical compatibility baseline. If you also upgrade Homebridge itself, check the [service compatibility list](docs/service-support.md) for historical services removed by newer HAP versions.

### Install or upgrade

**Replacing `homebridge-http-advanced-accessory`? Save your legacy accessory JSON before using the Homebridge UI.** Make a full Homebridge backup, then separately save the exact `accessories[]` entries from the raw `config.json` editor in a private file. They may contain credentials or private URLs. The UI's **Remove plugin config?** option is enabled by default when uninstalling the old package and can delete those entries; its child-bridge removal option can also remove pairings. This is a separate npm package, not an automatic update to the original accessory package. Follow the [replacement and recovery guide](docs/migration.md) before changing an existing installation.

If the legacy accessories disappear from the new setup, [paste only the missing saved entries back into the current `accessories[]` array](docs/migration.md#if-the-accessories-are-missing). Restoring their JSON does **not** guarantee that Apple Home will recover room assignments, scenes or automations after it has seen the accessories removed; those references may need to be rebuilt. A full Homebridge backup restore also reinstalls the npm plugins recorded in that backup, potentially including the old package.

Check the [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions) and matching [GitHub release](https://github.com/shanemcw/homebridge-http-advanced-platform/releases) before installing. Choose the stable release; a local candidate archive alone does not establish public availability.

In **Homebridge UI 5.29.0**, open **Plugins** and search for `homebridge-http-advanced-platform`. Choose its install icon, then select **latest** or **v2.1.0** in the version chooser. Existing Alpha and Beta testers can use **Manage Version** to select **v2.1.0**. Descriptive searches such as **HTTP Advanced**, **HTTP accessory**, **REST API** or **HTTP JSON** depend on npm indexing and ranking; searching the exact original package name still finds the original accessory package.

For command-line installation, use `homebridge-http-advanced-platform@latest`, or pin the reviewed version as shown below. Use the same plugin location and account your Homebridge installation already uses; `/var/lib/homebridge` is an example prefix:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts homebridge-http-advanced-platform@2.1.0
```

To install a reviewed archive directly:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts /path/to/homebridge-http-advanced-platform-2.1.0.tgz
```

**Release channels: `latest` for stable `2.1.0`, and `beta` for `2.2.0-beta.1`.** Stable `2.0.0` remains available by exact version. The earlier 2.0.0 Alpha and 2.1.0 Beta versions were retired from npm on October 24, 2026; the new Beta uses the `beta` tag. These changes apply only to the platform package; the original accessory package is separate. Users with an older prerelease installed can select **latest** or **v2.1.0** in **Manage Version** to move to stable.

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

Keep each existing accessory's name, unqualified alias, `uuid_base` when present, service definition and bridge assignment unchanged to give HomeKit the best chance of retaining its identity. Your existing GET/POST methods, bodies, encoded strings, mapper chains, optional characteristics and property settings remain supported. See the [configuration examples](docs/configuration-examples.md) for progressive generic setups and the [action and HTTP reference](docs/modernization.md#actions-and-http) and [mapper reference](docs/modernization.md#mappers) for exact behavior.

To customize HomeKit's Accessory Information, optionally add `manufacturer`, `model` and `serialNumber` to an accessory or platform device. Omitted fields keep their previous values. A platform device's `id` still controls its HomeKit identity; `serialNumber` does not replace `id` or change the generated UUID.

### Maintain configuration in the UI or JSON

The plugin settings screen brings three areas together:

| Area | What you maintain |
|---|---|
| **Legacy Accessories** | An accessory count and individual expandable JSON editors, with add and remove controls. |
| **Shared Settings** | Timing, request limits and recovery defaults for both accessories and platforms. |
| **Optional Platforms** | Individual expandable device JSON editors with add/remove controls, separate platform settings, and an enable checkbox for each platform. |

To edit, add or remove a legacy accessory or platform device, use **Plugin Config**. Under a platform, expand **Edit Configured Devices**, then the device's name. Each device has its own JSON editor for custom fields, encoded commands and mappings. **Edit Platform Settings** maintains the platform's name, alias, child bridge and other platform fields separately. Keep an existing device's `id` and platform name unchanged to retain its HomeKit identity; if `id` is omitted, its name supplies the identity. Newly added devices receive a fresh ID that you can choose before pairing. **JSON Config** in the plugin menu edits complete platform definitions. **Back to Plugin Menu** closes Plugin Config after you save any pending changes.

Individual platform device editors are included in `2.1.0`.

Choose **Save All Settings** inside Plugin Config to save legacy accessories, shared settings and optional platforms, then restart Homebridge to apply changes. Existing accessory definitions stay unchanged unless you edit or remove them. A changed save keeps a private configuration backup and preserves unrelated plugins and bridge settings. Avoid editing the same configuration from multiple windows at once.

You can also maintain `config.json` directly through Homebridge's JSON editor. Existing entries remain in `accessories[]`; platform entries use `platforms[]`; shared defaults use the top-level `httpAdvanced` object. Simply opening the UI or starting the plugin does not migrate or rewrite your configuration.

### Add a platform when you choose

Use **Add Platform** in the settings screen, or add an `HttpAdvanced` entry to `platforms[]`. Every HTTP Advanced instance uses the same `platform` identifier. Give each instance a unique `name`; it appears in the heading, **Enable platform** checkbox and **Add Device to “…”** button. Apple Home shows the individual devices rather than a separate accessory for the platform. You can start with a new device while keeping all existing accessories as they are:

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

Choose a permanent device `id` before pairing, and keep the platform name stable. The device's display name can then change without changing its platform identity. Disabling a platform keeps its definitions and cached identities but stops device updates. The [configuration examples](docs/configuration-examples.md#use-the-same-device-as-a-platform-entry) show how the same device fields translate between accessory and platform forms.

### Look up exact device states

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

### Scale a device value

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

### Add battery information to a device

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

**Accessories and platforms can coexist for different devices.** Do not define the same physical device in both places. Moving an existing accessory into a platform is an optional, deliberate conversion: it creates a different HomeKit identity and may require reassigning rooms, scenes and automations. There is no automatic identity-preserving migration tool in this release. Follow the [migration guide](docs/migration.md) if you choose to convert devices.

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
- HTTP actions, older-server response handling, writes, templates, the five legacy mapper types and `scale`/`lookup`.
- Service support, optional characteristics, configuration editing and platform lifecycle.
- Benchmark interpretation, development commands, test coverage and release policy.

The [release notes](docs/release-notes.md) and [changelog](CHANGELOG.md) summarize 2.1.0 and its validation boundaries. The project retains its existing [Apache-2.0 license](LICENSE) and historical authorship.
