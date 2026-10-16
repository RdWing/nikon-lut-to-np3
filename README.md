# LUT to Picture Control

**[Open the browser app](https://rdwing.github.io/nikon-lut-to-np3/)**

Load a 3D .cube LUT with Rec.2020/N-Log input and Rec.709/BT.1886 output, then download a fitted Flexible Color NP3. Processing stays in your browser. The output target is sRGB. The interface and NP3 workflow are unchanged.

The bundled model uses fixed +1.207630378 EV photographic normalization, nine-point tone curves, Color Blender and Color Grading response coefficients. Use sRGB and Active D-Lighting Off. Do not add the normalization as camera exposure compensation.

Every result is an approximation fitted to your LUT, not an NX-validated preset. The app contains no exact-LUT lookup, validated preset catalog or measured-recipe fallback. The comparison download is a synthetic identity-curve starting point, not a validated preset.

See [calibration](CALIBRATION.md) and [verification](VALIDATION.md) for scope and limitations.
