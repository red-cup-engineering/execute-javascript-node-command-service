/**
 * Run only from a clean consumer with the actual independently installed
 * @red-cup-engineering/execute-javascript-node-command-service package.
 * This is a recipient's real Linux kernel observation, not an acceptance
 * claim about any particular File, CDE, or Moneyday producer operation.
 */
import assert from 'node:assert/strict';
import { constants, openSync, closeSync, writeFileSync, mkdtempSync, rmSync, fstatSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  executeJavascriptNodeCommand,
  javascriptNodeCommandExecutionPolicy,
} from '@red-cup-engineering/execute-javascript-node-command-service';

assert.equal(process.platform,'linux','genuine Linux kernel consumer is required');
assert.equal(spawnSync('flock',['--version'],{timeout:4000}).status,0,
  'util-linux flock is required');
assert.equal(javascriptNodeCommandExecutionPolicy.type,
  'JavascriptNodeCommandExecutionPolicyCapability');
assert.equal(javascriptNodeCommandExecutionPolicy.version,1);
assert.equal(Object.isFrozen(javascriptNodeCommandExecutionPolicy),true);

const dir=mkdtempSync(join(tmpdir(),'installed-code-original-'));
const leaf=join(dir,'retained-native.lock');
writeFileSync(leaf,'original, preprovisioned lock leaf');
const identity=statSync(leaf);
let fd;
try{
  fd=openSync(leaf,constants.O_RDWR|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  const request={
    type:'JavascriptNodeCommandExecutionRequest', version:1, command:'flock',
    arguments:['--exclusive','--nonblock','--conflict-exit-code','75','3'],
    directory:dir, environment:null, input:null,
  };
  const policy={timeoutMilliseconds:5000,maximumOutputBytes:4096,
    inheritedFileDescriptors:[fd]};
  const acquired=executeJavascriptNodeCommand(request,policy);
  assert.deepEqual(acquired.request,request);
  assert.equal(acquired.type,'JavascriptNodeCommandExecutionReceipt');
  assert.equal(acquired.result.type,'JavascriptNodeCommandExecutionResult');
  assert.equal(acquired.result.status,0,acquired.result.error);
  assert.equal(acquired.result.signal,null);
  assert.equal(acquired.result.error,'');
  assert.equal(fstatSync(fd).ino,identity.ino);
  assert.equal(Object.isFrozen(acquired),true);
  assert.equal(JSON.stringify(acquired).includes('inheritedFileDescriptors'),false);
  assert.notEqual(spawnSync('flock',['--exclusive','--nonblock',leaf,'-c','true'],
    {timeout:4000}).status,0,'an independent kernel contender must observe the held lock');
  assert.throws(()=>executeJavascriptNodeCommand(request,{...policy,
    inheritedFileDescriptors:[-1]}),TypeError);
  // A second Code-issued request must use the retained kernel description,
  // and its failure must not be mistaken for a successful receipt.
  const secondFd=openSync(leaf,constants.O_RDWR|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try{
    const refused=executeJavascriptNodeCommand(request,{...policy,inheritedFileDescriptors:[secondFd]});
    assert.equal(refused.result.status,75);
    assert.equal(refused.result.error,'');
  }finally{closeSync(secondFd);}
}finally{
  if(fd!==undefined)closeSync(fd);
  const available=spawnSync('flock',['--exclusive','--nonblock',leaf,'-c','true'],
    {timeout:4000,encoding:'utf8'});
  assert.equal(available.status,0,available.stderr);
  assert.equal(statSync(leaf).ino,identity.ino);
  rmSync(dir,{recursive:true,force:true});
}
console.log('Installed original Code 0.4.1-dev.0: public package export and real inherited-FD Linux flock accepted; File/CDE Proof and deployment remain unreceived.');
