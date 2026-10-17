# Verification

The release candidate was checked using 36 candidate NX Studio renders across nine LUTs and four reused scenes. After final joint polishing, 24 renders were exported fresh; 12 renders were reused only after verifying that both their NP3 files and TIFF hashes were unchanged. It was compared with 36 frozen exports from the preceding current-public-fitter campaign. Both sets used the same geometry, sRGB output, ADL Off and full-resolution 16-bit TIFFs. Private image samples were used for evaluation only, not as inputs to the public model's fitting corpus.

The mean fit error across LUTs changed from 2.1268 to 1.9562 Delta E76 (8.02% lower). Every LUT stayed within the frozen allowed mean regression of 0.15; the largest increase was 0.1239. Average improvement does not mean every LUT improved.

For prediction versus actual NX output, the worst per-image mean was 0.7601 and the worst per-image p95 was 1.5143 Delta E76. Both satisfy the frozen limits of mean <=1 and p95 <=3. This includes the synthetic input mapping, stage approximation and output conversion. These scenes were reused during development; this is not an independent-scene or physical-camera qualification.

All 32 code tests pass. The minified worker, bundled model and authored WebAssembly optimizer produce byte-identical NP3 files to the command-line fitter for all nine test LUTs. That check exercised the bundled worker under Node with local asset loading; it is not itself a browser UI test.

A separate 21-recipe private-reference check included randomized full-range controls. Its worst recipe mean was 0.981, worst recipe p95 was 3.305, and largest individual error was 29.843 Delta E76. Extreme combinations therefore remain less accurate than the qualified fitted recipes. The model is not a complete Nikon renderer, and there is no guarantee for arbitrary LUTs or photographs.

No reference LUTs, captures, recipes, generated test NP3s or image samples are distributed. Only aggregate qualification results are public. Every result generated for a user's LUT is labeled `nx_validation:false` and `exact_lut_cache:false`; check it in NX Studio before camera use.

Model and application assets are SHA-256 bound. Public build checks require the synthetic schema and a passing NX receipt matching the numerical source and optimizer hashes. Run `node verify.mjs` to check the published asset hashes and distribution schema.
