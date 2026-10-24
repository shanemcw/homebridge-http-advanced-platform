# 2.2.0 Plan: Individual HTTP Commands

Status: implemented for `2.2.0-beta.1`, October 24, 2026. Automated release
validation passed; representative physical command-device acceptance remains
pending before stable `2.2.0`. Publication evidence is recorded separately.
Package publication and production installation are separate operations.

## Outcome and scope

Each command write received by the plugin represents one intentional operation.
Three received Volume Up writes must remain three separately accounted-for
operations. A target adjustment such as brightness can still combine rapid
changes into its latest value. Queue rejection, expiry and cancellation must
produce explicit failures rather than silently dropping or replaying commands.

This release adds per-setter command behavior to both existing accessory and
platform configurations, including `additionalServices`. It does not add new
HomeKit buttons, guarantee that a controller emits repeated writes, or infer
physical completion from an HTTP acknowledgement. Custom FanIR/TVIR services,
complete television integration, constant getters, conditional action sequences,
session authentication and certificate options remain separate work.

## Configuration contract

The optional action field `writeMode` has exactly two string values:

| Value | Behavior |
|---|---|
| omitted or `"target"` | Existing target-value behavior, including the effective device/shared `setterDelay` and requested-value confirmation |
| `"command"` | Preserve each received write, bypass debounce, serialize delivery with the containing device's other writes, and use observed feedback without a requested-value hold |

The field belongs on a `urls.set…` action that binds to an exposed, writable
HomeKit characteristic. It has no device/global default and is not inherited.
Reject other values/types and placement on getters, `inconclusive` actions,
device/shared settings, or setter names that do not bind to a writable
characteristic. Report the device/service/action path without including its URL,
body, credentials or raw payload. Preserve unrelated unknown configuration fields.

Illustrative action fragment for an exposed VolumeSelector characteristic:

```json
{
  "setVolumeSelector": {
    "url": "http://device.example/volume/{value}",
    "writeMode": "command"
  }
}
```

The endpoint must accept the characteristic's values, or use existing setter
mappers to translate them. This fragment is not a complete accessory definition;
the chosen service must expose the characteristic and have its other required
configuration. Existing mapping and URL/body template semantics remain intact.
Capture the received value at admission; evaluate its mapper/template once when
the operation runs, against observed mapper state, rather than enqueue-time or
optimistic target state. A mapper failure sends no HTTP request.

For a command characteristic that is readable, require an explicit getter for
that same characteristic. Until a usable observation exists, reads report the
existing communication/not-ready error. A write-only command needs no getter.
Do not synthesize observed state for a one-way readable control in this release.

## Ordering and debounce

Enabling any command action opts the containing accessory/device into one shared
write queue across its primary and additional services. Device identity owns this
queue; neither the endpoint URL nor a service-specific configuration fingerprint
defines it. Different devices remain independent, including devices on the same
origin subject to the existing origin limits. Ordering applies within one plugin
process; duplicated definitions in other processes are not coordinated.

All writes on an opted-in device reserve their order when received. Only one
write from that device may be in HTTP delivery at a time. Existing target-only
devices retain their current scheduling and debounce behavior. Explicit
`writeMode: "target"` alone does not enable the device queue.

For opted-in devices, combine target writes only in the immediately preceding,
unsent target slot for the same action, while its debounce window remains open.
A command or different action is an ordering boundary. Never replace a target
already in HTTP delivery. A later command waits for an earlier target's debounce
and HTTP delivery, without occupying an active HTTP slot while waiting. It does
not wait for physical state confirmation.

| Received writes | HTTP delivery order |
|---|---|
| Up, Up, Up | Up, Up, Up |
| Up, Down, Up | Up, Down, Up |
| Brightness 40, Brightness 60 within debounce | Brightness 60 |
| Brightness 40, Up, Brightness 60 | Brightness 40, Up, Brightness 60 |
| Brightness 40, another target action, Brightness 60 | All three, in received order |

Command actions ignore `setterDelay`, including a positive shared default.
`uriCallsDelay` still spaces actual HTTP starts across the device's services.
Serialization and ordering boundaries are documented timing changes only for
devices that opt into command behavior; no configuration is migrated implicitly.

## Admission, deadlines and HTTP delivery

- Use the existing process-wide `coordinator.maxQueue` budget for pending network
  jobs and buffered opted-in device writes together. Reserve capacity before
  acknowledging admission; transfer each reservation into transport without
  double counting. Coalescing an existing target slot consumes no extra slot.
  Do not introduce an unbounded Promise chain or a separate queue per action.
- Start a command's absolute deadline when its setter is received, using action
  `timeout`, shared `requestTimeout`, then the current 10-second built-in default.
  Include device-queue waiting, pacing, coordinator waiting and HTTP delivery in
  that single budget; never restart it as the command advances.
- For opted-in target slots, the request budget begins when their debounce ends
  (immediately when delay is zero), and includes subsequent device/coordinator
  waiting. A later coalesced value resets only an open debounce window. Keep
  non-opted-in targets' existing timing unchanged.
- Expire buffered writes independently of queue progress. Remove an expired
  slot, release its reservation and reject it before it can enter transport.
  Recheck the deadline immediately before starting HTTP. No head-of-queue wait
  can keep later, already-expired commands alive.
- Command setters await their HTTP result; there is no debounce-style early
  success callback. Admission failure is reported immediately. Completion means
  the configured HTTP acknowledgement was accepted, not that the physical device
  completed the operation. Preserve targets' existing acknowledgement behavior.
- Commands require a 2xx HTTP response and respect an optional `responsePattern`.
  Treat explicit `strictHTTP: false` with command mode as invalid; omission uses
  strict status handling for commands. Targets retain existing status semantics.
- Do not follow redirects for commands, even when the command uses GET. A 3xx
  response fails with no request to its destination. Users can configure the
  intended final command endpoint directly. This prevents a second delivery
  after a device has already acted before returning a redirect.
- Send each command at most once. No automatic retries, reconnect replay, queue
  persistence, deduplication, or replay after restart. A timeout or abort after
  dispatch can leave physical delivery unknown and must be reported that way.

Expiry or admission rejection before dispatch affects that write only. An
execution failure at the head of a device queue cancels the writes already
waiting behind it for that device; each receives an explicit cancellation and
releases its reservation. This avoids continuing a received batch after an
uncertain operation. New writes received after failure handling are new user
intent and can be admitted normally. Other devices continue working.

Shutdown stops admission, cancels queued work, clears deadline/debounce timers,
releases reservations, settles waiting setters and aborts active HTTP requests.
Nothing survives for later delivery. Cancellation cannot undo an operation the
device already received. Record the queue cancellation policy in user guidance.

## Feedback and HomeKit state

Keep command delivery separate from `beginWrite` and target confirmation. A
command's argument is an operation code, not a requested target value. Never
place it in `pendingWrite`, mapper state, observed caches or persisted state.
HTTP success alone cannot confirm a command's resulting physical state.

Invalidate refresh generations for all getters belonging to the containing
device when a command starts and finishes. Earlier in-flight GETs must not
overwrite post-command observations. Command dispatch also retires older target
confirmation holds on that device, because a relative command may change their
result. Track received-order tokens so newer target intents are not cleared by
an older command's completion, failure or cancellation.

After command completion, make the device's getters eligible for background
refresh under normal pacing, queue limits and outage backoff. Do not block the
next command on a getter. Getter failures or `resultOnError` fallbacks cannot be
treated as command confirmation. Preserve target confirmation windows and the
rule that templates see observed mapper state rather than optimistic previews.

Homebridge may store a setter's argument when its callback resolves. For
readable command characteristics, republish their observed value/error after
that completion so the command argument cannot remain as apparent device state.
Test the actual Homebridge handler/event behavior on both supported HAP versions,
including successive identical writes and races with newer target intents.
Write-only command arguments are transient operations and are not observations.

Use bounded aggregate diagnostics for pending/completed/failed/expired/cancelled
commands and hashed device/action identifiers. Diagnostics and errors contain
no command bodies, URLs, authentication values or raw responses. Unchanged
configurations keep their existing target cache keys and persisted format;
changing an action configuration can invalidate its configuration-based cache as
it does today. Preserve registration aliases, platform UUIDs, service subtypes
and child-bridge assignments.

## Implementation milestones and remaining release work

1. Define `writeMode` in types, runtime validation and schema; resolve writable
   characteristics with the supplied Homebridge HAP registry. Cover primary and
   additional services in both adapters. Preserve UI round-trips and add clear
   validation for the new field without expanding into a general editor rewrite.
2. Implement the shared device write queue, admission reservations, ordered target
   debounce boundaries, deadlines, failure cancellation and shutdown cleanup.
   Retain coordinator fairness, pacing, concurrency and background recovery.
3. Integrate command HTTP rules and feedback handling. Keep target previews,
   observed state and command outcomes distinct, including HAP completion races.
4. Add configuration examples, compatibility notes, command diagnostics and
   regression coverage; prepare a reviewed `2.2.0-beta.1` candidate only after
   the automated acceptance below passes.
5. Validate representative controls and household regression behavior during
   beta field testing; promote to stable `2.2.0` only after recording acceptance.

Each milestone should be reviewable on its own. Package version/tag changes,
publication and deployment remain deliberate later release steps. Keep the
scope focused on this command feature and the validation/documentation it needs.

## Acceptance and release gates

| Area | Required evidence |
|---|---|
| Configuration | Omission/target equivalence; command only on bound writable setters; invalid values/scopes; readable-without-getter rejection; strictHTTP conflict; schema/runtime agreement; UI save/reload and encoded fields preserved |
| Distinct intent | Repeated identical and alternating writes arrive once each and in order; raw arguments are not deduplicated; mappings execute once against observed state |
| Mixed ordering | Every ordering example above; zero and positive device/shared delays; additional-service boundaries; an in-flight target cannot be replaced |
| Independence | A slow/debounced device does not occupy HTTP slots while parked or block another device; shared-origin limits and per-device pacing remain effective |
| Bounds and time | Combined pending count never exceeds maxQueue; capacity released once; deadline begins at receipt for commands; independent expiry, event-loop admission races and no late delivery |
| HTTP outcome | 2xx success, response mismatch, non-2xx/Retry-After, no redirect follow for GET/HEAD/POST, timeout before/after dispatch, reset/abort and zero automatic replay |
| Failure cancellation | Failed head cancels the device's waiting batch once; pre-dispatch admission/expiry rejects only its own write; new post-failure intent works; other devices continue; acknowledged targets restore observations after cancellation |
| Feedback | No command pending target or persisted code; readable state restored after HAP completion; unknown reads remain errors; overlapping GET generations, older target holds, newer intents, getter fallback and outage recovery remain correct |
| Lifecycle | Shutdown with queued/in-flight commands and debounced targets; all setters settle and timers/reservations clear; restart delivers none of the old commands; disabled/invalid platform identities remain unavailable and retained |
| Compatibility | Existing target behavior and published legacy fixtures pass; aliases, metadata, service identities, mapper/template behavior, child-bridge configuration and persistence remain compatible |
| Candidate | Node 22/24 x Homebridge 1/2 full check matrix, production dependency audit, fresh package installation/plugin loading and tarball/link review |
| Field | A controller that actually emits repeated command writes; ordered repeated/alternating physical commands; mixed target/command behavior; unavailable endpoint and restart; existing household switch/scene/voice behavior; recorded backup/rollback |

Use controlled clocks and transport stubs for ordering/deadline races, loopback
servers for HTTP behavior and real Homebridge characteristic handlers for HAP
feedback. Tests must exercise observable delivery/state results and queue cleanup,
not merely duplicate queue implementation details.

The beta must record its physical device/controller and distinguish HTTP delivery
from observed effects. A suitable representative command device is not selected
yet; selecting and testing one is required before stable promotion. Existing
switch field coverage does not establish relative-command acceptance.

## Background

This develops the earlier [individual-command proposal](development-2.1.0.md#planned-preserve-individual-http-commands)
and the broader command/IR need highlighted in
[upstream PR #55](https://github.com/staromeste/homebridge-http-advanced-accessory/pull/55).
The design uses the existing setters, shared runtime and coordinator rather than
incorporating the upstream modernization branch or adding custom IR services.
