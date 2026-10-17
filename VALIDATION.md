# Verification

Pipeline `fixed121-synthetic-joint-v3` keeps the same synthetic model and +1.2076303781988988 EV normalization. It adds a tone-dependent fitting-priority heuristic. The rule was selected after exploratory synthetic tests and 44 NX exports. It was then frozen and checked with 16 fresh confirmation exports of the four changed recipes. Twenty exports of the five unchanged recipes were reused only after verifying exact NP3 bytes and TIFF hashes. The baseline has 36 prior NX exports. These are four reused development scenes, not independent-scene or physical-camera validation.

Mean error across the nine LUTs changed from 1.9562 to 1.8908 Delta E76 (3.34% lower). All four targeted LUT means improved. The other five NP3s are byte-identical, preserving their prior results. Individual regions still trade off: the largest targeted per-scene mean increase is 0.0749. One targeted garden change is effectively unchanged (about +0.001); not every scene improves. Some older pre-port regressions remain.

Worst per-image model-versus-NX mean is 0.7601; worst p95 is 1.4227 Delta E76. These satisfy the retained mean <=1 and p95 <=3 prediction gates. All render comparisons use matching geometry, sRGB, ADL Off, full-resolution 16-bit TIFF and embedded ICC conversion. Private photographs are used only for development evaluation, not distributed as fitting inputs.

All 35 code tests pass. The actual minified worker, synthetic model and authored WebAssembly optimizer must produce byte-identical NP3s to the CLI for all nine LUTs before publication. The bundled-worker check runs under Node with local asset loading; it does not constitute camera validation.

The underlying stage model is unchanged. Its prior randomized full-range reference check had worst recipe mean 0.981, worst p95 3.305 and largest individual error 29.843 Delta E76. Extreme combinations remain less accurate than the qualified recipes. This is not a complete Nikon renderer.

No photographs, LUTs, Nikon binaries, raw vendor tables, captured state, fitted recipes or NP3 banks are shipped. Generated results continue to say `nx_validation:false` and `exact_lut_cache:false`. Public build checks require an approved schema and passing qualification bound to model, numerical source and optimizer hashes. Run `node verify.mjs` to verify the distribution.
