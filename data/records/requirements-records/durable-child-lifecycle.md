Title: Proposed durable child-lifecycle contract

Status: source requirements/design proposal, not an implemented API or admission to execute.
The existing synchronous and asynchronous entrypoints retain their present contracts.
This proposal arises from a source-qualification supervisor whose output-size stat/unlink
race escaped its stop branch, leaving child lifetime and source-binding custody unknown.
A method correction or elapsed timeout cannot retrospectively settle that invocation.

### Responsibility and alternatives

This command-execution owner is responsible for any new executable launch and settlement
mechanism; the JavaScript Node section continues to own shared typed request/receipt
admission. The caller owns the authorized scope, resource reservation and original
consumer acceptance. The existing npm-workspace-publication-service source-binding
owner owns binding restoration, not process death. Its current finally unconditionally
removes recorded targets; identity-guarded crash recovery described below is a proposed
migration requirement, not a capability of the current binding implementation. Do not add lifecycle logic to
the product under qualification, a second controller, or a new work registry.

Existing synchronous spawnSync returns only after the direct child terminates; its
timeout is not a guaranteed whole-tree deadline. Existing asynchronous execution signals
a detached process group and observes child close; neither provides durable incarnation
receipts or proves death of descendants that leave that group. Inherited stdio transfers
stdio, not lifecycle custody. None can currently claim restart-safe tree settlement.
Compare reuse of a supported executor job/containment handle with a qualified platform
containment primitive before selecting an extension. A process-group-only fallback is
insufficient where escaped descendants are in scope. Unsupported platforms must refuse
that stronger profile before the consumer program executes; preserve legacy modes.

### Required state and interfaces before implementation

Use the original operation's owner-readable evidence store and allocation, not a new
registry. Define a versioned lifecycle profile at the shared contract owner, with exact
request/source identity, authority scope and bounded resources. Do not add undocumented
fields to JavascriptNodeCommandExecutionReceipt@1 or infer admission from this prose.

1. Persist prepared launch intent and recovery address before child creation. Use a
   supported gated launch: after creation, durably bind process incarnation (not just
   PID), relevant namespace/containment identity and the authorized owner handle before
   releasing the requested program. A crash between preparation and that receipt is
   unknown, not absent; require supported reconciliation before any replacement.
2. Persist running and terminal observations against that same identity. Scope settlement
   explicitly: direct child, process group or supported containment; never promote a
   weaker receipt to whole-descendant evidence. External responses and observed times
   are explicit inputs, not reproducible facts inferred from the current PID namespace.
3. All launch, monitoring, accounting, output-capture, custody and cancellation failures
   converge on the same authorized settlement path. Preserve the primary failure plus
   settlement failures. Enter settlement before fallible post-run custody checks and
   receipt formatting. Bound the settlement/evidence attempt under its owning contract;
   missing proof remains unknown, never a released allocation. A vanished ephemeral file must follow specified race-safe
   accounting; unreadable or incomplete accounting fails closed, never undercounts into
   a pass. Exception handling must not bypass settlement.
4. A signal request, timeout, missing session or parent exit is not a terminal receipt.
   Use the selected containment owner's evidence to establish death of the admitted
   scope. Persist unknown when unavailable; do not signal reused PIDs or broaden host
   inspection. Bind recovery remains held, even if the direct child exited.
5. Only after verified settlement may the original binding owner restore its recorded
   exact targets, preserving changed/concurrent targets and original backups. Record
   binding restoration separately; release the allocation only after both applicable
   conditions. Failed restoration retains ownership, never a successful receipt.

### Migration and receiving

First admit the lifecycle profile and platform contract through existing source review;
then implement at this owner and qualify its existing tests. Migrate the source-bound
qualification caller to that supported profile instead of patching its private watchdog.
Only then qualify the unchanged original consumer under its original authority. No
implementation, runtime test, cleanup, package publication or deployment is performed or
authorized by this proposal.

Required future cases: prelaunch refusal; crash before/after gated identity persistence;
monitor stat/unlink race and accounting failure; ignored termination; escaped descendants;
parent death; duplicate/reordered observations; reused PID or mismatched namespace;
restart with durable evidence; unknown original lifetime; concurrent binding replacement;
settlement or restoration failure. Verify no unauthorized signals, binding mutation or
replacement launch while unknown. A source-only review of these cases is not their
runtime qualification or the original product's receiving evidence.
