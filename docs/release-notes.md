# Homebridge HTTP Advanced Platform 2.1.0-beta.1

Beta release for a week of household testing before stable promotion.
Select **beta** or **v2.1.0-beta.1** in Homebridge UI **Manage Version**, or install
`homebridge-http-advanced-platform@2.1.0-beta.1` in your existing plugin location.
npm **latest remains 2.0.0**. This package is not yet Homebridge-verified.

## Changes

- Correct the configuration schema to identify the `HttpAdvanced` platform and
  describe a platform at its root, addressing the failed automated verification
  check. Existing `HttpAdvancedAccessory` configurations remain supported.
- Add expandable legacy accessory JSON editors and add/remove controls to
  **Plugin Config**. Native **JSON Config** manages platform definitions; Plugin
  Config brings legacy accessories, shared settings and optional platforms
  together. Opening the UI does not migrate or rewrite configuration.
- Use title case for headings and buttons, and sentence case with a colon for
  field labels. Buttons retain title case under the Homebridge theme.
- Remove all configured headers and device Basic Auth when GET/HEAD requests
  redirect to another origin. Same-origin redirects retain them.

## Before Installing

Make a full Homebridge backup. Keep existing accessory names, aliases, storage
and bridge assignments unchanged. This update does not require converting
legacy accessories into platform devices.

**Redirect compatibility:** an origin changes when the scheme, hostname or port
changes. A redirected endpoint on another origin will no longer receive custom
API-key headers, cookies or authentication from the starting endpoint. If that
trusted final endpoint needs configured headers or authentication, configure
its URL directly.

Users replacing the original `homebridge-http-advanced-accessory` package must
follow the [migration guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0-beta.1/docs/migration.md).
Do not load both packages together because their registered aliases overlap.

## Validation and Beta Coverage

The candidate is checked on Node 22 and 24 with Homebridge 1 and 2, with fresh
production-dependency package installation and custom UI checks. The local
development build restored all 44 legacy device getters, retained configuration
and cached accessory identities, and received household-owner confirmation that
Apple Home displayed state and physical control worked correctly.

Household testing covers legacy Switch accessories. Optional platforms,
additional services and new mapper modes have automated and isolated coverage.
Verify your own devices, scenes and automations after updating. Individual
per-action command handling remains planned and is not included in this beta.

Stable promotion and verification resubmission will follow a successful week of
beta testing. See the [full changelog](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/v2.1.0-beta.1/CHANGELOG.md).
