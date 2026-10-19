> Current release (October 18): highlight-constrained joint fitting is now the default.
> +1.21 EV and the Flexible Color TRC remain fixed. Twenty fresh NX renders of
> Tech and CT E preserved measured highlight separation but failed prior color
> preservation limits, especially in warm indoor colors. This release accepts
> those known regressions; it is not a passing nine-LUT qualification. A LUT
> that cannot satisfy the model's tone constraints returns an error instead of
> an unchecked preset. Earlier results below describe historical versions.

# Model and fitting details

## Color contract

The LUT must accept Rec.2020/N-Log and produce Rec.709/BT.1886. N-Log coordinates use 10-bit code values divided by 1023. Output conversion assumes ideal zero-black BT.1886: decode with power 2.4, then encode sRGB. This changes the output transfer function without applying another creative look. LUT output outside 0–1 is rejected. Source values outside the declared LUT domain are clipped and counted.

Photographic normalization is fixed at +1.2076303781988988 EV in scene-linear coordinates before N-Log encoding. This is chart-referred research calibration, not a universal camera ISO conversion. Do not add it as camera exposure compensation. Use sRGB output and Active D-Lighting Off.

## One synthetic forward model

The shared fitting population has 8,964 rows: 4,482 procedural source colors, each evaluated in two distinct contexts drawn from an authored four-context family. Colors are grouped across the training/reserved split so a repeated source color cannot enter both sets. The fitting set has 4,484 rows and the reserved set 4,480. Photograph pixels, histograms and captured camera preparation matrices are excluded.

Derived response lattices approximate stock color mapping, tone preparation and output conversion. Each uses a 129×129×129 base lattice and a 253×65×65 central refinement. Coordinates account for rounded 12-bit inputs and concentrate precision around shadows and low chroma. Derived control responses cover global saturation, Grading and Color Blender, including the composition of Blender adjustments before hue interpolation. These are measurements on artificial inputs, not copied Nikon tables or executable code.

Grading, saturation, Blender and the custom-curve/output stages are evaluated together. The model captures brightness-dependent and saturation-dependent color changes within its approximation. It is a color-stage model, not a RAW renderer: demosaicing, noise reduction, lens geometry and spatial sharpening are outside the public evaluator.

The recovered Flexible Color TRC is fixed and distinct from the Neutral Picture Control curve. Its gray response initializes a compensated custom curve. Optimization then evaluates the combined curve and color controls, including their effects on saturation and hue. Both curve endpoints may move; the actual encoded curve table must remain monotonic. An initial nine-point curve can grow to 20 points when insertion improves the joint objective.

## Comprehensive generated search

The fitter adjusts 36 color controls and the custom curve. Five basic tone controls are superseded by the custom curve; spatial controls cannot be inferred from a color LUT. Grading uses Cartesian tint coordinates for numerical proposals, then quantizes back to Nikon Hue/Saturation. Feasible two-sided differences, joint refinement and adaptive curve insertion respect encoded control ranges.

The first search generates alternatives through primary and proposal evaluators on identical synthetic samples, then refines every distinct generated recipe under the same primary evaluator. A bounded chroma polish follows. No stored recipe or LUT-name lookup supplies a starting point.

The second search generates up to 20 alternatives from that newly fitted result: Grading resets and sign reversals, Blending endpoints, relative custom-curve powers, and eight untinted shadow/midtone/highlight luminance corners with resampled curve knots. Each receives joint refinement and bounded material polish. Invalid quantized curves are omitted. The original result is retained unless an alternative improves both objectives by at least 0.05; eligible alternatives compete on the material objective. This margin is a stability heuristic, not statistical confidence.

The primary objective combines a hybrid Delta E76/Delta E00 residual, RMS stratum error and a neighbor-difference term that measures changes across brightness and chroma. Weighting mixes uniform and equal-stratum mass, with additional warm-color coverage. The material objective emphasizes supported warm and foliage target colors while limiting degradation of the primary score. There is no control-size penalty or exposure optimization in this release. These search weights are empirical choices tested on a development corpus, not recovered Nikon processing rules.

Reserved errors are recomputed from the final quantized recipe and reported as ordinary, unweighted Delta E76. Reserved synthetic colors are not independent photographs. A small prediction score does not guarantee fidelity for an arbitrary LUT, especially at clipping or extreme control combinations. Complete search is computationally expensive and runs locally in a cancellable worker.

## Distribution boundary

Only authored interpreter/optimizer code, generic NP3 encoding and approved synthetic-derived numerical data are distributed. No photographs, private calibration pixels, vendor binaries, raw vendor tables, captured runtime state, commercial LUTs, fitted recipes or NP3 banks are included. Private full-image spatial tests use separate prepared state which is not shipped or required by the public fitter. Generated presets remain predictions requiring an NX check.
