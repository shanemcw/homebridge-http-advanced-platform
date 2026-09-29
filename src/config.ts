import { ActionError, type ActionConfig, type DeviceConfig } from './types.js';

export function validateDevice(config: DeviceConfig): void {
  if (!config || typeof config.name !== 'string' || !config.name.trim() || typeof config.service !== 'string') {
    throw new ActionError('config');
  }
  for (const value of [config.forceRefreshDelay, config.setterDelay, config.uriCallsDelay, config.writeConfirmationTimeout]) {
    if (value !== undefined && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) throw new ActionError('config');
  }
  for (const value of Object.values(config.refresh ?? {})) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new ActionError('config');
  }
  if (config.optionCharacteristic && (!Array.isArray(config.optionCharacteristic) || config.optionCharacteristic.some(v => typeof v !== 'string'))) {
    throw new ActionError('config');
  }
  if (config.urls && (typeof config.urls !== 'object' || Array.isArray(config.urls))) throw new ActionError('config');
  for (const action of Object.values(config.urls ?? {})) validateAction(action, new Set());
  if (config.additionalServices !== undefined) {
    if (!Array.isArray(config.additionalServices) || config.additionalServices.length > 32) throw new ActionError('config');
    const ids = new Set<string>();
    for (const additional of config.additionalServices) {
      if (!additional || typeof additional !== 'object' || Array.isArray(additional)
        || typeof additional.id !== 'string' || !additional.id.trim()
        || additional.id !== additional.id.trim() || ids.has(additional.id)
        || typeof additional.service !== 'string' || !additional.service.trim()
        || additional.service === 'AccessoryInformation'
        || additional.name !== undefined && (typeof additional.name !== 'string' || !additional.name.trim())
        || 'additionalServices' in additional) throw new ActionError('config');
      ids.add(additional.id);
      validateDevice({ ...serviceDefaults(config), ...additional, name: additional.name ?? config.name });
    }
  }
}

function serviceDefaults(config: DeviceConfig): DeviceConfig {
  const defaults = { ...config };
  delete defaults.additionalServices;
  delete defaults.optionCharacteristic;
  delete defaults.props;
  delete defaults.urls;
  return defaults;
}

export function serviceConfigs(config: DeviceConfig): Array<{ config: DeviceConfig; subtype?: string }> {
  const { additionalServices, ...primary } = config;
  const defaults = serviceDefaults(config);
  return [{ config: primary }, ...(additionalServices ?? []).map(additional => ({
    config: { ...defaults, ...additional, name: additional.name ?? config.name }, subtype: additional.id,
  }))];
}

function validateAction(action: ActionConfig, seen: Set<ActionConfig>): void {
  if (!action || seen.has(action) || seen.size >= 32 || typeof action.url !== 'string' || !/^https?:\/\//i.test(action.url)) {
    throw new ActionError('config');
  }
  seen.add(action);
  if (!/^[A-Za-z]+$/.test(action.httpMethod || 'GET')) throw new ActionError('config');
  if (action.body !== undefined && typeof action.body !== 'string') throw new ActionError('config');
  if (action.timeout !== undefined && (!Number.isFinite(action.timeout) || action.timeout <= 0)) throw new ActionError('config');
  if (action.requireResponseMatch !== undefined && typeof action.requireResponseMatch !== 'boolean') throw new ActionError('config');
  if (action.responsePattern !== undefined) {
    if (typeof action.responsePattern !== 'string') throw new ActionError('config');
    try { new RegExp(action.responsePattern); } catch { throw new ActionError('config'); }
  }
  if (action.mappers !== undefined && !Array.isArray(action.mappers)) throw new ActionError('config');
  for (const mapper of action.mappers ?? []) {
    if (!mapper || !mapper.parameters) throw new ActionError('config');
    switch (mapper.type) {
      case 'regex': try { new RegExp(mapper.parameters.regexp); } catch { throw new ActionError('config'); } break;
      case 'static': if (!mapper.parameters.mapping || typeof mapper.parameters.mapping !== 'object') throw new ActionError('config'); break;
      case 'lookup': {
        const p = mapper.parameters;
        const mapping = p.mapping;
        if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping) || !Object.keys(mapping).length
          || Object.keys(p).some(key => key !== 'mapping')
          || Object.values(mapping).some(value => !['string', 'boolean', 'number'].includes(typeof value)
            || typeof value === 'number' && !Number.isFinite(value))) throw new ActionError('config');
        break;
      }
      case 'eval': if (typeof mapper.parameters.expression !== 'string') throw new ActionError('config'); break;
      case 'xpath': if (typeof mapper.parameters.xpath !== 'string') throw new ActionError('config'); break;
      case 'jpath': if (typeof mapper.parameters.jpath !== 'string') throw new ActionError('config'); break;
      case 'scale': {
        const p = mapper.parameters;
        if ([p.inputMin, p.inputMax, p.outputMin, p.outputMax].some(value => typeof value !== 'number' || !Number.isFinite(value))
          || p.inputMax <= p.inputMin || !Number.isFinite(p.inputMax - p.inputMin)
          || !Number.isFinite(p.outputMax - p.outputMin)
          || p.round !== undefined && (!Number.isInteger(p.round) || p.round < 0 || p.round > 12)
          || p.clamp !== undefined && typeof p.clamp !== 'boolean'
          || Object.keys(p).some(key => !['inputMin', 'inputMax', 'outputMin', 'outputMax', 'round', 'clamp'].includes(key))) {
          throw new ActionError('config');
        }
        break;
      }
      default: throw new ActionError('config');
    }
  }
  if (action.inconclusive) validateAction(action.inconclusive, seen);
}
