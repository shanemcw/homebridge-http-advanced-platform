# Homebridge HTTP Advanced Platform release checkpoint

Recorded: 2026-09-26. Milestone 1: local baseline and release plan.

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
- Existing ignored build output and dependencies have not been validated for
  this checkout. Rebuild before using any candidate package.

## Intended public metadata

| Field | Intended value |
| --- | --- |
| Public title | Homebridge HTTP Advanced Platform |
| npm package | `homebridge-http-advanced-platform` |
| GitHub repository | `shanemcw/homebridge-http-advanced-platform` |
| Description | A platform conversion of staromeste's homebridge-http-advanced-accessory, with shared cached HTTP reads and support for existing accessory configurations. |
| Keywords | `homebridge-plugin`, `supports-hap`, `http`, `https`, `advanced`, `platform`, `accessory`, `homekit`, `cache`, `homebridge-http-advanced-accessory` |
| Support links | Our repository, README and issue tracker |
| First candidate | Proposed `2.0.0-alpha.6`; retain Alpha status |

Keep `HttpAdvancedAccessory` and `HttpAdvanced` configuration aliases. The public
README must explain retained accessory configuration support, optional manual
conversion and the identity consequences of conversion. Preserve Apache-2.0
licensing and original authorship credit while identifying our release ownership.

## Packaging decisions that need verification

1. Homebridge's registered plugin name must match the npm package name. Existing
   platform UUID seeds also contain the old plugin name. Inspect registration,
   cached plugin association, explicit plugin-qualified configuration and child
   bridges before choosing the smallest packaging adjustment. Keeping aliases
   alone does not prove that replacement installation preserves identities.
   Do not promise seamless replacement until verified.
2. Homebridge UI searches npm using `homebridge-plugin`, then matches names,
   keywords and descriptions. Test descriptive searches for "HTTP Advanced",
   "HTTP accessory" and "HTTP Advanced Platform" after indexing. An exact lookup
   of the original npm package name still resolves the original package.
3. Homebridge UI's exact-package lookup reads the `latest` dist-tag. Resolve and
   test first-publication Alpha discovery and installation before release; do
   not silently promote the candidate to stable to solve discovery.
4. Alpha.5 includes the entire `docs` directory in its package file list. Review
   public documentation and use a deliberate distributable allowlist. Keep this
   checkpoint, private material, tests and preparation evidence out of the tarball.
5. The publishing guard currently permits only the original package name and
   matching Alpha/Beta version/tag. Update it narrowly for the new identity.

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
| 1. Baseline and checkpoint | Separate local branch from preserved Alpha.5; commit this plan; clean tracked working tree | Complete with the checkpoint commit |
| 2. Local packaging candidate | Apply only packaging and required identity adjustments; review full diff and public file list; run existing typecheck/lint/tests and package checks; record unresolved installation gates | Next |
| 3. Installation acceptance | Install candidate in isolation; verify UI, both adapters, restart/cache identity behavior and supported runtime matrix; document replacement and rollback instructions | Pending |
| 4. Public launch | Review accepted candidate; rename repo and update remote/support links, expose the Alpha branch as default, enable issues, publish new npm identity with tested tag/install policy and matching GitHub prerelease; verify searches and install flow | Pending |
| 5. Live soak | Back up first; deploy as a deliberate production milestone; check actual HomeKit devices, controls, freshness, recovery, child bridges and rollback; record duration and results | Pending |
| 6. Verification | After public launch, audit then-current Homebridge requirements and request verification when evidence supports it | Pending |

Parent fixes remain separate and can begin after successful milestone 5.
Leave the fork relationship and upstream PR branch intact for this packaging work.
GitHub fork detachment is unnecessary and has metadata-loss consequences.

At every stop, commit the coherent local milestone, record checks and outstanding
gates here, and report the branch, commit, working-tree state and next action.
Do not publish a partially checked candidate because an allowance window is ending.

## Resume at milestone 2

1. Read this checkpoint and applicable instructions; inspect current usage and
   Git state before changing files.
2. Use `package-http-advanced-platform` in this repository. If another task has
   changed the checkout, preserve its work rather than switching blindly.
3. Inspect the existing identity tests, registration/cached-accessory behavior
   and publishing guard. Resolve the identity policy and first-publication tag
   policy before implementing the packaging candidate.
4. Prepare and validate that candidate only. Stop at a clean local commit with
   a refreshed checkpoint before installation acceptance or public launch.

Milestone 1 validation: documentation diff checked for whitespace; only this file
was added relative to the Alpha.5 baseline. Runtime tests were not run because
the runtime and package metadata were not changed. Weekly account usage at this
checkpoint was 96% used; the user requested clean stopping points around the reset.
