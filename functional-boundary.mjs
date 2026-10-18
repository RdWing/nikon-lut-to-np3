// Strict numeric schema for the reviewed generated functional model. Provenance
// additionally requires its hash-pinned generation audit and release receipt.
export function assertFunctionalModel(p){
 const exact=(v,keys)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).sort().join('|')!==keys.slice().sort().join('|'))throw Error('Unreviewed functional model field');};
 const shape=(v,d)=>{if(!d.length){if(typeof v!=='number'||!Number.isFinite(v))throw Error('Nonfinite functional value');return;}if(!Array.isArray(v)||v.length!==d[0])throw Error('Invalid functional dimensions');for(const x of v)shape(x,d.slice(1));};
 exact(p,['kind','version','exposure_ev','fields','arrays','controls','grids','outputMatrix','provenance','twist_graph']);
 if(p.kind!=='synthetic-flexible-response'||p.version!==2||p.exposure_ev!==1.2076303781988988)throw Error('Unapproved functional model normalization/version');
 const sectors=['Red','Orange','Yellow','Green','Aqua','Blue','Purple','Magenta'],blender=sectors.flatMap(s=>['Hue','Saturation','Luminance'].map(a=>a+'Adjustment'+s));
 const fields=['Contrast2012','Highlights2012','Shadows2012','Whites2012','Blacks2012','Saturation',...blender,'SplitToningShadowHue','SplitToningShadowSaturation','ColorGradeShadowLum','ColorGradeMidtoneHue','ColorGradeMidtoneSat','ColorGradeMidtoneLum','SplitToningHighlightHue','SplitToningHighlightSaturation','ColorGradeHighlightLum','ColorGradeBlending','SplitToningBalance'];
 exact(p.fields,fields);let offset=0;
 for(const f of fields){const hue=['SplitToningShadowHue','ColorGradeMidtoneHue','SplitToningHighlightHue'].includes(f),unsigned=['SplitToningShadowSaturation','ColorGradeMidtoneSat','SplitToningHighlightSaturation','ColorGradeBlending'].includes(f),wanted=[offset,hue?'H':unsigned?'B':'b',hue||unsigned?0:-100,hue?360:100];if(JSON.stringify(p.fields[f])!==JSON.stringify(wanted))throw Error('Invalid functional control definition');offset+=hue?2:1;}
 exact(p.arrays,['nlg','linear','train','stratum']);const a=p.arrays,n=a.nlg.length;
 if(!Number.isInteger(n)||n<16||n>10000)throw Error('Invalid functional sample count');
 shape(a.nlg,[n,3]);shape(a.linear,[n,3]);shape(a.stratum,[n]);
 if(a.nlg.some(v=>v.some(x=>x<0||x>1))||a.linear.some(v=>v.some(x=>x<0))||a.stratum.some(x=>!Number.isInteger(x)||x<0||x>=960))throw Error('Invalid procedural color domain');
 if(!Array.isArray(a.train)||a.train.length!==n||!a.train.every(x=>typeof x==='boolean')||!a.train.some(Boolean)||a.train.every(Boolean))throw Error('Invalid functional sample split');
 const groups=new Map();a.linear.forEach((v,i)=>{const k=v.join('/');if(groups.has(k)&&groups.get(k)!==a.train[i])throw Error('Source color leaks across training and reserved samples');groups.set(k,a.train[i]);});
 exact(p.controls,['baseComplex','matrix','saturationGain','levels','rays','responses','grading','coarse','rgbYuv']);const c=p.controls;
 if(c.rays!==256||JSON.stringify(c.levels)!=='[-100,-75,-50,-25,0,25,50,75,100]')throw Error('Invalid functional response levels');
 shape(c.baseComplex,[256,2]);shape(c.matrix,[3,3]);shape(c.saturationGain,[201]);exact(c.responses,blender);for(const v of Object.values(c.responses))shape(v,[9,256,3]);
 exact(c.grading,['hueResponse','envelope','luma100']);shape(c.grading.hueResponse,[360,3]);shape(c.grading.envelope,[65]);shape(c.grading.luma100,[]);
 exact(c.coarse,['version','levels','rays','coordinate','baseComplex','responses']);
 if(c.coarse.version!==1||c.coarse.rays!==32||typeof c.coarse.coordinate!=='string'||c.coarse.coordinate.length>300||JSON.stringify(c.coarse.levels)!==JSON.stringify(Array.from({length:201},(_,i)=>i-100)))throw Error('Invalid derived Blender response');
 shape(c.coarse.baseComplex,[32,2]);exact(c.coarse.responses,blender.filter(f=>!f.startsWith('Luminance')));
 for(const r of Object.values(c.coarse.responses)){exact(r,['angle','gain','slopes']);shape(r.angle,[201,32]);shape(r.gain,[201,32]);shape(r.slopes,[2,32]);}
 exact(c.rgbYuv,['version','levels','matrices']);if(c.rgbYuv.version!==1||JSON.stringify(c.rgbYuv.levels)!==JSON.stringify(c.coarse.levels))throw Error('Invalid derived saturation response');shape(c.rgbYuv.matrices,[201,3,3]);
 function lattice(g,refined){
  exact(g,refined?['shape','encoding','axisCodes','guardCodes','values']:['shape','encoding','yPower','values','refinements']);
  if(g.encoding!=='f32le-base64'||JSON.stringify(g.shape)!==(refined?'[253,65,65,3]':'[129,129,129,3]')||typeof g.values!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(g.values))throw Error('Invalid generated response lattice');
  const b=Buffer.from(g.values,'base64');if(b.length!==g.shape.reduce((s,v)=>s*v,1)*4)throw Error('Invalid response byte count');for(let i=0;i<b.length;i+=4)if(!Number.isFinite(b.readFloatLE(i)))throw Error('Nonfinite response grid');
  if(refined){if(g.guardCodes!==64||!Array.isArray(g.axisCodes)||g.axisCodes.length!==3)throw Error('Invalid refinement');g.axisCodes.forEach((v,k)=>{shape(v,[g.shape[k]]);if(v.some((x,i)=>!Number.isInteger(x)||x<0||x>4095||(i&&x<=v[i-1])))throw Error('Invalid response coordinates');});}
  else{if(g.yPower!==2||!Array.isArray(g.refinements)||g.refinements.length!==1)throw Error('Invalid global response');lattice(g.refinements[0],true);}
 }
 exact(p.grids,['stock-response','tone-preparation','gamut-output']);for(const g of Object.values(p.grids))lattice(g,false);shape(p.outputMatrix,[3,3]);
 const M=p.outputMatrix,det=M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])-M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])+M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);if(Math.abs(det)<1e-10)throw Error('Singular destination matrix');
 exact(p.twist_graph,['version','groups','edges','definition']);const graph=p.twist_graph;if(graph.version!==1||graph.groups!==8||!Array.isArray(graph.edges)||graph.edges.length>100000||typeof graph.definition!=='string'||graph.definition.length>1000)throw Error('Invalid procedural graph');
 const seen=new Set();for(const e of graph.edges){if(!Array.isArray(e)||e.length!==3||!e.every(Number.isInteger)||e[0]<0||e[1]<0||e[0]>=n||e[1]>=n||e[0]===e[1]||e[2]<0||e[2]>=8)throw Error('Invalid graph edge');const k=e.join('/');if(seen.has(k))throw Error('Duplicate graph edge');seen.add(k);}
 exact(p.provenance,['source','image_samples','raw_vendor_tables','vendor_code','prepared_memory','preset_bank','qualification','response_interpolation','preparation']);
 for(const k of ['image_samples','raw_vendor_tables','vendor_code','prepared_memory','preset_bank'])if(p.provenance[k]!==false)throw Error('Private payload prohibited');
 for(const k of ['source','qualification','response_interpolation','preparation'])if(typeof p.provenance[k]!=='string'||p.provenance[k].length>1000)throw Error('Invalid functional provenance');
 const text=JSON.stringify(p);for(const marker of ['/Users/','/Volumes/','.NEF','.TIF','np3_sha256','curve_points','private_preparation_experiment'])if(text.includes(marker))throw Error('Private artifact marker');
 return true;
}
