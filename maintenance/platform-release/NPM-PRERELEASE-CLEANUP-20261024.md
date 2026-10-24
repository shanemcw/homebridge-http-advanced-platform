# npm prerelease retirement - October 24, 2026

The maintainer requested removal of obsolete npm Alpha/Beta versions. Verified
local archives were retained before unpublishing six exact platform versions:

- 2.0.0-alpha.6
- 2.0.0-alpha.7
- 2.0.0-alpha.8
- 2.0.0-alpha.9
- 2.1.0-beta.1
- 2.1.0-beta.2

Post-operation public registry verification shows only stable 2.0.0 and 2.1.0.
All six retired tarball URLs return HTTP 404, both stable tarballs return HTTP
200, and the sole dist-tag is latest=2.1.0. GitHub release records were retained.
The 2.2.0-beta.1 candidate was not published, and no running installation changed.

The package had one maintainer, zero listed dependents and fewer than 300 weekly
downloads during preflight. npm accepted each exact-version unpublish following
its security-key verification. No package-wide unpublish or force option was used.
Version retirement is permanent under npm's policy; retained archives provide
local installation/rollback material without reusing retired registry versions.

The README and current guide now describe the remaining public versions and
tags. Historical release notes explicitly identify retired download instructions.
