# Independent platform device editors - October 18, 2026

The [named-control follow-up](PLATFORM-LABELS-UI-20261018.md) records the related
label changes. This historical checkpoint describes the initial UI improvement.

## Behavior

Each platform device has an expandable JSON editor and remove control, matching
the legacy accessory workflow. Each platform has its own add-device control and
separate platform settings. New devices receive fresh IDs. Existing definitions
retain IDs, aliases, encoded requests, custom fields and bridge assignments
unless explicitly edited.

Platform settings exclude `devices` and reject a competing array. The server
validates the combined draft, rejects duplicate IDs and stale saves, preserves
unrelated configuration and backs up changed configurations. Runtime behavior
and dependencies were unchanged.

## Validation

- All 119 tests passed on Node 24 with each supported Homebridge major version.
  Browser-handler coverage includes unchanged saves, independent edits,
  additions/removals, replacement identities, malformed JSON and duplicate IDs.
- Typecheck, build, lint, syntax and whitespace checks passed.
- Isolated browser checks exercised editing, save/reload, draft tracking,
  validation errors, disabled platforms and preservation of unedited fields.
- Installed UI checks confirmed separate editors and controls without saving
  configuration. Configuration and cached identities remained unchanged.

The final public beta required the complete Node 22/24 compatibility matrix and
fresh-package checks separately. Field acceptance and publication were separate
from this UI-only checkpoint.

## Installation and rollback boundary

Only schema and UI assets changed. A guarded update retained the previous
assets and checked runtime, configuration and identity preservation. Restoring
that update uses the retained originals through the test installation's normal
maintenance workflow. A normal package reinstall replaces local UI patches.
No runtime reload or device command was required for this UI change.
