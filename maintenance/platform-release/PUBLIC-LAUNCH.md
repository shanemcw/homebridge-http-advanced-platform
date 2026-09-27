# Public launch progress

Recorded 2026-09-26. Milestone 4b is in progress; npm publication is awaiting
user-completed one-time authentication. This is not a completed launch report.

## Completed GitHub launch gates

- Reviewed release commit: `85d65bc5b690a0b53c224e38c3f5498327a19474`.
- Pushed that exact commit to `package-http-advanced-platform` and new `main`.
- Both Compatibility runs passed all four Node 22/24 x Homebridge 1/2 jobs,
  including source checks, production dependency audit and packaging checks:
  [main CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36286354215)
  and [packaging branch CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36286354241).
- Renamed the existing public fork to
  [shanemcw/homebridge-http-advanced-platform](https://github.com/shanemcw/homebridge-http-advanced-platform).
  Parent remains `staromeste/homebridge-http-advanced-accessory`; Git history and
  contributor/license lineage are retained.
- `main` is default at the reviewed release commit. Our issue tracker is enabled;
  description and all seven reviewed search topics are applied.
- Updated local `origin` to the new repository URL; `upstream` is unchanged.
- Remote historical `master`, `prepare-alpha5-upstream` and the annotated
  Alpha.5 tag/commit were verified unchanged. No production access or restart.

## npm authentication handoff

The explicit Alpha guard and archive SHA-256 were rechecked before publication.
The first npm publish attempt stopped with `EOTP` (one-time authentication
required), before creating a package. An interactive browser-authentication retry
was cancelled before handing the operation to the user's terminal. There is no
agent-owned publication process still waiting or competing with that command.

The package registry still returned 404 at the latest check. The user was given
the exact tarball publication command with `--tag alpha --access public
--auth-type=web`, using the temporary npm cache. No OTP, token or authentication
link is recorded in this repository.

The requested visible-terminal setup could not be completed: Computer Use
rejected access to `com.apple.Terminal`; the Codex terminal request was queued,
and there was no attached terminal. The user can run the provided command in
their own terminal and approve npm's link there.

Reviewed archive:
`/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
SHA-256:
`3c62cfc01ba7b9f2cbb737fc6fdfa0de4b82ea592ffda935757b0db7823af247`.

## Resume after authentication

1. Check public registry state before retrying publication; the user's terminal
   may already have completed it. Verify exact version/metadata, `alpha` and no
   `latest`, plus registry archive identity against the reviewed checksum.
2. Create/push annotated `v2.0.0-alpha.6` at the reviewed release commit, not a later
   maintenance-report commit. Publish the matching GitHub prerelease with the
   prepared release body, exact archive and checksum attachment.
3. Complete the fresh registry installation, installed acceptance, actual native
   UI Alpha chooser/installation and descriptive search/indexing checks from
   [LAUNCH-REVIEW.md](LAUNCH-REVIEW.md).
4. Record the actual public outcomes and commit the completed milestone. Leave
   production deployment/live soak, verification and parent fixes for later work.

Maintenance checkpoint commits do not change the reviewed distributable archive
or the intended release/tag commit. Do not infer npm/GitHub-release completion
from the repository rename or passing CI.
