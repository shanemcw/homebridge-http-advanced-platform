# Homebridge HTTP Advanced Platform release checkpoint

Recorded: 2026-09-26. Milestone 2: validated local packaging candidate.

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
- Candidate build output has been regenerated. Typecheck/lint and both
  Homebridge regression suites passed on Node 24. A production-only clean
  installation and Node 22 matrix remain milestone 3 acceptance work.

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
   Installed UI, managed child bridges and actual HomeKit acceptance remain pending.
2. Homebridge UI searches npm using `homebridge-plugin`, then matches names,
   keywords and descriptions. Test descriptive searches for "HTTP Advanced",
   "HTTP accessory" and "HTTP Advanced Platform" after indexing. An exact lookup
   of the original npm package name still resolves the original package.
3. Homebridge UI's exact-package lookup reads the `latest` dist-tag. Resolve and
   test first-publication Alpha discovery and installation before release. The
   candidate policy is explicit `alpha` opt-in, with `latest` still rejected by
   the guard. The README gives an explicit tag/version installation path. Registry
   indexing and actual Homebridge UI behavior remain launch gates; do not silently
   promote the candidate to stable to solve discovery.
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
| 2. Local packaging candidate | Package identity, docs, search metadata and retained UUID namespace; existing checks and tarball review passed; remaining gates recorded below | Complete with this milestone commit |
| 3. Installation acceptance | Install candidate in isolation; verify UI, both adapters, restart/cache identity behavior and supported runtime matrix; exercise documented replacement and rollback | Next |
| 4. Public launch | Review accepted candidate; rename repo and update remote/support links, expose the Alpha branch as default, enable issues, publish new npm identity with tested tag/install policy and matching GitHub prerelease; verify searches and install flow | Pending |
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

## Resume at milestone 3

1. Read this checkpoint and applicable instructions; inspect usage and Git state.
2. Continue on `package-http-advanced-platform`. Preserve other work if the
   checkout has changed. Verify the tarball checksum before using this artifact.
3. Run an isolated production-only clean installation and remaining Node 22/24
   compatibility checks without touching production. Check dependencies/audit at
   that installation milestone; existing source-check results do not prove a
   clean installed runtime.
4. Verify both adapters, legacy and cached-platform identity, explicit package
   prefixes, plugin lists, native JSON Config, Plugin Config and managed-child-
   bridge restart behavior. Preserve the accessory-type native schema needed for
   per-accessory JSON editing; the custom UI handles platform configuration.
5. Rehearse documented replacement and rollback in isolation. Record acceptance
   limits and stop at a clean checkpoint before public launch. Keep first-publication
   `alpha` search/tag behavior as a separate registry/Homebridge UI launch gate.
