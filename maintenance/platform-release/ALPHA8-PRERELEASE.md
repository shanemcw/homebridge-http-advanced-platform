Homebridge HTTP Advanced Platform adds optional HomeKit Accessory Information
metadata in **2.0.0-alpha.8**, based on
[upstream PR #46](https://github.com/staromeste/homebridge-http-advanced-accessory/pull/46).

- Legacy accessories now honor configured `manufacturer`, `model` and
  `serialNumber`. When absent, the values retain their previous defaults.
- Platform devices continue to honor manufacturer and model and can now set a
  separate `serialNumber`. Their stable `id` and generated HomeKit UUID do not
  change.
- HTTP actions, caching, aliases, dependencies and supported runtimes are
  unchanged. No other upstream PR is included.

Install **`homebridge-http-advanced-platform@2.0.0-alpha.8`** or choose the
**alpha** row or exact Alpha.8 version under **Manage Version** in Homebridge UI.
This is a prerelease without Homebridge verification; npm's required `latest`
tag can also point to an Alpha. The original accessory package is separate.

The reviewed archive contains 56 files. SHA-256:
`bcc529d9ffbe0175fc3f7f00d1278f66721f37ddcad890fb7cdb47a7953ac3c4`.
Local typecheck, lint and 99 source tests pass; the production dependency audit
reports zero known vulnerabilities. The 56-file archive comparison with Alpha.7
found only metadata runtime, schema, sample and documentation changes.

Before updating an existing Homebridge installation, back it up and follow the
[migration guide](https://github.com/shanemcw/homebridge-http-advanced-platform/blob/main/docs/migration.md).
Check Apple Home states, physical controls and automations after installation;
package and UI checks do not establish those live results. Report only sanitized
diagnostics, without credentials or pairing data.
