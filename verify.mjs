import fs from 'node:fs';import crypto from 'node:crypto';import zlib from 'node:zlib';import assert from 'node:assert/strict';
const manifest=JSON.parse(fs.readFileSync('manifest.json')),allowed=['index.html','app.min.js','worker.min.js','style.min.css','fit.wasm','model.json.gz'];
assert.deepEqual(Object.keys(manifest.files).sort(),allowed.sort());
for(const [name,hash]of Object.entries(manifest.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex'),hash,name);
const p=JSON.parse(zlib.gunzipSync(fs.readFileSync('model.json.gz')));assert.equal(p.kind,'synthetic-flexible-response');assertPublicModel(p);
const wasm=new WebAssembly.Module(fs.readFileSync('fit.wasm'));assert.deepEqual(WebAssembly.Module.imports(wasm),[]);assert.equal(WebAssembly.Module.customSections(wasm,'name').length,0);assert.ok(WebAssembly.Module.exports(wasm).some(x=>x.name==='normal'));
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('data-bundled="true"'));assert.ok(!html.includes('id="model"'));assert.ok(html.includes('+1.207630378 EV'));
for(const n of ['app.min.js','worker.min.js']){const text=fs.readFileSync(n,'utf8');assert.ok(!text.includes('sourceMappingURL'));assert.ok(!text.includes('/Users/'));assert.ok(!text.includes('/Volumes/'));}
const s=JSON.parse(fs.readFileSync('validation-summary.json'));assert.equal(s.passed,true);assert.equal(s.nx_validation,false);assert.equal(s.exact_lut_cache,false);assert.equal(s.model_sha256,manifest.files['model.json.gz']);assert.equal(s.qualification_campaign.gates_passed,true);
console.log('Verified hashes, synthetic-only model schema, fixed normalization, standalone optimizer and qualification summary.');

// Release builds accept reviewed data schemas, never a caller's privacy flag.
const publicKeys=new Set(['version','kind','exposureEV','fields','groups','linear','weights','regions','provenance']);
const regionKeys=new Set(['label','controls','base','jacobian']);
export function assertPublicModel(model){
 if(model?.kind==='synthetic-flexible-response')return assertSyntheticModel(model);
 if(model?.kind!=='fixed121-response'||model.version!==2)throw Error('Model schema is not approved for public distribution');
 if(Object.keys(model).some(k=>!publicKeys.has(k)))throw Error('Unreviewed public model field');
 if(!Array.isArray(model.regions)||model.regions.some(r=>Object.keys(r).some(k=>!regionKeys.has(k))))throw Error('Unreviewed public region payload');
 // Structural approval is only one gate. Numerical coverage and provenance
 // still require separate qualification before a new model version ships.
 return true;
}

// Numeric schema for generated experiments. This validates structure and
// exclusion rules; release qualification is recorded separately for its hash.
export function assertSyntheticModel(p){
 const exact=(v,keys)=>{if(!v||typeof v!=='object'||Object.keys(v).sort().join('|')!==keys.slice().sort().join('|'))throw Error('Unreviewed synthetic model field');};
 const shape=(v,d)=>{if(!d.length){if(typeof v!=='number'||!Number.isFinite(v))throw Error('Nonfinite model value');return;}if(!Array.isArray(v)||v.length!==d[0])throw Error('Invalid synthetic dimensions');v.forEach(x=>shape(x,d.slice(1)));};
 exact(p,['kind','version','exposure_ev','fields','arrays','controls','grids','outputMatrix','provenance']);
 if(p.kind!=='synthetic-flexible-response'||p.version!==1||p.exposure_ev!==1.2076303781988988)throw Error('Unapproved synthetic model version or normalization');
 const sectors=['Red','Orange','Yellow','Green','Aqua','Blue','Purple','Magenta'],blender=sectors.flatMap(s=>['Hue','Saturation','Luminance'].map(a=>a+'Adjustment'+s));
 const fields=['Contrast2012','Highlights2012','Shadows2012','Whites2012','Blacks2012','Saturation',...blender,'SplitToningShadowHue','SplitToningShadowSaturation','ColorGradeShadowLum','ColorGradeMidtoneHue','ColorGradeMidtoneSat','ColorGradeMidtoneLum','SplitToningHighlightHue','SplitToningHighlightSaturation','ColorGradeHighlightLum','ColorGradeBlending','SplitToningBalance'];exact(p.fields,fields);
 let offset=0;for(const f of fields){const def=p.fields[f],hue=['SplitToningShadowHue','ColorGradeMidtoneHue','SplitToningHighlightHue'].includes(f),unsigned=['SplitToningShadowSaturation','ColorGradeMidtoneSat','SplitToningHighlightSaturation','ColorGradeBlending'].includes(f),wanted=[offset,hue?'H':unsigned?'B':'b',hue||unsigned?0:-100,hue?360:100];if(JSON.stringify(def)!==JSON.stringify(wanted))throw Error('Invalid encoded control definition');offset+=hue?2:1;}
 exact(p.arrays,['nlg','linear','train','stratum']);const n=p.arrays.nlg.length;if(n<16||n>10000)throw Error('Invalid sample count');shape(p.arrays.nlg,[n,3]);shape(p.arrays.linear,[n,3]);shape(p.arrays.stratum,[n]);if(p.arrays.train.length!==n||!p.arrays.train.every(v=>typeof v==='boolean')||!p.arrays.train.some(Boolean)||p.arrays.train.every(Boolean))throw Error('Invalid sample split');
 exact(p.controls,['baseComplex','matrix','saturationGain','levels','rays','responses','grading']);const c=p.controls;if(c.rays!==256||JSON.stringify(c.levels)!=='[-25,0,25]')throw Error('Invalid control sampling');shape(c.baseComplex,[256,2]);shape(c.matrix,[3,3]);shape(c.saturationGain,[201]);exact(c.responses,blender);for(const r of Object.values(c.responses))shape(r,[3,256,3]);exact(c.grading,['hueResponse','envelope','luma100']);shape(c.grading.hueResponse,[360,3]);shape(c.grading.envelope,[65]);shape(c.grading.luma100,[]);
 exact(p.grids,['stock-response','tone-preparation','gamut-output']);for(const g of Object.values(p.grids)){exact(g,['shape','encoding','yPower','values']);if(JSON.stringify(g.shape)!=='[65,65,65,3]'||g.encoding!=='f32le-base64'||g.yPower!==2||typeof g.values!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(g.values))throw Error('Invalid synthetic grid');const bytes=Buffer.from(g.values,'base64');if(bytes.length!==65**3*12)throw Error('Invalid synthetic grid bytes');for(let i=0;i<bytes.length;i+=4)if(!Number.isFinite(bytes.readFloatLE(i)))throw Error('Nonfinite grid');}
 shape(p.outputMatrix,[3,3]);exact(p.provenance,['source','image_samples','raw_vendor_tables','vendor_code','prepared_memory','preset_bank','qualification','response_interpolation']);for(const k of ['image_samples','raw_vendor_tables','vendor_code','prepared_memory','preset_bank'])if(p.provenance[k]!==false)throw Error('Private data is prohibited');for(const k of ['source','qualification','response_interpolation'])if(typeof p.provenance[k]!=='string'||p.provenance[k].length>1000)throw Error('Invalid provenance');
 const json=JSON.stringify(p);for(const marker of ['/Users/','/Volumes/','.NEF','.TIF','np3_sha256','curve_points'])if(json.includes(marker))throw Error('Private artifact marker');return true;
}
