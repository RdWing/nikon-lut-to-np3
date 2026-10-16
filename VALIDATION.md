# Verification

This release verifies the public implementation and aggregate model; it does not distribute or certify NX-validated presets.

The encoded-brightness implementation agrees with the private Python reference to 1.12e-13 maximum absolute Lab component error on a private 100-sample fixture. Nine reference LUTs complete fitting and NP3 generation. Their aggregate weighted model errors range from 1.68 to 3.60 Delta E76. A separate evaluation of the generated recipes against the full private response model gives reserved-sample means from 2.18 to 3.65. Those are model crosschecks, not fresh NX renders or physical-camera validation.

The model is bound to this release by SHA-256. Asset checks require synthetic grid coordinates, the preset-free schema, stripped standalone WebAssembly, and the unchanged bundled-model browser workflow. Source images, private fixtures, reference LUTs and generated test NP3s are excluded from publication.

Inspect each output in NX Studio before relying on it. The measured local presets and their validation remain private.
