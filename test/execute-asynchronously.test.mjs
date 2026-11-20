import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getEventListeners } from "node:events";
import { executeJavascriptNodeCommandAsynchronously } from "../scripts/execute-javascript-node-command-asynchronously.mjs";

const request = arguments_ => ({ type: "JavascriptNodeCommandExecutionRequest", version: 1,
  command: process.execPath, arguments: arguments_, directory: tmpdir(), environment: null, input: null });

test("an already ended caller cannot start its command", async t => {
  const root = await mkdtemp(join(tmpdir(), "command-preabort-")); t.after(() => rm(root, { recursive: true, force: true }));
  const controller = new AbortController(), reason = new Error("original customer ended"), marker = join(root, "started");
  controller.abort(reason);
  assert.throws(() => executeJavascriptNodeCommandAsynchronously(request(["-e", `require('node:fs').writeFileSync(${JSON.stringify(marker)},'started')`]), { signal: controller.signal }), error => error === reason);
  await assert.rejects(access(marker), { code: "ENOENT" });
});

test("in-flight cancellation receives actual child exit and captured output", async t => {
  const root = await mkdtemp(join(tmpdir(), "command-abort-")); t.after(() => rm(root, { recursive: true, force: true }));
  const marker = join(root, "started"), controller = new AbortController();
  const result = executeJavascriptNodeCommandAsynchronously(request(["-e", `process.stdout.write('original-output');require('node:fs').writeFileSync(${JSON.stringify(marker)},String(process.pid));setInterval(()=>{},1000)`]), { signal: controller.signal, outputLimit: 4096 });
  const until = Date.now() + 5000;
  let pid;
  while (Date.now() < until) { try { pid = Number(await readFile(marker, "utf8")); break; } catch (error) { if (error.code !== "ENOENT") throw error; await new Promise(resolve => setTimeout(resolve, 10)); } }
  assert.ok(pid > 0, "the original child reached its command");
  controller.abort(new Error("original customer ended"));
  const receipt = await result;
  assert.equal(receipt.result.status, null);
  assert.equal(receipt.result.signal, "SIGKILL");
  assert.equal(receipt.result.stdout, "original-output");
  assert.equal(receipt.result.error, "cancelled by caller");
  assert.throws(() => process.kill(pid, 0), { code: "ESRCH" });
  assert.equal(getEventListeners(controller.signal, "abort").length, 0);
});

test("a received successful command keeps its original result after later caller cancellation", async () => {
  const controller = new AbortController();
  const receipt = await executeJavascriptNodeCommandAsynchronously(request(["-e", "process.stdout.write('complete')"]), { signal: controller.signal });
  controller.abort(new Error("later caller cancellation"));
  assert.deepEqual(receipt.result, { type: "JavascriptNodeCommandExecutionResult", version: 1, status: 0, signal: null, stdout: "complete", stderr: "", error: "" });
  assert.equal(getEventListeners(controller.signal, "abort").length, 0);
});

test("the existing timeout still reports its original command observation", async () => {
  const receipt = await executeJavascriptNodeCommandAsynchronously(request(["-e", "setInterval(()=>{},1000)"]), { timeoutMilliseconds: 50, outputLimit: 4096 });
  assert.equal(receipt.result.signal, "SIGKILL");
  assert.equal(receipt.result.error, "timed out after 50 ms");
});
