# Bundled calibration

Version 2 uses nine synthetic operating regions, 313 synthetic Rec.2020 RGB cells and 14 color-control groups. Each aggregate cell has at least eight contributors. Input coordinates are fixed half-stop logarithmic cell centers. The model contains rounded aggregate response coefficients, aggregate weights and color operating coordinates. It contains no original custom tone curves, complete measured recipes, preset bank, captured NP3 files, source photographs, LUTs or LUT-hash lookup table.

Original tone curves are removed privately by inversion of their encoded-brightness response. Only samples supported in every regional inversion and derivative contribute. Response coefficients are aggregated onto synthetic cells. Unsupported clipped pixels are excluded; this limits extreme shadow and highlight coverage.

The input mapping applies 2.3095797736291894 times scene-linear RGB (+1.2076303781988988 EV), then Nikon N-Log encoding and tetrahedral LUT interpolation. BT.1886 output is decoded and converted to sRGB. This is a fixed chart-based photographic normalization, not independently established physical N-Log exposure calibration. Negative inputs and cube-domain excursions are clipped and counted; extended-range LUT outputs are rejected.

The fitter jointly adjusts seven interior ordinates of a nine-point curve and 14 grouped color offsets. Encoded brightness is 0.299R + 0.587G + 0.114B; the curve shifts all channels by the same brightness delta. All nine regions start with an identity curve. Color offsets are bounded to +/-4; curve ordinates are integer 0–255 with monotonicity enforced. Six iteratively reweighted least-squares iterations are followed by discrete coordinate refinement. The weighted model error chooses the result.

The public curve search is broader than the local measured-anchor search because original custom curves are deliberately excluded. Public predictions therefore need not match local cached presets. Error metrics are model estimates on synthetic cells, not held-out NX measurements. Fit reports retain the legacy reservedPixels key for compatibility, but it denotes these synthetic-cell estimates.
