/**
 * Genuine installed original Code 0.4.1-dev.0 + PUBLISHED original File 0.8.4.
 *
 * This is a consumer compatibility assay, not a source-mirror, private File
 * checkout, proof of File 0.8.5-dev.1, or issuer of any production effects.
 * Run ONLY from a clean npm consumer with both authentic packages installed.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, statSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import {
  acquireLocalFileLeaseSync, LocalFileLeaseError, localFileLeaseSchemas,
} from '@red-cup-engineering/computer-file-engineering-services-section/local-file-lease';
import {
  executeJavascriptNodeCommand, javascriptNodeCommandExecutionPolicy,
} from '@red-cup-engineering/execute-javascript-node-command-service';

const require = createRequire(import.meta.url);
const codeName='@red-cup-engineering/execute-javascript-node-command-service';
const fileName='@red-cup-engineering/computer-file-engineering-services-section';
const filePkg=require(fileName+'/package.json');
const codePkg=require(codeName+'/package.json');
const expectedCode='0.4.1-dev.0', expectedFile='0.8.4';
const expectedFileLeaseBlob='21c04c16ec9b00692e87a2a283d1aa343ef4b403';
const linux=process.platform==='linux'&&
  spawnSync('flock',['--version'],{timeout:5000}).status===0;
assert.equal(linux,true,'original File + Code receiving requires a real Linux flock');
const refusal=code=>e=>e instanceof LocalFileLeaseError && e.code===code;
function fixture(t){
  const root=mkdtempSync(join(tmpdir(),'published-file-code-'));
  t.after(()=>rmSync(root,{recursive:true,force:true}));
  return {root,path:join(root,'owner-named-lock')};
}
const request=(path,mode)=>({
  type:'LocalFileLeaseRequest',version:1,profile:'linux-local-flock-v1',
  path,...(mode?{mode}:{}),
});
function host(receipts){
  return Object.freeze({executeCommandSync(command,policy){
    // We do not fabricate a File-compatible success result; the exact
    // installed Code package alone produces the immutable typed receipt.
    const receipt=executeJavascriptNodeCommand(command,policy);
    receipts.push({command,policy,receipt});
    return receipt;
  }});
}
function received(receipts,index,expected){
  const {command,policy,receipt}=receipts[index];
  assert.equal(command.command,'flock');
  assert.deepEqual(command.arguments.slice(-4),['--nonblock','--conflict-exit-code','75','3']);
  assert.equal(policy.timeoutMilliseconds,10000);
  assert.equal(policy.maximumOutputBytes,4096);
  assert.equal(policy.inheritedFileDescriptors.length,1);
  assert.equal(receipt.type,'JavascriptNodeCommandExecutionReceipt');
  assert.equal(receipt.version,1);
  assert.deepEqual(receipt.request,command);
  assert.equal(receipt.result.type,'JavascriptNodeCommandExecutionResult');
  assert.equal(receipt.result.status,expected,JSON.stringify(receipt.result));
  assert.equal(receipt.result.signal,null);
  assert.equal(receipt.result.error,'');
  assert.equal(Object.isFrozen(receipt),true);
  assert.equal(JSON.stringify(receipt).includes('inheritedFileDescriptors'),false);
}
function independentCompeting(path){
  return spawnSync('flock',['--exclusive','--nonblock',path,'-c','true'],
    {timeout:5000,encoding:'utf8'});
}

test('original published exact File and signed Code package/legacy source identities are explicit',()=>{
  assert.equal(filePkg.name,fileName);
  assert.equal(filePkg.version,expectedFile);
  assert.equal(codePkg.name,codeName);
  assert.equal(codePkg.version,expectedCode);
  assert.equal(javascriptNodeCommandExecutionPolicy.type,
    'JavascriptNodeCommandExecutionPolicyCapability');
  assert.equal(javascriptNodeCommandExecutionPolicy.version,1);
  assert.ok(Object.isFrozen(javascriptNodeCommandExecutionPolicy));
  const leasePath=require.resolve(fileName+'/local-file-lease');
  const bytes=readFileSync(leasePath);
  const sha=createHash('sha1').update(
    Buffer.concat([Buffer.from('blob '+bytes.length+'\0','utf8'),bytes])
  ).digest('hex');
  assert.equal(sha,expectedFileLeaseBlob,
    'published File0.8.4 original source must match the original File-owner blob');
  assert.equal(localFileLeaseSchemas.request.properties.profile.const,'linux-local-flock-v1');
});

test('published File legacy O_CREAT acquires through genuine Code and kernel, then releases',t=>{
  const {path}=fixture(t),receipts=[],owner=host(receipts);
  assert.equal(existsSync(path),false);
  const first=acquireLocalFileLeaseSync(request(path),owner);
  assert.ok(existsSync(path),'legacy real File consumer intentionally creates its own lock');
  const inode=statSync(path).ino;
  try{
    first.assertBound();
    assert.equal(receipts.length,1);
    received(receipts,0,0);
    assert.notEqual(independentCompeting(path).status,0);
    assert.throws(()=>acquireLocalFileLeaseSync(request(path),owner),refusal('busy'));
    received(receipts,1,75);
    assert.equal(statSync(path).ino,inode);
  }finally{first.close();}
  assert.equal(independentCompeting(path).status,0);
  assert.equal(statSync(path).ino,inode);
});

test('two published File shared readers exclude Code-issued exclusive publication',t=>{
  const {path}=fixture(t),receipts=[],owner=host(receipts);
  const first=acquireLocalFileLeaseSync(request(path,'shared'),owner);
  const second=acquireLocalFileLeaseSync(request(path,'shared'),owner);
  try{
    first.assertBound();second.assertBound();
    assert.deepEqual(receipts[0].command.arguments.slice(0,2),['--shared','--nonblock']);
    assert.deepEqual(receipts[1].command.arguments.slice(0,2),['--shared','--nonblock']);
    assert.throws(()=>acquireLocalFileLeaseSync(request(path),owner),refusal('busy'));
    received(receipts,2,75);
    first.close();
    assert.throws(()=>acquireLocalFileLeaseSync(request(path),owner),refusal('busy'));
    received(receipts,3,75);
  }finally{first.close();second.close();}
  const exclusive=acquireLocalFileLeaseSync(request(path),owner);
  try{exclusive.assertBound();received(receipts,4,0);}
  finally{exclusive.close();}
  assert.equal(independentCompeting(path).status,0);
});

test('published File0.8.4 does not falsely accept the NEW preprovisioned-only API',t=>{
  const {path}=fixture(t),receipts=[],owner=host(receipts);
  const candidate={...request(path),carrier:'preexisting'};
  assert.throws(()=>acquireLocalFileLeaseSync(candidate,owner),refusal('invalid-request'));
  assert.equal(existsSync(path),false);
  assert.deepEqual(receipts,[]);
  // This negative test is an intentional release compatibility gate: it
  // must NOT represent published File0.8.4 as File0.8.5-dev.1 or as a
  // qualified Moneyday controlled-writer implementation.
});

console.log('Real published File0.8.4 + source-qualified Code0.4.1-dev.0: historical kernel compatibility received; File0.8.5/Moneyday Proof and deployment remain unreceived.');
