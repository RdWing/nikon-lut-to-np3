# Verification and limits

The current pipeline is `fixed121-bounded-highlight-v1`. Both apps use the same
synthetic response model, fixed +1.2076303781988988 EV and Flexible Color TRC.
It begins with a bounded generated seed, then runs highlight separation, tone/color
balancing, constrained joint refinement and final color refinement. It does not
select a saved preset by LUT name.

## Current end-to-end check

CINECOLOR completed in 2m 10s in the actual browser and 167.143 seconds in Node
on the development Mac. Exact-value caching, shared preparation and buffer reuse preserve the
previous NP3 and every report field except Node runtime. Browser reports are also exactly identical.
111 tests pass, including buffer ownership and sampler boundary checks; scalar-stage parity checks on Tech, CT C and RED Film Bias
match both successful results and expected qualification rejections. These timings
are one test case, not a runtime guarantee or controlled comparison with the old
search. Stages, elapsed time and last-progress age are
visible while fitting; Cancel stops the browser worker.

The unchanged final gate tested 1,911 synthetic gray samples: RMS 0.100946 L*,
peak 0.350975 L*, 45 rising highlight intervals, minimum relative rise 0.726708,
and zero near-flat intervals. Reserved synthetic mean/p95 error was
2.035085 / 7.479254 ΔE76. These are predictions, not fresh NX Studio measurements.

The earlier bounded initializer changed the search starting point and can change
color quality; this caching update preserves its tested output. No complete
nine-LUT or fresh NX qualification is claimed for the bounded search. A final tone failure stops export rather than silently
returning an unchecked preset. Finite gray tests do not prove every colored ray.

## Historical photographic evidence

The preceding constrained search had twenty fresh NX renders of Tech and CT E.
Measured highlights passed, but color-preservation limits failed, especially in
warm indoor colors. Those known limits remain; the runtime check does not erase
them. Earlier basin-search results covered 72 renders and nine LUTs, but used a
different search. They do not qualify this revision.

The model was developed with matching lens geometry, ADL Off, sRGB, full-resolution
TIFF16 and 0/0/0 detail. Check each new preset on representative images in NX Studio.
An NP3 approximates a LUT; arbitrary LUTs need not be representable by these controls.

## Public data boundary

Only authored code and synthetic-derived numerical responses are distributed.
No photographs, commercial LUTs, Nikon binaries, raw vendor tables, captured
preparation state, fitted recipes or NP3 bank are included. Generated reports
remain `nx_validation:false`. Model provenance, hashes and dependency closure
are audited separately from photographic accuracy. Run `node verify.mjs` in the
released distribution to check package integrity.

Prediction-buffer validation compares all 8,964 Lab rows exactly across 21
recipes, including extreme controls and curves near clipping. Retained results
and trace data also match. In six alternating-order paired rounds of twenty
warmed predictions, median time changed from 259 ms to 156 ms. This excludes
preparation and measures the hot prediction loop; it is not a full-fit speed claim.
