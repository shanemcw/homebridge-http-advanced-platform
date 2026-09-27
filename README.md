# Homebridge HTTP Advanced Platform

A platform conversion of [staromeste's homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory), connecting HTTP-controlled devices and web services to Apple Home through Homebridge. The project retains the original Apache-2.0 license, Git history and contributor credit, including the earlier [tasict/homebridge-http-accessory](https://github.com/tasict/homebridge-http-accessory) lineage.

**Use platform devices, retain existing accessory configurations, or migrate manually at your own pace.** Keep your `HttpAdvancedAccessory` entries, encoded command URLs, request bodies, hand-written mappings and other settings. The improvements apply to existing accessories without converting them to a platform or upgrading their web server.

- **Faster HomeKit reads:** shared cached state lets Apple Home read device status promptly while HTTP refreshes run in the background.
- **More resilient HTTP handling:** bounded requests, background recovery and quieter logs accommodate slow or temporarily unavailable servers, including older systems you cannot change.
- **Migration at your pace:** maintain existing accessories through JSON Config, and add platform devices alongside them when useful. The plugin also keeps a requested switch state visible while the server catches up, avoiding a brief reversal caused by stale reads.

**Release channel: `2.0.0-alpha.6` is an opt-in Alpha based on preserved Alpha.5.** It changes public package identity and branding while retaining Alpha.5 device behavior. Source checks, isolated installations and Homebridge UI replacement/rollback acceptance have passed; paired Apple Home and live-device soak remain pending. Compatibility applies on the supported runtimes below. Refresh timing changes, and voluntarily converting a device to the platform creates a new HomeKit identity. [Compatibility details](docs/modernization.md#what-non-breaking-means-here) explain those boundaries.

[User guide](#user-guide) · [Modernization details](#modernization-details) · [Developer reference](docs/modernization.md#development-and-release-policy)

## User guide

### Requirements

| Component | Supported versions |
|---|---|
| Node.js | 22.13 or later in the 22.x line, or 24.x |
| Homebridge | 1.11.4 or later in the 1.x line, or 2.4 or later in the 2.x line |

Older environments need a runtime upgrade before testing this Alpha. Plugin 1.3.0 is the stable compatibility baseline. If you also upgrade Homebridge itself, check the [service compatibility list](docs/service-support.md) for historical services removed by newer HAP versions.

### Install or upgrade

Back up Homebridge first, including configuration, cached accessories and pairing data. This is a separate npm package, not an automatic update to the original accessory package. Follow the [replacement and rollback guide](docs/migration.md) before changing an existing installation.

Check the [npm version list](https://www.npmjs.com/package/homebridge-http-advanced-platform?activeTab=versions) and matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases) before installing. The registry instructions below apply once the Alpha is published; a local candidate archive alone does not establish public availability.

In **Homebridge UI 5.29.0**, open **Plugins** and search for `homebridge-http-advanced-platform`. Choose its install icon, then select **alpha / v2.0.0-alpha.6** in the version chooser. After installation, use **Manage Version** to select a later Alpha deliberately. Descriptive searches such as **HTTP Advanced** or **HTTP accessory** depend on npm indexing; searching the exact original package name still finds the original accessory package.

For command-line installation, use `homebridge-http-advanced-platform@alpha`, or pin the reviewed version as shown below. Use the same plugin location and account your Homebridge installation already uses; `/var/lib/homebridge` is an example prefix:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts homebridge-http-advanced-platform@2.0.0-alpha.6
```

To install a reviewed archive directly:

```sh
npm install --prefix /var/lib/homebridge --omit=dev --ignore-scripts /path/to/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz
```

**This package has no stable release.** npm requires a `latest` tag and assigned it to this first Alpha alongside `alpha`; both currently resolve to `2.0.0-alpha.6`. An unqualified install therefore also installs the Alpha. Choose the explicit Alpha tag or reviewed exact version to make that decision clear. These tags affect only the new platform package; the original accessory package is separate and does not update automatically to it.

The immutable Alpha.6 archive and its npm-page README contain the earlier assumption that `latest` could be absent. This section and the [GitHub prerelease notes](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.6) correct that statement. Updating the npm-page README requires a subsequent package version; this does not change the published Alpha.6 runtime.

Preserve Homebridge storage and bridge identity. Remove the old plugin package as part of the backed-up replacement before starting Homebridge with the new package; loading both would make their shared configuration aliases ambiguous. See the migration guide for package-qualified entries and plugin allowlists. Restart Homebridge and its UI, then verify devices, state updates, controls and existing automations. Installed UI and managed-child-bridge acceptance passed in an isolated Node 24/Homebridge 2 fixture with HAP disabled; paired Apple Home identity and live controls still need acceptance.

### Keep using existing accessories

Existing devices stay in `accessories[]`. Unqualified aliases remain unchanged; update any explicit old package prefixes as described in the migration guide. A basic definition looks like this:

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

Keep each existing accessory's name, alias and service definition unchanged when upgrading to preserve its identity. Your existing GET/POST methods, bodies, encoded strings, mapper chains, optional characteristics and property settings remain supported. See the [action and HTTP reference](docs/modernization.md#actions-and-http), [mapper reference](docs/modernization.md#mappers) and [legacy examples](docs/legacy-reference.md) for more elaborate configurations.

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

Set `debug: true` on one device to enable a shared diagnostic snapshot every 30 seconds. It includes request timing, queue usage, cache ages and recovery status. Shared messages use **HTTP Advanced** as their log prefix; device-specific messages retain their accessory name. Diagnostics omit URLs, credentials, request bodies and device values, and are not sent externally.

For a report, include plugin, Homebridge and Node versions plus sanitized diagnostics. The [measurement guide](docs/performance.md) explains how to compare responsiveness and freshness together.

To roll back, reinstall the 1.3.0 baseline through the same plugin-management path and restart Homebridge. Legacy-only users retain their definitions and storage. If you introduced platform devices, follow the [rollback instructions](docs/migration.md#rollback) and use the relevant backup. Preserve pairing and identifier storage during an ordinary plugin rollback.

## Modernization details

The [modernization and developer reference](docs/modernization.md) contains the fine print:

- What compatibility preserves, and which runtime behaviors change.
- Shared caching, persistence, polling, request scheduling and outage recovery.
- HTTP actions, older-server response handling, writes, templates and all five mapper types.
- Service support, optional characteristics, configuration editing and platform lifecycle.
- Benchmark interpretation, development commands, test coverage and release policy.

The [Alpha release notes](docs/alpha-release-notes.md) summarize this candidate and its remaining release gates. The project retains its existing [Apache-2.0 license](LICENSE) and historical authorship.
