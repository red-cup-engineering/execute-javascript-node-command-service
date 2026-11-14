import { canonicalizeJson } from "@red-cup-engineering/json-engineering-services-section/canonical-json";
import { defineType, admit } from "@red-cup-engineering/signcell/type-system";
import inputSchema from "../data/records/schema/execute-javascript-node-command.input.schema.json" with { type: "json" };
import outputSchema from "../data/records/schema/execute-javascript-node-command.output.schema.json" with { type: "json" };

function contract(name, schema) {
  const result = defineType({ id: name, name, description: name, schema, parents: [] });
  if (!result.ok) throw new TypeError(result.refusal.message);
  return result.value;
}
const requestType = contract("JavascriptNodeCommandExecutionRequest@1", inputSchema);
const receiptType = contract("JavascriptNodeCommandExecutionReceipt@1", outputSchema);

function receive(type, candidate) {
  // The JSON owner snapshots inert values and refuses accessors/lossy carriers
  // before the type owner reads fields. No caller object is retained for spawn.
  const value = canonicalizeJson(candidate).value;
  const result = admit(type, value);
  if (!result.ok) throw new TypeError(result.refusal.issues.map(issue => `${issue.path || "/"} ${issue.message}`).join("; "));
  return value;
}

/** Admit the current executor's exact data request before any native effect.
 * Policy and operator authority are not invocation fields. */
export function admitExecutionRequest(candidate) {
  return receive(requestType, candidate);
}

/** Retain actual native observations without inferring success, rollback,
 * descendant quiescence, or authorization from a receipt. */
export function projectExecutionReceipt({ request, result }) {
  return receive(receiptType, {
    type: "JavascriptNodeCommandExecutionReceipt", version: 1, request, result,
  });
}
