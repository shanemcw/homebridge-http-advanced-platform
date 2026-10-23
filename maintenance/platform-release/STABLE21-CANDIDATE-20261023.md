# Stable 2.1.0 candidate - October 23, 2026

This checkpoint records local candidate acceptance before public publication.
The checks below did not install or restart a running Homebridge instance.
Public release availability must be verified separately.

## Scope

Promote the published Beta.2 runtime and editors. Release metadata selects 2.1.0
and npm latest. Current and historical documentation is sanitized: examples use
reserved domains, and private installation details and inventory are omitted.
Field acceptance is recorded only by behavior category. Homebridge verification
resubmission remains separate, and per-action command handling is not included.

## Local validation

- Locked-dependency isolated source passed typecheck, lint and 119 tests on each
  Node 22/24 and Homebridge 1/2 combination: 476 test executions.
- Fresh production-only archive installation matched all packed files. Loader,
  loopback adapters and official custom UI IPC passed on all combinations:
  12 installed smoke-test executions.
- Production dependency audit: zero known vulnerabilities.
- Runtime, UI, schema, sample and license files match the published Beta.2
  archive byte for byte. Dependencies and engine requirements are unchanged.
- Documentation review covered tracked Markdown and structured documentation;
  private-environment and inventory scans passed. Packed documentation passed
  the same checks. Relative Markdown targets and whitespace checks passed.

## Reviewed artifact

Archive: `homebridge-http-advanced-platform-2.1.0.tgz`.
SHA-256: `7bfc361ee9e8d551e4f351da7b94c27f4008eed92901745ae5beef13e23bf64e`.

## Publication gates

Commit and push the reviewed source, require the release-commit compatibility
matrix to pass, then publish the exact reviewed archive to npm latest and a
matching regular GitHub release. Verify public archive checksums, preserve the
existing prerelease channels, and check rendered Homebridge installation notes.
Package publication does not install or restart a running Homebridge instance.
