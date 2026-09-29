import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {makeAPI} from './helpers.mjs';
import {validateDevice} from '../dist/config.js';
const require=createRequire(import.meta.url);

test('actual Homebridge plugin loader loads the ESM entry and registers both adapters',async t=>{
  const api=await makeAPI(t),calls=[];
  api.registerAccessory=(...args)=>calls.push(args[1]);api.registerPlatform=(...args)=>calls.push(args[1]);
  const packageName=process.env.HB_TEST_VERSION==='1'?'homebridge-v1':'homebridge';
  const modulePath=require.resolve(packageName).replace(/index\.js$/,'plugin.js');
  const {Plugin}=await import(pathToFileURL(modulePath).href);
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  const plugin=new Plugin(pkg.name,fileURLToPath(new URL('..',import.meta.url)),pkg);
  await plugin.load();await plugin.initialize(api);
  assert.deepEqual(calls,['HttpAdvancedAccessory','HttpAdvanced']);
});
test('platform JSON schema accepts every sanitized legacy device and recursive actions',()=>{
  const Ajv=require('ajv');
  const schema=JSON.parse(readFileSync(new URL('../config.schema.json',import.meta.url),'utf8'));
  const devices=JSON.parse(readFileSync(new URL('./fixtures/fleet.json',import.meta.url),'utf8'));
  assert.equal(schema.pluginAlias, 'HttpAdvancedAccessory');
  assert.equal(schema.pluginType, 'accessory');
  assert.equal(schema.customUi, true);
  const ajv=new Ajv({formats:{password:()=>true}});
  const legacyValidator=ajv.compile(schema.schema);
  for (const device of devices) assert.equal(legacyValidator(device),true,JSON.stringify(legacyValidator.errors));
  const validator=ajv.compile({definitions:schema.schema.definitions,$ref:'#/definitions/platform'});
  assert.equal(validator({name:'Fixture',platform:'HttpAdvanced',devices}),true,JSON.stringify(validator.errors));
  const multiService={name:'Door',service:'ContactSensor',additionalServices:[{
    id:'battery',service:'BatteryService',optionCharacteristic:['BatteryLevel'],
    urls:{getStatusLowBattery:{url:'http://example.invalid/low'},getBatteryLevel:{url:'http://example.invalid/level'}},
  }]};
  assert.equal(legacyValidator(multiService),true,JSON.stringify(legacyValidator.errors));
  assert.equal(validator({name:'Fixture',platform:'HttpAdvanced',devices:[multiService]}),true,JSON.stringify(validator.errors));
  validateDevice(multiService);
  const scaleDevice={name:'Dimmer',service:'Lightbulb',urls:{getBrightness:{url:'http://example.invalid/level',mappers:[{
    type:'scale',parameters:{inputMin:0,inputMax:255,outputMin:0,outputMax:100,round:0,clamp:true},
  }]}}};
  assert.equal(legacyValidator(scaleDevice),true,JSON.stringify(legacyValidator.errors));
  assert.equal(validator({name:'Fixture',platform:'HttpAdvanced',devices:[scaleDevice]}),true,JSON.stringify(validator.errors));
  validateDevice(scaleDevice);
  devices[0].urls.getOn.inconclusive={url:'http://example.invalid',mappers:[{type:'eval',parameters:{expression:'value'}}]};
  devices[0].urls.getOn.responsePattern='^(?:ON|OFF)$';
  devices[0].urls.getOn.requireResponseMatch=true;
  assert.equal(validator({name:'Fixture',platform:'HttpAdvanced',devices}),true,JSON.stringify(validator.errors));
});

test('scale parameters reject invalid bounds and options during configuration validation', () => {
  const schema=JSON.parse(readFileSync(new URL('../config.schema.json',import.meta.url),'utf8'));
  const Ajv=require('ajv');
  const schemaValidator=new Ajv({formats:{password:()=>true}}).compile(schema.schema);
  const base={inputMin:0,inputMax:255,outputMin:0,outputMax:100};
  const device=parameters=>({name:'Dimmer',service:'Lightbulb',urls:{getBrightness:{url:'http://example.invalid',mappers:[{type:'scale',parameters}]}}});
  for (const parameters of [
    {inputMin:0,inputMax:255,outputMin:0},
    {...base,inputMin:'0'},
    {...base,round:-1},
    {...base,round:13},
    {...base,round:1.5},
    {...base,clamp:'true'},
    {...base,extra:1},
  ]) {
    assert.equal(schemaValidator(device(parameters)),false,JSON.stringify(parameters));
    assert.throws(() => validateDevice(device(parameters)),{category:'config'});
  }
  for (const parameters of [
    {...base,inputMax:0},
    {...base,inputMax:-1},
    {...base,inputMax:Infinity},
    {...base,inputMax:NaN},
    {...base,inputMin:-1e308,inputMax:1e308},
  ]) {
    assert.throws(() => validateDevice(device(parameters)),{category:'config'});
  }
});

test('documented dimmer example is valid accessory configuration', () => {
  const readme=readFileSync(new URL('../README.md',import.meta.url),'utf8');
  const section=readme.split('### Scale a device value (unpublished Alpha.9)')[1].split('### Add battery information')[0];
  const example=JSON.parse(section.match(/```json\s*([\s\S]*?)\s*```/)[1]);
  const schema=JSON.parse(readFileSync(new URL('../config.schema.json',import.meta.url),'utf8'));
  const Ajv=require('ajv');
  const schemaValidator=new Ajv({formats:{password:()=>true}}).compile(schema.schema);
  assert.equal(schemaValidator(example),true,JSON.stringify(schemaValidator.errors));
  validateDevice(example);
  assert.equal(example.urls.getBrightness.mappers[0].type,'scale');
  assert.equal(example.urls.setBrightness.mappers[0].type,'scale');
});

test('response patterns validate before startup, including fallback actions', () => {
  const device = {name:'Fixed protocol',service:'Switch',urls:{getOn:{url:'http://example.invalid',responsePattern:'^(?:ON|OFF)$'}}};
  validateDevice(device);
  for (const responsePattern of ['[', 7, null]) {
    device.urls.getOn.inconclusive = {url:'http://example.invalid/fallback',responsePattern};
    assert.throws(() => validateDevice(device), {category:'config'});
  }
  device.urls.getOn.inconclusive = {url:'http://example.invalid/fallback',requireResponseMatch:'yes'};
  assert.throws(() => validateDevice(device), {category:'config'});
});
