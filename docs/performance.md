# Measuring latency, freshness and backend load

## Reproducible fixture

Run `npm run benchmark -- --save` from the source checkout. It uses real HAP serialization and a loopback backend that serializes 50 ms responses, modeling a single-command backend. It never contacts field devices.

The baseline reads the on-demand entries in a synthetic fixture. Explicit
polling intervals are covered separately. The cached implementation warms the
fixture before serializing HAP state. Acquisition is separated from measurement
so network requests caused by the bulk read can be attributed correctly.
Timings are diagnostic rather than portable performance guarantees.

A local benchmark result records bulk-read time, getter requests, refresh time,
cache age, request latency, queue pressure, concurrency and failures. Inventory
sizes are omitted from the checked-in summary. Cache age at the end of a sweep
does not establish sustained field freshness.

## Actual Homebridge measurements still required

On a backed-up Alpha test installation, use the existing Homebridge UI/API session to time repeated `/accessories` requests. Keep authorization in the existing client; never paste headers into commands or logs. Capture baseline and Alpha on the same host with comparable load.

Record:

- `/accessories` median/p95/max wall time, including warm and restart cases;
- external reader end-to-end time and successful parsing;
- backend request counts and maximum concurrency during bulk reads;
- cache-age median/p95/max from periodic plugin debug snapshots;
- getter request-duration median/p95/max and error/timeout counts;
- sustained request rate from the difference in cumulative `requests.started` divided by elapsed seconds;
- elapsed time until every getter has completed one successful refresh after startup;
- whether devices with explicit polling intervals retain the expected freshness;
- normal writes, delayed writes and recovery after a backend outage.

Debug snapshots expose per-action hashes for correlation without exposing endpoint names or payloads. `age` is time since last successful HTTP acquisition. Fallback values do not reset that timestamp. An unknown entry has `age: null`. The bounded duration sample holds the most recent 2048 requests.

If an external reader adds orchestration or polling delay, measure that separately. Do not attribute an end-to-end improvement to the plugin without isolating its contribution.

Approve default cadence based on actual freshness and sustained load. If a full sweep is slower than the desired interval, reduce workload or deliberately tune the shared concurrency for the backend; do not simply remove the bounds. Avoid changing existing explicit polling intervals unintentionally.

## Measurement caveat

Homebridge/HAP may reuse a recent `/accessories` snapshot. Space repeated measurements beyond the installed implementation's reuse window and record versions so snapshot reuse is not mistaken for a plugin improvement.

A controlled field performance comparison for this packaging candidate remains pending. Synthetic timings are not live-device measurements.
