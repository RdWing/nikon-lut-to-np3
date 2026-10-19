> Current release (October 18): highlight-constrained joint fitting is now the default.
> +1.21 EV and the Flexible Color TRC remain fixed. Twenty fresh NX renders of
> Tech and CT E preserved measured highlight separation but failed prior color
> preservation limits, especially in warm indoor colors. This release accepts
> those known regressions; it is not a passing nine-LUT qualification. A LUT
> that cannot satisfy the model's tone constraints returns an error instead of
> an unchecked preset. Earlier results below describe historical versions.

# LUT to Picture Control

**[Open the browser app](https://rdwing.github.io/nikon-lut-to-np3/)**

Load a 3D `.cube` LUT with Rec.2020/N-Log input and Rec.709/BT.1886 output, then download a fitted Flexible Color NP3. Processing stays in your browser. The output target is sRGB.

The fitter jointly adjusts an adaptive custom tone curve, Color Blender, Color Grading and global saturation using a synthetic response model. It compensates for the Flexible Color TRC and keeps photographic normalization fixed at +1.207630378 EV. Use sRGB and Active D-Lighting Off. **Do not add that EV value as camera exposure compensation.**

Every generated result is a prediction that should be checked in NX Studio. A single brightness curve and Nikon's available color controls cannot reproduce every 3D LUT exactly. There is no exact-LUT lookup, preset catalog or measured-recipe fallback.

The distributed numerical data comes from generated color samples and derived response experiments. It contains no source photographs, private image-calibration samples, Nikon binaries, raw vendor tables, prepared memory, user LUTs or validated presets.

See [model and fitting details](CALIBRATION.md), [verification](VALIDATION.md), and [notice](NOTICE.md).

Fitting starts with a bounded generated tone/color seed, then refines the curve and
color controls under highlight constraints. CINECOLOR completed in 2m 30s on the
development Mac; other LUTs and computers can take longer. The model download is
about 59 MB. Seven stages, elapsed time and last-progress age are displayed. You
can cancel the worker. A result that fails the final tone guard is not exported.
