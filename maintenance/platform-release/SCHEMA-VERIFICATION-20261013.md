# Platform schema verification correction

Prepared locally on unpublished `develop/2.1.0`, October 13, 2026.

## Problem and resulting behavior

[Homebridge verification request #1266](https://github.com/homebridge/plugins/issues/1266#issuecomment-6147806907)
failed its mandatory `pluginType: platform` check against published 2.0.0.
The runtime implements a dynamic platform, but the schema still classified the
package by its retained legacy accessory alias. The earlier checklist review
underestimated that metadata requirement.

The schema now selects the registered `HttpAdvanced` platform alias and describes
a platform at its root. The former device schema is retained unchanged under
`definitions.device`, serving both platform devices and legacy validation.
Legacy registration, runtime identity generation, state cache and HTTP action
behavior are unchanged by this correction.

The native plugin JSON Config consequently selects platforms. Plugin Config now
provides individual expandable legacy accessory JSON editors with add/remove
controls, alongside platform definitions and shared settings. All saves use the
existing validated, conflict-checked, backed-up merge path. Unedited definitions,
aliases, encoded data, unknown fields, bridge assignments and other plugins stay
preserved. Only explicit saving writes configuration.

The settings screen uses title case for headings and buttons, and sentence case
with a trailing colon for field labels. A scoped `text-transform: none` rule
preserves button title case under Homebridge's theme. `Optional Platforms` stays plural because the
screen supports multiple platform definitions. Legacy editors remain grouped
under an expandable summary so large inventories do not fill the initial view.

## Validation

- Typecheck and lint passed in an isolated locked-dependency checkout.
- All 113 regressions passed in each Node 22.23.3/24.21.0 × Homebridge
  1.11.4/2.4.0 combination: 452 test executions.
- The new legacy editing regression was also checked after strengthening its
  edited-field fixture. All nine configuration/UI tests passed.
- Fresh production-only candidate installation added eight packages.
- Installed loader/aliases, loopback controls and official custom UI IPC passed
  3/3 on each Homebridge version, including corrected schema metadata.
- Browser checks on sanitized fixtures covered edit/save/reload, preservation of
  the other 43 legacy definitions, encoded/unknown fields and bridge assignment,
  invalid-JSON rejection, add/remove, compact group behavior and the final copy.
- Final tarball inspection confirmed platform metadata and final UI copy.
- `git diff --check` passed.

The four-combination regression matrix covers this source change; the last GUI
updates were layout/copy changes and received browser, lint and tarball checks.
The browser used the isolated preview and existing ConfigEditor, not the
household Homebridge instance or a production configuration.

## Initial release boundary

At this local-test checkpoint, the changes remained uncommitted on
`develop/2.1.0`. The development tarball was installed on stinky-1 for authorized local testing after backups;
see [the deployment record](LOCAL-DEV-20261013.md). During that local test, no package was published,
branch pushed, or GitHub issue comment sent. The public 2.0.0 package has
the rejected schema metadata. A new
release and then a `/check` issue comment are needed for Homebridge's bot to
evaluate the correction.

The existing 2.1.0 branch also includes previously implemented cross-origin
redirect header hardening. Any release of this branch must include that change
in its reviewed scope and release notes. The planned individual-command feature
remains unimplemented.

The bot separately flags legacy `eval()` for manual review. Trusted local
configuration intentionally retains executable legacy expressions and templates;
this is not a sandbox. That behavior was not modified by the schema correction.
