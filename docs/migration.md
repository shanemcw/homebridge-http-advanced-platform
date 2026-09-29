# Upgrade and migration

The installation steps below refer to the published **2.0.0-alpha.8**. Alpha.9 additional-service support is still local, unpublished source work and has no npm or Homebridge UI installation path yet.

## Replace the accessory package with the platform package

This is a separate package with the existing Alpha behavior. It does not automatically convert accessory definitions into platform devices. Back up configuration, cached accessories, pairing data, identifier storage and the exact old plugin version/package before replacement. Separately copy every legacy `HttpAdvancedAccessory` object from the top-level `accessories[]` array in the raw `config.json` editor to a private file, preserving every field. These entries can contain credentials, command bodies and private URLs; keep the copy secure and do not include it in an issue report.

**A normal Homebridge UI install followed by uninstalling the old plugin is not an identity-safe shortcut.** Both installed packages currently register the same aliases. The UI's **Remove plugin config?** option starts enabled when uninstalling a configured plugin; accepting it removes that plugin's configuration before uninstalling the package. The child-bridge removal option also starts enabled when applicable. For this replacement, turn off both options when shown so the definitions and pairings remain, and inspect the current `config.json` before any restart. Even with the entries retained, do not restart Homebridge while both packages are enabled. See the [Homebridge UI uninstall behavior](https://github.com/homebridge/homebridge-config-ui-x/blob/latest/ui/src/app/core/plugins/uninstall-plugin/uninstall-plugin.component.ts).

1. Keep the Homebridge storage, bridge username, accessory names, service definitions, platform names, device IDs and `_bridge` settings unchanged.
2. Stop Homebridge before the package swap, and remove only the installed `homebridge-http-advanced-accessory` package through the installation's existing package-management workflow. Preserve configuration and Homebridge storage. Do not load both packages: both register `HttpAdvancedAccessory` and `HttpAdvanced`.
3. Leave unqualified `accessory: "HttpAdvancedAccessory"` and `platform: "HttpAdvanced"` values unchanged. Review any `plugins` allowlist so the new package can load, and make sure it is not in `disabledPlugins` if it is meant to serve the existing devices. Package-qualified `accessory` entries need special care: replacing `homebridge-http-advanced-accessory.HttpAdvancedAccessory` with `homebridge-http-advanced-platform.HttpAdvancedAccessory` changes the identifier Homebridge uses to generate that legacy accessory's UUID. It may appear as a new accessory in Apple Home, even when the name is unchanged. Do not treat a prefix edit as identity preserving. Package-qualified platform entries also need the new package prefix to load; verify their cached identities separately. Runtime does not rewrite these settings.
4. Install the reviewed platform Alpha package through the installation's existing package-management workflow, explicitly selecting `@alpha`, `@2.0.0-alpha.8` or the reviewed local archive. See the [installation instructions](../README.md#install-or-upgrade), then restart Homebridge and its UI.
5. Verify native JSON Config, Plugin Config, legacy devices, cached platform devices, child bridges, rooms, scenes and automations before leaving the candidate unattended. If any legacy definitions are missing, follow [the JSON recovery steps](#if-the-accessories-are-missing).

Platform UUIDs retain the immutable Alpha.5 namespace `homebridge-http-advanced-accessory`, independent of the new registration name. Homebridge 1/2 can reassociate cached platform accessories through the unchanged `HttpAdvanced` alias when the old package is absent. Regression tests exercise that fallback with serialized cache and identifier assignments. Isolated installed-UI, managed-child-bridge and package replacement/rollback checks also passed with HAP disabled. Paired Apple Home identity, rooms, scenes, automations and actual device controls remain live acceptance checks. If Apple Home observed accessories missing or recreated during the swap, their room assignments, scenes and automations may need to be rebuilt; pasting configuration back does not guarantee those HomeKit references return.

To roll back a package replacement, remove the new package, reinstall the exact backed-up old version/archive, restore package-qualified settings and plugin lists, and retain the same storage and bridge identity. Restore the appropriate full backup if cached identities or pairing were changed. Do not install both packages as a rollback shortcut.

## If the accessories are missing

1. In Homebridge UI, open the full **Configuration** JSON editor and inspect the current top-level `accessories[]` array. The new plugin's settings screen can show zero legacy accessories when the JSON definitions are absent; do not infer deletion from an empty settings screen alone. If the entries are still in `config.json`, do not paste duplicates. Check the plugin list and Homebridge log for alias conflicts or a disabled plugin instead.
2. If the entries were deleted, use the separate copy you saved before uninstalling the old package. If you only have a full Homebridge backup archive, retrieve its `storage/config.json` locally and copy the legacy entries from there. A full **Backup & Restore** operation is not a config-only paste: Homebridge UI also reinstalls the npm plugins listed in that backup, which may reinstall the old package alongside the new one. See the [Homebridge UI backup implementation](https://github.com/homebridge/homebridge-config-ui-x/blob/latest/src/modules/backup/backup.service.ts).
3. Paste **only the missing original `HttpAdvancedAccessory` objects** into the current top-level `accessories[]` array; create that array if it is absent. Keep each unqualified `accessory` identifier, `name`, `uuid_base` if present, `_bridge` if present, service definition, URLs, mappings and other fields exactly as saved. If an entry was package-qualified to the old package, review the UUID warning in replacement step 3 before changing its prefix; leaving the old prefix will not load with only the new package installed. Preserve unrelated current accessories, platforms, bridge settings and storage. Do not move these objects into a platform's `devices[]` array or create duplicate entries.
4. Save the current configuration, confirm that only the new package is enabled, then restart Homebridge. Check the Homebridge log and accessory list against your saved definitions. Check Apple Home rooms, scenes and automations individually. If Apple Home already removed the accessories, restoring JSON may add them back without restoring those references; rebuild anything missing.

The safest time to recover missing JSON is **before** Homebridge restarts and publishes a bridge without those accessories. Once Apple Home has seen a removal, a Homebridge backup cannot guarantee restoration of Apple Home's own room, scene or automation references. Back up or record critical automations before starting the replacement.

## Legacy configuration compatibility

1. Back up Homebridge configuration, cached accessories, pairing data and identifier cache using Homebridge's backup facility.
2. Verify the Node/Homebridge requirements in the README.
3. Install the explicit Alpha version or reviewed local package in your Homebridge environment and restart.
4. Keep accessory names, `accessory: "HttpAdvancedAccessory"`, service definitions and storage unchanged.
5. Verify state freshness, control writes and existing automations before leaving Alpha unattended.

Runtime reads existing configuration without rewriting it. Plugin Config summarizes legacy accessories and maintains optional platforms and shared defaults; the plugin menu's **JSON Config** provides individual legacy accessory editors with add and delete controls. In Plugin Config, only an explicit **Save all settings** changes configuration, preserving the legacy definitions. The legacy registration and service identity remain unchanged. HAP identifier-cache regression tests cover replacing plugin instances without changing AIDs/IIDs. Live Apple Home pairing and automation verification remain a live-soak gate.

The platform-only settings screen in the first Alpha hid legacy configuration. Hidden entries are not evidence of deleted configuration: inspect `accessories[]` in the current `config.json` before attempting any restoration. Recover missing definitions from a known backup, not from cached HAP values. Follow [the targeted JSON recovery steps](#if-the-accessories-are-missing) rather than rolling unrelated plugins back to an old complete configuration.

## Optional platform migration

Platform mode is for new devices or an explicitly planned conversion. It is not required to obtain the cache/performance improvements.

Use **Also use as a platform** in the plugin settings screen to create a platform while leaving legacy entries in place. Its enable checkbox controls `enabled`; after restart, disabling it retains definitions and cached identities while reporting device reads and commands unavailable. Re-enable with the same name and device IDs, then restart to restore operation. Shared timings can be maintained in the same screen and apply to legacy-only configurations too. The full JSON editor uses top-level `httpAdvanced` for these defaults.

The legacy UUID seed is controlled by Homebridge (`<accessory identifier>:<uuid_base or name>`). For an unqualified legacy entry, that identifier is `HttpAdvancedAccessory`; for a package-qualified entry, it includes the package prefix. Platform UUIDs use the retained Alpha.5 namespace, platform name and device ID. These namespaces differ intentionally. Merely moving a JSON block or changing an accessory's package-qualified prefix is therefore not a seamless identity-preserving migration.

Do not copy the same device into both arrays. A future migration tool must prove identity preservation, back up state and handle partial failure before it is offered. No such tool is included in this Alpha. For a manual conversion, expect new HomeKit identities and plan room, scene and automation reassignment. Keep a full backup and test rollback first.

Within platform mode, a fixed device `id` preserves its UUID across display-name changes. Changing the platform name or device ID changes identity. Removing an entry from a valid platform inventory unregisters that accessory.

## Rollback

For rollback to the historical stable `homebridge-http-advanced-accessory@1.3.0`, remove the new platform package first, reinstall the original package and restore any package-qualified settings and plugin lists before restarting Homebridge. Legacy-only users keep their configuration and storage. If you introduced platform entries, restore the backed-up legacy configuration and appropriate Homebridge backup rather than attempting to run platform definitions with 1.3.0. The optional Alpha state file can remain; stable does not read it.
