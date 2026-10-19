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

## Bounded generated search and tone protection

The fitter adjusts 36 color controls and a custom curve of up to 20 points. Five
basic tone controls are superseded by the custom curve; spatial controls cannot
be inferred from a color LUT. Grading proposals use Cartesian tint coordinates,
then quantize to Nikon Hue/Saturation. Curve knots and the interpolated table must
remain monotonic.

Initialization generates a TRC-compensated nine-point curve and reset color
controls, with four joint iterations per refinement phase. It replaces the older
full portfolio and basin search. Subsequent stages solve highlight headroom,
balance tone/color, refine constrained controls and test joint tone/color proposals.
No saved recipe or LUT-name lookup supplies an answer.

The joint proposal objective combines perceptual color residuals, stratum balance
and brightness/chroma neighbor differences, with warm/foliage priorities. Final
feasible refinement minimizes training mean Delta E76 within an absolute tone
envelope: gray RMS ≤0.15 L*, peak ≤0.4 L*, and shadow/midtone/highlight RMS
≤0.15/0.20/0.20 L*. The final serialized output must also retain at least eight
rising highlight intervals, minimum relative rise ≥0.5 and no near-flat intervals.
Failed constraints stop export. No tolerance was relaxed for the performance update.

These objectives are empirical fitting choices, not Nikon processing rules.
Changing initialization can change the selected color tradeoff; it is not promised
to match the former slow search. Reserved synthetic errors are predictions, not
independent photographs. Check each new result in NX Studio, especially clipping
and saturated colors. Runtime and photographic qualifications are separate.

## Distribution boundary

Only authored interpreter/optimizer code, generic NP3 encoding and approved synthetic-derived numerical data are distributed. No photographs, private calibration pixels, vendor binaries, raw vendor tables, captured runtime state, commercial LUTs, fitted recipes or NP3 banks are included. Private full-image spatial tests use separate prepared state which is not shipped or required by the public fitter. Generated presets remain predictions requiring an NX check.
