# Alpha.6 public launch and installation acceptance

Recorded 2026-09-26. Publication and exact-package installation are accepted.
Descriptive search indexing and the npm-page README correction remain follow-ups.

## Published release

- Public npm package:
  [homebridge-http-advanced-platform@2.0.0-alpha.6](https://www.npmjs.com/package/homebridge-http-advanced-platform).
- Public repository:
  [shanemcw/homebridge-http-advanced-platform](https://github.com/shanemcw/homebridge-http-advanced-platform).
- Matching [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.6)
  has the reviewed archive and checksum attached. It is neither a draft nor
  designated GitHub's latest release.
- Annotated `v2.0.0-alpha.6` resolves to the reviewed release commit
  `85d65bc5b690a0b53c224e38c3f5498327a19474`, not later documentation commits.
- Reviewed/published archive (56 files, 69253 compressed bytes):
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
- SHA-256:
  `3c62cfc01ba7b9f2cbb737fc6fdfa0de4b82ea592ffda935757b0db7823af247`.
  The registry download and GitHub release asset digest both match it.
- Dependencies, runtime behavior, retained configuration aliases and UUID
  namespace remain as reviewed. No parent issue/PR fixes were incorporated.

## Repository and CI acceptance

The existing public fork was renamed; its parent remains
`staromeste/homebridge-http-advanced-accessory`. Git history, original contributor
credit and Apache-2.0 lineage are retained. `main` is default, our issue tracker
is enabled, and the reviewed description and seven search topics are applied.
Local `origin` uses the renamed repository; `upstream` is unchanged. Historical
`master`, `prepare-alpha5-upstream` and the Alpha.5 tag/commit were preserved.

Both reviewed-release CI runs passed all four Node 22/24 x Homebridge 1/2 jobs,
including source checks, production dependency audit and packaging checks:
[main CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36286354215)
and [packaging CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36286354241).
Documentation correction `306841e` also passed both four-job matrices:
[main CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36287253749)
and [packaging CI](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36287253555).

## Authentication and npm tag exception

The guarded publication initially required one-time authentication (`EOTP`).
The agent's interactive retry was cancelled before the user completed publication
from their accessible terminal. Computer Use did not permit access to Terminal;
the Codex terminal request was queued without an attached session. No agent-owned
publication process remains pending. No OTP, token or authentication link is
recorded in this repository.

Despite explicit `--tag alpha`, npm created both `alpha` and `latest`, pointing
to `2.0.0-alpha.6`. The user's separately authenticated attempt to remove
`latest` returned HTTP 400. The registry's
[package metadata specification](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md)
states that every package has a `latest` tag; the same first-publication and
removal behavior is documented in [npm/cli #8490](https://github.com/npm/cli/issues/8490).
This disproved the planned absence-of-`latest` gate.

The user explicitly approved completing the launch with npm's required tag and
clear Alpha labeling. The version remains a prerelease. The original npm package
is untouched, and its users receive no automatic package-name migration. The
publishing guard still requires explicit Alpha/Beta publication and rejects
manual `latest`/stable publication; the registry-created tag is the approved
exception. GitHub's source README and prerelease notes now explain this behavior.

The immutable Alpha.6 archive and npm-page README still contain the earlier
incorrect absence-of-`latest` wording. npm's
[README update instructions](https://docs.npmjs.com/about-package-readme-files/)
require publishing a new version to update that page. A subsequent documentation
Alpha is the next milestone; do not overwrite the published Alpha.6 archive or
retag its release commit.

## Published installation acceptance

- Fresh exact-version npm installation from the public registry added eight
  production packages in an isolated prefix. Lockfile integrity matches registry
  metadata, and all 56 installed distributable files match the reviewed archive.
- Installed loader/alias, loopback adapter HTTP I/O and custom UI IPC acceptance
  passed 3/3 on Node 24.21.0 / Homebridge 2.4.0.
- A separate fresh Homebridge UI 5.29.0 fixture, initially lacking the candidate,
  found the exact public package name. Its actual first-install chooser displayed
  both `latest` and `alpha` at Alpha.6. Selecting the `alpha` row successfully
  installed the published version through the native UI/npm path.
- Plugin Config opened with the exact Homebridge HTTP Advanced Platform branding,
  a loaded configuration, zero legacy accessories, shared settings and the
  optional platform. All 56 native-UI-installed files also match the archive.
- Evidence images are retained outside the distributable allowlist:
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/public-alpha-version-chooser.png`
  and `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/public-registry-installed-ui.png`.

The UI fixture used loopback port 57471, disabled HAP, disabled insecure control
and had no device endpoints. Its duplicate startup exited with `EADDRINUSE`;
acceptance used the already-running isolated instance. The supervisor/UI and
Homebridge child were stopped and their processes and listener verified gone.
The browser tab was closed. No production access, deployment, restart or physical
device control occurred. These results do not establish paired Apple Home behavior
or a successful production soak, and no verification badge is claimed.

## Remaining follow-ups and next milestone

Public descriptive searches for `HTTP Advanced`, `HTTP accessory` and
`HTTP Advanced Platform` did not yet return the candidate. The checked npm search
API snapshot also lacked it for the full new name. Exact native UI lookup uses
package metadata directly and succeeded; this does not establish search indexing
or ranking. Metadata matching passed the earlier synthetic checks, but the timing
and cause of public index inclusion are not confirmed.

Milestone 4c will prepare a subsequent documentation-only Alpha to refresh the
npm README and recheck actual descriptive search inclusion. Publication and exact
installation do not need to be repeated as a new launch. Preserve both Alpha.5
and Alpha.6 artifacts/tags. Production backup/deployment and live soak remain
milestone 5; verification remains milestone 6. Parent fixes remain separate work
after a successful live soak.
