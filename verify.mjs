import {assertFunctionalModel} from "./functional-boundary.mjs";
import fs from 'node:fs';import crypto from 'node:crypto';import zlib from 'node:zlib';import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('manifest.json')),allowed=['index.html','app.min.js','worker.min.js','style.min.css','fit.wasm','model.json.gz'];
assert.deepEqual(Object.keys(manifest.files).sort(),allowed.sort());
for(const [name,hash]of Object.entries(manifest.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'),hash,name);
const p=JSON.parse(zlib.gunzipSync(fs.readFileSync('model.json.gz')));assert.equal(p.kind,'synthetic-flexible-response');assertFunctionalModel(p);
const wasm=new WebAssembly.Module(fs.readFileSync('fit.wasm'));assert.deepEqual(WebAssembly.Module.imports(wasm),[]);assert.equal(WebAssembly.Module.customSections(wasm,'name').length,0);assert.ok(WebAssembly.Module.exports(wasm).some(x=>x.name==='normal'));
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('data-bundled="true"'));assert.ok(!html.includes('id="model"'));assert.ok(html.includes('+1.207630378 EV'));
for(const n of ['app.min.js','worker.min.js']){const text=fs.readFileSync(n,'utf8');assert.ok(!text.includes('sourceMappingURL'));assert.ok(!text.includes('/Users/'));assert.ok(!text.includes('/Volumes/'));}
const s=JSON.parse(fs.readFileSync('validation-summary.json'));assert.equal(s.passed,false);assert.equal(s.pipeline,'fixed121-feasible-color-experimental-v1');assert.equal(s.color_preservation_passed,false);assert.equal(s.no_shelf_measured,true);assert.equal(s.nx_validation,false);assert.equal(s.exact_lut_cache,false);assert.equal(s.model_sha256,manifest.files['model.json.gz']);
console.log('Verified hashes, synthetic-only model schema, fixed normalization, standalone optimizer and explicit known-regression release summary.');
