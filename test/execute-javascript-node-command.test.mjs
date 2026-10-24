import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { parseLines, serializeLines } from "@red-cup-engineering/jsonl-services-section";
import { executeJavascriptNodeCommand, javascriptNodeCommandExecutionPolicy } from "../scripts/execute-javascript-node-command.mjs";

const nativeRequest = (program) => ({
  type: "JavascriptNodeCommandExecutionRequest", version: 1,
  command: process.execPath, arguments: ["-e", program],
  directory: tmpdir(), environment: null, input: null,
});

test("advertises immutable versioned native bounds without changing requests", () => {
  assert.deepEqual(javascriptNodeCommandExecutionPolicy, {
    type: "JavascriptNodeCommandExecutionPolicyCapability", version: 1,
    maximumOutputBytes: "node-spawn-sync-max-buffer", processGroup: "inherited",
  });
  assert.equal(Object.isFrozen(javascriptNodeCommandExecutionPolicy), true);
});

for (const stream of ["stdout", "stderr"]) {
  test(`accepts exact-bound ${stream} capture`, () => {
    const request = nativeRequest(`process.${stream}.write('x'.repeat(4096));`);
    const receipt = executeJavascriptNodeCommand(request, { maximumOutputBytes: 4096 });
    assert.deepEqual(receipt.request, request);
    assert.equal(receipt.result.status, 0, receipt.result.error);
    assert.equal(receipt.result.signal, null);
    assert.equal(receipt.result.error, "");
    assert.equal(Buffer.byteLength(receipt.result[stream]), 4096);
  });

  test(`native ${stream} overflow is an unsuccessful finite diagnostic receipt`, () => {
    const requestedBytes = 16 * 1024 * 1024;
    const receipt = executeJavascriptNodeCommand(
      nativeRequest(`process.${stream}.write(Buffer.alloc(${requestedBytes}, 120));`),
      { maximumOutputBytes: 4096, timeoutMilliseconds: 5000 },
    );
    assert.match(receipt.result.error, /ENOBUFS/u);
    assert.ok(receipt.result.status !== 0 || receipt.result.signal !== null || receipt.result.error !== "");
    // Native chunks may overshoot 4096; never assert exact-byte truncation.
    const captured = Buffer.byteLength(receipt.result.stdout) + Buffer.byteLength(receipt.result.stderr);
    assert.ok(captured > 0 && captured < requestedBytes, `captured ${captured} bytes`);
    assert.equal(Object.isFrozen(receipt), true);
  });
}

test("omitted output policy retains complete ordinary capture", () => {
  const receipt = executeJavascriptNodeCommand(nativeRequest("process.stdout.write('x'.repeat(131072));"));
  assert.equal(receipt.result.status, 0, receipt.result.error);
  assert.equal(receipt.result.stdout.length, 131072);
});

test("Unicode overflow uses a byte threshold, not a character tail limit", () => {
  const receipt = executeJavascriptNodeCommand(nativeRequest("process.stdout.write('😀'.repeat(1048576));"), { maximumOutputBytes: 4096, timeoutMilliseconds: 5000 });
  assert.match(receipt.result.error, /ENOBUFS/u);
  assert.ok(Buffer.byteLength(receipt.result.stdout) < 4 * 1048576);
});

test("synchronous execution preserves the inherited Linux process group", { skip: process.platform !== "linux" }, () => {
  const receipt = executeJavascriptNodeCommand(nativeRequest("const fs = require('node:fs'); const group = pid => fs.readFileSync('/proc/' + pid + '/stat', 'utf8').split(') ')[1].split(' ')[2]; process.stdout.write(JSON.stringify({child: group(process.pid), parent: group(process.ppid)}));"), { maximumOutputBytes: 4096 });
  assert.equal(receipt.result.status, 0, receipt.result.error);
  const groups = JSON.parse(receipt.result.stdout);
  assert.equal(groups.child, groups.parent);
});

test("finite output policy preserves nonzero exit and timeout evidence", () => {
  const failed = executeJavascriptNodeCommand(nativeRequest("process.stderr.write('failure'); process.exit(7);"), { maximumOutputBytes: 4096 });
  assert.equal(failed.result.status, 7);
  assert.equal(failed.result.stderr, "failure");
  assert.equal(failed.result.error, "");
  const timed = executeJavascriptNodeCommand(nativeRequest("setTimeout(() => {}, 10000);"), { maximumOutputBytes: 4096, timeoutMilliseconds: 100 });
  assert.match(timed.result.error, /ETIMEDOUT/u);
  assert.notEqual(timed.result.status, 0);
});

test("malformed local bounds refuse before native execution", () => {
  for (const value of [0, -1, 1.5, NaN, Infinity, "4096", null, Number.MAX_SAFE_INTEGER + 1]) {
    for (const key of ["maximumOutputBytes", "timeoutMilliseconds"]) {
      assert.throws(() => executeJavascriptNodeCommand(nativeRequest("process.exit(0);"), { [key]: value }), TypeError);
    }
  }
  assert.throws(() => executeJavascriptNodeCommand(nativeRequest("process.exit(0);"), { maxBufferBytes: 4096 }), TypeError);
});

test("executes an explicit program and argument vector without a shell", () => {
  const request = {
    type: "JavascriptNodeCommandExecutionRequest",
    version: 1,
    command: process.execPath,
    arguments: ["-e", "process.stdout.write(process.argv[1])", "hello"],
    directory: tmpdir(),
    environment: null,
    input: null,
  };
  const receipt = executeJavascriptNodeCommand(request);
  assert.deepEqual(receipt.request, request);
  assert.equal(receipt.result.status, 0);
  assert.equal(receipt.result.stdout, "hello");
  assert.equal(receipt.result.stderr, "");
});

test("returns spawn failure as receipt evidence", () => {
  const receipt = executeJavascriptNodeCommand({
    type: "JavascriptNodeCommandExecutionRequest",
    version: 1,
    command: "command-that-does-not-exist-for-command-service-test",
    arguments: [],
    directory: tmpdir(),
    environment: null,
    input: null,
  });
  assert.equal(receipt.result.status, null);
  assert.match(receipt.result.error, /ENOENT/u);
});

test("refuses every implicit execution field", () => {
  assert.throws(() => executeJavascriptNodeCommand({
    type: "JavascriptNodeCommandExecutionRequest",
    version: 1,
    command: process.execPath,
    arguments: [],
    directory: tmpdir(),
    environment: null,
  }), TypeError);
});

test("the NDJSON command face executes the same requests", () => {
  const requests = ["first", "second"].map((value) => ({
    type: "JavascriptNodeCommandExecutionRequest",
    version: 1,
    command: process.execPath,
    arguments: ["-e", "process.stdout.write(process.argv[1])", value],
    directory: tmpdir(),
    environment: null,
    input: null,
  }));
  const imported = requests.map((request) => executeJavascriptNodeCommand(request));
  const command = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("../scripts/execute-javascript-node-command.mjs", import.meta.url))],
    { input: serializeLines(requests), encoding: "utf8" },
  );
  assert.equal(command.status, 0, command.stderr);
  assert.deepEqual(parseLines(command.stdout), imported);
});
