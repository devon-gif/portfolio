/**
 * GLSL for the hero color field.
 *
 * The field is an "ink" buffer that persists between frames. Each frame the
 * ink is carried along a slowly turning noise flow, dragged by the pointer,
 * faded a little, and new ink is laid down by a handful of brushes that chase
 * or orbit the cursor. The display pass then turns that soft buffer into
 * paint-like shapes on cream paper with stippled edges and film grain.
 */

export const MAX_BRUSHES = 8;

/** 2D simplex noise (Ian McEwan / Ashima Arts, MIT). */
const SIMPLEX_2D = /* glsl */ `
vec3 permute3(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute3(permute3(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

export const fullscreenVertex = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/**
 * Simulation pass. Ink is stored premultiplied: rgb = color * coverage, a = coverage.
 * Positions are in "field space": x in [0, aspect], y in [0, 1], y down like CSS.
 */
export const simFragment = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uTime;
uniform float uDt;
uniform float uFlow;        // strength of the ambient flow
uniform float uFade;        // per-second fade
uniform vec4 uPointer;      // xy = position, zw = velocity (field units / s)
uniform float uPointerOn;   // 0..1 presence of a real pointer
uniform int uCount;
uniform vec4 uBrushA[${MAX_BRUSHES}];  // xy = position, z = radius, w = deposit rate
uniform vec4 uBrushB[${MAX_BRUSHES}];  // xy = velocity, z = seed, w = unused
uniform vec3 uBrushColor[${MAX_BRUSHES}];

${SIMPLEX_2D}

// Divergence-free flow from the curl of a slowly evolving noise potential.
vec2 flowAt(vec2 p) {
  float t = uTime * 0.045;
  float e = 0.02;
  vec2 q = p * 1.35;
  float n1 = snoise(q + vec2(0.0, e) + t) + 0.5 * snoise(q * 2.1 + vec2(0.0, e) - t * 1.3 + 7.1);
  float n2 = snoise(q - vec2(0.0, e) + t) + 0.5 * snoise(q * 2.1 - vec2(0.0, e) - t * 1.3 + 7.1);
  float n3 = snoise(q + vec2(e, 0.0) + t) + 0.5 * snoise(q * 2.1 + vec2(e, 0.0) - t * 1.3 + 7.1);
  float n4 = snoise(q - vec2(e, 0.0) + t) + 0.5 * snoise(q * 2.1 - vec2(e, 0.0) - t * 1.3 + 7.1);
  return vec2(n1 - n2, -(n3 - n4)) / (2.0 * e);
}

void main() {
  vec2 p = vec2(vUv.x * uAspect, 1.0 - vUv.y);

  // Ambient flow plus pointer drag: ink near the cursor gets smeared along its motion.
  vec2 vel = flowAt(p) * uFlow;
  vec2 dp = p - uPointer.xy;
  float near = exp(-dot(dp, dp) / 0.022);
  vel += uPointer.zw * near * 0.38 * uPointerOn;

  // Semi-Lagrangian advection (convert field-space velocity back to uv).
  vec2 back = vUv - vec2(vel.x / uAspect, -vel.y) * uDt;
  vec4 ink = texture(uPrev, back);

  // A little diffusion keeps edges soft as shapes stretch.
  vec4 blur = texture(uPrev, back + vec2(uTexel.x, 0.0)) + texture(uPrev, back - vec2(uTexel.x, 0.0))
            + texture(uPrev, back + vec2(0.0, uTexel.y)) + texture(uPrev, back - vec2(0.0, uTexel.y));
  ink = mix(ink, blur * 0.25, 0.18);

  // Fade back toward bare paper.
  ink *= exp(-uFade * uDt);

  // Brushes: anisotropic, noise-edged splats laid down "over" the existing ink.
  for (int i = 0; i < ${MAX_BRUSHES}; i++) {
    if (i >= uCount) break;
    vec4 a = uBrushA[i];
    vec4 b = uBrushB[i];
    vec2 d = p - a.xy;
    float speed = length(b.xy);
    vec2 dir = speed > 1e-4 ? b.xy / speed : vec2(1.0, 0.0);
    // Stretch along the direction of travel, pinch across it.
    float stretch = 1.0 + min(speed * 1.8, 1.9);
    float along = dot(d, dir) / stretch;
    float across = dot(d, vec2(-dir.y, dir.x)) * mix(1.0, 1.25, min(speed, 1.0));
    float r = length(vec2(along, across));
    // Lobed outline: radius wobbles with angle and time so the splat is never a circle.
    float ang = atan(d.y, d.x);
    float wobble = snoise(vec2(cos(ang), sin(ang)) * 1.3 + vec2(b.z * 9.7, uTime * 0.35 + b.z * 3.1));
    float radius = a.z * (1.0 + 0.32 * wobble);
    float m = 1.0 - smoothstep(radius * 0.25, radius, r);
    float amt = clamp(a.w * uDt * m, 0.0, 1.0);
    ink.rgb = uBrushColor[i] * amt + ink.rgb * (1.0 - amt);
    ink.a = amt + ink.a * (1.0 - amt);
  }

  outColor = clamp(ink, 0.0, 1.0);
}
`;

/** Display pass: paper, paint-like coverage, stippled edges, grain. */
export const displayFragment = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uInk;
uniform vec2 uResolution;   // drawing-buffer pixels
uniform float uPixelRatio;
uniform float uAspect;
uniform float uTime;
uniform float uGrainSeed;
uniform float uGrain;
uniform vec3 uPaper;
uniform float uOpacity;

${SIMPLEX_2D}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  vec4 ink = texture(uInk, vUv);
  float a = ink.a;
  vec3 col = a > 0.002 ? ink.rgb / a : uPaper;
  // Where two hues have mixed, lift saturation a touch so overlaps stay clean instead of muddy.
  col = clamp(mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 1.22), 0.0, 1.0);

  // Organic threshold: turns the soft buffer into shapes with defined, ragged edges.
  vec2 p = vec2(vUv.x * uAspect, 1.0 - vUv.y);
  float n = snoise(p * 3.2 + uTime * 0.02) * 0.6 + snoise(p * 9.0 - uTime * 0.03) * 0.4;
  float t = a + n * 0.09;
  float shape = smoothstep(0.14, 0.24, t);
  float cov = mix(a * 1.1, shape, 0.82);

  // Stipple: a dithered band along every edge, sized in CSS pixels.
  vec2 cell = floor(gl_FragCoord.xy / max(1.0, uPixelRatio * 1.25));
  float band = smoothstep(0.0, 0.5, cov) * (1.0 - smoothstep(0.5, 1.0, cov));
  float dots = step(hash(cell + 3.7), cov);
  cov = mix(cov, dots, band * 0.55);
  cov = clamp(cov, 0.0, 1.0) * uOpacity;

  vec3 rgb = mix(uPaper, col, cov);

  // Paper tooth: very fine static texture plus a gently flickering grain.
  float tooth = snoise(gl_FragCoord.xy / uPixelRatio * 0.9) * 0.012;
  float grain = (hash(cell * 1.31 + uGrainSeed) - 0.5) * uGrain;
  rgb += tooth + grain;

  outColor = vec4(rgb, 1.0);
}
`;
