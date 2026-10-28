/**
 * Consumer-level original Linux File lease command contract: actual native
 * Code service, retained preprovisioned FD, kernel flock and independent
 * competing issuer. This does NOT implement or self-approve the File lease,
 * a CDE FileRole, source effects, cancellation, or beneficiary receiving.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { constants, openSync, closeSync, fstatSync, statSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  executeJavascriptNodeCommand, javascriptNodeCommandExecutionPolicy,
} from '../scripts/execute-javascript-node-command.mjs';

const linux = process.platform === 'linux' &&
  spawnSync('flock',['--version'],{timeout:4000}).status === 0;
if (!linux && process.env.CODE_REQUIRE_NATIVE_FLOCK === '1')
  throw new Error('original Code descriptor native receiving requires Linux and util-linux flock');

const request = (directory, mode='--exclusive') => Object.freeze({
  type:'JavascriptNodeCommandExecutionRequest', version:1,
  command:'flock', arguments:[mode,'--nonblock','--conflict-exit-code','75','3'],
  directory, environment:null, input:null,
});
const privatePolicy = fd => ({timeoutMilliseconds:5000,maximumOutputBytes:4096,
  inheritedFileDescriptors:[fd]});
function preprovisioned(t) {
  const root=mkdtempSync(join(tmpdir(),'original-code-flock-'));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  const leaf=join(root,'preprovisioned.lock');
  writeFileSync(leaf,'Original retained lock, not generated output');
  return {root,leaf};
}
function receiveCode(req, fd, expectedStatus) {
  const receipt=executeJavascriptNodeCommand(req,privatePolicy(fd));
  assert.equal(receipt.type,'JavascriptNodeCommandExecutionReceipt');
  assert.equal(receipt.version,1);
  assert.deepEqual(receipt.request,req);
  assert.equal(receipt.result.type,'JavascriptNodeCommandExecutionResult');
  assert.equal(receipt.result.status,expectedStatus,
    'genuine original Code issuer must return kernel flock exit code');
  assert.equal(receipt.result.error,'');
  assert.equal(receipt.result.signal,null);
  assert.equal(receipt.result.stdout,'');
  assert.equal(receipt.result.stderr,'');
  assert.equal(Object.isFrozen(receipt),true);
  // The locally selected descriptor and capture resource bounds are PRIVATE:
  // they must never become model/caller invocation or an authority claim.
  assert.ok(!JSON.stringify(receipt).includes('inheritedFileDescriptors'));
  return receipt;
}
function openExisting(leaf) {
  const before=statSync(leaf);
  const fd=openSync(leaf,constants.O_RDWR|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  assert.equal(fstatSync(fd).ino,before.ino);
  return fd;
}

test('genuine Code policy advertises bounded local capture semantics, without Work rights',()=>{
  assert.deepEqual(javascriptNodeCommandExecutionPolicy,{
    type:'JavascriptNodeCommandExecutionPolicyCapability',
    version:1,
    maximumOutputBytes:'node-spawn-sync-max-buffer',
    processGroup:'inherited',
  });
  assert.equal(Object.isFrozen(javascriptNodeCommandExecutionPolicy),true);
});

test('original Code retained fd3 lease is observed by an independent kernel contender', {skip:!linux},t=>{
  const {root,leaf}=preprovisioned(t),fd=openExisting(leaf),inode=statSync(leaf).ino;
  try{
    receiveCode(request(root),fd,0);
    assert.equal(fstatSync(fd).ino,inode);
    const contender=spawnSync('flock',['--exclusive','--nonblock',leaf,'-c','true'],
      {encoding:'utf8',timeout:4000});
    assert.notEqual(contender.status,0,'external kernel contender must be excluded');
    const competingFd=openExisting(leaf);
    try{receiveCode(request(root),competingFd,75);}
    finally{closeSync(competingFd);}
  }finally{closeSync(fd);}
  const released=spawnSync('flock',['--exclusive','--nonblock',leaf,'-c','true'],
    {encoding:'utf8',timeout:4000});
  assert.equal(released.status,0,released.stderr);
  assert.equal(statSync(leaf).ino,inode);
});

test('two shared original Code FD descriptions keep publisher excluded until both release', {skip:!linux},t=>{
  const {root,leaf}=preprovisioned(t);
  const first=openExisting(leaf),second=openExisting(leaf);
  try{
    receiveCode(request(root,'--shared'),first,0);
    receiveCode(request(root,'--shared'),second,0);
    const third=openExisting(leaf);
    try{receiveCode(request(root),third,75);}
    finally{closeSync(third);}
    closeSync(first);
    const fourth=openExisting(leaf);
    try{receiveCode(request(root),fourth,75);}
    finally{closeSync(fourth);}
  }finally{
    try{closeSync(first);}catch{}  // already closed above
    closeSync(second);
  }
  const successor=openExisting(leaf);
  try{receiveCode(request(root),successor,0);}
  finally{closeSync(successor);}
});

test('untrusted or invalid private Code bounds refuse before a child is spawned', {skip:!linux},t=>{
  const {root,leaf}=preprovisioned(t),fd=openExisting(leaf);
  try{
    const req=request(root);
    for(const bad of [
      { ...privatePolicy(fd),timeoutMilliseconds:0 },
      { ...privatePolicy(fd),maximumOutputBytes:-1 },
      { ...privatePolicy(fd),inheritedFileDescriptors:[null] },
      { ...privatePolicy(fd),inheritedFileDescriptors:[,] },
      { ...privatePolicy(fd),unknownCapability:true },
    ]) assert.throws(()=>executeJavascriptNodeCommand(req,bad),TypeError);
    // With invalid requests no lock was acquired on the owned FD.
    assert.equal(spawnSync('flock',['--exclusive','--nonblock',leaf,'-c','true'],
      {timeout:4000}).status,0);
  }finally{closeSync(fd);}
});
