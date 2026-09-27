# Alpha.6 installed lifecycle acceptance

Recorded: 2026-09-26. Milestone 3b complete for the isolated fixture. Public launch
and live Apple Home acceptance remain separate milestones.

The reviewed candidate remains `homebridge-http-advanced-platform@2.0.0-alpha.6`
from `fe5adb0`. Its archive SHA-256 remains
`899161d4e5a8a83e3941b06636b9bd75c34e98dbad1dbcdd00c261650e32bc22`.
This milestone changes only maintenance evidence, outside the package allowlist.

## Fixture and scope

- macOS arm64, Node 24.21.0, Homebridge 2.4.0, Homebridge UI 5.29.0.
- Temporary installation and storage under
  `/private/tmp/http-advanced-platform-acceptance-20260926/`.
- UI bound to `127.0.0.1:57451`; synthetic HTTP devices on
  `127.0.0.1:57450`. Separate legacy and platform Switch devices.
- Synthetic main bridge and two managed child bridges; `bind: ["lo0"]`, with
  HAP disabled on each bridge. No production configuration or pairing storage.
- Explicit plugin allowlist and qualified platform/accessory definitions tested.
- Homebridge UI and Homebridge were added as temporary host dependencies after
  milestone 3a. That milestone's eight-package clean-install audit does not apply
  to the larger UI host dependency tree.

The UI initially failed because its native terminal dependency had been installed
with scripts disabled. Rebuilding that dependency in the temporary prefix fixed
the host; no candidate dependency or system installation changed.

Before fixture isolation was complete, Homebridge UI's default LAN discovery
probed an existing bridge and was refused. No device control occurred. Subsequent
runs disabled insecure accessory control through the fixture's
`.uix-hb-service-homebridge-startup.json` (`insecureMode: false`), preventing its
HAP client from starting. Preserve that startup setting when repeating this work;
the UI onboarding flow can normalize its own platform configuration.

## Rendered UI and managed runtime

1. The installed plugin card displayed **Homebridge HTTP Advanced Platform**,
   `homebridge-http-advanced-platform`, and `2.0.0-alpha.6`.
2. Actual Plugin Config rendered the new title, one existing legacy accessory,
   shared settings and one enabled optional platform. Saving request timeout
   `31000` reached the installed custom UI server and persisted to `httpAdvanced`.
   Its success status appeared; the value reopened correctly after replacement
   and rollback. A later unchanged save also succeeded.
3. The plugin menu's native **JSON Config** opened the individual legacy
   accessory editor. A synthetic `manufacturer` field saved successfully.
   Comparison with the pre-edit configuration found only that added field and
   Homebridge UI's normalization of the qualified accessory registration to
   `HttpAdvancedAccessory`. Platform definitions, shared settings, bridge fields,
   names, device IDs and unrelated configuration were preserved.
4. The native save's **Restart Required** action restarted both actual child
   processes. The platform loaded its existing serialized accessory cache and
   retained its UUID; both adapters reported restored getter state.
5. Disabling through Plugin Actions wrote
   `disabledPlugins: ["homebridge-http-advanced-platform"]`. After a full fixture
   restart, Homebridge logged the plugin as disabled and skipped both adapter
   configurations. Re-enabling and restarting restored both children and returned
   configuration to the post-edit state. This was a disposable, unpaired fixture;
   it is not an instruction to disable a paired production plugin for replacement.

Homebridge UI's accessory schema can warn about a package-qualified alias before
normalizing it on save. The resulting unqualified alias remains valid. No schema
or runtime changes were needed for these checks.

## Package replacement and backed-up rollback

The old package was rebuilt in temporary storage from preserved tag
`v2.0.0-alpha.5` at `e85f4324bb06dd12d5ce808f11480b886b855d14`.
Its rehearsal archive SHA-256 was
`94926bae6088a1c7ebe930ee081a6af7e031adb7071f0a17905091a819b827e9`.
This is a source-based rehearsal archive, not a claim that it is byte-identical
to the preserved production deployment archive. Existing recovery artifacts were
not modified.

Before package replacement, the fixture's configuration, accessory caches,
persist storage and startup options were copied to separate backups. The old
package was removed before installing the new one, with assertions that both
packages were never installed together. Only package prefixes and plugin lists
changed; bridge identities, names, device IDs, service definitions and storage
location stayed fixed. Rollback restored the backed-up Alpha.5 configuration
and storage, rather than constructing a substitute configuration.

| Stage | Installed package | Managed children | Platform cache identity |
| --- | --- | --- | --- |
| Preserved baseline | accessory Alpha.5 | Both started | Preserved |
| Forward replacement | platform Alpha.6 | Both started | Preserved; plugin association updated |
| Full process restart | platform Alpha.6 | Both started again | Preserved |
| Restored backup rollback | accessory Alpha.5 | Both started | Preserved; old association restored |
| Final candidate restoration | platform Alpha.6 | Both started | Preserved; new association restored |

Every stage retained one cached platform accessory with UUID
`e8d6f025-6706-4e40-ac87-b154d91f7f6b`. Its serialized service and characteristic
UUIDs, child bridge usernames and device definitions also matched. Both package
names successfully loaded their qualified registrations and explicit allowlists.
Final configuration matched the post-UI-edit Alpha.6 backup exactly.

The fixture was returned to Alpha.6, then its supervisor, child processes,
synthetic backend and browser tab were stopped. No package was published, no
repository was renamed or pushed, and production was not deployed or restarted.

## Evidence and repeating the checks

- [lifecycle-results.json](lifecycle-results.json) preserves synthetic stage
  results, process IDs and versions. Process IDs are historical observations.
- [lifecycle-rehearsal.mjs](lifecycle-rehearsal.mjs) preserves the orchestration
  used for the package swaps and assertions. Its retained version adds archive
  path overrides, assertions for the synthetic fixture/host and a guard against
  swapping while the fixture UI listener is running. Syntax validation passed.
  The running-UI and existing-backup guards both refused before package mutation;
  the stopped fixture passed the additional identity/host assertions.
- Raw stage logs, npm logs and backups remain under temporary
  `lifecycle/rehearsal/`; they may expire. No authentication file is included in
  the lifecycle backups or committed evidence.
- Browser evidence remains in
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-20260926/`:
  `installed-ui-acceptance.png`, `native-editor-save.png`, and
  `restored-ui-acceptance.png`.

To repeat, prepare a fresh temporary prefix with the reviewed candidate and the
specified Homebridge/UI host versions. Recreate the synthetic configuration and
loopback endpoints above, including two children, the enabled platform, shared
timeout `31000`, manufacturer `Packaging Fixture`, and disabled insecure mode.
Seed its platform cache with a normal fixture startup, then stop the supervisor.
Provide the preserved Alpha.5 rehearsal archive under `rollback/` and run the
harness with `HTTP_ADVANCED_ACCEPTANCE_BASE` pointing to the new temporary base.
`HTTP_ADVANCED_CANDIDATE_ARCHIVE` and `HTTP_ADVANCED_BASELINE_ARCHIVE` can override
archive paths. Existing rehearsal backup directories intentionally prevent a
silent rerun over the evidence. Never point this harness at production storage.

## Acceptance limits and next milestone

Managed process/browser acceptance here covers Node 24 and Homebridge 2. The
Node 22/24 and Homebridge 1/2 installed/source matrix is separately recorded in
[INSTALLATION-ACCEPTANCE.md](INSTALLATION-ACCEPTANCE.md).

HAP was disabled, so this fixture did not establish paired Apple Home behavior,
published AID/IID persistence, scenes, room assignment or physical control. The
existing real Homebridge/HAP source regressions cover identifier preservation;
production pairing and live soak remain milestone 5. Replacement does not prove
that manual accessory-to-platform conversion retains identity; those namespaces
still differ intentionally.

Milestone 4 begins with launch review. Refresh public acceptance wording in the
frozen README/docs and repack if those distributable files change. Recheck npm
name availability, repository state, Alpha-only installation/discovery behavior,
and the proposed public metadata before publication. Registry indexing, search
and first-publication tag behavior have not been tested by installing a local
archive. Homebridge verification and parent issue/PR fixes remain later work.
