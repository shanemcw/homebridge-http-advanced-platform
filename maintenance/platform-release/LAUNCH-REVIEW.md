# Alpha.6 public launch review

Historical milestone 4a planning snapshot. See [PUBLIC-LAUNCH.md](PUBLIC-LAUNCH.md)
for the executed launch, the user-approved npm-required `latest` exception and
remaining README/indexing follow-ups. The planned absence-of-`latest` gate below
was disproved by the registry and is superseded by that acceptance record.

Recorded 2026-09-26. Milestone 4a is local preparation; publication is milestone
4b. Nothing in this checklist has been pushed, renamed or published. Production
Homebridge and Apple Home were not accessed.

## Reviewed package

- Name/version: `homebridge-http-advanced-platform@2.0.0-alpha.6`.
- Archive: `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
- SHA-256: `3c62cfc01ba7b9f2cbb737fc6fdfa0de4b82ea592ffda935757b0db7823af247`.
- 56 files; 69253 compressed bytes. Relative documentation targets exist.
- Compared with the preserved milestone 2/3 archive, only `README.md`,
  `docs/alpha-release-notes.md`, `docs/migration.md` and `docs/modernization.md`
  changed. Runtime, source maps, custom UI, manifest, schema, samples and license
  are byte-identical. Dependencies and engines are unchanged.
- The earlier archive remains intact with SHA-256
  `899161d4e5a8a83e3941b06636b9bd75c34e98dbad1dbcdd00c261650e32bc22`.
- Public documentation now records completed isolated acceptance and the exact
  Alpha installation path. It directs readers to registry/release availability
  before installing; no public availability is claimed by this local checkpoint.
- Reports, launch drafts and acceptance harnesses remain outside the npm archive.

## Current public state and proposed changes

Read-only checks found the proposed npm package and GitHub repository returning
404. A missing name is an availability observation, not a reservation.
`npm whoami` returned `shanemcw`; GitHub reported administrative permission on
the existing fork. Publication may still require npm's interactive authentication
or 2FA; no credential files were read or authentication policy changed.

| Item | Current | Proposed at 4b |
| --- | --- | --- |
| Repository | `shanemcw/homebridge-http-advanced-accessory` | Rename to `shanemcw/homebridge-http-advanced-platform` |
| Fork parent | `staromeste/homebridge-http-advanced-accessory` | Retain |
| Default branch | Historical `master` | New `main`, pointing to the reviewed packaging commit |
| Issues | Disabled | Enable our tracker |
| Description | Historical HTTP bridge description | Current package description with parent lineage |
| Topics | None | `homebridge-plugin`, `homebridge`, `http`, `homekit`, `platform`, `accessory`, `homebridge-http-advanced-accessory` |
| npm | New package absent | Public `2.0.0-alpha.6` on `alpha` only |
| GitHub release | No new-platform release | Prerelease `v2.0.0-alpha.6` with reviewed archive/checksum |

No remote `main` or packaging branch existed at the check. Preserve historical
`master`, the Alpha.5 tag and the separate upstream-preparation branch/PR. The
local folder need not be renamed. Rename the existing fork rather than creating
a replacement repository; retain its history, fork parent and GitHub redirects.
Do not reuse the old repository name, which would interfere with redirects.

## Alpha discovery and installation acceptance

Homebridge UI **5.29.0** has a first-install version chooser. Its exact-package
lookup reads `latest`, so an Alpha-only package can have an empty default-version
label, but the chooser separately enumerates all tags and versions. Selecting the
`alpha` row passes **the exact version** to the install service. No `latest` tag,
guard exception or stable promotion is required.

`alpha-discovery.test.mjs` passed 3/3 against the actual installed UI service and
the transpiled upstream version-chooser methods. Registry responses were
synthetic; Angular rendering/injection and the final npm process were stubbed.
It checked exact discovery without `latest`, descriptive metadata matching, tag
enumeration and the resulting exact-version npm command. Template checks verified
first-install and Alpha-row wiring. This is not a public registry or browser
installation test; rendered installed UI acceptance is recorded separately in 3b.

The pinned upstream inputs, verified by SHA-256 in the harness, are:

- [Plugin card template](https://github.com/homebridge/homebridge-config-ui-x/blob/v5.29.0/ui/src/app/modules/plugins/plugin-card/plugin-card.component.html).
- [Version chooser](https://github.com/homebridge/homebridge-config-ui-x/blob/v5.29.0/ui/src/app/core/plugins/manage-version/manage-version.component.ts).
- [Chooser template](https://github.com/homebridge/homebridge-config-ui-x/blob/v5.29.0/ui/src/app/core/plugins/manage-version/manage-version.component.html).
- [Registry/install service](https://github.com/homebridge/homebridge-config-ui-x/blob/v5.29.0/src/modules/plugins/plugins.service.ts).

The intervening [frontend management service](https://github.com/homebridge/homebridge-config-ui-x/blob/v5.29.0/ui/src/app/core/plugins/manage-plugins.service.ts)
was also inspected: it opens the chooser without requiring `latest` and forwards
the selected version after checking runtime compatibility.

To repeat, install UI 5.29.0 only into an isolated fixture; download those three
frontend files from the pinned tag into a separate source directory. Supply their
directories using `HTTP_ADVANCED_UI_ROOT` and `HTTP_ADVANCED_UI_SOURCE_ROOT`:

```sh
HTTP_ADVANCED_UI_ROOT=/private/tmp/http-advanced-platform-acceptance-20260926/installed/node_modules/homebridge-config-ui-x \
HTTP_ADVANCED_UI_SOURCE_ROOT=/private/tmp/http-advanced-platform-launch-review-20260926 \
node --test maintenance/platform-release/alpha-discovery.test.mjs
```

Metadata matches `HTTP Advanced`, `HTTP accessory` and `HTTP Advanced Platform`
when npm returns the indexed candidate. Actual index inclusion/ranking is a
post-publication check. Exact lookup of the original package name remains the
original package. CLI testers must use `@alpha` or `@2.0.0-alpha.6`; an unqualified
install is not this package's Alpha installation route.

## Completed local validation

- `npm run check`: typecheck, lint and 98/98 source tests on Node 24.21.0 /
  Homebridge 2.4.0. The first sandboxed attempt blocked loopback sockets; the
  permitted rerun passed. No runtime code was changed to address that restriction.
- Existing full Node 22/24 x Homebridge 1/2 results remain applicable because all
  distributable runtime bytes are unchanged.
- Fresh production-only installation from the reviewed archive: eight packages;
  installed loader/adapters/custom UI IPC acceptance 3/3 on Node 24/Homebridge 2.
- Alpha-only discovery/chooser acceptance: 3/3.
- Publishing guard accepted explicit `alpha`; its 98-test suite retains rejection
  checks for `latest`, stable versions, old identity and mismatched channels.
- Archive comparison, allowlist and relative documentation links passed.
- npm publication dry-run passed for the exact reviewed archive, explicit `alpha`
  tag and public access. No package or tag was created on the registry. This does
  not prove server-side publication permission or replace post-publication checks.

## Milestone 4b execution order

This sequence is prepared for review, not executed. Recheck clean Git state,
name availability, archive checksum and authenticated accounts immediately before
public work. Resolve the reviewed release commit explicitly; do not publish an
unreviewed later HEAD or force an existing remote branch/tag.

1. Push the reviewed packaging branch and create remote `main` at the same commit.
   Wait for all four compatibility CI jobs on that exact commit to pass. CI also
   audits production dependencies and checks packaging. Stop on failures.
2. Rename the existing fork, enable issues, set the description and make `main`
   default. Set the topics above. Update only `origin`; keep `upstream` unchanged.
   Confirm the new repository's public visibility, fork parent and settings.
3. Rerun the release guard with explicit `alpha` and verify the exact archive hash.
   Publish the reviewed tarball using `--tag alpha --access public`. Publishing an
   existing tarball does not run the checkout's `prepublishOnly`; the source/CI
   checks and explicit guard are required separate gates.
4. Verify registry name/version, engines, lineage/support metadata, `alpha` tag
   and absence of `latest`. Do not add `latest` to repair discovery. Resolve any
   unexpected tag behavior before declaring the launch accepted.
5. Create/push annotated `v2.0.0-alpha.6` at the reviewed commit. Create a matching
   GitHub **prerelease** using `GITHUB-PRERELEASE.md`; attach the exact archive and
   checksum file. Confirm the release and npm archive contents agree.
6. Install the published exact version into a fresh isolated prefix. Check npm
   integrity, compare installed distributable bytes with the reviewed archive,
   then repeat loader/adapters/custom UI IPC acceptance. Verify the actual native
   UI exact-package lookup, Alpha chooser and registry installation in isolation.
7. Check npm/Homebridge UI descriptive searches after indexing. Record pending
   indexing explicitly if delayed; don't claim discoverability solely from local
   metadata matching. Record publication/CI/install/search outcomes in the checkpoint.

Core commands after those gates are satisfied (run from this checkout):

```sh
# resolve and verify this milestone's reviewed commit before using these commands
releaseCommit=$(git rev-parse package-http-advanced-platform)
releaseArchive=/Users/shanemcw/Downloads/http-advanced-platform-alpha6-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz

git push origin "${releaseCommit}:refs/heads/package-http-advanced-platform"
git push origin "${releaseCommit}:refs/heads/main"
# wait for compatibility CI on releaseCommit before the rename or publication
gh api --method PATCH repos/shanemcw/homebridge-http-advanced-accessory \
  -f name=homebridge-http-advanced-platform -f default_branch=main -F has_issues=true \
  -f description="A platform conversion of staromeste's homebridge-http-advanced-accessory, with shared cached HTTP reads and support for existing accessory configurations."
git remote set-url origin https://github.com/shanemcw/homebridge-http-advanced-platform.git
gh api --method PUT repos/shanemcw/homebridge-http-advanced-platform/topics --input - <<'JSON'
{"names":["homebridge-plugin","homebridge","http","homekit","platform","accessory","homebridge-http-advanced-accessory"]}
JSON
# verify all repository settings

npm_config_tag=alpha node scripts/release-guard.mjs
shasum -a 256 "$releaseArchive"
npm publish "$releaseArchive" --tag alpha --access public \
  --registry https://registry.npmjs.org/ --cache /private/tmp/http-advanced-platform-npm-cache
# verify registry dist-tags and archive before creating the matching prerelease
git tag -a v2.0.0-alpha.6 "$releaseCommit" -m 'Homebridge HTTP Advanced Platform 2.0.0-alpha.6'
git push origin refs/tags/v2.0.0-alpha.6
gh release create v2.0.0-alpha.6 --repo shanemcw/homebridge-http-advanced-platform \
  --verify-tag --prerelease --title 'Homebridge HTTP Advanced Platform 2.0.0-alpha.6' \
  --notes-file maintenance/platform-release/GITHUB-PRERELEASE.md \
  "$releaseArchive" "${releaseArchive}.sha256"
```

Stop at public-installation acceptance. Production backup/deployment/live soak,
Homebridge verification and incorporating parent fixes are subsequent milestones.
Keep release copy factual and preserve lineage; no announcement or maintainer
message is included in this scope.

Policy references: [npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish/),
[npm dist-tags](https://docs.npmjs.com/cli/v11/commands/npm-dist-tag/),
[GitHub repository rename](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository).
