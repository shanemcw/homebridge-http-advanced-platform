# Alpha.7 search metadata and README follow-up

Recorded 2026-09-26 (America/New_York). Alpha.7 publication, public README and
exact-version installation are accepted. The functional keywords are indexed;
ordinary descriptive search inclusion remains an open acceptance gate.

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
`cache`, `switch` and `sensor`. The matching GitHub description and 19 topics are
applied (all keywords except `supports-hap`). The README introduces functionality
before the retained platform-conversion lineage and original contributor/license credit.

## Reviewed artifact and local checks

- Published: [homebridge-http-advanced-platform@2.0.0-alpha.7](https://www.npmjs.com/package/homebridge-http-advanced-platform).
- Reviewed release commit: `3ff8a7ea39c757b4148cbce578f363b9a449cd33`, pushed to
  `main` and `package-http-advanced-platform`.
- Annotated `v2.0.0-alpha.7` resolves to that commit. The matching
  [GitHub prerelease](https://github.com/shanemcw/homebridge-http-advanced-platform/releases/tag/v2.0.0-alpha.7)
  is public, not a draft and not designated GitHub's latest release.
- Archive: `/Users/shanemcw/Downloads/http-advanced-platform-alpha7-launch-20260926/homebridge-http-advanced-platform-2.0.0-alpha.7.tgz`.
- 56 files, 69764 compressed bytes.
- SHA-256: `7cc5ae503b7ca68739113b92d2bf2dd0d478b5c72003eb6e6b4fc5db267a42fc`.
  The registry download and GitHub archive asset both match. The sibling
  `.tgz.sha256` is attached to the prerelease too.
- npm integrity: `sha512-ocYFAXYgGrr8g+Uxgg+Frhzsu8YWAmhKWWBdE6lq0nxXg70meJmlvOqvNZd5k9rB/eqTzl9eLBRMyQDapbtADw==`.
- Exactly five distributed files differ from published Alpha.6: `package.json`,
  `README.md`, `docs/alpha-release-notes.md`, `docs/migration.md` and
  `docs/modernization.md`. Only version, description and keywords differ in the
  manifest; dependency declarations, engines and other manifest fields match.
  Only the two root version fields differ in the lockfile.
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

Both release-commit CI runs passed all four Node 22/24 x Homebridge 1/2 jobs:
[main](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36289760791)
and [packaging](https://github.com/shanemcw/homebridge-http-advanced-platform/actions/runs/36289760458).
Each included typecheck, lint, 98 source tests, production audit and pack dry-run.

Fresh public exact-version installation added eight production packages. All 56
installed files match the reviewed archive; lockfile integrity matches registry
metadata. Installed loader/aliases, loopback HTTP adapters and custom UI IPC
passed 3/3 on Node 24/Homebridge 2. The public installation is at
`/private/tmp/http-advanced-platform-alpha7-registry-20260926`.

No new persistent Homebridge fixture was started. Earlier native UI/child-bridge
acceptance applies to unchanged UI/runtime bytes; it does not prove paired Apple
Home or production behavior. Transient installed-test servers exited after tests.

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

## Publication, tags and default README

The stale npm CLI login was replaced through user-completed browser login;
`npm whoami` then confirmed `shanemcw`. The user completed separate publication
authentication for the reviewed archive, published explicitly with
`--tag alpha --access public`. Initial registry processing resolved before
public installation and checksum verification.

Under the previously approved required-tag policy, the existing `latest` pointer
was aligned with Alpha.7. The CLI returned success and registry checks confirm
both `alpha` and `latest` at `2.0.0-alpha.7`, despite the user's subsequent report
that the authentication link failed. No further authentication is required for
this completed operation. No authentication link, OTP or token is recorded here.
The version remains a prerelease; the guard still rejects manual `latest`/stable
publication. The original npm package is untouched. Git history, the fork parent
and upstream-preparation work are preserved.

The actual default npm page displays Alpha.7's corrected required-`latest`
guidance, functionality-first README, lineage, exact-version examples and all
20 keywords. Public DOM evidence is saved alongside the frozen archive as
`public-npm-readme.txt`. The registry's legacy root description/keywords still
reflect Alpha.6 and its root `readme` is empty; those fields do not describe the
rendered page. Exact-version metadata and the `/latest` endpoint contain the new
description/keywords. Acceptance uses those and the actual rendered page.

## Public search observations and remaining gate

Actual npm registry search confirmed Alpha.7 with the new description/keywords
under `maintainer:shanemcw`. Both `keywords:homebridge-plugin keywords:jsonpath`
and `keywords:homebridge-http-advanced-accessory` returned only this package
(rank 1). The first keyword query also displayed the single Alpha.7 result in
the actual npm browser UI; evidence is saved as `public-npm-keyword-search.txt`.
These observations establish index inclusion of the functional and lineage
keywords, not ordinary free-text visibility.

The actual Homebridge UI 5.29.0 search service was exercised against the live
registry, omitting constructor timers and external provider lists. Exact new
package lookup returned Alpha.7. The ordinary query results were:

| Query | Plugin results returned | Our package present |
| --- | ---: | --- |
| HTTP Advanced | 15 | No |
| HTTP accessory | 23 | No |
| HTTP Advanced Platform | 21 | No |
| REST API | 27 | No |
| HTTP JSON | 13 | No |
| JSONPath | 0 | No |
| XML | 1 | No |
| XPath | 0 | No |
| polling | 0 | No |
| HTTP switch | 30 | No |
| HTTP sensor | 30 | No |

The npm browser's first page for `HTTP Advanced` also omitted this package.
Raw registry queries for `HTTP Advanced` and
`http advanced keywords:homebridge-plugin not:deprecated` omitted it from the
first 99 results. No ranking cause or eventual appearance date is established.
An additional maintainer-query attempt hit HTTP 429 after all service queries
completed; the earlier successful maintainer result and later successful keyword
queries establish indexing. No automatic monitor or repeated polling was set up.

Metadata, README, publication and exact installation are accepted. Ordinary
descriptive search acceptance is still open. The next discrete action is a
manual recheck of the same queries after allowing the external search service
time, recording inclusion/rank and deciding further action from that evidence.
Do not republish Alpha.7 or retag its release to perform that check.

Paired Apple Home and production soak remain milestone 5; verification remains
milestone 6. Parent issue/PR fixes follow a successful soak. No production access,
deployment, restart, announcement or maintainer message occurred in this work.
