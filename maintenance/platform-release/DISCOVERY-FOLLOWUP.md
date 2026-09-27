# Alpha.7 search metadata and README follow-up

Recorded 2026-09-26. Milestone 4c has a validated local candidate; CI, publication
and public discovery acceptance remain pending. Alpha.6 is already public.

## Scope and public wording

The user approved strengthening functional discovery and packaging the npm README
correction as a new Alpha. This changes version metadata and public documentation,
with a repository-only correction to an intermittent timing assertion. No runtime
refactor, dependency update, parent issue/PR fix or production operation is included.

Description:

> Connect HTTP/HTTPS devices and REST APIs to HomeKit with JSON/XML mapping,
> polling and shared cached reads. A platform conversion of staromeste's
> homebridge-http-advanced-accessory with support for existing accessory configurations.

The 20 npm keywords include the required `homebridge-plugin`, retained `supports-hap`
and parent package name, plus `homebridge`, `http`, `https`, `rest`, `api`, `json`,
`xml`, `jsonpath`, `xpath`, `polling`, `advanced`, `platform`, `accessory`, `homekit`,
`cache`, `switch` and `sensor`. The matching GitHub description/topics will be
applied after candidate CI passes. The README introduces functionality before
the retained platform-conversion lineage and original contributor/license credit.

## Reviewed artifact and local checks

- Candidate: `homebridge-http-advanced-platform@2.0.0-alpha.7`.
- Archive: `/Users/shanemcw/Downloads/http-advanced-platform-alpha7-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.7.tgz`.
- 56 files, 69764 compressed bytes.
- SHA-256: `7cc5ae503b7ca68739113b92d2bf2dd0d478b5c72003eb6e6b4fc5db267a42fc`.
  The sibling `.tgz.sha256` records this reviewed artifact.
- Exactly five distributed files differ from published Alpha.6: `package.json`,
  `README.md`, `docs/alpha-release-notes.md`, `docs/migration.md` and
  `docs/modernization.md`. Only version, description and keywords differ in the
  manifest; dependency declarations, engines and other manifest fields match.
- All runtime, source-map, custom UI, schema, sample and license bytes match
  Alpha.6. Relative packaged documentation links resolve. Both preserved earlier
  archives and their release tags remain unchanged.
- Node 24.21.0 / Homebridge 2.4.0 typecheck, lint and 98/98 source tests passed.
- Expanded actual Homebridge UI 5.29.0 metadata/chooser acceptance passed 3/3,
  including REST/API, JSONPath/XML/XPath, polling and HTTP switch/sensor terms.
  Registry data is synthetic; this establishes matching when the candidate is
  returned, not public indexing, ranking or full browser installation.
- Node 22.23.3 / Homebridge 1 settings tests passed 8/8 in each of three concurrent
  runs after the timing assertion correction.
- Fresh production-only archive installation added eight packages. All 56
  installed files match, and installed loader, loopback HTTP adapters and custom
  UI IPC passed 3/3 on Node 24/Homebridge 2.
- Production dependency audit reported zero known vulnerabilities.
- The explicit `alpha` release guard and whitespace checks passed.

## Linked CI failure

The user's [linked run](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36288032783)
was on checkpoint commit `b48214f`, which changed only maintenance reports.
Node 22/Homebridge 1 failed the existing shared-timeout/spacing test at its
server-receive timestamp assertion; the other three jobs and the identical
commit's [main run](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36288032691)
passed. Rerunning the failed job without changing that commit passed (attempt 2).

The candidate test now records coordinator execution starts instead of comparing
server arrival times, which include connection delays. It retains the same
80 ms configured spacing and 70 ms assertion threshold, verifies the forwarded
delay, and retains shared timeout rejection, successful explicit-timeout override
and unchanged configuration checks. The successful unchanged rerun establishes
intermittency, not the exact CI timing cause. No production code was altered.

## Publication and remaining public gates

1. Commit the reviewed candidate, push the public branches and require all four
   compatibility jobs to pass before publication.
2. Apply the reviewed GitHub functionality description/topics; preserve fork parent,
   existing history, original npm package and Alpha.5/Alpha.6 tags/artifacts.
3. Publish this exact archive with explicit `--tag alpha --access public` and any
   required user-completed npm browser authentication. Preserve the stable-release
   guard. Under the already-approved required-tag policy, align the existing
   `latest` pointer with the reviewed Alpha.7 so default metadata/README do not
   remain on Alpha.6; this version remains a prerelease.
4. Verify exact metadata, tags, archive checksum, packaged and public README;
   install the published exact version and repeat installed acceptance. Create
   the matching GitHub prerelease at the reviewed candidate commit with archive
   and checksum, using [ALPHA7-PRERELEASE.md](ALPHA7-PRERELEASE.md).
5. Recheck actual npm/Homebridge UI search inputs for HTTP Advanced/accessory,
   REST/API, JSON/XML mapping, polling, switch and sensor terms. Record search
   inclusion and ranking accurately; do not infer it from metadata alone.

The npm API [metadata specification](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#package)
describes the public package README as the `latest` version's README. All source
and packaged copy clearly identifies this as an Alpha without a stable release.
Before Alpha.7 publication, the checked public descriptive results did not include
Alpha.6. Exact-name native UI lookup/install was accepted in milestone 4b.

Paired Apple Home and production soak remain milestone 5; verification remains
milestone 6. No monitor, announcement or maintainer message is part of this work.
