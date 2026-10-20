# Independent platform device editors - October 18, 2026

The later [named-control follow-up](PLATFORM-LABELS-UI-20261018.md) updates the
labels and has its own rollback. This record describes the initial UI patch.

## Result and scope

Plugin Config now gives each platform device an expandable JSON editor and
remove control, matching the legacy accessory workflow. Each platform has its
own **Add Platform Device** button and a separate **Edit Platform Settings**
editor. Device counts and summaries follow draft edits. New devices receive
fresh random IDs; existing definitions keep their exact IDs, aliases, encoded
requests, custom fields and bridge assignments unless explicitly edited.

The platform settings editor excludes `devices` and refuses a competing array.
The existing server validates the combined draft, rejects duplicate IDs and stale
saves, preserves unrelated configuration, and backs up changed configurations.
No runtime code or dependency was changed for this feature.

## Validation

- Node 24.19.0: 119/119 tests passed with Homebridge 1, and 119/119 with
  Homebridge 2. Six new tests execute the actual browser event handlers against
  the real configuration editor. Coverage includes unchanged byte preservation,
  one-device edits, scoped additions/removals, fresh replacement identities,
  malformed JSON, competing arrays, duplicate IDs and pending-change tracking.
- Full repository ESLint passed with no warnings; TypeScript `--noEmit`, normal
  TypeScript build, JavaScript syntax and `git diff --check` passed.
- The local generated runtime initially predated current source. Final suites
  used a fresh normal TypeScript build after dependency-file reads completed.
  Node 22 was not tested in this UI-only deployment; this is not a public
  release matrix acceptance.
- An isolated browser preview used sanitized fixtures with 44 legacy
  accessories and two platforms. A single-device edit survived save/reload;
  peers and IDs remained intact. Add/remove counts, invalid JSON, error focus,
  unchanged saves and the disabled platform were checked. No console errors.
- The installed authenticated Homebridge UI showed **Home Control - 2 devices**
  with separate **Mischief** (`mischief-managed`) and **Movie Time Living Room**
  (`movie-time`) entries. Production configuration was not saved for this test.

## Local deployment

Applied three assets through the authenticated Homebridge service-account
terminal. The guarded helper required the installed `2.1.0-beta.1` package,
reviewed original asset hashes and the current configuration hash before writing.
It saved originals and a private manifest under:

`/var/lib/homebridge/.project-maintenance/platform-device-ui-20261018/`

Only these assets were replaced:

| Asset | Installed SHA-256 |
| --- | --- |
| `config.schema.json` | `9864817b6f00e35bee2ae0763f17bf7887fbbe9d2b785c569657410770d66e11` |
| `homebridge-ui/public/index.html` | `ba0199852bd3d2a686164808f34aa346e0bad4179fe4f718121f99994e682a0c` |
| `homebridge-ui/public/settings.js` | `54c0e5c4cbb579976dc86bd429a603561015ac1a5a8dbf284857ab47281f9445` |

Post-deployment verification confirmed identical runtime-file hashes,
configuration bytes, identifier-cache data and the identities of all 70 cached
accessories across the installation. The configuration SHA-256 remained
`6ac47d1a9c8aad180d4012935fe0620bf9f19befe04460216b14d564471d2657`.
Homebridge stayed active/running with PID 140274, no restarts, and its existing
16:54:47 EDT start time. No device commands, Apple Home changes or runtime reload
were needed for this UI update. The device soak continues.

The installed package version remains `2.1.0-beta.1`; these assets are an
unreleased local UI patch. Reinstalling that published version will replace
them with its original UI. No npm publication, tag movement or stable promotion
was performed; `latest` promotion remains on hold.

## Rollback

From the authenticated Homebridge terminal:

```sh
python3 /var/lib/homebridge/.project-maintenance/platform-device-ui-20261018/deploy-platform-device-ui-20261018.py --rollback
```

The helper verifies that installed assets still match this patch and that runtime,
config and identity snapshots remain unchanged, then restores the saved original
assets. It requests no Homebridge restart. Its source and the reviewed payload
were retained beside the private manifest and original assets, with mode 0600.
The retained helper also passed `--verify` from that durable location.

## Remaining release gates

This UI-only deployment does not complete the platform-device household soak,
Movie Time scene/voice acceptance, the Node 22/24 release matrix or publication
checks. Those remain separate from the configuration-editor change.
