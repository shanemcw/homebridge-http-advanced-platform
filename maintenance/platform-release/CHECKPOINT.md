# Homebridge HTTP Advanced Platform release checkpoint

Recorded: 2026-09-26 (America/New_York). Alpha.7 is public at reviewed release
commit `3ff8a7e`. Its CI, corrected npm README, indexed functionality keywords and
fresh exact-version installation are accepted. Ordinary descriptive search
inclusion remains open; see [DISCOVERY-FOLLOWUP.md](DISCOVERY-FOLLOWUP.md).

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
- Origin is now `shanemcw/homebridge-http-advanced-platform`; upstream remains
  `staromeste/homebridge-http-advanced-accessory`. The fork relationship is retained.
- Earlier read-only checks found both public default branches on the old 2022
  source, upstream PR #59 open, and the proposed npm name returning HTTP 404.
  These were historical prelaunch observations; Alpha.6 is now published.
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
| Description | Connect HTTP/HTTPS devices and REST APIs to HomeKit with JSON/XML mapping, polling and shared cached reads. A platform conversion of staromeste's homebridge-http-advanced-accessory with support for existing accessory configurations. |
| Keywords | `homebridge-plugin`, `supports-hap`, `homebridge`, `http`, `https`, `rest`, `api`, `json`, `xml`, `jsonpath`, `xpath`, `polling`, `advanced`, `platform`, `accessory`, `homekit`, `cache`, `switch`, `sensor`, `homebridge-http-advanced-accessory` |
| Support links | Our repository, README and issue tracker |
| First public release | `2.0.0-alpha.6`; retain Alpha status |
| Current public release | `2.0.0-alpha.7`; both `alpha` and required `latest` point here; still an Alpha |

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
   keywords and descriptions. Alpha.7 is indexed with the expanded functional
   and lineage keywords: targeted keyword queries return it at rank 1. Ordinary
   descriptive queries, including "HTTP Advanced", "HTTP accessory" and
   "HTTP Advanced Platform", still omit it from the observed results. Index
   inclusion is confirmed; broad discovery acceptance remains open. An exact
   lookup of the original npm package name still resolves the original package.
3. Actual public exact-package lookup, Alpha selection and installation passed in
   Homebridge UI 5.29.0. npm created required `latest` alongside `alpha`, both at
   Alpha.6, and rejected authenticated removal with HTTP 400. The user approved
   this exception with clear Alpha labeling; it is not a stable release. Explicit
   Alpha/Beta publication remains required by the guard, which still rejects
   manual `latest`/stable publication. GitHub documentation and release notes are
   corrected. Alpha.7 is published through explicit `alpha`, with the existing
   required `latest` pointer aligned to the same version. Its actual default npm
   page now displays the corrected README and all 20 keywords. The immutable
   Alpha.6 archive remains unchanged. See historical
   [PUBLIC-LAUNCH.md](PUBLIC-LAUNCH.md) and current
   [DISCOVERY-FOLLOWUP.md](DISCOVERY-FOLLOWUP.md).
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
| 4a. Launch preparation | Refresh public docs, rehearse Alpha-only discovery/selection, freeze a reviewed archive, prepare exact public changes and release draft | Complete at `85d65bc` |
| 4b. Public launch and installation | CI, renamed fork, public npm Alpha and matching GitHub prerelease; registry archive integrity and fresh npm/native UI installation | Publication and exact installation accepted; subsequent metadata/README work in 4c |
| 4c. Public documentation/search follow-up | Alpha.7 functionality metadata and corrected npm README; verify actual descriptive search inclusion | Publication, README, indexed keywords and exact installation accepted; ordinary search inclusion still open |
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

## Milestone 4b public launch results

See [PUBLIC-LAUNCH.md](PUBLIC-LAUNCH.md). Reviewed release commit `85d65bc` was
pushed to both public packaging and new `main` branches. Both four-job
compatibility CI runs passed before repository changes. The existing public fork
was renamed, `main` made default, issues enabled and description/topics applied.
History, parent lineage, historical refs and production are preserved.

npm required one-time authentication; the user completed publication from their
terminal after the agent's retry was cancelled. The published registry archive
and GitHub prerelease asset match the frozen launch SHA-256. Annotated
`v2.0.0-alpha.6` resolves to `85d65bc`; later maintenance/documentation commits
do not change that release target.

Fresh registry installation passed all 56 file comparisons and installed
acceptance 3/3. The actual native Homebridge UI found the exact package, installed
Alpha.6 from the `alpha` row, and opened Plugin Config with correct branding.
Its separately installed 56 files also match the published archive. The isolated
fixture and browser tab were stopped, and the listener/process cleanup verified.

npm required `latest` alongside `alpha`, both pointing at Alpha.6; authenticated
removal returned HTTP 400. The user approved this exception and clear Alpha
labeling. GitHub documentation/prerelease notes were corrected in `306841e`, and
both four-job CI matrices passed. npm's immutable Alpha.6 README requires a new
documentation release to refresh its earlier wording. Broad public descriptive
search inclusion was not observed. Production and the original npm package are
untouched; paired Apple Home acceptance and verification remain pending.

## Milestone 4c public results

See [DISCOVERY-FOLLOWUP.md](DISCOVERY-FOLLOWUP.md) for the reviewed Alpha.7 artifact,
expanded metadata, local checks and the linked intermittent CI failure/rerun.
Only five distributed documentation/manifest files differ from Alpha.6; runtime,
UI, schema, dependencies, samples and licensing match. Local source tests passed
98/98, discovery/chooser acceptance 3/3 and installed acceptance 3/3. Node 22/HB1
settings checks passed three times after correcting a server-arrival timing
assertion to measure execution spacing, preserving its delay and timeout checks.
Both release-commit four-job CI matrices passed. The user's earlier failed CI
run also passed on unchanged rerun; no production bug was established.

The reviewed archive was published through `alpha`; both npm tags now point to
Alpha.7. Its registry download and GitHub prerelease archive match SHA-256
`7cc5ae503b7ca68739113b92d2bf2dd0d478b5c72003eb6e6b4fc5db267a42fc`.
The prerelease tag resolves to `3ff8a7e`; later report commits do not change it.
A fresh public installation passed all 56 file comparisons and installed
acceptance 3/3. The actual default npm page shows the corrected Alpha.7 README
and 20 keywords. GitHub's description and 19 functionality/lineage topics are
applied; its fork parent is retained.

Targeted functional/lineage keyword searches and maintainer search return the
indexed Alpha.7 metadata. Ordinary npm/Homebridge UI queries still omit it in
the observed results. Broad discovery remains open, with no proven ranking
cause or eventual appearance date. No pending npm process or authentication
remains; no production access, deployment or restart occurred.

## Resume ordinary descriptive discovery acceptance

1. Read this checkpoint and discovery follow-up report; inspect usage and Git state.
2. Continue on `package-http-advanced-platform`, preserving unrelated work,
   Alpha.5/upstream-preparation refs and all preserved archives. Do not retag or
   overwrite Alpha.6 at `85d65bc` or Alpha.7 at `3ff8a7e` with report commits.
3. Manually recheck the recorded ordinary descriptive queries after allowing
   external search time. Record actual inclusion/rank and decide any additional
   action from the evidence; do not assume indexing delay is the cause.
4. Exact public installation, Alpha.7 publication and default README are already
   accepted. Do not recreate the repository, republish or request authentication
   to repeat those completed operations. Retain the stable-publication guard.
5. Keep production backup/deployment, live HomeKit soak, verification and parent
   fixes as later milestones. Record the outstanding ordinary search gate explicitly.
