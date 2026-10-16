import fs from 'node:fs';import crypto from 'node:crypto';import zlib from 'node:zlib';import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('manifest.json'));
for(const [name,hash]of Object.entries(manifest.files)){assert.ok(!name.includes('/')&&!name.includes('..'));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'),hash,name);}
const p=JSON.parse(zlib.gunzipSync(fs.readFileSync('model.json.gz')));
const keys=(o,k)=>assert.deepEqual(Object.keys(o).sort(),k.sort());
keys(p,['version','kind','exposureEV','fields','groups','linear','weights','regions','provenance']);assert.equal(p.version,2);assert.equal(p.kind,'fixed121-response');assert.equal(p.exposureEV,1.2076303781988988);assert.equal(p.regions.length,9);assert.equal(p.groups.length,14);assert.equal(p.provenance.minimumContributors,8);assert.deepEqual(p.linear.shape,[313,3]);
for(const r of p.regions){keys(r,['label','controls','base','jacobian']);assert.match(r.label,/^Region [1-9]$/);assert.deepEqual(r.base.shape,[313,3]);assert.deepEqual(r.jacobian.shape,[313,3,14]);}
const bytes=Buffer.from(p.linear.data,'base64');for(let i=0;i<bytes.length;i+=8){const grid=(Math.log2(bytes.readDoubleLE(i))+12)/.5-.5;assert.ok(Math.abs(grid-Math.round(grid))<1e-9);}
for(const marker of ['/Users/','/Volumes/','.NEF','.TIF','Cinema','FilmBias','np3_sha256','curve_points','"bank"','"recipe"'])assert.ok(!JSON.stringify(p).includes(marker),marker);
const wasm=new WebAssembly.Module(fs.readFileSync('fit.wasm'));assert.deepEqual(WebAssembly.Module.imports(wasm),[]);assert.equal(WebAssembly.Module.customSections(wasm,'name').length,0);assert.ok(WebAssembly.Module.exports(wasm).some(x=>x.name==='normal'));
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('data-bundled="true"'));assert.ok(!html.includes('id="model"'));assert.ok(html.includes('+1.207630378 EV'));
for(const n of ['app.min.js','worker.min.js'])assert.ok(!fs.readFileSync(n,'utf8').includes('sourceMappingURL'));
const s=JSON.parse(fs.readFileSync('validation-summary.json'));assert.equal(s.passed,true);assert.equal(s.nx_validation,false);assert.equal(s.exact_lut_cache,false);assert.equal(s.model_sha256,manifest.files['model.json.gz']);
console.log('Verified asset hashes, preset-free schema, synthetic cells, normalization, standalone Wasm and bundled UI.');
