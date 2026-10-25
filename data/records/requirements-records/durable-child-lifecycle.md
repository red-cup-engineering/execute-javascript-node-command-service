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

## Component contract refinement: owner-mediated gated invocation

Status: detailed source design candidate. Review of this document accepts its stated
requirements and boundaries for source continuation only; no platform profile or API
is installed, and no original process history is reconstructed.

### Source comparison and selected responsibility

The current shared request admission rejects extra keys; the receipt projector admits
only request plus direct-child result. Preserve both version-1 contracts unchanged:
[request admission](https://github.com/red-cup-engineering/javascript-node-engineering-services-section/blob/3264d2b886c5a4a05fffa857c47e1b196a6e09b0/scripts/admit-javascript-node-command-execution-request.mjs),
[receipt projection](https://github.com/red-cup-engineering/javascript-node-engineering-services-section/blob/3264d2b886c5a4a05fffa857c47e1b196a6e09b0/scripts/project-javascript-node-command-execution-receipt.mjs).
The existing isolation transformer constructs a sandbox request, not an authoritative
launch/settlement receipt. The command owner's synchronous and asynchronous operations
are still usable at their actual weaker scope, never advertised as this profile.

Select composition with the existing installed job/supervision owner, not another
watchdog in this package. That owner must independently qualify an exact declared job,
surviving manager, immutable per-invocation identity and scope observation. Its ordinary
start acknowledgement or last-job receipt is not sufficient. The command executor owns
the finite gated executable and lifecycle projection; the existing job owner owns
manager interaction and recovery; the shared JavaScript Node owner owns admission of
the proposed additional envelope/evidence schema; the existing file owner owns durable
writes and conditional custody; the publication-service owner owns binding recovery.
The trusted consumer selects its existing owner/runtime and allocated evidence location.
The job remains an already admitted, installed declaration with a fixed artifact and
allowed effects/resources. It must explicitly admit this exact qualification request;
this design cannot submit arbitrary command text to a job, create a job declaration,
install an artifact or convert a logical job identity into a remote shell. An absent
installed job/profile mapping is an admission gap, not permission to fabricate one.
No caller-supplied wire JSON may install a manager, filesystem root, credential or policy.

Rejected alternatives: extend spawnSync timeout (no durable controller-loss evidence);
extend process-group kill (escape/reparenting remains); rely on sandbox command flags
(no witnessed establishment or later reachable owner); start an ad hoc persistent
monitor (duplicates the existing job owner and needs new deployment authority).
An installed manager profile is a conditional design selection, not a claim the present
VM exposes one. Without its separately admitted capabilities, refuse before launching.
Do not retrofit an unmanaged historical invocation into a newly assigned job identity.

### Trust and capability boundary

A proposed profile is a separately versioned shared contract, not extra fields added to
the existing request. It binds the unchanged exact command request digest, source and
artifact identities, logical admitted job, original allocation/revision, evidence-store
identity, deadline/output bounds, binding-owner inventory digest and required scope.
Opaque operation keys are supplied by the existing allocation/idempotency owner; this
document allocates none. Hashing environment/input is not permission to publish them.
Keep raw private input at its current custodian; receipts contain only authorized
references and classified diagnostics.

Before the first effect, the selected private runtime must provide exact-version evidence
for all of: durable conditional writes; once-only claim for this allocation; gated
program startup; recovery address surviving caller loss; invocation identity immune to
unit/PID reuse; approved full-scope containment; bounded stop/reconcile; and independently
readable terminal evidence. A capability declaration alone is not qualification.
Discovery must be inert and preserve a refusal; no local fallback or new host registration.

The following logical operations are proposed component obligations, not callable APIs:
prepare(intent, expectedRevision), read(operationKey), release(gatedEvidence,
expectedRevision), settle(operationKey, expectedRevision, reason), and readSettlement.
Their final schema and mapping onto existing owner operations require shared-owner
admission. They never accept bare PIDs as cancellation authority. Required outputs carry
the same operation key/request digest, owner revision, monotonically ordered transition,
original authority reference and observed evidence identity. Every response has one of
confirmed, refused, or unknown disposition; no nullable success shorthand.

### State transitions and linearization

| Durable state | Permitted next effect | Required evidence and refusal |
| --- | --- | --- |
| Unprepared | prepare | All authority, scope, bounds and custody checks passed; durable intent precedes creation. |
| Prepared | owner creates gated invocation once | Conditional owner claim prevents duplicate launch; lost create response becomes Unknown. |
| Gated | release exact requested program | Actual invocation/boot-or-manager incarnation, relevant namespace/containment identity, request digest and durable recovery address recorded before release. |
| Running | observe or settle | Program release acknowledgement retained; a lost acknowledgement is Unknown, never a second release or replacement. |
| Settling | reconcile existing scope | Primary error preserved; approved manager stop is requested against exact incarnation only. No binding cleanup. |
| Settled | original binding-owner recovery | Authoritative terminal scope evidence and unchanged identity; direct child result remains separate. |
| BindingsRestored | release allocation | Exact restoration receipt and any remaining custody checks complete. |
| Unknown | read/reconcile original owner only | Preserve last confirmed state, unresolved effect and ownership; no replay, cleanup or replacement. |

Refused-before-effects is terminal only when the owner proves no invocation was created.
Unknown is an observation disposition retaining the last durable transition, not a
replacement operation key. A late authenticated observation may resolve it; timeout
cannot. Terminal process failure can still settle correctly but cannot become a product
pass. A successful direct-child receipt with unknown descendants remains unreceived.

Preparation and gated identity require actual durable acknowledgement from the file/job
owners, including their crash-consistency contract, before the next effect. Atomic
rename alone is not a power-loss guarantee. If persistence fails after creation, do not
release the gate; the manager owns bounded settlement and retained recovery evidence.
If the caller disappears, the manager's admitted policy closes an unreleased gate and
settles its scope; this guarantee must survive caller loss and itself be qualified.
The controller must not depend on a callback finally to retain that guarantee.

On restart, read the existing operation identity and manager incarnation first. A stale
revision refuses a new mutation without changing state. Identical duplicate requests
return/reconcile the original result; same key with different request/scope refuses.
Out-of-order observations cannot regress the durable revision or replace a terminal
incarnation. Contradictory authenticated evidence marks Unknown and retains both inputs.
Retries are bounded reads or explicitly idempotent same-owner effects only; never reset
a retry budget on restart or issue a new allocation to evade uncertainty.

### Scope attestation and binding handoff

An acceptable terminal observation names the original containment and invocation,
confirms no admitted consumer descendants remain, and excludes further consumer program
release under the same invocation. Reused unit names, an empty new namespace, manager
disconnection, job ACK, inactive state alone, missing unit, or a signal acknowledgement
cannot attest that predicate. A manager reboot without retained original terminal
evidence remains Unknown unless the admitted platform contract separately proves the
entire original scope died and cannot resume. No broader process inventory is implied.

A possible Linux service-manager profile must qualify its actual installed version,
non-escape containment, stop configuration and per-invocation evidence retention.
Official [systemd service](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html)
and [kill semantics](https://www.freedesktop.org/software/systemd/man/latest/systemd.kill.html)
distinguish startup acknowledgement, stop processing and group termination; these
reference documents do not attest an installed configuration or historical invocation.
The final observer cannot claim an empty whole unit while its own post-stop recorder is
still a member: define the consumer scope separately or obtain manager evidence after
that recorder exits. Never exclude a consumer descendant merely by calling it a recorder.
Any escape capability, incomplete observation or unqualified platform refuses this profile.

The proposed binding-owner handoff includes exact inventory and original target/backup
identities plus settlement evidence, not a generic cleanup flag. Restoration must use
the existing file owner's qualified conditional custody/lease mechanism so a check-then-
remove race cannot delete a concurrent replacement. Missing guarded restoration support
leaves Settled with bindings held. Do not implement that mechanism in this executor.
No callback exit authorizes current unconditional source-binding cleanup for this profile.
Migration must first teach the binding owner to defer restoration until this handoff;
preserve legacy behavior for callers that do not opt into this stronger profile.

### Failure accounting and implementable receiving sequence

For output monitoring, define which owner counters or exact allocation bounds supply the
resource predicate. If snapshot scanning is retained, a disappeared ephemeral file may
be ignored only when the specified metric is current retained bytes and all enumeration
and persistence races are covered by a proven reservation bound; it cannot estimate
historical peak. Permission/I/O errors and incomplete scans enter settlement. Do not
adopt a generic catch-and-zero patch. Cleanup/reporting errors are secondary evidence,
never allowed to skip settlement or overwrite the initiating failure.

Next source steps: admit the shared envelope/evidence schema without changing v1;
qualify the selected job owner's gated lifecycle and durable evidence capability;
specify/receive conditional binding-owner restoration; then implement executor projection
and migrate the original consumer. No platform available today is asserted to satisfy
this profile. VM-only local supervision stays unsupported for the stronger guarantee.

Future qualification matrix must exercise each row before and after its durable write,
lost create/release/stop responses, repeated keys, changed digests, stale revisions,
out-of-order and contradictory observations, caller/manager loss, ignored termination,
descendant escape attempts, recorder lifetime, reused identities, accounting races,
evidence-write failure and concurrent target replacement. For every refused/unknown case
verify no extra program release, signals to unrelated incarnations, binding mutation or
allocation release. Only after those owner cases and original lifetime reconciliation
may the unchanged original consumer be run within its independent authority.
