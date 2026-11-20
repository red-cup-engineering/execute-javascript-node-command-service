import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {executeJavascriptNodeCommand} from '@red-cup-engineering/execute-javascript-node-command-service';
import {executeJavascriptNodeCommandAsynchronously} from '@red-cup-engineering/execute-javascript-node-command-service/asynchronously';

const request = (program, fields={}) => ({type:'JavascriptNodeCommandExecutionRequest',version:1,
 command:process.execPath,arguments:['-e',program],directory:tmpdir(),environment:null,input:null,...fields});

test('malformed exact requests and effectful carriers refuse before native execution', t => {
 const dir=mkdtempSync(join(tmpdir(),'execute-admission-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const sentinel=join(dir,'spawned');const valid=request(`require('node:fs').writeFileSync(${JSON.stringify(sentinel)},'not admitted');`);
 const invalid=[];
 for(const key of Object.keys(valid)){const next={...valid};delete next[key];invalid.push(next);}
 for(const [key,value] of [['type','Other'],['version',2],['command',''],['arguments',[4]],['arguments',Array(1)],['directory',''],['environment',{X:4}],['input',4]]) invalid.push({...valid,[key]:value});
 invalid.push({...valid,shell:true},{...valid,timeoutMilliseconds:10},{...valid,inheritedFileDescriptors:[1]});
 let reads=0;const accessor={...valid};Object.defineProperty(accessor,'command',{enumerable:true,get(){reads++;return process.execPath;}});invalid.push(accessor);
 const coercible={...valid,toJSON(){reads++;return valid;}};invalid.push(coercible);
 for(const candidate of invalid){
  assert.throws(()=>executeJavascriptNodeCommand(candidate),TypeError);
  assert.throws(()=>executeJavascriptNodeCommandAsynchronously(candidate),TypeError);
  assert.equal(existsSync(sentinel),false);
 }
 assert.equal(reads,0,'admission must not invoke accessors or toJSON');
});

test('explicit environment replacement, inherited environment and text input keep their distinct meanings', () => {
 const key='EXECUTE_CONTRACT_PARENT';const previous=process.env[key];process.env[key]='parent';
 try {
  const program=`process.stdin.resume();let text='';process.stdin.on('data',x=>text+=x);process.stdin.on('end',()=>process.stdout.write(JSON.stringify({parent:process.env.${key}??null,child:process.env.ONLY_CHILD??null,text})));`;
  const inherited=executeJavascriptNodeCommand(request(program,{input:'inherited'}));
  assert.deepEqual(JSON.parse(inherited.result.stdout),{parent:'parent',child:null,text:'inherited'});
  const replaced=executeJavascriptNodeCommand(request(program,{environment:{ONLY_CHILD:'child'},input:'replacement'}));
  assert.deepEqual(JSON.parse(replaced.result.stdout),{parent:null,child:'child',text:'replacement'});
  assert.deepEqual(replaced.request.environment,{ONLY_CHILD:'child'});
 } finally {if(previous===undefined)delete process.env[key];else process.env[key]=previous;}
});

test('async request snapshot and complete immutable result retain the values actually executed', async () => {
 const original=request("setTimeout(()=>process.stdout.write(process.argv[1]),30)",{arguments:['-e',"setTimeout(()=>process.stdout.write(process.argv[1]),30)",'original'],environment:{SELECTED:'original'}});
 const expected=structuredClone(original);const pending=executeJavascriptNodeCommandAsynchronously(original);
 original.arguments[2]='mutated';original.environment.SELECTED='mutated';original.input='mutated';
 const receipt=await pending;
 assert.deepEqual(receipt.request,expected);assert.equal(receipt.result.stdout,'original');
 assert.equal(receipt.type,'JavascriptNodeCommandExecutionReceipt');assert.equal(receipt.version,1);
 assert.deepEqual(Object.keys(receipt.result).sort(),['error','signal','status','stderr','stdout','type','version']);
 for(const value of [receipt,receipt.request,receipt.request.arguments,receipt.request.environment,receipt.result])assert.equal(Object.isFrozen(value),true);
 assert.equal(receipt.result.status,0);assert.equal(receipt.result.signal,null);assert.equal(receipt.result.error,'');
});

for (const stream of ['stdout','stderr']) test(`async ${stream} tail remains scalar-safe and settles at a UTF-16 boundary`, async () => {
 for (const [text,limit,expected] of [['😀',1,''],['😀',2,'😀'],['😀x',2,'x'],['😀x',3,'😀x']]) {
  const receipt=await executeJavascriptNodeCommandAsynchronously(request(`process.${stream}.write(${JSON.stringify(text)});`),{outputLimit:limit,timeoutMilliseconds:2000});
  assert.equal(receipt.result[stream],expected);assert.ok(receipt.result[stream].length<=limit);
  assert.equal(receipt.result.status,0);assert.equal(receipt.result.error,'');
 }
});
