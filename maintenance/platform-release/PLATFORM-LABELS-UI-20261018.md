# Named platform controls - October 18, 2026

## Behavior

Platform headings and controls use the configured instance name. For a
hypothetical instance named **Example Platform**, the controls include:

- **Platform “Example Platform”**
- **Enable platform “Example Platform”:**
- **Add Device to “Example Platform”**
- **Add Platform** creates another instance.

Labels follow valid name edits in the draft. Missing names are required, and
long button labels wrap within the container. Each instance uses the shared
`HttpAdvanced` alias and a unique name. Existing names and device IDs remain
stable after pairing because they contribute to HomeKit identity.

## Validation

The affected UI, configuration-editor and schema/package regressions passed.
Lint and whitespace checks passed. Sanitized browser fixtures covered draft
name changes, unchanged saves, platform creation and instance-scoped additions.
Installed UI checks confirmed the updated labels without saving configuration.
Runtime files, configuration and cached identities remained unchanged.

## Installation and rollback boundary

This historical UI-only update changed schema, HTML and JavaScript assets. The
update checked expected asset versions and retained originals for rollback;
no runtime restart or device command was needed. Reinstalling the published
package replaces local UI edits. The earlier
[device-editor record](PLATFORM-DEVICE-UI-20261018.md) describes the preceding
change; restore later patches before earlier ones when using retained originals.
