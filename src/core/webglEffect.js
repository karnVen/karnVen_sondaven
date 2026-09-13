/**
 * ============================================================================
 * WEBGL CROSS-STITCH / DITHER ENGINE
 * ============================================================================
 * 
 * CORE ARCHITECTURAL CONCEPTS:
 * 
 * 1. ZERO CPU PIXEL PROCESSING:
 *    Instead of slow 2D canvas loops (getImageData), this engine executes 
 *    the quantization and thresholding in parallel across millions of GPU fragment cores.
 * 
 * 2. MULTI-LAYER VIDEO / IMAGE COMPOSITING:
 *    A single canvas can render multiple distinct animated elements (e.g. swaying trees,
 *    flying birds, moving sheep) with independent coordinates, grid sizes, and contrast levels.
 * 
 * 3. INTERSECTION OBSERVER BATTERY SAVER:
 *    WebGL contexts continuously consume GPU cycles. When the canvas scrolls out of
 *    view, the render loop automatically pauses.
 * ============================================================================
 */

import { vertexShaderSource, fragmentShaderSource } from '../shaders/ditherShader.js';

export class WebGLDitherScene {
  /**
   * @param {Object} options
   * @param {HTMLCanvasElement|string} options.canvas - Target canvas element or selector
   * @param {Array<Object>} options.layers - Media layer definitions
   */
  constructor(options = {}) {
    this.canvas = typeof options.canvas === 'string' ? document.querySelector(options.canvas) : options.canvas;
    this.layerDefs = options.layers || [];
    if (!this.canvas) return;

    this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!this.gl) {
      console.warn('[WebGLDitherScene] WebGL not supported.');
      return;
    }

    this.program = null;
    this.uniforms = {};
    this.attributes = {};
    this.layers = [];
    this.isRunning = false;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.compileShaders();
    this.initGeometry();
    this.initLayers();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());

    // Observe visibility to save GPU resources when scrolled out of view
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.05 });

    this.observer.observe(this.canvas);
  }

  compileShaders() {
    const gl = this.gl;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    gl.useProgram(program);

    // Cache locations
    this.attributes.position = gl.getAttribLocation(program, 'a_position');
    this.attributes.texCoord = gl.getAttribLocation(program, 'a_texCoord');

    this.uniforms.texture = gl.getUniformLocation(program, 'u_texture');
    this.uniforms.resolution = gl.getUniformLocation(program, 'u_resolution');
    this.uniforms.gridSize = gl.getUniformLocation(program, 'u_gridSize');
    this.uniforms.threshold = gl.getUniformLocation(program, 'u_threshold');
    this.uniforms.blackPoint = gl.getUniformLocation(program, 'u_blackPoint');
    this.uniforms.whitePoint = gl.getUniformLocation(program, 'u_whitePoint');
    this.uniforms.fillColor = gl.getUniformLocation(program, 'u_fillColor');
    this.uniforms.fillOpacity = gl.getUniformLocation(program, 'u_fillOpacity');
    this.uniforms.bounds = gl.getUniformLocation(program, 'u_bounds');
  }

  initGeometry() {
    const gl = this.gl;

    // Fullscreen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    const texCoords = new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0
    ]);

    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    this.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  }

  initLayers() {
    const gl = this.gl;

    this.layers = this.layerDefs.map((def) => {
      let mediaElement;
      let isVideo = def.type === 'video';

      if (isVideo) {
        mediaElement = document.createElement('video');
        mediaElement.src = def.src;
        mediaElement.autoplay = true;
        mediaElement.loop = true;
        mediaElement.muted = true;
        mediaElement.playsInline = true;
        mediaElement.crossOrigin = 'anonymous';
        mediaElement.play().catch(() => {});
      } else {
        mediaElement = new Image();
        mediaElement.crossOrigin = 'anonymous';
        mediaElement.src = def.src;
      }

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      return {
        media: mediaElement,
        texture: texture,
        isVideo: isVideo,
        config: {
          x: 0,
          y: 0,
          width: 1,
          height: 1,
          xSquares: 80,
          ySquares: 80,
          blackPoint: 20,
          whitePoint: 220,
          threshold: 255,
          fillColor: [0.658, 0.580, 0.455], // Default bronze (#a89474)
          fillOpacity: 1.0,
          ...def.config
        }
      };
    });
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    const gl = this.gl;
    if (!gl || !this.program) return;

    gl.useProgram(this.program);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Bind Quad Attributes
    gl.enableVertexAttribArray(this.attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.attributes.texCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.vertexAttribPointer(this.attributes.texCoord, 2, gl.FLOAT, false, 0, 0);

    // Global resolution
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);

    // Render each active layer
    this.layers.forEach((layer) => {
      const cfg = layer.config;
      const media = layer.media;

      const isReady = layer.isVideo
        ? media.readyState >= 2
        : media.complete && media.naturalWidth > 0;

      if (!isReady) return;

      // Update texture on each frame for video, or once for image
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, layer.texture);

      if (layer.isVideo) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media);
      } else if (!layer._textureUploaded) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media);
        layer._textureUploaded = true;
      }

      gl.uniform1i(this.uniforms.texture, 0);
      gl.uniform2f(this.uniforms.gridSize, cfg.xSquares, cfg.ySquares);
      gl.uniform1f(this.uniforms.threshold, cfg.threshold);
      gl.uniform1f(this.uniforms.blackPoint, cfg.blackPoint);
      gl.uniform1f(this.uniforms.whitePoint, cfg.whitePoint);
      gl.uniform3f(this.uniforms.fillColor, cfg.fillColor[0], cfg.fillColor[1], cfg.fillColor[2]);
      gl.uniform1f(this.uniforms.fillOpacity, cfg.fillOpacity);

      // Bounds: [x, y, w, h] normalized in [0, 1]
      gl.uniform4f(this.uniforms.bounds, cfg.x, cfg.y, cfg.width, cfg.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    });

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(() => this.render());
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.render();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.stop();
    if (this.observer) this.observer.disconnect();
    this.layers.forEach((l) => {
      if (l.isVideo) {
        l.media.pause();
        l.media.removeAttribute('src');
        l.media.load();
      }
      this.gl.deleteTexture(l.texture);
    });
  }
}
