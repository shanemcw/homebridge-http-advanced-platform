# Alpha.6 isolated installation acceptance

Checkpoint: 2026-09-26. Milestone 3a complete; milestone 3b remains pending.
Candidate source: `fe5adb0`, based on preserved Alpha.5. This acceptance work
changes no distributable files and does not require rebuilding the candidate.

## Artifact and isolated installation

- Package: `homebridge-http-advanced-platform@2.0.0-alpha.6`.
- Archive:
  `/Users/shanemcw/Downloads/http-advanced-platform-alpha6-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz`.
- Verified SHA-256:
  `899161d4e5a8a83e3941b06636b9bd75c34e98dbad1dbcdd00c261650e32bc22`.
- Installed with `--omit=dev --ignore-scripts --no-audit --no-fund`, using a
  temporary npm cache and a fresh prefix under
  `/private/tmp/http-advanced-platform-acceptance-20260926/installed`.
- Eight installed packages: the plugin, plugin-ui-utils, xmldom, jsonpath-plus,
  xpath, jsep and its assignment/regex plugins. No Homebridge, historical test
  fixture, request or polling-to-event dependency was installed with the plugin.
- A separate `npm audit --omit=dev` reported zero known vulnerabilities.
  This registry advisory result is time-specific and is not a security audit.

## Runtime and installed-package results

| Runtime | Homebridge | Source regression suite | Installed-package acceptance |
| --- | --- | --- | --- |
| Node 22.23.3 | 1.11.4 | 98/98 passed | 3/3 passed |
| Node 22.23.3 | 2.4.0 | 98/98 passed | 3/3 passed |
| Node 24.21.0 | 1.11.4 | 98/98 passed at milestone 2 | 3/3 passed |
| Node 24.21.0 | 2.4.0 | 98/98 passed at milestone 2 | 3/3 passed |

Node 22 typecheck and lint also passed. Its official darwin-arm64 binary was
downloaded from `https://nodejs.org/dist/latest-v22.x/`, verified against the
published SHASUMS256 manifest, and extracted only under the temporary acceptance
directory. The installed system Node runtime was not changed.

The reusable `installed-smoke.mjs` exercises the installed tarball rather than
the checkout's build output. Homebridge host APIs and sanitized loopback helpers
come from the development checkout, outside the plugin's production dependency
tree. Its three checks cover:

1. Loading the installed ESM entry through Homebridge's actual Plugin class and
   registering both aliases with the new package name.
2. Package-qualified constructor lookup plus actual getter/setter requests from
   both installed adapters against separate loopback fixture devices.
3. Installed schema metadata and the official custom UI IPC server loading and
   saving qualified accessory/platform definitions, preserving bridge fields,
   existing accessory definitions and unrelated settings.

The full source regression matrix additionally exercises the actual Homebridge
cached-plugin reassociation and real UUID/AID/IID preservation after package rename.

To repeat installed acceptance with an available Node binary, from the repository:

```sh
HTTP_ADVANCED_INSTALLED_ROOT=/private/tmp/http-advanced-platform-acceptance-20260926/installed/node_modules/homebridge-http-advanced-platform \
HB_TEST_VERSION=1 \
node --test maintenance/platform-release/installed-smoke.mjs
```

Repeat with `HB_TEST_VERSION=2` and each supported Node major. Local run logs are
under `/private/tmp/http-advanced-platform-acceptance-20260926/`; temporary files
may expire, so this report and harness retain the reproducible acceptance record.
The harness/report are outside the package allowlist and are not distributed.

## Milestone 3b remaining gates

- Actual Homebridge UI rendering and native per-accessory JSON editing. Schema
  checks and custom UI IPC round-trips do not establish browser acceptance.
- Managed child-bridge creation and restart with the installed new package,
  explicit package prefixes and plugin allowlists/disabled lists.
- Backed-up package replacement and rollback rehearsal in an isolated fixture.
- Installed restart/cache restoration and identity verification across that
  complete lifecycle. Source API/HAP regression coverage remains distinct.

Do not mark milestone 3 complete or start public launch solely from these results.
Actual Apple Home pairing, scenes, physical devices and live soak remain separate
production acceptance. Public registry indexing and Alpha-tag install/search
behavior remain launch gates. No production access, restart, publication, push,
repository rename or remote setting change was performed.
