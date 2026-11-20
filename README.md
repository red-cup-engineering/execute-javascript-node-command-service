# execute-javascript-node-command-service

<!-- 561-group-standards:badges:start -->
[![Red Cup Engineering](https://img.shields.io/badge/561%20Group-Red%20Cup%20Engineering-c0392b)](https://github.com/red-cup-engineering)
[![License: MIT](https://img.shields.io/badge/license-MIT-c0392b)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/red-cup-engineering/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

Executes one exact typed program request without a shell and returns its complete immutable receipt; also executes a request with this process's own stdio inherited by the child for a delegate that must hand its live stdin/stdout/stderr connection straight to another program.

## Run the tests

Install the dependencies and run `npm test` on Node 24 or later. The suite
checks typed request admission, captured and inherited streams, cancellation
and timeouts. On Linux with util-linux installed, it also checks that a second
process observes a file lock until the original descriptor is released.
`npm run test:native-flock` runs those descriptor tests alone.

The asynchronous tests were recovered from published package 0.4.8. The other
contract and descriptor tests, including `test/installed-original-code-consumer.mjs`,
come from 0.4.6. To check the installed Linux entry point independently, copy
that consumer script into a project that has installed this package and run
`node installed-original-code-consumer.mjs`.

## Synchronous local execution policy

`executeJavascriptNodeCommand(request, policy)` admits the unchanged exact
`JavascriptNodeCommandExecutionRequest@1` using JSON Engine to snapshot the request and Typed Content to validate its schema and
projects the unchanged immutable `JavascriptNodeCommandExecutionReceipt@1`.
Policy is local trusted caller configuration, not request data or an additional
NDJSON operation field. The existing descriptor-inheritance proposal and its File
consumer requirements remain in `data/records/requirements-records/inherited-file-descriptors.json`.

The optional `timeoutMilliseconds` and `maximumOutputBytes` must be positive safe
integers. Unknown policy keys and malformed descriptor arrays refuse before
spawning. Omitted bounds preserve existing behavior: no timeout and unlimited
capture. `inheritedFileDescriptors` retains its existing explicit descriptor
mapping to child descriptors beginning at 3; this does not transfer ownership of
the parent's opened descriptors.

`maximumOutputBytes` maps directly to native Node `spawnSync` `maxBuffer`, with
UTF-8 decoding and no shell. Overflow terminates the direct child through native
Node semantics and produces an unsuccessful receipt containing native error and
partial diagnostic output. This is a native capture threshold, not exact-byte
truncation: chunks and multibyte decoding may exceed the threshold. Consumers must
not accept partial overflow output as a complete successful product. Success
requires status 0, null signal, and an empty error; nonzero exits, spawn errors,
timeout and overflow preserve their actual evidence. The executor does not roll
back child effects. The consumer owns any transactional rollback.

The synchronous child remains in the caller's inherited process group. No
detached group or asynchronous tail-truncating executor is substituted. Native
timeout does not prove descendant quiescence and may wait for a child that ignores
termination. Callers needing a total wall-clock bound and descendant cleanup must
retain their existing outer worker/process-group watchdog and quiescence checks.

The root module exports frozen `javascriptNodeCommandExecutionPolicy`:
`{ type: "JavascriptNodeCommandExecutionPolicyCapability", version: 1,
maximumOutputBytes: "node-spawn-sync-max-buffer", processGroup: "inherited" }`.
Before destructive preparation or execution, a bounded consumer must namespace
import and verify this capability and the execution function. Older suppliers
may silently ignore unknown policy keys; an absent or incompatible capability
therefore refuses without effects. This descriptor identifies policy semantics,
not package publication, installed provenance, authority or a completed job.

Acceptance covers successful exact-bound capture, unchanged default capture,
stdout and stderr overflow rejection with finite partial diagnostics, nonzero
exit and timeout evidence, invalid policy refusal, and descriptor inheritance.
The capability can be adopted by consumers without changing the shared request
or receipt schemas or the behavior of existing unbounded callers.

## Current typed boundary and qualification scope

The execution owner admits its current seven-field request before spawning: exact type/version, explicit nonempty command/directory, a string argument vector, null or string-valued environment, and null or string input. No implicit invocation fields or payload execution-policy fields are admitted. The shared JSON carrier first snapshots inert values without invoking accessors or coercion hooks; SignCell admits the declared schemas. Native result fields and the request values actually executed are retained in an immutable typed receipt, not converted into a success or process-quiescence claim. Environment null retains native inheritance; an explicit map replaces the captured execution environment, unchanged from the existing executor.

These are private boundaries of this actual executor, not restoration of the deleted JavaScriptNode admission/projection services or a new public command authority. The NDJSON face uses the current Function operation runtime. Synchronous local FD/capture policy, asynchronous output-tail/cancellation behavior, and inherited-stdio's distinct convenience request remain separate. The legacy isolation-specific test resolves its optional supplier only in that existing platform-qualified test; neither an isolation implementation nor stronger containment is supplied here.

Asynchronous capture retains a tail bounded in UTF-16 code units. If the left truncation boundary would split a Unicode scalar, that partial scalar is omitted; the tail can therefore contain fewer units than the limit. Ordinary native outcomes remain typed receipts. An unexpected receipt-construction failure rejects the asynchronous promise rather than escaping its completion callback or leaving the promise pending. This does not strengthen process containment.

Native source and packed receiving use genuine source/archive prerequisites. They do not establish frozen registry installation, issuance, production File acceptance, or permission to invoke commands on a managed host. Existing dependency-lock and upstream approval limits remain explicit.
