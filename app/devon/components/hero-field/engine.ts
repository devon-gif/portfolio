import { MAX_BRUSHES, displayFragment, fullscreenVertex, simFragment } from "./shaders";

/**
 * HeroFieldEngine
 *
 * A small real-time painting system rendered with raw WebGL2 (no React, no
 * three.js). Brushes with spring physics chase or orbit the cursor and lay ink
 * into a persistent buffer; the buffer is advected by a curl-noise flow and the
 * pointer's own motion, so every path the visitor takes leaves a different
 * composition that slowly dissolves back to paper.
 *
 * Everything here runs outside React: pointer events only write to plain
 * fields, and all work happens inside one requestAnimationFrame loop.
 */

type RGB = [number, number, number];

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** Editorial pastels around the brand lime. */
const LIME = hex("#d4fb52");
const MINT = hex("#93eecb");
const CYAN = hex("#a9e1ef");
const LAVENDER = hex("#c6b9f1");
const PINK = hex("#f1b7cd");
const PEACH = hex("#ffc694");

/**
 * Only three colors are ever in play at once. Moving the pointer (and, more
 * slowly, time) walks through these moods, so each pass across the hero
 * leaves a composition in a different key instead of a rainbow.
 */
const MOODS: [RGB, RGB, RGB][] = [
  [LIME, MINT, LAVENDER],
  [CYAN, LAVENDER, PINK],
  [LIME, PEACH, CYAN],
  [MINT, PINK, LAVENDER],
  [PEACH, PINK, CYAN],
  [LIME, CYAN, LAVENDER],
];

const PAPER = hex("#f2f0e8");

type BrushKind = "chase" | "orbit" | "drift";

interface BrushSpec {
  kind: BrushKind;
  /** Spring stiffness and damping: lower values lag further behind. */
  k: number;
  c: number;
  radius: number;
  rate: number;
  /** Which palette offset this brush paints with. */
  slot: number;
  orbitR?: number;
  orbitW?: number;
  /** Lissajous parameters for ambient wandering: [ax, ay, fx, fy, phase]. */
  path: [number, number, number, number, number];
}

const BRUSHES: BrushSpec[] = [
  { kind: "chase", k: 30, c: 8.5, radius: 0.14, rate: 1.6, slot: 0, path: [0.2, 0.16, 0.13, 0.17, 0.0] },
  { kind: "chase", k: 6.5, c: 4.0, radius: 0.19, rate: 1.0, slot: 1, path: [0.26, 0.2, 0.09, 0.12, 1.7] },
  { kind: "orbit", k: 11, c: 5.2, radius: 0.12, rate: 1.2, slot: 2, orbitR: 0.16, orbitW: 0.85, path: [0.3, 0.18, 0.07, 0.15, 3.1] },
  { kind: "orbit", k: 4.2, c: 3.1, radius: 0.15, rate: 0.8, slot: 0, orbitR: 0.27, orbitW: -0.48, path: [0.22, 0.24, 0.11, 0.08, 4.4] },
  { kind: "drift", k: 1.8, c: 1.9, radius: 0.2, rate: 0.3, slot: 0, path: [0.34, 0.2, 0.05, 0.07, 0.9] },
  { kind: "drift", k: 1.4, c: 1.7, radius: 0.17, rate: 0.26, slot: 1, path: [0.3, 0.22, 0.06, 0.045, 2.6] },
];

interface Brush {
  spec: BrushSpec;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: RGB;
  seed: number;
}

interface Target {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
}

export interface EngineOptions {
  reducedMotion: boolean;
  onReady?: () => void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`Hero field shader failed to compile: ${log}`);
  }
  return s;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  const v = compile(gl, gl.VERTEX_SHADER, vs);
  const f = compile(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(`Hero field program failed to link: ${gl.getProgramInfoLog(p)}`);
  }
  const uniforms = new Map<string, WebGLUniformLocation | null>();
  const u = (name: string) => {
    if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(p, name));
    return uniforms.get(name)!;
  };
  return { p, u };
}

const COPY_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSrc;
void main() { outColor = texture(uSrc, vUv); }
`;

export class HeroFieldEngine {
  private gl: WebGL2RenderingContext | null = null;
  private sim!: ReturnType<typeof program>;
  private display!: ReturnType<typeof program>;
  private copy!: ReturnType<typeof program>;
  private vao: WebGLVertexArrayObject | null = null;
  private quad: WebGLBuffer | null = null;
  private targets: Target[] = [];
  private read = 0;
  private internalFormat = 0;
  private texType = 0;

  private simW = 0;
  private simH = 0;
  private cssW = 1;
  private cssH = 1;
  private aspect = 1;
  private dpr = 1;
  private qualityScale = 1;

  private brushes: Brush[] = [];
  private time = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private visible = true;
  private ready = false;
  private frame = 0;
  private grainSeed = 0;

  // Pointer state, written by events and read once per frame.
  private clientX = 0;
  private clientY = 0;
  private pointerMoved = false;
  private pointerInside = false;
  private lastPointerAt = -1e9;
  private px = 0;
  private py = 0;
  private pvx = 0;
  private pvy = 0;
  private presence = 0;
  private energy = 0;
  private travel = 0;
  private rect: DOMRect | null = null;
  private rectDirty = true;

  // Frame-time watchdog for adaptive quality.
  private slowFrames = 0;
  private sampledFrames = 0;

  private resizeObserver: ResizeObserver | null = null;
  private intersection: IntersectionObserver | null = null;
  private brushA = new Float32Array(MAX_BRUSHES * 4);
  private brushB = new Float32Array(MAX_BRUSHES * 4);
  private brushC = new Float32Array(MAX_BRUSHES * 3);

  constructor(
    private canvas: HTMLCanvasElement,
    private host: HTMLElement,
    private opts: EngineOptions,
  ) {}

  /** Returns false when WebGL2 is unavailable so the caller can keep the CSS fallback. */
  start(): boolean {
    if (!this.setupGL()) return false;
    this.resetBrushes();
    this.measure();
    this.allocate(true);
    this.prewarm(this.opts.reducedMotion ? 4 : 1.4);

    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.host);
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.updateRunning();
    });
    this.intersection.observe(this.host);
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("scroll", this.markRect, { passive: true });

    if (this.opts.reducedMotion) {
      this.drawDisplay();
      this.markReady();
    } else {
      window.addEventListener("pointermove", this.onPointerMove, { passive: true });
      window.addEventListener("pointerdown", this.onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", this.onPointerLeave);
      this.updateRunning();
    }
    return true;
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.intersection?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("scroll", this.markRect);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerMove);
    document.documentElement.removeEventListener("pointerleave", this.onPointerLeave);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.releaseGL();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }

  /**
   * Development helper: advance the system frame by frame at a fixed 60 fps,
   * feeding a scripted pointer path (client coordinates). Lets slow test
   * browsers see exactly what a real 60 fps session would produce.
   */
  debugRun(points: Array<[number, number]>) {
    this.running = false;
    cancelAnimationFrame(this.raf);
    const dt = 1 / 60;
    for (const [x, y] of points) {
      this.clientX = x;
      this.clientY = y;
      this.pointerMoved = true;
      this.readPointer(dt);
      this.step(dt);
    }
    this.drawDisplay();
    this.gl?.finish();
  }

  // ---------------------------------------------------------------- setup

  private setupGL(): boolean {
    const gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;
    try {
      this.sim = program(gl, fullscreenVertex, simFragment);
      this.display = program(gl, fullscreenVertex, displayFragment);
      this.copy = program(gl, fullscreenVertex, COPY_FRAGMENT);
    } catch (err) {
      console.warn(err);
      return false;
    }

    // Half-float render targets keep the slow fade smooth; fall back to 8-bit if needed.
    const floatOk = !!gl.getExtension("EXT_color_buffer_float") || !!gl.getExtension("EXT_color_buffer_half_float");
    this.internalFormat = floatOk ? gl.RGBA16F : gl.RGBA8;
    this.texType = floatOk ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    return true;
  }

  private releaseGL() {
    const gl = this.gl;
    if (!gl) return;
    this.targets.forEach((t) => {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fbo);
    });
    this.targets = [];
    if (this.quad) gl.deleteBuffer(this.quad);
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.sim) gl.deleteProgram(this.sim.p);
    if (this.display) gl.deleteProgram(this.display.p);
    if (this.copy) gl.deleteProgram(this.copy.p);
  }

  private makeTarget(w: number, h: number): Target {
    const gl = this.gl!;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, w, h, 0, gl.RGBA, this.texType, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo };
  }

  private measure() {
    const r = this.host.getBoundingClientRect();
    this.cssW = Math.max(1, r.width);
    this.cssH = Math.max(1, r.height);
    this.aspect = this.cssW / this.cssH;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2) * this.qualityScale;
    this.rect = r;
    this.rectDirty = false;
  }

  /** (Re)allocate buffers. Existing ink is copied across so a resize never wipes the composition. */
  private allocate(force = false) {
    const gl = this.gl;
    if (!gl) return;
    this.canvas.width = Math.max(1, Math.round(this.cssW * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.cssH * this.dpr));

    // The simulation is soft by nature, so it runs at a fraction of display resolution.
    const simW = Math.round(Math.min(560, Math.max(180, this.cssW / 2.8)));
    const simH = Math.max(90, Math.round(simW / this.aspect));
    const changed = Math.abs(simW - this.simW) / Math.max(1, this.simW) > 0.08 || Math.abs(simH - this.simH) / Math.max(1, this.simH) > 0.08;
    if (!force && !changed && this.targets.length) return;

    const next = [this.makeTarget(simW, simH), this.makeTarget(simW, simH)];
    if (this.targets.length) {
      gl.useProgram(this.copy.p);
      gl.bindVertexArray(this.vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.targets[this.read].tex);
      gl.uniform1i(this.copy.u("uSrc"), 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, next[0].fbo);
      gl.viewport(0, 0, simW, simH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.targets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      });
    }
    this.targets = next;
    this.read = 0;
    this.simW = simW;
    this.simH = simH;
  }

  private resetBrushes() {
    this.brushes = BRUSHES.map((spec, i) => {
      const [ax, ay, , , ph] = spec.path;
      return {
        spec,
        x: 0.36 + Math.sin(ph) * ax * 0.5,
        y: 0.52 + Math.cos(ph) * ay * 0.5,
        vx: 0,
        vy: 0,
        color: [...MOODS[0][spec.slot % 3]] as RGB,
        seed: i * 0.173 + 0.11,
      };
    });
  }

  /** Run the simulation briefly before the first paint so the hero never opens on a blank field. */
  private prewarm(seconds: number) {
    const dt = 1 / 30;
    for (let t = 0; t < seconds; t += dt) this.step(dt);
  }

  // ---------------------------------------------------------------- events

  private onPointerMove = (e: PointerEvent) => {
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.pointerMoved = true;
  };

  private onPointerLeave = () => {
    this.pointerInside = false;
  };

  private markRect = () => {
    this.rectDirty = true;
  };

  private onVisibility = () => this.updateRunning();

  private onResize() {
    if (!this.gl) return;
    this.measure();
    this.allocate();
    if (this.opts.reducedMotion) this.drawDisplay();
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.targets = [];
  };

  private onContextRestored = () => {
    if (!this.setupGL()) return;
    this.measure();
    this.allocate(true);
    this.prewarm(1);
    if (this.opts.reducedMotion) this.drawDisplay();
    else this.updateRunning();
  };

  private updateRunning() {
    const should = !this.opts.reducedMotion && this.visible && document.visibilityState === "visible" && !!this.gl;
    if (should && !this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    } else if (!should && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  private markReady() {
    if (this.ready) return;
    this.ready = true;
    this.opts.onReady?.();
  }

  // ---------------------------------------------------------------- frame

  private tick = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    const real = Math.min(0.25, (now - this.last) / 1000);
    this.last = now;
    const dt = Math.min(real, 1 / 30);

    this.watchQuality(real);
    this.readPointer(dt);
    this.step(dt);
    this.drawDisplay();
    this.markReady();
  };

  /** Steps quality down (never up) if the display pass cannot hold its frame budget. */
  private watchQuality(real: number) {
    this.sampledFrames++;
    if (real > 0.024) this.slowFrames++;
    if (this.sampledFrames < 90) return;
    if (this.slowFrames > 45 && this.qualityScale > 0.5) {
      this.qualityScale = Math.max(0.5, this.qualityScale - 0.25);
      this.measure();
      this.allocate();
    }
    this.sampledFrames = 0;
    this.slowFrames = 0;
  }

  private readPointer(dt: number) {
    if (this.rectDirty || !this.rect) {
      this.rect = this.host.getBoundingClientRect();
      this.rectDirty = false;
    }
    const r = this.rect;
    const h = Math.max(1, r.height);
    const x = (this.clientX - r.left) / h;
    const y = (this.clientY - r.top) / h;
    const margin = 40 / h;
    if (this.pointerMoved) {
      this.pointerMoved = false;
      const inside = x > -margin && x < this.aspect + margin && y > -margin && y < 1 + margin;
      if (inside) {
        if (!this.pointerInside) {
          // Entering: start from here instead of streaking in from the last exit point.
          this.px = x;
          this.py = y;
        }
        const ivx = (x - this.px) / Math.max(dt, 1 / 240);
        const ivy = (y - this.py) / Math.max(dt, 1 / 240);
        this.pvx += (ivx - this.pvx) * 0.35;
        this.pvy += (ivy - this.pvy) * 0.35;
        this.travel += Math.hypot(x - this.px, y - this.py);
        this.px = x;
        this.py = y;
        this.lastPointerAt = this.time;
      }
      this.pointerInside = inside;
    } else {
      // No new event this frame: the pointer is resting, let its velocity settle.
      this.pvx *= Math.exp(-dt * 7);
      this.pvy *= Math.exp(-dt * 7);
    }

    const idle = this.time - this.lastPointerAt;
    const goal = this.pointerInside && idle < 2.5 ? 1 : 0;
    this.presence += (goal - this.presence) * (1 - Math.exp(-dt * (goal > this.presence ? 3 : 0.35)));

    const speed = Math.min(4, Math.hypot(this.pvx, this.pvy));
    const e = Math.min(1.5, speed / 2.2) * this.presence;
    this.energy += (e - this.energy) * (1 - Math.exp(-dt * (e > this.energy ? 6 : 1.1)));
  }

  /** Brush physics + one simulation pass. */
  private step(dt: number) {
    const gl = this.gl;
    if (!gl || this.targets.length < 2) return;
    this.time += dt;
    const t = this.time;
    const a = this.aspect;
    const cx = a * 0.4;
    const cy = 0.52;

    // The mood advances with pointer travel (about two sweeps of the hero) and slowly with time.
    const mood = MOODS[(Math.floor(this.travel / 1.5) + Math.floor(t / 16)) % MOODS.length];

    this.brushes.forEach((b, i) => {
      const s = b.spec;
      const [ax, ay, fx, fy, ph] = s.path;
      const ambX = cx + Math.sin(t * fx * 2 * Math.PI * 0.35 + ph) * ax * a * 0.62;
      const ambY = cy + Math.sin(t * fy * 2 * Math.PI * 0.35 + ph * 1.7) * ay;

      let tx = ambX;
      let ty = ambY;
      if (s.kind !== "drift") {
        let ptx = this.px;
        let pty = this.py;
        if (s.kind === "orbit") {
          const ang = t * (s.orbitW ?? 0.6) + ph;
          ptx += Math.cos(ang) * (s.orbitR ?? 0.2);
          pty += Math.sin(ang) * (s.orbitR ?? 0.2) * 0.8;
        }
        tx = ambX + (ptx - ambX) * this.presence;
        ty = ambY + (pty - ambY) * this.presence;
      }

      const ax2 = s.k * (tx - b.x) - s.c * b.vx;
      const ay2 = s.k * (ty - b.y) - s.c * b.vy;
      b.vx += ax2 * dt;
      b.vy += ay2 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      const target = mood[s.slot % 3];
      const k = 1 - Math.exp(-dt * 1.1);
      b.color[0] += (target[0] - b.color[0]) * k;
      b.color[1] += (target[1] - b.color[1]) * k;
      b.color[2] += (target[2] - b.color[2]) * k;

      const speed = Math.hypot(b.vx, b.vy);
      const active = s.kind === "drift" ? 1 - this.presence * 0.5 : 0.12 + 0.88 * this.presence;
      const rate = s.rate * active * (0.5 + Math.min(1.2, speed * 0.7)) * (1 + this.energy * 0.6);
      const radius = s.radius * (1 + this.energy * 0.18);

      this.brushA.set([b.x, b.y, radius, rate], i * 4);
      this.brushB.set([b.vx, b.vy, b.seed, 0], i * 4);
      this.brushC.set(b.color, i * 3);
    });

    const src = this.targets[this.read];
    const dst = this.targets[1 - this.read];
    const { p, u } = this.sim;
    gl.useProgram(p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(u("uPrev"), 0);
    gl.uniform2f(u("uTexel"), 1 / this.simW, 1 / this.simH);
    gl.uniform1f(u("uAspect"), a);
    gl.uniform1f(u("uTime"), t);
    gl.uniform1f(u("uDt"), dt);
    gl.uniform1f(u("uFlow"), 0.018 + this.energy * 0.04);
    gl.uniform1f(u("uFade"), 0.3 - this.presence * 0.08);
    const pv = Math.min(3, Math.hypot(this.pvx, this.pvy));
    const pscale = pv > 0 ? pv / Math.max(1e-5, Math.hypot(this.pvx, this.pvy)) : 0;
    gl.uniform4f(u("uPointer"), this.px, this.py, this.pvx * pscale, this.pvy * pscale);
    gl.uniform1f(u("uPointerOn"), this.presence);
    gl.uniform1i(u("uCount"), this.brushes.length);
    gl.uniform4fv(u("uBrushA"), this.brushA);
    gl.uniform4fv(u("uBrushB"), this.brushB);
    gl.uniform3fv(u("uBrushColor"), this.brushC);
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, this.simW, this.simH);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.read = 1 - this.read;
  }

  private drawDisplay() {
    const gl = this.gl;
    if (!gl || !this.targets.length) return;
    this.frame++;
    // Grain re-rolls every other frame: alive, but not a buzzing static.
    if (!this.opts.reducedMotion && this.frame % 2 === 0) this.grainSeed = (this.grainSeed + 17.13) % 1000;

    const { p, u } = this.display;
    gl.useProgram(p);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.targets[this.read].tex);
    gl.uniform1i(u("uInk"), 0);
    gl.uniform2f(u("uResolution"), this.canvas.width, this.canvas.height);
    gl.uniform1f(u("uPixelRatio"), this.dpr);
    gl.uniform1f(u("uAspect"), this.aspect);
    gl.uniform1f(u("uTime"), this.time);
    gl.uniform1f(u("uGrainSeed"), this.grainSeed);
    gl.uniform1f(u("uGrain"), 0.04);
    gl.uniform3f(u("uPaper"), PAPER[0], PAPER[1], PAPER[2]);
    gl.uniform1f(u("uOpacity"), 0.85 + Math.min(1, this.energy) * 0.08);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
