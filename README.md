# LUT to Picture Control

**[Open the browser app](https://rdwing.github.io/nikon-lut-to-np3/)**

Load a 3D `.cube` LUT with Rec.2020/N-Log input and Rec.709/BT.1886 output, then download a fitted Flexible Color NP3. Processing stays in your browser. The output target is sRGB.

The fitter jointly adjusts an adaptive custom tone curve, Color Blender, Color Grading and global saturation using a synthetic response model. It compensates for the Flexible Color TRC and keeps photographic normalization fixed at +1.207630378 EV. Use sRGB and Active D-Lighting Off. **Do not add that EV value as camera exposure compensation.**

Every generated result is a prediction that should be checked in NX Studio. A single brightness curve and Nikon's available color controls cannot reproduce every 3D LUT exactly. There is no exact-LUT lookup, preset catalog or measured-recipe fallback. The comparison download uses an identity custom curve as a starting point.

The distributed numerical data comes from generated color samples and derived response experiments. It contains no source photographs, private image-calibration samples, Nikon binaries, raw vendor tables, prepared memory, user LUTs or validated presets.

See [model and fitting details](CALIBRATION.md), [verification](VALIDATION.md), and [notice](NOTICE.md).

The shared search evaluates multiple generated tone/Grading starting points and retains its first complete solution unless another improves both fitting objectives. This is a comprehensive, computationally expensive search; it can take tens of minutes or longer, especially for complex LUTs. The model download is about 59 MB. The worker can be cancelled. Its empirical weights and stability margin are described in the model details.
