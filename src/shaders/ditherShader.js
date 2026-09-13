/**
 * ============================================================================
 * GLSL SHADERS FOR CROSS-STITCH / DITHER EFFECT
 * Extracted and optimized from Son Daven WebGL pipeline
 * ============================================================================
 */

export const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_gridSize;
  uniform float u_threshold;
  uniform float u_blackPoint;
  uniform float u_whitePoint;
  uniform vec3 u_fillColor;
  uniform float u_fillOpacity;
  uniform vec4 u_bounds; // [x, y, width, height] normalized in [0, 1]

  varying vec2 v_texCoord;

  void main() {
    // Normalized screen coordinates [0, 1]
    vec2 p = gl_FragCoord.xy / u_resolution;
    p.y = 1.0 - p.y; // Flip Y to match web coordinate orientation

    // Discard fragments outside the layer's bounding box
    if (p.x < u_bounds.x || p.x > (u_bounds.x + u_bounds.z) ||
        p.y < u_bounds.y || p.y > (u_bounds.y + u_bounds.w)) {
      discard;
    }

    // Local coordinates normalized inside the layer bounds [0, 1]
    vec2 localCoord = (p - u_bounds.xy) / u_bounds.zw;

    // Discrete grid cell quantization (Cross-Stitch Matrix)
    vec2 cellSize = 1.0 / u_gridSize;
    vec2 cellIndex = floor(localCoord / cellSize);
    vec2 cellCenter = (cellIndex + 0.5) * cellSize;

    // Sample texture at cell center
    vec4 texColor = texture2D(u_texture, cellCenter);

    // Alpha check for transparent PNGs/WebPs or black keyed backgrounds
    if (texColor.a < 0.05) discard;

    // Perceptual luminance calculation
    float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

    // Levels remapping based on blackPoint & whitePoint uniforms
    float bp = u_blackPoint / 255.0;
    float wp = u_whitePoint / 255.0;
    float level = clamp((luma - bp) / max(wp - bp, 0.001), 0.0, 1.0);

    // Cross-stitch tactile gap: slight borders between cells to create fabric weave
    vec2 cellFrac = fract(localCoord / cellSize);
    if (cellFrac.x < 0.1 || cellFrac.x > 0.9 || cellFrac.y < 0.1 || cellFrac.y > 0.9) {
      discard;
    }

    // Threshold discard test
    if (level <= (u_threshold / 255.0)) {
      gl_FragColor = vec4(u_fillColor, texColor.a * u_fillOpacity);
    } else {
      discard;
    }
  }
`;
