# Model and fitting details

## Color contract

The input LUT must accept Rec.2020/N-Log and produce Rec.709/BT.1886. N-Log coordinates use normalized 10-bit code values divided by 1023. Output conversion assumes ideal zero-black BT.1886, decodes the LUT output with power 2.4, then encodes sRGB. This is a display-transfer conversion, not a second creative look. Extended-range LUT outputs outside 0–1 are rejected; source values outside the LUT's declared domain are clipped and counted in the report.

The photographic normalization is fixed at +1.2076303781988988 EV, applied in scene-linear coordinates before N-Log encoding. It is a chart-referred research calibration, not a universal camera ISO conversion. Do not apply it as additional camera exposure compensation. The model assumes sRGB output and Active D-Lighting Off.

## Synthetic model

The fitting corpus contains 1,461 algorithmically generated color samples: hue/saturation/brightness ramps and gray ramps. Synthetic source colors are mapped to the input coordinates of the color stage and to scene-linear Rec.2020. They are not pixels selected from photographs.

The portable interpreter uses derived response measurements for Grading, global saturation and Blender, together with three 65×65×65 response lattices for fixed stock color behavior, tone preparation, and output conversion. These are functional experiments on artificial inputs, rather than copied internal coefficient tables or executable routines. The lattices use denser sampling near black. Interpolation respects the actual rounded 12-bit experiment coordinates; treating them as perfectly uniform introduces color bias near gray and in shadows.

Color Grading is evaluated before global saturation and Blender. The custom curve acts within the tone/output stages. Changes in brightness, chroma and hue are evaluated together, including the saturation changes that a shared custom brightness curve can cause. This remains an approximation of the color stage, not a complete Nikon renderer. It does not model demosaicing, noise reduction, lens geometry or spatial sharpening.

The Flexible Color TRC initializer uses derived synthetic gray-axis responses. It is distinct from the Neutral Picture Control curve. The initializer compensates for the existing response before proposing the LUT's tone shape; joint fitting then evaluates that curve with the color controls and output conversion.

## Optimizer

The fitter optimizes all 36 modeled color controls and the custom curve jointly. The five basic tone controls are superseded by the custom curve, and spatial controls are not optimized from a color LUT.

Six starts combine three grading initializations with both the TRC-compensated curve and an identity curve. The curve begins with nine points and can grow to 20 where an added point reduces the complete color objective. Both endpoints may move, and the encoded curve must remain monotonic. A final joint pass refines all controls after adaptive curve placement. No stored recipe initializes the fit.

The data objective is weighted mean Delta E76 in Lab. Half of the sample weight is uniform and half is distributed evenly across populated brightness/chroma/hue strata. A small control-size penalty discourages compensating extreme settings: `0.2 * sum(((control - center)/100)^2)`. Cyclic hue angles are exempt; Blending is centered at 50 and other penalized controls at zero. All encoded ranges remain available. Curve ordinates are not penalized this way. Reports separate this penalty from color-error metrics.

Half of the generated sample indices are reserved from optimization. Their errors are synthetic-model predictions, not measurements of the user's LUT in a camera or NX Studio. Extreme combinations and colors near clipping can have larger errors than the tested recipes. A low reported score does not guarantee fidelity on every photograph.

## Distribution boundary

The public assets contain the original interpreter and optimizer, synthetic response data, and generic NP3 encoding logic. No real-image calibration samples, Nikon binaries, raw vendor coefficient arrays, prepared runtime state, original NEFs, TIFFs, LUT files, validated recipes, NP3 banks or exact-LUT caches are shipped. Private qualification exports are summarized only as aggregate metrics.
