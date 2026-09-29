import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import initialize from '../dist/index.js';
import {LegacyAccessory,DeviceAdapter,serviceConstructor,convertValue} from '../dist/accessory.js';
import {HTTPPlatform} from '../dist/platform.js';
import {Runtime,sharedRuntime} from '../dist/runtime.js';
import {loadLegacy} from './legacy-loader.mjs';
import {fakeServer,makeAPI,silentLog,identifierCache} from './helpers.mjs';
const require=createRequire(import.meta.url);
const shape=services=>JSON.parse(JSON.stringify(services.map(s=>({UUID:s.UUID,name:s.displayName,chars:s.characteristics.map(c=>({UUID:c.UUID,props:c.props}))}))));

test('registers unchanged legacy alias alongside dynamic platform',async t=>{
  const api=await makeAPI(t);const registrations=[];
  api.registerAccessory=(...args)=>registrations.push(args.slice(0,2));api.registerPlatform=(...args)=>registrations.push(args.slice(0,2));initialize(api);
  assert.deepEqual(registrations,[['homebridge-http-advanced-platform','HttpAdvancedAccessory'],['homebridge-http-advanced-platform','HttpAdvanced']]);
});
test('legacy service shape matches published plugin across service types, optional characteristics and props',async t=>{
  const api=await makeAPI(t);const Old=loadLegacy(api.hap);
  for(const config of [
    {name:'Switch',service:'Switch'},
    {name:'Lamp',service:'Lightbulb',optionCharacteristic:['Hue','Brightness','Saturation'],props:{Brightness:{minValue:5,maxValue:90}}},
    {name:'Thermostat',service:'Thermostat'},
    {name:'Security',service:'SecuritySystem'},
    {name:'Contact',service:'ContactSensor'},
    {name:'Window',service:'WindowCovering'},
  ]){
    const old=new Old(silentLog,config);const modern=new LegacyAccessory(silentLog,config,api);
    assert.deepEqual(shape(modern.getServices()),shape(old.getServices()));
  }
});
test('accessory information accepts metadata overrides without changing legacy or platform identity',async t=>{
  const api=await makeAPI(t);
  const info=accessory=>accessory.getService(api.hap.Service.AccessoryInformation);
  const value=(service,characteristic)=>service.getCharacteristic(characteristic).value;
  const config={name:'Identity',service:'Switch',manufacturer:'Acme',model:'Relay',serialNumber:'serial-123'};
  const legacy=new LegacyAccessory(silentLog,config,api);
  const legacyInfo=legacy.getServices()[0];
  assert.equal(value(legacyInfo,api.hap.Characteristic.Manufacturer),'Acme');
  assert.equal(value(legacyInfo,api.hap.Characteristic.Model),'Relay');
  assert.equal(value(legacyInfo,api.hap.Characteristic.SerialNumber),'serial-123');
  const platform=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Metadata',devices:[{...config,id:'stable-id'}]},api);
  platform.discover();
  const device=api.registrations[0];
  assert.equal(device.UUID,api.hap.uuid.generate('homebridge-http-advanced-accessory:Metadata:stable-id'));
  assert.equal(value(info(device),api.hap.Characteristic.Manufacturer),'Acme');
  assert.equal(value(info(device),api.hap.Characteristic.Model),'Relay');
  assert.equal(value(info(device),api.hap.Characteristic.SerialNumber),'serial-123');
  const defaults=new LegacyAccessory(silentLog,{name:'Defaults',service:'Switch'},api).getServices()[0];
  assert.equal(value(defaults,api.hap.Characteristic.Manufacturer),'Custom Manufacturer');
  assert.equal(value(defaults,api.hap.Characteristic.Model),'HTTP Accessory Model');
  assert.equal(value(defaults,api.hap.Characteristic.SerialNumber),'HTTP Accessory Serial Number');
  const platformDefault=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Default Metadata',devices:[{id:'stable-id',name:'Default',service:'Switch'}]},api);
  platformDefault.discover();
  assert.equal(value(info(api.registrations[1]),api.hap.Characteristic.SerialNumber),'stable-id');
});
test('inventory every historically documented service against actual HAP; BatteryService alias works',async t=>{
  const api=await makeAPI(t);
  const doc=readFileSync(new URL('../docs/legacy-reference.md',import.meta.url),'utf8');
  const names=doc.split('## Supported services')[1].split('## Configuration Examples')[0].trim().split(/\s+/);
  for(const name of names){
    if(name==='BatteryService'||typeof api.hap.Service[name]==='function')assert.equal(typeof serviceConstructor(api,name),'function');
    else assert.throws(()=>serviceConstructor(api,name),new RegExp('unsupported HomeKit service: '+name));
  }
  assert.equal(serviceConstructor(api,'BatteryService').UUID,api.hap.Service.Battery.UUID);
});
test('numeric, boolean, string characteristic conversions preserve false/zero',async t=>{
  const api=await makeAPI(t);
  assert.equal(convertValue(new api.hap.Characteristic.On(),'0'),false);
  assert.equal(convertValue(new api.hap.Characteristic.Brightness(),'0'),0);
  assert.equal(convertValue(new api.hap.Characteristic.CurrentTemperature(),'21.5'),21.5);
  assert.equal(convertValue(new api.hap.Characteristic.Name(),''),'');
  assert.equal(convertValue(new api.hap.Characteristic.Brightness(),'120'),100);
  assert.equal(convertValue(new api.hap.Characteristic.On(),'off'),false);
  assert.equal(convertValue(new api.hap.Characteristic.Name(),42),'42');
});
test('dynamic platform restores cached objects, retains IDs on rename with id, removes only obsolete devices',async t=>{
  const api=await makeAPI(t);
  const config={platform:'HttpAdvanced',name:'Test Platform',devices:[{id:'one',name:'One',service:'Switch'}]};
  const first=new HTTPPlatform(silentLog,config,api);first.discover();
  assert.equal(api.registrations.length,1);const original=api.registrations[0];
  const second=new HTTPPlatform(silentLog,{...config,devices:[{...config.devices[0],name:'Renamed'}]},api);second.configureAccessory(original);second.discover();
  assert.equal(api.registrations.length,1);assert.equal(api.updates[0],original);
  assert.equal(original.getService(api.hap.Service.Switch).getCharacteristic(api.hap.Characteristic.Name).value,'Renamed');
  const invalid=new HTTPPlatform(silentLog,{...config,devices:[{name:'bad',service:'Missing'}]},api);invalid.configureAccessory(original);invalid.discover();assert.equal(api.removals.length,0);
  const empty=new HTTPPlatform(silentLog,{...config,devices:[]},api);empty.configureAccessory(original);empty.discover();assert.equal(api.removals.length,1);
});
test('legacy and platform attach Battery to the primary accessory with separate HTTP actions',async t=>{
  const api=await makeAPI(t);const server=await fakeServer(t,(req,res)=>res.end(req.url==='/battery/level'?'79':req.url==='/battery/low'?'0':'1'));
  const config={id:'contact-one',name:'Door',service:'ContactSensor',username:'reader',password:'secret',uriCallsDelay:20,
    urls:{getContactSensorState:{url:server.url+'/contact'}},additionalServices:[{
      id:'battery',service:'BatteryService',optionCharacteristic:['BatteryLevel'],
      urls:{getStatusLowBattery:{url:server.url+'/battery/low'},getBatteryLevel:{url:server.url+'/battery/level'}},
    }]};
  const legacy=new LegacyAccessory(silentLog,config,api);
  assert.equal(legacy.getServices().length,3);
  const platform=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[config]},api);platform.discover();
  const accessory=api.registrations[0];
  assert.equal(accessory.services.length,3);
  assert.equal(accessory.getService(api.hap.Service.ContactSensor).subtype,undefined);
  const battery=accessory.services.find(service=>service.UUID===api.hap.Service.Battery.UUID);
  assert.equal(battery.subtype,'battery');
  assert.ok(battery.testCharacteristic(api.hap.Characteristic.BatteryLevel));
  const runtime=sharedRuntime(api,silentLog);
  assert.equal(new Set([...runtime.entries.values()].map(entry=>entry.requestOwner)).size,1);
  assert.ok([...runtime.entries.values()].every(entry=>entry.config.uriCallsDelay===20));
  await Promise.all([...runtime.entries.values()].map(entry=>runtime.refresh(entry)));
  assert.equal(await battery.getCharacteristic(api.hap.Characteristic.StatusLowBattery).handleGetRequest(),0);
  assert.equal(await battery.getCharacteristic(api.hap.Characteristic.BatteryLevel).handleGetRequest(),79);
  assert.equal(await accessory.getService(api.hap.Service.ContactSensor).getCharacteristic(api.hap.Characteristic.ContactSensorState).handleGetRequest(),1);
  assert.ok(server.requests.every(request=>request.headers.authorization==='Basic '+Buffer.from('reader:secret').toString('base64')));
});
test('platform restores, changes and removes additional services without replacing the primary identity',async t=>{
  const api=await makeAPI(t);
  const base={id:'fixed',name:'Door',service:'ContactSensor'};
  const first=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[base]},api);first.discover();
  const accessory=api.registrations[0],primary=accessory.getService(api.hap.Service.ContactSensor);
  const cache=identifierCache(),bridge=new api.hap.Bridge('Multi Test Bridge',api.hap.uuid.generate('Multi Test Bridge'));
  bridge.addBridgedAccessory(accessory._associatedHAPAccessory);bridge._assignIDs(cache);
  const originalIDs=[accessory._associatedHAPAccessory.aid,primary.iid,...primary.characteristics.map(characteristic=>characteristic.iid)];
  const withExtras={...base,additionalServices:[{id:'battery',service:'BatteryService'},{id:'secondary',service:'ContactSensor'}]};
  const second=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[withExtras]},api);
  second.configureAccessory(accessory);second.discover();
  assert.equal(api.registrations.length,1);assert.equal(api.updates[0],accessory);
  assert.equal(accessory.getService(api.hap.Service.ContactSensor),primary);
  bridge._assignIDs(cache);
  assert.deepEqual([accessory._associatedHAPAccessory.aid,primary.iid,...primary.characteristics.map(characteristic=>characteristic.iid)],originalIDs);
  assert.deepEqual(accessory.services.filter(service=>service.UUID===api.hap.Service.ContactSensor.UUID).map(service=>service.subtype),[undefined,'secondary']);
  assert.equal(accessory.services.find(service=>service.subtype==='battery').UUID,api.hap.Service.Battery.UUID);
  accessory._associatedPlugin='homebridge-http-advanced-platform';accessory._associatedPlatform='HttpAdvanced';
  const saved=JSON.parse(JSON.stringify(api.platformAccessory.serialize(accessory)));
  const restoredAPI=await makeAPI(t),restored=restoredAPI.platformAccessory.deserialize(saved);
  const third=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[withExtras]},restoredAPI);
  third.configureAccessory(restored);third.discover();
  assert.equal(restoredAPI.updates[0],restored);
  assert.deepEqual(restored.services.map(service=>service.subtype),accessory.services.map(service=>service.subtype));
  const invalid=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[{
    ...withExtras,additionalServices:[{id:'battery',service:'BatteryService'},{id:'battery',service:'Switch'}],
  }]},restoredAPI);invalid.configureAccessory(restored);invalid.discover();
  assert.equal(restoredAPI.removals.length,0);assert.equal(restored.services.length,4);
  const removed=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Multi',devices:[base]},restoredAPI);
  removed.configureAccessory(restored);removed.discover();
  assert.equal(restored.services.length,2);
  assert.equal(restored.getService(restoredAPI.hap.Service.ContactSensor).subtype,undefined);
  assert.equal(restored.UUID,accessory.UUID);
});
test('legacy and platform configurations expose equivalent services, getters and setters',async t=>{
  const api=await makeAPI(t);const server=await fakeServer(t);
  const config={name:'Equivalent',service:'Switch',urls:{getOn:{url:server.url},setOn:{url:server.url+'/set/{value}'}}};
  const legacy=new LegacyAccessory(silentLog,config,api);
  const platform=new HTTPPlatform(silentLog,{platform:'HttpAdvanced',name:'Test',devices:[config]},api);platform.discover();
  const runtime=sharedRuntime(api,silentLog);await Promise.all([...runtime.entries.values()].map(e=>runtime.refresh(e)));
  const a=legacy.getServices()[1], b=api.registrations[0].getService(api.hap.Service.Switch);
  assert.deepEqual(shape([a]),shape([b]));
  for(const s of [a,b]){const c=s.getCharacteristic(api.hap.Characteristic.On);assert.equal(await c.handleGetRequest(),true);await c.handleSetRequest(false);}
  assert.equal(server.requests.filter(r=>r.url==='/set/false').length,2);
});
test('ordinary legacy upgrade preserves Homebridge UUID input and serialized AID/IID assignment',async t=>{
  const api=await makeAPI(t);
  const modulePath=require.resolve(process.env.HB_TEST_VERSION==='1'?'homebridge-v1':'homebridge').replace(/index\.js$/,'bridgeService.js');
  const {BridgeService}=await import(pathToFileURL(modulePath).href);
  const Old=loadLegacy(api.hap), config={name:'Identity',service:'Lightbulb',optionCharacteristic:['Brightness'],manufacturer:'Acme',model:'Relay',serialNumber:'serial-123'};
  const old=new Old(silentLog,config), modern=new LegacyAccessory(silentLog,config,api);
  const identity=api.hap.uuid.generate('HttpAdvancedAccessory:Identity');
  const build=(instance,plugin)=>BridgeService.prototype.createHAPAccessory.call({}, {getPluginIdentifier:()=>plugin}, instance, config.name, 'HttpAdvancedAccessory');
  const before=build(old,'homebridge-http-advanced-accessory'),after=build(modern,'homebridge-http-advanced-platform');
  assert.equal(before.UUID,after.UUID);
  assert.equal(after.UUID,identity);
  assert.equal(before.getService(api.hap.Service.AccessoryInformation).getCharacteristic(api.hap.Characteristic.Manufacturer).value,'Custom Manufacturer');
  assert.equal(after.getService(api.hap.Service.AccessoryInformation).getCharacteristic(api.hap.Characteristic.Manufacturer).value,'Acme');
  // persisted identifier lookup keys are the accessory UUID, service UUID/subtype and characteristic UUID
  const keys=a=>a.services.flatMap(s=>s.characteristics.map(c=>[a.UUID,s.UUID,s.subtype,c.UUID]));
  assert.deepEqual(keys(before),keys(after));
});
test('Homebridge reassigns the Alpha.5 cached platform to the renamed package without changing UUID or AIDs/IIDs',async t=>{
  const api=await makeAPI(t);
  const modulePath=require.resolve(process.env.HB_TEST_VERSION==='1'?'homebridge-v1':'homebridge').replace(/index\.js$/,'bridgeService.js');
  const {BridgeService}=await import(pathToFileURL(modulePath).href);
  const config={platform:'HttpAdvanced',name:'Identity Platform',devices:[{id:'fixed-id',name:'Renamed Switch',service:'Switch'}]};
  const UUID=api.hap.uuid.generate('homebridge-http-advanced-accessory:Identity Platform:fixed-id');
  const original=new api.platformAccessory('Original Switch',UUID);
  original.addService(new api.hap.Service.Switch('Original Switch'));
  original._associatedPlugin='homebridge-http-advanced-accessory';original._associatedPlatform='HttpAdvanced';
  const cache=identifierCache(),bridgeUUID=api.hap.uuid.generate('Packaging Identity Bridge');
  const oldBridge=new api.hap.Bridge('Packaging Identity Bridge',bridgeUUID);
  oldBridge.addBridgedAccessory(original._associatedHAPAccessory);oldBridge._assignIDs(cache);
  const ids=accessory=>({aid:accessory.aid,services:accessory.services.map(s=>({iid:s.iid,characteristics:s.characteristics.map(c=>c.iid)}))});
  const before=ids(original._associatedHAPAccessory);
  const restored=api.platformAccessory.deserialize(JSON.parse(JSON.stringify(api.platformAccessory.serialize(original))));
  const platform=new HTTPPlatform(silentLog,config,api);
  const plugin={getPluginIdentifier:()=> 'homebridge-http-advanced-platform',getActiveDynamicPlatform:name=>name==='HttpAdvanced'?platform:undefined};
  const context={cachedPlatformAccessories:[restored],bridgeOptions:{keepOrphanedCachedAccessories:false},
    bridge:new api.hap.Bridge('Packaging Identity Bridge',bridgeUUID),pluginManager:{
      getPlugin:name=>name==='homebridge-http-advanced-platform'?plugin:undefined,
      getPluginByActiveDynamicPlatform:name=>{assert.equal(name,'HttpAdvanced');return plugin;},
    }};
  BridgeService.prototype.restoreCachedPlatformAccessories.call(context);
  platform.discover();context.bridge._assignIDs(cache);
  assert.equal(restored._associatedPlugin,'homebridge-http-advanced-platform');
  assert.equal(restored.UUID,UUID);assert.equal(context.cachedPlatformAccessories.length,1);
  assert.equal(api.registrations.length,0);assert.equal(api.removals.length,0);
  assert.equal(api.updates[0],restored);assert.deepEqual(ids(restored._associatedHAPAccessory),before);
});
test('sanitized 44-device fixture preserves all delay and mapper variants without config rewriting',async t=>{
  const api=await makeAPI(t);const runtime=new Runtime(silentLog);t.after(()=>runtime.shutdown());
  const devices=JSON.parse(readFileSync(new URL('./fixtures/fleet.json',import.meta.url)));
  const original=JSON.stringify(devices);
  for(const config of devices)new DeviceAdapter(api,runtime,config,config.name);
  assert.equal(runtime.entries.size,44);assert.equal([...runtime.entries.values()].filter(e=>e.config.forceRefreshDelay===500).length,3);
  assert.equal(JSON.stringify(devices),original);
});

test('serialized platform lifecycle preserves identity through disable and re-enable, then removes explicitly',async t=>{
  const server=await fakeServer(t,(req,res)=>res.end(req.url.startsWith('/set')?'OK':'1'));
  const config={platform:'HttpAdvanced',name:'Lifecycle',enabled:true,devices:[{id:'stable-id',name:'Original',service:'Switch',urls:{getOn:{url:server.url},setOn:{url:server.url+'/set/{value}'}}}]};
  const firstAPI=await makeAPI(t);
  new HTTPPlatform(silentLog,config,firstAPI).discover();
  const original=firstAPI.registrations[0];
  const firstRuntime=sharedRuntime(firstAPI,silentLog);
  await firstRuntime.refresh([...firstRuntime.entries.values()][0]);
  // use Homebridge's real persistence format, not an in-memory object with old handlers
  original._associatedPlugin='homebridge-http-advanced-accessory';original._associatedPlatform='HttpAdvanced';
  const saved=JSON.parse(JSON.stringify(firstAPI.platformAccessory.serialize(original)));
  firstAPI.emit('shutdown');
  const restore=api=>api.platformAccessory.deserialize(structuredClone(saved));
  const disabledAPI=await makeAPI(t);const disabledAccessory=restore(disabledAPI);
  const disabled=new HTTPPlatform(silentLog,{...config,enabled:false},disabledAPI);disabled.configureAccessory(disabledAccessory);disabled.discover();
  const off=disabledAccessory.getService(disabledAPI.hap.Service.Switch).getCharacteristic(disabledAPI.hap.Characteristic.On);
  const before=server.requests.length;
  await assert.rejects(off.handleGetRequest());await assert.rejects(off.handleSetRequest(false));
  assert.equal(server.requests.length,before);assert.equal(disabledAPI.removals.length,0);
  assert.equal(disabledAccessory.UUID,original.UUID);
  const enabledAPI=await makeAPI(t);const restored=restore(enabledAPI);
  const renamed={...config,devices:[{...config.devices[0],name:'Renamed'}]};
  const enabled=new HTTPPlatform(silentLog,renamed,enabledAPI);enabled.configureAccessory(restored);enabled.discover();
  assert.equal(enabledAPI.registrations.length,0);assert.equal(enabledAPI.updates[0].UUID,original.UUID);
  const runtime=sharedRuntime(enabledAPI,silentLog);await runtime.refresh([...runtime.entries.values()][0]);
  const on=restored.getService(enabledAPI.hap.Service.Switch).getCharacteristic(enabledAPI.hap.Characteristic.On);
  assert.equal(await on.handleGetRequest(),true);await on.handleSetRequest(false);
  assert.equal(server.requests.filter(req=>req.url==='/set/false').length,1);
  enabledAPI.emit('shutdown');
  for(const overrides of [{enabled:'false',devices:[]},{devices:[{name:'Invalid',service:'Missing'}]},{coordinator:{concurrency:0},devices:[]}]){
    const api=await makeAPI(t);const accessory=restore(api);const platform=new HTTPPlatform(silentLog,{...config,...overrides},api);
    platform.configureAccessory(accessory);platform.discover();assert.equal(api.removals.length,0);
    await assert.rejects(accessory.getService(api.hap.Service.Switch).getCharacteristic(api.hap.Characteristic.On).handleSetRequest(false));
  }
  const emptyAPI=await makeAPI(t);const empty=new HTTPPlatform(silentLog,{...config,devices:[]},emptyAPI);
  empty.configureAccessory(restore(emptyAPI));empty.discover();assert.equal(emptyAPI.removals.length,1);
  assert.equal(emptyAPI.removals[0].UUID,original.UUID);
});
