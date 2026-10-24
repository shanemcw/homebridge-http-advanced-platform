import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {DeviceWrites} from '../dist/writes.js';
import {Coordinator} from '../dist/coordinator.js';
import {Runtime} from '../dist/runtime.js';
import {Actions} from '../dist/actions.js';
import {Transport} from '../dist/transport.js';
import {DeviceAdapter,LegacyAccessory,validateWriteModes} from '../dist/accessory.js';
import {HTTPPlatform} from '../dist/platform.js';
import {validateDevice} from '../dist/config.js';
import {validateSettings} from '../dist/settings.js';
import {ActionError} from '../dist/types.js';
import {validatePluginSettings,mergeSettings,selectSettings} from '../dist/ui-config.js';
import {fakeServer,makeAPI,silentLog,until} from './helpers.mjs';
const require=createRequire(import.meta.url);
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
const turn=()=>new Promise(resolve=>setImmediate(resolve));
const commandAction={url:'http://device.example/command/{value}',writeMode:'command'};

function queueFixture(t) {
  t.mock.timers.enable({apis:['Date','setTimeout'],now:1000});
  const coordinator=new Coordinator({maxQueue:6});
  const warnings=[];
  const queue=new DeviceWrites(coordinator,(...args)=>warnings.push(args));
  const sent=[],cancelled=[];
  t.after(()=>{queue.shutdown();coordinator.shutdown();});
  const submit=(action,options={})=>queue.submit({owner:options.owner??'one',action,command:options.command??true,
    delay:options.delay??0,timeout:options.timeout??1000,
    prepare:()=>({run:async(deadline,reservation)=>{
      await coordinator.submit('http://device.example',options.owner??'one',0,true,async()=>{
        sent.push(action);await options.wait?.();
      },deadline,reservation);
    },cancel:()=>cancelled.push(action)})});
  return {queue,coordinator,warnings,sent,cancelled,submit};
}

async function fixture(t,overrides={},settings={}) {
  const api=await makeAPI(t),messages=[];
  const log={...silentLog,warn:message=>messages.push(message)};
  const runtime=new Runtime(log,{},api.user.persistPath(),settings);t.after(()=>runtime.shutdown());
  const config={name:'Command light',service:'Lightbulb',optionCharacteristic:['Brightness'],urls:{
    getOn:{url:'http://device.example/power'},setOn:{...commandAction},
    getBrightness:{url:'http://device.example/brightness'},setBrightness:{url:'http://device.example/level/{value}'},
  },...overrides};
  const adapter=new DeviceAdapter(api,runtime,config,'command-light');
  runtime.actions.get=async action=>action.url.endsWith('brightness')?'10':'0';
  for(const entry of adapter.entries.values())await runtime.refresh(entry);
  return {api,runtime,config,adapter,messages,
    power:adapter.service.getCharacteristic(api.hap.Characteristic.On),
    brightness:adapter.service.getCharacteristic(api.hap.Characteristic.Brightness)};
}

test('writeMode schema and structural validation agree on supported values and placement',()=>{
  const schema=JSON.parse(readFileSync(new URL('../config.schema.json',import.meta.url),'utf8'));
  const Ajv=require('ajv');
  const validate=new Ajv({formats:{password:()=>true}}).compile({...schema.schema.definitions.device,definitions:schema.schema.definitions});
  const device=action=>({name:'Fixture',service:'Switch',urls:{setOn:action}});
  for(const mode of [undefined,'target','command']) {
    const config=device({...commandAction,writeMode:mode});
    assert.equal(validate(config),true);assert.doesNotThrow(()=>validateDevice(config));
  }
  const invalid=[
    ...[false,null,1,'COMMAND',''].map(writeMode=>device({...commandAction,writeMode})),
    {...device(commandAction),writeMode:'command'},
    {name:'Fixture',service:'Switch',urls:{getOn:commandAction}},
    {name:'Fixture',service:'Switch',urls:{getOn:{url:commandAction.url,inconclusive:commandAction}}},
    device({...commandAction,strictHTTP:false}),
    {...device(commandAction),additionalServices:[{id:'extra',service:'Switch',writeMode:'command'}]},
  ];
  for(const config of invalid) {
    assert.equal(validate(config),false,JSON.stringify(config));
    assert.throws(()=>validateDevice(config),{category:'config'});
  }
  assert.throws(()=>validateSettings({writeMode:'command'}),/writeMode/);
  assert.throws(()=>validatePluginSettings({accessories:[{accessory:'HttpAdvancedAccessory',...device({...commandAction,strictHTTP:false})}],platforms:[],settings:{}}),/Legacy accessory 1: device.urls.setOn.strictHTTP/);
});

test('mode-bearing actions must bind to writable exposed characteristics; readable commands require feedback',async t=>{
  const api=await makeAPI(t);
  for(const config of [
    {name:'Missing',service:'Switch',urls:{setOff:commandAction}},
    {name:'Optional',service:'Lightbulb',urls:{setBrightness:{...commandAction,writeMode:'target'}}},
    {name:'Read only',service:'TemperatureSensor',urls:{setCurrentTemperature:commandAction}},
    {name:'No feedback',service:'Switch',urls:{setOn:commandAction}},
    {name:'Name',service:'Switch',urls:{setName:commandAction}},
  ])assert.throws(()=>validateWriteModes(api,config),{category:'config'});
  assert.doesNotThrow(()=>validateWriteModes(api,{name:'Remote',service:'TelevisionSpeaker',optionCharacteristic:['VolumeSelector'],urls:{setVolumeSelector:commandAction}}));
});

test('each received identical or alternating command is delivered in order despite shared debounce',async t=>{
  const {runtime,power}=await fixture(t,{}, {setterDelay:5000});
  const values=[];runtime.actions.set=async(_a,_c,_o,_s,value)=>values.push(value);
  await Promise.all([true,true,true,false,true].map(value=>power.handleSetRequest(value)));
  assert.deepEqual(values,[true,true,true,false,true]);
  assert.equal(runtime.writes.stats.completed,5);
  assert.equal(runtime.setters.size,0);
  assert.equal(runtime.coordinator.reservations.size,0);
});

test('target-only devices retain debounce when mode is omitted or explicitly target',async t=>{
  for(const writeMode of [undefined,'target']) {
    const {runtime,power}=await fixture(t,{setterDelay:15,urls:{getOn:{url:'http://device.example/state'},setOn:{...commandAction,writeMode}}});
    const values=[];runtime.actions.set=async(_a,_c,_o,_s,value)=>values.push(value);
    await power.handleSetRequest(true);await power.handleSetRequest(false);
    await until(()=>values.length===1);
    assert.deepEqual(values,[false]);assert.equal(runtime.writes.stats.received,0);
  }
});

test('adjacent targets coalesce but command and action boundaries preserve all earlier order',async t=>{
  const {submit,sent}=queueFixture(t);
  submit('brightness40',{command:false,delay:20});
  // same action key with replacement payload is exercised through actual adapters below
  const command=submit('up');
  submit('brightness60',{command:false,delay:20});
  await flush();assert.deepEqual(sent,[]);
  t.mock.timers.tick(20);await flush();await command;
  assert.deepEqual(sent,['brightness40','up','brightness60']);
});

test('actual HAP slider writes coalesce only before the next command boundary',async t=>{
  const {runtime,power,brightness}=await fixture(t,{setterDelay:100});
  t.mock.timers.enable({apis:['Date','setTimeout'],now:10000});
  const sent=[];runtime.actions.set=async(action,_c,_o,_s,value)=>sent.push([action.writeMode??'target',value]);
  await brightness.handleSetRequest(40);await brightness.handleSetRequest(60);
  const command=power.handleSetRequest(true);
  await brightness.handleSetRequest(80);
  await flush();assert.deepEqual(sent,[]);
  t.mock.timers.tick(100);await flush();await command;
  assert.deepEqual(sent,[['target',60],['command',true],['target',80]]);
});

test('a waiting device does not occupy HTTP capacity or block an independent device',async t=>{
  const {submit,sent,coordinator}=queueFixture(t);
  submit('slow-target',{command:false,delay:500});
  const first=submit('after-target');
  const independent=submit('other-device',{owner:'two'});
  await flush();await independent;
  assert.deepEqual(sent,['other-device']);assert.equal(coordinator.active.size,0);
  t.mock.timers.tick(500);await flush();await first;
  assert.deepEqual(sent,['other-device','slow-target','after-target']);
});

test('commands expire while parked and cannot execute after the earlier target becomes ready',async t=>{
  const {submit,sent,queue,coordinator}=queueFixture(t);
  submit('target',{command:false,delay:500});
  const expired=assert.rejects(submit('expired',{timeout:50}),{category:'timeout'});
  await flush();t.mock.timers.tick(50);await flush();await expired;
  assert.equal(queue.stats.expired,1);assert.equal(coordinator.reservations.size,1);
  t.mock.timers.tick(450);await flush();assert.deepEqual(sent,['target']);
});

test('one shared capacity bound covers buffered writes and transport jobs without double counting',async t=>{
  const {submit,coordinator,sent}=queueFixture(t);
  coordinator.configure({maxQueue:2});
  submit('target',{command:false,delay:50});
  const command=submit('up');
  assert.throws(()=>submit('rejected',{owner:'two'}),{category:'queue'});
  await assert.rejects(coordinator.submit('http://other.example','other',0,false,async()=>{}),{category:'queue'});
  assert.equal(coordinator.queue.length+coordinator.reservations.size,2);
  t.mock.timers.tick(50);await flush();await command;
  assert.deepEqual(sent,['target','up']);assert.equal(coordinator.reservations.size,0);
});

test('a failed head cancels its waiting batch; new intent and other devices still work',async t=>{
  const {submit,sent,cancelled,queue}=queueFixture(t);
  let fail;
  const first=assert.rejects(submit('failed',{wait:()=>new Promise((_resolve,reject)=>{fail=reject;})}),{category:'network'});
  const next=assert.rejects(submit('cancelled'),{category:'cancelled'});
  await flush();fail(new ActionError('network'));await flush();await Promise.all([first,next]);
  assert.deepEqual(sent,['failed']);assert.ok(cancelled.includes('cancelled'));
  await submit('new');await submit('other',{owner:'two'});
  assert.deepEqual(sent,['failed','new','other']);assert.equal(queue.stats.cancelled,1);
});

test('shutdown settles both active and parked writes and releases every reservation',async t=>{
  const {submit,queue,coordinator,sent}=queueFixture(t);
  const active=assert.rejects(submit('active',{wait:()=>new Promise(()=>{})}),{category:'aborted'});
  const parked=assert.rejects(submit('parked'),{category:'aborted'});
  await flush();queue.shutdown();coordinator.shutdown();await Promise.all([active,parked]);
  t.mock.timers.tick(5000);await flush();
  assert.deepEqual(sent,['active']);assert.equal(queue.pending,0);assert.equal(coordinator.reservations.size,0);
  assert.throws(()=>submit('after-shutdown'),{category:'aborted'});
});

test('command acknowledgements never become target previews, mapper state or persisted observations',async t=>{
  const {runtime,power,adapter,api}=await fixture(t);
  runtime.actions.set=async()=>{};
  await power.handleSetRequest(true);await turn();
  const entry=adapter.entries.get('getOn');
  assert.equal(entry.pendingWrite,undefined);assert.equal(await power.handleGetRequest(),false);
  assert.equal(power.value,false);assert.equal(adapter.state.getOn,'0');
  runtime.persist();
  const saved=JSON.parse(readFileSync(join(api.user.persistPath(),'http-advanced-state-v1',entry.key+'.json'),'utf8'));
  assert.equal(saved.value,false);assert.equal(saved.stateValue,'0');
});

test('unknown readable command state remains an error after a successful acknowledgement',async t=>{
  const {runtime,power,adapter}=await fixture(t);
  const entry=adapter.entries.get('getOn');entry.known=false;delete entry.value;
  runtime.actions.set=async()=>{};
  await power.handleSetRequest(true);await turn();
  await assert.rejects(power.handleGetRequest());assert.notEqual(power.statusCode,0);
});

test('commands retire older target holds while preserving a newer queued target intent',async t=>{
  const {runtime,power,brightness,adapter}=await fixture(t);
  runtime.actions.set=async(...args)=>{args[7]?.();};
  await brightness.handleSetRequest(40);
  const entry=adapter.entries.get('getBrightness');assert.ok(entry.pendingWrite);
  await power.handleSetRequest(true);assert.equal(entry.pendingWrite,undefined);
  let finish;
  runtime.actions.set=async(...args)=>{args[7]?.();if(args[0].writeMode==='command')await new Promise(resolve=>{finish=resolve;});};
  const command=power.handleSetRequest(true);await until(()=>finish);
  const target=brightness.handleSetRequest(80);const intent=entry.pendingWrite;
  finish();await command;await target;await turn();
  assert.equal(entry.pendingWrite,intent);assert.equal(await brightness.handleGetRequest(),80);
});

test('an overlapping getter cannot overwrite observations after command delivery',async t=>{
  const {runtime,power,adapter}=await fixture(t);
  let finish;
  runtime.actions.get=()=>new Promise(resolve=>{finish=resolve;});
  const entry=adapter.entries.get('getOn'),refresh=runtime.refresh(entry);
  runtime.actions.set=async(...args)=>{args[7]?.();};
  await power.handleSetRequest(true);finish('1');await refresh;
  assert.equal(entry.value,false);assert.equal(adapter.state.getOn,'0');
  runtime.actions.get=async()=> '1';await runtime.refresh(entry);assert.equal(entry.value,true);
});

test('legacy and platform adapters share ordering across primary and additional services',async t=>{
  for(const kind of ['legacy','platform']) {
    const api=await makeAPI(t);
    const config={id:'one',name:'Combined',service:'Switch',urls:{getOn:{url:'http://device.example/state'},setOn:{url:'http://device.example/power/{value}'}},
      additionalServices:[{id:'speaker',service:'TelevisionSpeaker',optionCharacteristic:['VolumeSelector'],urls:{setVolumeSelector:commandAction}}]};
    let services;
    if(kind==='legacy')services=new LegacyAccessory(silentLog,config,api).getServices();
    else {const platform=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Fixture',devices:[config]},api);platform.discover();services=api.registrations[0].services;}
    const {sharedRuntime}=await import('../dist/runtime.js');
    const runtime=sharedRuntime(api,silentLog),sent=[];let finish;
    runtime.actions.set=async(action,_c,_o,_s,value)=>{sent.push([action.writeMode??'target',value]);if(sent.length===1)await new Promise(resolve=>{finish=resolve;});};
    const speaker=services.find(service=>service.UUID===api.hap.Service.TelevisionSpeaker.UUID);
    const remote=speaker.getCharacteristic(api.hap.Characteristic.VolumeSelector);
    const power=services.find(service=>service.UUID===api.hap.Service.Switch.UUID).getCharacteristic(api.hap.Characteristic.On);
    const first=remote.handleSetRequest(0);await until(()=>finish);
    const second=power.handleSetRequest(true),third=remote.handleSetRequest(1);
    await flush();assert.deepEqual(sent,[['command',0]]);
    finish();await Promise.all([first,second,third]);
    assert.deepEqual(sent,[['command',0],['target',true],['command',1]]);
  }
});

test('commands require successful HTTP status and never follow redirects for GET, HEAD or POST',async t=>{
  let status=200;
  const destination=await fakeServer(t,(_req,res)=>res.end('OK'));
  const source=await fakeServer(t,(_req,res)=>{res.statusCode=status;res.setHeader('Location',destination.url);res.end('OK');});
  const coordinator=new Coordinator(),transport=new Transport(coordinator),actions=new Actions(transport);t.after(()=>transport.shutdown());
  for(const httpMethod of ['GET','HEAD','POST']) {
    for(status of [200,302,307,400,429,503]) {
      const work=actions.set({...commandAction,url:source.url,httpMethod},{},'one',{},1);
      if(status===200)await work;else await assert.rejects(work,{category:'http'});
    }
  }
  assert.equal(source.requests.length,18);assert.equal(destination.requests.length,0);
  status=200;await assert.rejects(actions.set({...commandAction,url:source.url,responsePattern:'^ACCEPTED$'},{},'one',{},1),{category:'inconclusive'});
  assert.equal(source.requests.length,19);
});

test('command deadline includes device waiting and HTTP time, with no replay after timeout',async t=>{
  const server=await fakeServer(t,async(_req,res)=>{await new Promise(resolve=>setTimeout(resolve,80));res.end('OK');});
  const {runtime,power}=await fixture(t,{urls:{getOn:{url:server.url},setOn:{url:server.url,writeMode:'command',timeout:30}}});
  const work=power.handleSetRequest(true);await assert.rejects(work);
  await new Promise(resolve=>setTimeout(resolve,100));
  assert.equal(server.requests.length,1);assert.equal(runtime.coordinator.active.size,0);
  assert.equal(runtime.coordinator.reservations.size,0);
});

test('different target actions are debounce boundaries and active target writes cannot be replaced',async t=>{
  const {queue,coordinator}=queueFixture(t),sent=[];let finish;
  const submit=(action,value,delay=20)=>queue.submit({owner:'one',action,command:false,delay,timeout:1000,
    prepare:()=>({run:async(deadline,reservation)=>coordinator.submit('http://device.example','one',0,true,async()=>{
      sent.push([action,value]);if(value===40)await new Promise(resolve=>{finish=resolve;});
    },deadline,reservation),cancel:()=>{}})});
  submit('brightness',40);submit('hue',20);submit('brightness',60);
  t.mock.timers.tick(20);await flush();assert.deepEqual(sent,[['brightness',40]]);
  const last=submit('brightness',80,0);
  finish();await flush();await last;
  assert.deepEqual(sent,[['brightness',40],['hue',20],['brightness',60],['brightness',80]]);
});

test('a rejected command cannot replace a target preview or consume its capacity',async t=>{
  const {runtime,power,brightness,adapter}=await fixture(t,{setterDelay:100});
  runtime.coordinator.configure({maxQueue:1});
  await brightness.handleSetRequest(40);const intent=adapter.entries.get('getBrightness').pendingWrite;
  await assert.rejects(power.handleSetRequest(true));
  assert.equal(adapter.entries.get('getBrightness').pendingWrite,intent);
  assert.equal(runtime.coordinator.reservations.size,1);
});

test('a cancelled acknowledged target restores observed state and reports no false success',async t=>{
  const {runtime,power,brightness,adapter,messages}=await fixture(t,{setterDelay:100});let fail;
  runtime.actions.set=()=>new Promise((_resolve,reject)=>{fail=reject;});
  const failed=assert.rejects(power.handleSetRequest(true));await until(()=>fail);
  await brightness.handleSetRequest(80);assert.ok(adapter.entries.get('getBrightness').pendingWrite);
  fail(new ActionError('network'));await failed;await turn();
  assert.equal(adapter.entries.get('getBrightness').pendingWrite,undefined);
  assert.equal(await brightness.handleGetRequest(),10);
  assert.equal(runtime.coordinator.reservations.size,0);
  assert.ok(messages.length>=1);assert.ok(messages.every(message=>!message.includes('device.example')));
});

test('queued mappers/templates run once at delivery against the latest observed state',async t=>{
  const server=await fakeServer(t,(_req,res)=>res.end('OK'));
  const {runtime,power,adapter}=await fixture(t,{setterDelay:80,urls:{
    getOn:{url:server.url},setOn:{url:server.url+'/command/${state.getOn}/{value}',writeMode:'command',
      mappers:[{type:'eval',parameters:{expression:'self.state.mapperCalls=(self.state.mapperCalls||0)+1;value?"up":"down"'}}]},
    setBrightness:{url:server.url+'/target/{value}'},getBrightness:{url:server.url+'/brightness'},
  }});
  const original=runtime.actions.set.bind(runtime.actions);let finish;
  runtime.actions.set=async(...args)=>{if(args[0].writeMode!=='command')await new Promise(resolve=>{finish=resolve;});else await original(...args);};
  const brightness=adapter.service.getCharacteristic((await makeAPI(t)).hap.Characteristic.Brightness);
  await brightness.handleSetRequest(40);await until(()=>finish);
  const queued=power.handleSetRequest(true);adapter.state.getOn='observed';
  finish();await queued;
  assert.equal(adapter.state.mapperCalls,1);
  assert.deepEqual(server.requests.map(request=>request.url),['/command/observed/up']);
});

test('a failed mapper sends nothing and releases the device batch capacity',async t=>{
  const server=await fakeServer(t);
  const {runtime,power}=await fixture(t,{urls:{getOn:{url:server.url},setOn:{url:server.url,writeMode:'command',mappers:[{type:'lookup',parameters:{mapping:{never:'send'}}}]}}});
  await assert.rejects(power.handleSetRequest(true));
  assert.equal(server.requests.length,0);assert.equal(runtime.coordinator.reservations.size,0);
});

test('command pacing spans actual HTTP starts without delaying another device',async t=>{
  const server=await fakeServer(t,(_req,res)=>res.end('OK'));
  const {runtime,power}=await fixture(t,{uriCallsDelay:35,urls:{getOn:{url:server.url},setOn:{url:server.url,writeMode:'command'}}});
  await Promise.all([true,false,true].map(value=>power.handleSetRequest(value)));
  assert.equal(server.requests.length,3);
  for(let i=1;i<3;i++)assert.ok(server.requests[i].time-server.requests[i-1].time>=30);
  assert.equal(runtime.coordinator.reservations.size,0);
});

test('invalid command inventory retains cached platform identities and rejects their controls',async t=>{
  const api=await makeAPI(t),errors=[],log={...silentLog,error:message=>errors.push(message)};
  const existing=new api.platformAccessory('Retained',api.hap.uuid.generate('retained'));
  const characteristic=existing.addService(api.hap.Service.Switch).getCharacteristic(api.hap.Characteristic.On);
  const platform=new HTTPPlatform(log,{platform:'HttpAdvanced',devices:[{id:'one',name:'Invalid',service:'Switch',urls:{setOn:commandAction}}]},api);
  platform.configureAccessory(existing);platform.discover();
  assert.equal(api.removals.length,0);assert.equal(api.registrations.length,0);
  await assert.rejects(characteristic.handleSetRequest(true));
  assert.match(errors[0],/devices\[0\].services\[0\].urls.setOn.writeMode/);
});

test('command modes round-trip through configuration editing with IDs, encoded bodies and unknown fields',()=>{
  const device={id:'stable-id',name:'Remote',service:'TelevisionSpeaker',optionCharacteristic:['VolumeSelector'],
    urls:{setVolumeSelector:{...commandAction,httpMethod:'POST',body:'command=%2F{value}%25',futureField:{keep:true}}}};
  const config={bridge:{name:'Retain'},accessories:[{accessory:'HttpAdvancedAccessory',...device}],
    platforms:[{platform:'HttpAdvanced',name:'Platform',devices:[device]}],httpAdvanced:{setterDelay:500}};
  assert.deepEqual(mergeSettings(config,selectSettings(config)),config);
});

test('shutdown cancellation is transient and a fresh runtime never replays old commands',async t=>{
  const {runtime,power,brightness,api}=await fixture(t,{setterDelay:10000});
  await brightness.handleSetRequest(40);
  const waiting=assert.rejects(power.handleSetRequest(true));
  runtime.shutdown();await waiting;
  const fresh=new Runtime(silentLog,{},api.user.persistPath());t.after(()=>fresh.shutdown());
  assert.equal(fresh.writes.pending,0);assert.equal(fresh.writes.stats.received,0);
  assert.equal(fresh.coordinator.queue.length,0);assert.equal(fresh.coordinator.reservations.size,0);
});

test('expiry inside network admission rejects only that command and preserves valid followers',async t=>{
  const {submit,sent,coordinator,queue}=queueFixture(t);
  coordinator.configure({concurrency:1});let release;
  const blocking=coordinator.submit('http://blocked.example','blocker',0,true,()=>new Promise(resolve=>{release=resolve;}));
  await flush();
  const expired=assert.rejects(submit('expired',{timeout:40}),{category:'timeout'});
  const valid=submit('valid',{timeout:1000});
  await flush();t.mock.timers.tick(40);await flush();await expired;
  assert.equal(queue.stats.cancelled,0);assert.equal(queue.stats.expired,1);
  release();await blocking;await turn();await valid;
  assert.deepEqual(sent,['valid']);
});

test('a command expiring before HTTP admission does not retire an earlier target confirmation hold',async t=>{
  const server=await fakeServer(t,(_req,res)=>res.end('OK'));
  const {runtime,power,brightness,adapter}=await fixture(t,{urls:{
    getOn:{url:server.url},setOn:{url:server.url,writeMode:'command',timeout:25},
    getBrightness:{url:server.url+'/brightness'},setBrightness:{url:server.url+'/target/{value}'},
  }});
  await brightness.handleSetRequest(40);
  const entry=adapter.entries.get('getBrightness'),intent=entry.pendingWrite;
  runtime.coordinator.configure({concurrency:1});let release;
  const blocking=runtime.coordinator.submit('http://blocked.example','blocker',0,true,()=>new Promise(resolve=>{release=resolve;}));
  await until(()=>release);await assert.rejects(power.handleSetRequest(true));
  assert.equal(entry.pendingWrite,intent);assert.equal(await brightness.handleGetRequest(),40);
  assert.equal(server.requests.length,1);
  release();await blocking;
});
