import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const pkg = JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
export function validateRelease(pkg, tag) {
  const channel = /^2\.0\.0-(alpha|beta)\.\d+$/.exec(pkg.version)?.[1]
    ?? (/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(pkg.version) ? 'latest' : undefined);
  if (pkg.name !== 'homebridge-http-advanced-platform' || !channel || tag !== channel) {
    throw new Error('Publishing requires the platform package name and an explicit --tag matching its alpha, beta or stable latest version');
  }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) validateRelease(pkg, process.env.npm_config_tag);
