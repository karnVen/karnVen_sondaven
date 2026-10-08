/**
 * ============================================================================
 * MULTI-SCENE CANVAS PARALLAX & VIDEO COMPOSITING ENGINE
 * ============================================================================
 * 
 * ARCHITECTURAL MECHANICS:
 * 
 * 1. MULTI-PLANE SCENE COMPOSITING:
 *    Instead of placing dozens of heavy HTML <video> tags on the DOM (which causes
 *    memory exhaustion and paint thrashing), each section has a single GPU-accelerated
 *    <canvas class="scene">. A headless HTML5 video element streams into a canvas
 *    2D context with alpha masking and parallax offsets.
 * 
 * 2. BATTERY & GPU PRESERVATION (IntersectionObserver):
 *    Canvases only run their render loops when within the visible viewport.
 *    Off-screen canvases are frozen automatically.
 * 
 * 3. GSAP SCROLLTRIGGER PARALLAX:
 *    Each layer moves at a differential scroll velocity (e.g. background mountain at 0.1x,
 *    clouds at 0.3x, foreground wildlife at 0.6x).
 * ============================================================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mapping of data-attributes to scene video assets & parallax configs
const SCENE_CONFIGS = [
  {
    selector: '[data-intro-bg-scene]',
    video: '/assets/scenes/hero_tree-c.mp4',
    parallaxSpeed: 0.15,
  },
  {
    selector: '[data-intro-over-scene]',
    video: '/assets/scenes/hero_sheeps-c.mp4',
    parallaxSpeed: 0.35,
  },
  {
    selector: '[data-prolog-scene]',
    video: '/assets/scenes/prolog-l-c.mp4',
    secondaryVideo: '/assets/scenes/prolog-r-c.mp4',
    parallaxSpeed: 0.25,
  },
  {
    selector: '[data-about-scene]',
    video: '/assets/scenes/about_stork-c.mp4',
    parallaxSpeed: 0.2,
  },
  {
    selector: '[data-benefits-intro-scene]',
    video: '/assets/scenes/benefits-intro_birds-c.mp4',
    secondaryVideo: '/assets/scenes/benefits-intro_persons-cc.mp4',
    parallaxSpeed: 0.3,
  },
  {
    selector: '[data-benefits-outro-scene]',
    video: '/assets/scenes/benefits-outro_tree-c.mp4',
    secondaryVideo: '/assets/scenes/benefits-outro_sheeps.mp4',
    parallaxSpeed: 0.25,
  },
  {
    selector: '[data-fin-scene]',
    video: '/assets/scenes/claudes_01.mp4',
    parallaxSpeed: 0.18,
  },
  {
    selector: '[data-seasons-scene]',
    video: '/assets/scenes/seasons_summer.mp4',
    secondaryVideo: '/assets/scenes/seasons_winter.mp4',
    parallaxSpeed: 0.1,
  },
  {
    selector: '[data-factoid-scene]',
    video: '/assets/scenes/factoids_river-c.mp4',
    secondaryVideo: '/assets/scenes/factoids_sheeps-c.mp4',
    parallaxSpeed: 0.28,
  },
  {
    selector: '[data-footer-scene]',
    video: '/assets/scenes/footer_mountain.hevc.mp4',
    secondaryVideo: '/assets/scenes/footer_sheeps-c.mp4',
    parallaxSpeed: 0.12,
  }
];

class SceneCanvasController {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.ctx = canvas.getContext('2d');
    this.video = null;
    this.secondaryVideo = null;
    this.isVisible = false;
    this.animId = null;
    this.parallaxY = 0;

    this.init();
  }

  init() {
    this.setupMedia();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Intersection observer to pause off-screen rendering
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          if (this.video) this.video.play().catch(() => {});
          if (this.secondaryVideo) this.secondaryVideo.play().catch(() => {});
          this.render();
        } else {
          if (this.video) this.video.pause();
          if (this.secondaryVideo) this.secondaryVideo.pause();
          if (this.animId) cancelAnimationFrame(this.animId);
        }
      });
    }, { threshold: 0.05 });

    this.observer.observe(this.canvas);

    // GSAP Parallax ScrollTrigger
    const parentSection = this.canvas.closest('.section') || this.canvas.parentElement;
    if (parentSection) {
      ScrollTrigger.create({
        trigger: parentSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          this.parallaxY = (self.progress - 0.5) * 120 * this.config.parallaxSpeed;
        }
      });
    }
  }

  setupMedia() {
    if (this.config.video) {
      this.video = document.createElement('video');
      this.video.src = this.config.video;
      this.video.muted = true;
      this.video.loop = true;
      this.video.playsInline = true;
      this.video.crossOrigin = 'anonymous';
      this.video.load();
    }

    if (this.config.secondaryVideo) {
      this.secondaryVideo = document.createElement('video');
      this.secondaryVideo.src = this.config.secondaryVideo;
      this.secondaryVideo.muted = true;
      this.secondaryVideo.loop = true;
      this.secondaryVideo.playsInline = true;
      this.secondaryVideo.crossOrigin = 'anonymous';
      this.secondaryVideo.load();
    }
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
  }

  render() {
    if (!this.isVisible) return;

    const cw = this.canvas.width;
    const ch = this.canvas.height;
    this.ctx.clearRect(0, 0, cw, ch);

    // Primary Video Layer
    if (this.video && this.video.readyState >= 2) {
      const vw = this.video.videoWidth;
      const vh = this.video.videoHeight;
      const scale = Math.max(cw / vw, ch / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2 + this.parallaxY;

      this.ctx.drawImage(this.video, dx, dy, dw, dh);
    }

    // Secondary Video Layer (e.g. roaming wildlife / clouds)
    if (this.secondaryVideo && this.secondaryVideo.readyState >= 2) {
      const vw = this.secondaryVideo.videoWidth;
      const vh = this.secondaryVideo.videoHeight;
      const scale = Math.min(cw / vw, ch / vh) * 0.7;
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = cw - dw - 40;
      const dy = ch - dh - 20 - this.parallaxY * 0.5;

      this.ctx.drawImage(this.secondaryVideo, dx, dy, dw, dh);
    }

    this.animId = requestAnimationFrame(() => this.render());
  }
}

/**
 * Initialize all 15 scene canvases found across the DOM
 */
export function initAllSceneCanvases() {
  const controllers = [];

  SCENE_CONFIGS.forEach((cfg) => {
    const elements = document.querySelectorAll(cfg.selector);
    elements.forEach((canvas) => {
      if (canvas.tagName === 'CANVAS') {
        controllers.push(new SceneCanvasController(canvas, cfg));
      }
    });
  });

  return controllers;
}
