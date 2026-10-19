> Current release (October 18): highlight-constrained joint fitting is now the default.
> +1.21 EV and the Flexible Color TRC remain fixed. Twenty fresh NX renders of
> Tech and CT E preserved measured highlight separation but failed prior color
> preservation limits, especially in warm indoor colors. This release accepts
> those known regressions; it is not a passing nine-LUT qualification. A LUT
> that cannot satisfy the model's tone constraints returns an error instead of
> an unchecked preset. Earlier results below describe historical versions.

# Verification

Pipeline `fixed121-feasible-color-experimental-v1` uses the approved functional-v2 synthetic
response model, fixed +1.2076303781988988 EV and recovered Flexible Color TRC.
It broadens generated Grading/tone search while retaining the previous complete
fit unless both primary and material objectives improve by at least 0.05.
This is an empirical search rule, not a global-optimum guarantee.

The frozen nine-LUT comparison has 72 fresh NX renders across eight reused
development scenes. Mean fit error is 1.511279376 ΔE76, versus 1.522669991 for the
preceding candidate and 1.596284194 for the private reference. On the previous
public model's 54 overlapping images, mean changes from 1.738545243 to
1.421324007. These comparator populations are different and must not be merged.

CT C mean improves from 2.101691301 to 1.999175767. The other eight fitted NP3
byte streams are unchanged from the preceding candidate. CT C's chart and
garden improve, but one warm indoor scene worsens by 0.12694 against that
candidate. It remains within the frozen per-scene limits. All photographic
comparison gates pass, including the separate recent-focus comparison.

For 63 ordinary images, the worst per-image prediction mean is 0.433151713 and
worst p95 is 1.136010961 ΔE76. The nine high-ISO comparisons require prepared
full-image spatial validation: worst mean 0.554928486, worst p95 0.901281723.
The simpler pointwise high-ISO discrepancies are retained in private evidence.
The spatial validation state is private and is not distributed with the model.

Renders use matching geometry, ADL Off, exposure compensation 0, sRGB output,
full-resolution TIFF16 with ICC, and detail settings 0/0/0. They do not qualify
the user's sharpened variants or physical cameras. The development scenes are
reused; held-out synthetic colors are not held-out photographs. Arbitrary LUTs,
extreme control combinations and clipping can still produce larger errors.

All 123 code tests pass. Complete Node worker replays of Tech and CT C reproduce
every branch score and final NP3 exactly. Both actual-browser runs reproduce the
same final controls and NP3 bytes. CT C branch scores agree to floating-point
roundoff; some nonselected Tech branch trajectories differ across engines while
the selected result remains identical. This does not establish bit-identical
intermediate arithmetic on every JavaScript engine or for arbitrary LUTs.

The public package contains only authored code and synthetic-derived numerical
responses. It excludes photographs, commercial LUTs, Nikon binaries, raw vendor
tables, captured preparation state, fitted recipes and NP3 banks. Generated
results remain `nx_validation:false` and `exact_lut_cache:false`. Model schema,
provenance, source closure and optimizer hashes are checked separately from NX
accuracy. Run `node verify.mjs` to verify a released distribution.
