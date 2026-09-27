// run only after stopping the isolated fixture UI and supervisor; see LIFECYCLE-ACCEPTANCE.md
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createConnection} from 'node:net';
import {readFile,writeFile,mkdir,cp,rm,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
const base=resolve(process.env.HTTP_ADVANCED_ACCEPTANCE_BASE??'/private/tmp/http-advanced-platform-acceptance-20260926');
assert(base.startsWith('/private/tmp/http-advanced-platform-acceptance-'));
const installed=join(base,'installed');
const storage=join(base,'lifecycle/storage');
const oldName='homebridge-http-advanced-accessory';
const newName='homebridge-http-advanced-platform';
const newArchive=resolve(process.env.HTTP_ADVANCED_CANDIDATE_ARCHIVE??'/Users/shanemcw/Downloads/http-advanced-platform-alpha6-20260926/homebridge-http-advanced-platform-2.0.0-alpha.6.tgz');
const oldArchive=resolve(process.env.HTTP_ADVANCED_BASELINE_ARCHIVE??join(base,'rollback/homebridge-http-advanced-accessory-2.0.0-alpha.5.tgz'));
const evidence=join(base,'lifecycle/rehearsal');
await mkdir(evidence,{recursive:true});
assert.equal(createHash('sha256').update(await readFile(newArchive)).digest('hex'),'899161d4e5a8a83e3941b06636b9bd75c34e98dbad1dbcdd00c261650e32bc22');
const UIListening=await new Promise(resolve=>{
 const socket=createConnection({host:'127.0.0.1',port:57451});
 socket.once('connect',()=>{socket.destroy();resolve(true);});
 socket.once('error',()=>resolve(false));
 socket.setTimeout(1000,()=>{socket.destroy();resolve(true);});
});
assert.equal(UIListening,false,'Stop the isolated UI and supervisor before swapping packages');
const config=JSON.parse(await readFile(join(storage,'config.json')));
assert.equal(config.bridge.name,'Isolated Packaging Fixture');
assert.equal(config.bridge.username,'AA:BB:CC:DD:EE:30');
assert.equal(config.accessories.length,1);
assert.equal(config.platforms.length,2);
assert.equal(config.accessories[0]._bridge.username,'AA:BB:CC:DD:EE:31');
assert.equal(config.platforms[1]._bridge.username,'AA:BB:CC:DD:EE:32');
assert.equal(config.platforms[0].host,'127.0.0.1');
assert.equal(config.platforms[0].port,57451);
assert.deepEqual(config.plugins,[newName,'homebridge-config-ui-x']);
assert.equal(config.bridge.hap.enabled,false);
assert.deepEqual(config.bridge.bind,['lo0']);
assert.deepEqual(config.disabledPlugins,[]);
assert.equal(JSON.parse(await readFile(join(storage,'.uix-hb-service-homebridge-startup.json'))).insecureMode,false);
for(const block of [config.accessories[0],config.platforms[1]]){
 assert.equal(block._bridge.hap.enabled,false);
 for(const device of block.devices??[block])for(const action of Object.values(device.urls))assert.equal(new URL(action.url).hostname,'127.0.0.1');
}
const identityOf=c=>({bridge:c.bridge,legacy:{name:c.accessories[0].name,id:c.accessories[0].id,bridge:c.accessories[0]._bridge},platform:{name:c.platforms[1].name,devices:c.platforms[1].devices,bridge:c.platforms[1]._bridge}});
const hostManifest=JSON.parse(await readFile(join(installed,'node_modules/homebridge/package.json')));
assert.equal(hostManifest.version,'2.4.0');
const originalIdentity=identityOf(config);
const cacheFile=join(storage,'accessories/cachedAccessories.AABBCCDDEE32');
const originalCache=JSON.parse(await readFile(cacheFile));
assert.equal(originalCache.length,1);
const cacheIdentityOf=items=>items.map(a=>({displayName:a.displayName,UUID:a.UUID,services:a.services.map(s=>({UUID:s.UUID,subtype:s.subtype,characteristics:s.characteristics.map(c=>({UUID:c.UUID}))}))}));
const originalCacheIdentity=cacheIdentityOf(originalCache);
const results=[];
let child;
const exists=async path=>{try{await stat(path);return true;}catch{return false;}};
async function backup(label){
 const destination=join(evidence,label);
 assert(!(await exists(destination)),`Backup already exists: ${label}`);
 await mkdir(destination);
 for(const item of ['config.json','accessories','persist','.uix-hb-service-homebridge-startup.json'])if(await exists(join(storage,item)))await cp(join(storage,item),join(destination,item),{recursive:true});
 return destination;
}
async function restore(destination){
 for(const item of ['config.json','accessories','persist','.uix-hb-service-homebridge-startup.json']){
  const source=join(destination,item);
  await rm(join(storage,item),{recursive:true,force:true});
  if(await exists(source))await cp(source,join(storage,item),{recursive:true});
 }
}
async function npm(args,label){
 const log=join(evidence,`${label}-npm.log`);
 const command=spawn('npm',[...args,'--prefix',installed,'--cache',join('/private/tmp','http-advanced-platform-npm-cache'),'--ignore-scripts','--no-audit','--no-fund'],{cwd:installed,stdio:['ignore','pipe','pipe']});
 let output='';command.stdout.on('data',v=>output+=v);command.stderr.on('data',v=>output+=v);
 const code=await new Promise(resolve=>command.once('close',resolve));await writeFile(log,output);assert.equal(code,0,`npm failed; see ${log}`);
}
async function replace(removeName,archive,expectedName,version,label){
 await npm(['uninstall',removeName],`${label}-remove`);
 await npm(['install','--omit=dev',archive],`${label}-install`);
 assert(!(await exists(join(installed,'node_modules',removeName))));
 const manifest=JSON.parse(await readFile(join(installed,'node_modules',expectedName,'package.json')));assert.equal(manifest.name,expectedName);assert.equal(manifest.version,version);
}
async function configure(name){
 const current=JSON.parse(await readFile(join(storage,'config.json')));
 current.plugins=[name,'homebridge-config-ui-x'];current.disabledPlugins=[];
 current.accessories[0].accessory=`${name}.HttpAdvancedAccessory`;
 current.platforms[1].platform=`${name}.HttpAdvanced`;
 assert.deepEqual(identityOf(current),originalIdentity);
 await writeFile(join(storage,'config.json'),JSON.stringify(current,null,2)+'\n');
}
async function stop(){
 if(!child)return;
 const processToStop=child;child=undefined;
 if(processToStop.exitCode===null){
  const closed=new Promise(resolve=>processToStop.once('close',resolve));processToStop.kill('SIGTERM');
  await Promise.race([closed,delay(20000,undefined,{ref:false}).then(()=>{throw new Error('Fixture did not stop');})]);
 }
}
async function run(label,name,version){
 const logPath=join(evidence,`${label}-homebridge.log`);let output='';
 child=spawn(process.execPath,[join(installed,'node_modules/homebridge/bin/homebridge.js'),'-U',storage,'-P',join(installed,'node_modules'),'--strict-plugin-resolution'],{cwd:installed,env:{...process.env,UIX_INSECURE_MODE:'0'},stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',v=>output+=v);child.stderr.on('data',v=>output+=v);
 try{
  let ready=false;
  for(let i=0;i<100;i++){
   if(child.exitCode!==null)break;
   if((output.match(/Child bridge started successfully/g)??[]).length===2&&output.includes('Loaded 1 cached accessories from cachedAccessories.AABBCCDDEE32')){ready=true;break;}
   await delay(150);
  }
  assert(ready,`Managed bridges failed: ${label}`);await delay(1000);
  const cache=JSON.parse(await readFile(cacheFile));assert.deepEqual(cacheIdentityOf(cache),originalCacheIdentity);assert.equal(cache[0].plugin,name);assert.equal(cache[0].platform,'HttpAdvanced');
  assert(output.includes(`Loaded plugin: ${name}@${version}`));assert(!output.includes('No plugin was found'));assert(!output.includes('Error:'));
  const current=JSON.parse(await readFile(join(storage,'config.json')));assert.deepEqual(identityOf(current),originalIdentity);assert.equal(current.httpAdvanced.requestTimeout,31000);assert.equal(current.accessories[0].manufacturer,'Packaging Fixture');
  const record={stage:label,package:`${name}@${version}`,managedChildren:2,cachedPlatformAccessories:cache.length,platformUUID:cache[0].UUID,childPIDs:[...output.matchAll(/Child bridge starting \(pid (\d+)\)/g)].map(m=>Number(m[1])),identityPreserved:true};results.push(record);console.log(JSON.stringify(record));
 }finally{await stop();await writeFile(logPath,output.replace(/\b\d{3}-\d{2}-\d{3}\b/g,'[fixture PIN]'));}
}
const alpha6Backup=await backup('alpha6-backup');
try{
 await replace(newName,oldArchive,oldName,'2.0.0-alpha.5','baseline-alpha5');await configure(oldName);await run('baseline-alpha5',oldName,'2.0.0-alpha.5');
 const alpha5Backup=await backup('alpha5-backup');
 await replace(oldName,newArchive,newName,'2.0.0-alpha.6','forward-alpha6');await configure(newName);await run('forward-alpha6',newName,'2.0.0-alpha.6');
 await run('restart-alpha6',newName,'2.0.0-alpha.6');
 await replace(newName,oldArchive,oldName,'2.0.0-alpha.5','rollback-alpha5');await restore(alpha5Backup);await run('rollback-alpha5',oldName,'2.0.0-alpha.5');
 assert.deepEqual(JSON.parse(await readFile(join(storage,'config.json'))),JSON.parse(await readFile(join(alpha5Backup,'config.json'))));
 await replace(oldName,newArchive,newName,'2.0.0-alpha.6','final-alpha6');await restore(alpha6Backup);await run('final-alpha6',newName,'2.0.0-alpha.6');
 assert.deepEqual(JSON.parse(await readFile(join(storage,'config.json'))),config);
 await writeFile(join(evidence,'results.json'),JSON.stringify({node:process.version,homebridge:'2.4.0',oldArchiveSHA256:createHash('sha256').update(await readFile(oldArchive)).digest('hex'),results},null,2)+'\n');
 console.log('Backed-up package replacement, restart, rollback and final candidate restoration passed');
}finally{await stop();}
