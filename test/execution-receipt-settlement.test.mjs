import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

// Deliberate private-boundary fault injection, not a native receipt qualification.
test('unexpected receipt construction failure rejects the actual async promise instead of stranding it', () => {
 const contract=new URL('../src/execution-contract.mjs',import.meta.url).href;
 const asynchronous=new URL('../scripts/execute-javascript-node-command-asynchronously.mjs',import.meta.url).href;
 const program=`import {mock} from 'node:test';
const original=await import(${JSON.stringify(contract)});
mock.module(${JSON.stringify(contract)},{namedExports:{admitExecutionRequest:original.admitExecutionRequest,projectExecutionReceipt(){throw new Error('injected receipt failure');}}});
const {executeJavascriptNodeCommandAsynchronously}=await import(${JSON.stringify(asynchronous)});
const request={type:'JavascriptNodeCommandExecutionRequest',version:1,command:process.execPath,arguments:['-e','process.exit(0)'],directory:process.cwd(),environment:null,input:null};
try {await executeJavascriptNodeCommandAsynchronously(request);process.exitCode=1;}
catch(error){if(error.message!=='injected receipt failure')throw error;process.stdout.write('receipt-fault-rejected');}`;
 const result=spawnSync(process.execPath,['--experimental-test-module-mocks','--input-type=module','-e',program],{encoding:'utf8',timeout:5000});
 assert.equal(result.error,undefined,'promise must settle in bounded native process time');
 assert.equal(result.status,0,result.stderr);assert.equal(result.stdout,'receipt-fault-rejected');
});
