/**
 * ============================================================================
 * HERO CANVAS 3D FRAME SCRUBBER
 * ============================================================================
 * 
 * ARCHITECTURAL CONCEPTS & MATHEMATICS:
 * 
 * 1. WHY IMAGE SEQUENCES INSTEAD OF <video>?
 *    Video files use temporal compression (inter-frame encoding). When you scrub
 *    `video.currentTime` on scroll, the GPU must decode bidirectional predictive
 *    frames (B-frames / P-frames) on the fly, creating severe 200-500ms lag and
 *    frame-skipping. Preloaded WebP image frames can be painted to a 2D canvas via
 *    `ctx.drawImage()` in under 1ms, yielding locked 60-120fps hardware acceleration.
 * 
 * 2. DAY / NIGHT RENDERING LOGIC:
 *    The website samples the client's local time:
 *    `hour >= 7 && hour < 24` -> Daytime Sunlight pass
 *    `hour < 7` -> Night / Dusk Architectural Lighting pass
 * 
 * 3. CANVAS "COVER" MATHEMATICS:
 *    Unlike <img> or <video>, an HTML5 <canvas> does NOT support CSS `object-fit: cover`.
 *    To prevent stretching on ultrawide or mobile screens:
 *    scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
 *    drawWidth = imgWidth * scale;
 *    drawHeight = imgHeight * scale;
 *    drawX = (canvasWidth - drawWidth) / 2;
 *    drawY = (canvasHeight - drawHeight) / 2;
 * ============================================================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class HeroCanvasScroller {
  /**
   * @param {Object} config
   * @param {HTMLElement|string} config.canvas - Canvas element or selector
   * @param {HTMLElement|string} config.container - Outer scroll track to pin
   * @param {number} [config.totalFrames=120] - Number of frames in sequence
   * @param {Function} [config.onProgress] - Callback for loading progress (loaded, total)
   */
  constructor(config = {}) {
    this.canvas = typeof config.canvas === 'string' ? document.querySelector(config.canvas) : config.canvas;
    this.container = typeof config.container === 'string' ? document.querySelector(config.container) : config.container;
    this.totalFrames = config.totalFrames || 120;
    this.onProgress = config.onProgress || null;

    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.frames = [];
    this.currentFrame = 0;
    this.isLoaded = false;

    // Determine Day vs Night lighting pass based on local hour
    const hour = (new Date()).getHours();
    this.isDayTime = hour >= 7 && hour < 24;

    // Remote CDN Base (with local fallback support)
    this.cdnBase = this.isDayTime
      ? 'https://assets.sondaven.com/hero-video'
      : 'https://assets.sondaven.com/hero-video-dark';

    this.init();
  }

  async init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Preload frames
    await this.preloadFrames();
    this.isLoaded = true;

    // Draw initial frame (frame 0)
    this.renderFrame(0);

    // Setup ScrollTrigger Pin & Scrub
    this.setupScrollTrigger();
  }

  /**
   * Resize canvas drawing buffer to match display resolution & DPR
   */
  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    if (this.isLoaded) {
      this.renderFrame(Math.round(this.currentFrame));
    }
  }

  /**
   * Concurrently load all 120 frames with progress reporting
   */
  preloadFrames() {
    let loadedCount = 0;

    const promises = Array.from({ length: this.totalFrames }, (_, i) => {
      return new Promise((resolve) => {
        const frameIndex = String(i).padStart(3, '0');
        const img = new Image();
        img.src = `${this.cdnBase}/${frameIndex}.webp`;

        img.onload = () => {
          this.frames[i] = img;
          loadedCount++;
          if (this.onProgress) {
            this.onProgress(loadedCount, this.totalFrames);
          }
          resolve(img);
        };

        img.onerror = () => {
          // Fallback: create empty placeholder so sequence doesn't crash
          this.frames[i] = null;
          loadedCount++;
          if (this.onProgress) {
            this.onProgress(loadedCount, this.totalFrames);
          }
          resolve(null);
        };
      });
    });

    return Promise.all(promises);
  }

  /**
   * Render a specific frame with aspect-ratio cover math
   * @param {number} index
   */
  renderFrame(index) {
    const img = this.frames[index];
    if (!img || !img.naturalWidth) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Mathematical Aspect Ratio "Cover" Calculation
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    this.ctx.drawImage(img, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
  }

  /**
   * Bind GSAP ScrollTrigger to scrub frame index smoothly
   */
  setupScrollTrigger() {
    const progressObj = { frame: 0 };

    gsap.to(progressObj, {
      frame: this.totalFrames - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: '+=200%', // Pins for 200vh of scroll travel
        pin: true,
        scrub: 0.5,   // 0.5s smooth inertia catch-up
        onUpdate: () => {
          const targetIndex = Math.round(progressObj.frame);
          if (targetIndex !== this.currentFrame) {
            this.currentFrame = targetIndex;
            this.renderFrame(this.currentFrame);
          }
        }
      }
    });
  }
}
