# Branch archive — 2026-10-04

The maintained project is `shanemcw/homebridge-http-advanced-platform`.
Contribution and maintainer-announcement plans for the original accessory
repository are retired. The local `upstream` remote is removed; original
licensing, attribution and source history remain intact.

## Preserved history

| Removed local branch | Preserved tag | Commit |
|---|---|---|
| `master` | `archive/2026-10-04/legacy-master` | `ec6e666b006b8b7d41280f7eeaf2409f69c824d9` |
| `prepare-alpha5-upstream` | `archive/2026-10-04/alpha5-upstream-preparation` | `b010d32225669fefc09b83cc563c51f247e66b77` |
| `archive/alpha1-preparation-20260918` | `archive/2026-09-18/alpha1-maintainer-prep` | `45bc4169c8c123b83df664a100be358b01137b9b` |
| `archive/alpha5-preparation-20260918` | `archive/2026-09-18/alpha5-maintainer-prep` | `2b70a87cfdc152a51f68c133864d0987d965790c` |
| `alpha5-preserved`, `modernization-alpha5` | `v2.0.0-alpha.5` | `e85f4324bb06dd12d5ce808f11480b886b855d14` |

All these tag targets are retained on the owned GitHub repository before their
local branches are removed. `alpha9-multiservice` and
`package-http-advanced-platform` are already ancestors of `main`.

The remote `fix/service-inventory-test` branch was merged through PR #7. Its
combined `test/adapters.test.mjs` content is identical to the released `main`
content, although the original two commit IDs differ from the squash merge.
The branch was removed only after verifying its tip remained
`f364eb337788be83f71274095cd73072791dad16`.

## Useful follow-up work

- `1c158c6cdf9e80a28a0d7ffa67e8dd27067087c0` strips all configured headers
  after a redirect to another origin, including custom API-key headers. The
  published `2.0.0` strips Authorization, Cookie and Host but still forwards
  other configured headers. Carry this hardening and its regression coverage
  into the platform's next functional version.
- `docs/http-command-proposal.md` at the preparation archive tip describes an
  optional per-action command mode. Individual button presses should avoid
  target-value debouncing, retain ordering and delivery bounds, and avoid
  treating an increment/toggle code as observed state. This is a design
  proposal, not an implemented feature at that archived checkpoint. Any further
  development belongs to the owned platform project.
- The old timing-test replacement is superseded by the current test, which
  checks real coordinator execution spacing. The package allowlist and legacy
  example work are largely superseded by stable packaging and the current
  configuration guide. Repository metadata changes aimed at the original
  maintainer are obsolete.

The legacy `master` tip is a 2022 merge preserving DisplayName and JSON error
handling history. It is retained for provenance, rather than merged again.
