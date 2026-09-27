# Homebridge HTTP Advanced Platform release checkpoint

Recorded: 2026-09-26. Milestone 4a launch preparation complete; public launch 4b remains pending.

## Agreed scope

Package the existing Alpha as Homebridge HTTP Advanced Platform. Preserve its
runtime behavior and support for both legacy accessories and platform devices.
This work does not include a code refactor, dependency modernization, automatic
accessory conversion, or fixes from parent issues and pull requests.

Describe the project as a platform conversion of
[staromeste/homebridge-http-advanced-accessory](https://github.com/staromeste/homebridge-http-advanced-accessory).
Preserve original contributor credit, licensing and Git history. Public wording
should explain the conversion and capabilities without positioning it as a
"but maintained" replacement or claiming the parent has been abandoned.

Parent issue and pull-request fixes belong to separate work after public launch
and a successful live soak. Homebridge verification is a separate milestone
after publication; do not claim verification or display its badge beforehand.

## Baseline and local state

- Packaging branch: `package-http-advanced-platform`.
- Base: `v2.0.0-alpha.5`, commit `e85f4324bb06dd12d5ce808f11480b886b855d14`.
- Preserve this tag, its release archive and recovery artifacts unchanged.
- The former checkout was clean on `prepare-alpha5-upstream`, commit
  `b010d32225669fefc09b83cc563c51f247e66b77`.
- That upstream-preparation branch contains later changes. It is not the release
  baseline and must not be merged wholesale into this packaging work.
- Origin remains `shanemcw/homebridge-http-advanced-accessory`; upstream remains
  `staromeste/homebridge-http-advanced-accessory`.
- Earlier read-only checks found both public default branches on the old 2022
  source, upstream PR #59 open, and the proposed npm name returning HTTP 404.
  Recheck remote state and name availability before publication.
- Milestone 1 changes only this checkpoint document. No package/source edits,
  push, repository rename, npm publication, deployment or restart were performed.
- Candidate build output has been regenerated. Source checks passed across
  Node 22/24 and Homebridge 1/2. A production-only clean installation, audit and
  installed loader/adapters/UI IPC checks passed at milestone 3a. Rendered UI,
  managed child bridges and backed-up replacement/rollback passed at milestone 3b
  in an isolated Homebridge 2 fixture. Live Apple Home acceptance remains pending.

## Intended public metadata

| Field | Intended value |
| --- | --- |
| Public title | Homebridge HTTP Advanced Platform |
| npm package | `homebridge-http-advanced-platform` |
| GitHub repository | `shanemcw/homebridge-http-advanced-platform` |
| Description | A platform conversion of staromeste's homebridge-http-advanced-accessory, with shared cached HTTP reads and support for existing accessory configurations. |
| Keywords | `homebridge-plugin`, `supports-hap`, `http`, `https`, `advanced`, `platform`, `accessory`, `homekit`, `cache`, `homebridge-http-advanced-accessory` |
| Support links | Our repository, README and issue tracker |
| First candidate | Local `2.0.0-alpha.6`; retain Alpha status |

Keep `HttpAdvancedAccessory` and `HttpAdvanced` configuration aliases. The public
README must explain retained accessory configuration support, optional manual
conversion and the identity consequences of conversion. Preserve Apache-2.0
licensing and original authorship credit while identifying our release ownership.

## Packaging decisions and remaining acceptance

1. Registration now uses `homebridge-http-advanced-platform`. The immutable
   `platformUUIDNamespace` retains `homebridge-http-advanced-accessory`, so the
   UUID seed remains unchanged. Configuration aliases remain unchanged.
   Both Homebridge 1 and 2 regressions passed real cached-plugin reassociation
   and AID/IID continuity checks. Explicit old package prefixes and plugin lists
   require documented manual updates; no runtime configuration rewrite was added.
   Installed UI and managed child-bridge lifecycle acceptance passed in the
   isolated milestone 3b fixture. Actual HomeKit acceptance remains pending.
2. Homebridge UI searches npm using `homebridge-plugin`, then matches names,
   keywords and descriptions. Test descriptive searches for "HTTP Advanced",
   "HTTP accessory" and "HTTP Advanced Platform" after indexing. An exact lookup
   of the original npm package name still resolves the original package.
3. Homebridge UI's exact-package lookup reads the `latest` dist-tag, but UI 5.29.0
   opens a first-install version chooser that enumerates `alpha` independently.
   Actual service/version-chooser logic passed isolated Alpha-only registry
   acceptance: discovery, metadata matching and exact-version npm dispatch.
   The policy remains explicit `alpha` opt-in; `latest` remains rejected by the
   guard. The README records the supported chooser and CLI paths. Actual public
   registry/UI installation and indexing remain 4b gates; do not silently promote
   the candidate to stable to solve discovery.
4. Public documentation now has a deliberate distributable allowlist. The
   56-file tarball excludes this checkpoint, tests and draft evidence. Its relative
   documentation links and new package/retained namespace metadata were checked.
5. The publishing guard now permits only the platform package name with matching
   Alpha/Beta version/tag. Regression checks reject the original package name,
   stable versions, mismatched channels and `latest`.

References checked during planning:
[Homebridge UI search source](https://github.com/homebridge/homebridge-config-ui-x/blob/latest/src/modules/plugins/plugins.service.ts),
[plugin package metadata](https://github.com/homebridge/homebridge-plugin-template#update-packagejson),
[GitHub repository renaming](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).
Metadata changes are needed in the manifest and lockfile, registration metadata,
release guard, public docs, UI branding, examples and applicable test expectations.
Retain the historical npm regression fixture as a fixture, not a renamed dependency.

## Discrete milestones

| Milestone | Deliverable and completion check | Status |
| --- | --- | --- |
| 1. Baseline and checkpoint | Separate local branch from preserved Alpha.5; committed plan | Complete at `546aa3c` |
| 2. Local packaging candidate | Package identity, docs, search metadata and retained UUID namespace; existing checks and tarball review passed | Complete at `fe5adb0` |
| 3a. Clean install and matrix | Production-only clean install, advisory audit, full runtime matrix and installed loader/adapters/custom UI IPC checks | Complete at `adca0ad` |
| 3b. Installed lifecycle acceptance | Actual browser/native UI, managed-child-bridge restart, complete replacement/rollback and cache identity acceptance | Complete at `f80296b`; isolated Node 24/Homebridge 2 fixture |
| 4a. Launch preparation | Refresh public docs, rehearse Alpha-only discovery/selection, freeze a reviewed archive, prepare exact public changes and release draft | Complete with this checkpoint commit |
| 4b. Public launch | Push reviewed commit and pass CI; rename existing fork, make new `main` default, enable issues/topics, publish explicit npm Alpha and matching GitHub prerelease; verify registry/UI installation and searches | Next; no public changes made |
| 5. Live soak | Back up first; deploy as a deliberate production milestone; check actual HomeKit devices, controls, freshness, recovery, child bridges and rollback; record duration and results | Pending |
| 6. Verification | After public launch, audit then-current Homebridge requirements and request verification when evidence supports it | Pending |

Parent fixes remain separate and can begin after successful milestone 5.
Leave the fork relationship and upstream PR branch intact for this packaging work.
GitHub fork detachment is unnecessary and has metadata-loss consequences.

At every stop, commit the coherent local milestone, record checks and outstanding
gates here, and report the branch, commit, working-tree state and next action.
Do not publish a partially checked candidate because an allowance window is ending.

## Milestone 2 results

- Candidate: `homebridge-http-advanced-platform@2.0.0-alpha.6`.
- Public manifest, lockfile identity, README, lineage, search keywords, UI title,
  release notes and examples updated. Historical npm regression fixture retained.
- Runtime source changes are confined to registration metadata and using the
  preserved UUID namespace. HTTP, cache, recovery, mappings and write behavior
  were not refactored; no parent fixes or dependency changes were incorporated.
- `npm run check` passed on Node `24.21.0`: typecheck, lint and 98/98 tests using
  Homebridge `2.4.0`.
- `HB_TEST_VERSION=1 node --test test/*.test.mjs` passed 98/98 tests using
  Homebridge `1.11.4` on the same Node version.
- The new regression uses Homebridge's actual cache reassociation and real HAP
  identifier assignments to verify UUID/AID/IID continuity after package rename.
- Existing tests also passed actual ESM plugin loading, both registrations,
  serialized lifecycle and native custom UI IPC/configuration round-trips.
- Dependency declarations, engines, scripts and dependency lock entries are
  unchanged from Alpha.5; only lockfile root package name/version changed.
- Public sample passed runtime configuration validation; documentation links,
  tarball file list/metadata and whitespace checks passed. LICENSE unchanged.
- Tarball (56 files, 68296 bytes):
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
- SHA-256: `899161d4e5a8a83e3941b06636b9bd75c34e98dbad1dbcdd00c261650e32bc22`.
- npm pack could not use the default cache due to EPERM. It succeeded using an
  isolated `/private/tmp/http-advanced-platform-npm-cache`; no cache ownership or
  system permissions were changed.
- No pushes, remote settings, npm publication, installation/deployment or restart.
  The upstream PR branch and Alpha.5 tag remain unchanged.
- Weekly usage was 97% used at the validation milestone; stop here at the local
  commit as requested, with installation acceptance and public launch separate.

## Milestone 3a results

See [INSTALLATION-ACCEPTANCE.md](INSTALLATION-ACCEPTANCE.md) for the artifact,
checks, runtime matrix, isolated paths and exact evidence limits. The preserved
candidate tarball is unchanged; the acceptance report/harness are not packaged.

- Production-only clean installation and dependency audit passed; zero known
  vulnerabilities were reported at this checkpoint.
- Node 22.23.3 typecheck/lint and 98/98 source tests passed on each Homebridge
  version, completing the local Node 22/24 x Homebridge 1/2 matrix.
- Three installed-package acceptance tests passed in each of the four runtime
  combinations, exercising actual installed loader, adapter HTTP I/O and UI IPC.
- An official checksum-verified Node 22 binary was used only under a temporary
  directory; the system Node installation was not changed.
- Weekly usage was 98% used at the start. This checkpoint completes milestone 3a;
  it does not mark the broader installation milestone or public readiness complete.
- No production access, push, publication, remote rename or restart was performed.

## Milestone 3b results

See [LIFECYCLE-ACCEPTANCE.md](LIFECYCLE-ACCEPTANCE.md) and its retained synthetic
stage results for the complete record and evidence limits.

- Homebridge UI 5.29.0 rendered the new package card and Plugin Config on
  Node 24.21.0 / Homebridge 2.4.0. Shared timeout saved and reopened correctly.
- Native per-accessory JSON editing saved a synthetic manufacturer field.
  Homebridge UI normalized the accessory's qualified registration to the valid
  unchanged alias; other configuration matched the expected preserved data.
- Both actual managed child bridges restarted through the native UI flow and
  restored their cache. Disable/enable configuration and runtime behavior passed.
- A source-built preserved Alpha.5 archive established the old package baseline.
  Replacement, another full restart, restored-backup rollback and final candidate
  restoration all passed with one unchanged platform UUID and matching serialized
  service/characteristic identities. Both plugin identities and qualified
  registrations/allowlists loaded at the appropriate stages.
- The initial UI host setup needed its native dependency rebuilt. Its automatic
  LAN discovery briefly probed an existing bridge and was refused; no control
  occurred. Later fixture runs disabled insecure accessory control. The fixture
  was stopped, including its backend and child processes, after acceptance.
- HAP remained disabled; this does not establish paired Apple Home behavior or
  published AID/IID persistence. Those limits are distinct from the earlier
  Homebridge/HAP source regressions and the future live soak.
- Only maintenance evidence changed. The candidate archive/checksum, preserved
  Alpha.5 tag, upstream-preparation branch and distributable source are unchanged.
  No publication, push, repository rename, production deployment or restart.
- Weekly usage reached 99% during the first attempt. Work resumed after the
  account counters reset, without redeeming reset credits or changing models.

## Milestone 4a results

See [LAUNCH-REVIEW.md](LAUNCH-REVIEW.md) for exact repository settings, publication
sequence, artifact details and Alpha discovery evidence. The prepared public
release copy is [GITHUB-PRERELEASE.md](GITHUB-PRERELEASE.md); it is not published.

- README and public documentation now record completed isolated acceptance and
  explicit installation through UI 5.29.0's Alpha chooser or `@alpha`/exact version.
  Public availability must be confirmed from npm and the matching prerelease.
- New archive, 56 files / 69253 bytes:
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
- SHA-256: `3c62cfc01ba7b9f2cbb737fc6fdfa0de4b82ea592ffda935757b0db7823af247`.
  Its sibling `.tgz.sha256` is prepared for the eventual prerelease attachment.
- Only four distributed documentation files differ from the preserved milestone
  2/3 archive. Runtime, custom UI, schema, manifest, sample and license bytes match.
  The earlier archive/checksum, Alpha.5 tag and upstream-preparation ref are intact.
- Typecheck, lint and 98/98 source tests passed on Node 24/Homebridge 2. The first
  restricted run failed on loopback socket permissions; the permitted rerun passed.
  The prior full matrix remains applicable to unchanged runtime bytes.
- A new production-only installation added eight packages. Installed loader,
  adapters with loopback I/O and official custom UI IPC passed 3/3.
- `alpha-discovery.test.mjs` passed 3/3 using actual UI 5.29.0 service and pinned,
  transpiled chooser methods with synthetic registry data. Angular rendering and
  npm execution were stubbed. Public indexing and complete registry/UI installation
  are not established by this rehearsal and remain launch checks.
- npm publish dry-run passed for the reviewed archive with `--tag alpha` and
  `--access public`; no public package or tag was created. Source checks and the
  explicit guard are separate gates because tarball publishing skips the
  checkout's `prepublishOnly` hook.
- Both proposed public names returned 404. npm identified account `shanemcw`;
  GitHub confirmed admin permission on the existing public fork. These observations
  do not reserve a name or prove final npm publication/2FA will succeed.
- New public `main` is proposed at the reviewed packaging commit, preserving
  historical `master`, fork lineage and upstream PR work. No pushes, tag creation,
  repository rename, npm publication, production access or restarts were performed.

## Resume at milestone 4b public launch

1. Read this checkpoint and launch review; inspect usage and Git state.
2. Continue on `package-http-advanced-platform`, preserving unrelated work and
   the Alpha.5/upstream-preparation refs. Verify the new launch archive checksum;
   do not substitute the earlier documentation archive or unreviewed later HEAD.
3. Recheck name availability and authenticated public accounts. After the reviewed
   launch is authorized, push the exact commit/branches and wait for compatibility
   CI before repository settings or publication.
4. Follow the launch review's rename/default-branch/issues/topics, guarded exact
   tarball publication and matching GitHub prerelease sequence.
5. Verify public dist-tags, metadata, archive contents, fresh registry install,
   native UI Alpha install and descriptive searches after indexing.
6. Keep production backup/deployment, live HomeKit soak, verification and parent
   fixes as later milestones. Record any pending public indexing explicitly.
