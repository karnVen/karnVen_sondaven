/**
 * ============================================================================
 * SON DAVEN REPLICA - MASTER ENTRY POINT
 * ============================================================================
 * 
 * ARCHITECTURAL ORCHESTRATION PIPELINE:
 * 
 * 1. Initialize CSS Tokens & Viewport Scaling (style.css).
 * 2. Bootstrap Lenis Smooth Scroller + GSAP Ticker Synchronization (scroller.js).
 * 3. Mount Directional Auto-Hiding Sticky Header (header.js).
 * 4. Mount 120-Frame 3D Canvas Scroller with Day/Night Lighting (canvasScroller.js).
 * 5. Mount WebGL Cross-Stitch & Dither Fragment Shader Scene (webglEffect.js).
 * 6. Mount Mathematical Curved SVG Season Slider (seasonSlider.js).
 * 7. Mount Proximity-Sensitive Magnetic Map Pins (mapProximity.js).
 * 8. Mount Ambient Audio Player & Equalizer Bars (audioPlayer.js).
 * 9. Register Dynamic Theme Contrast Inversion Watchers (theme.js).
 * 10. Run Preloader (preloader.js) with real-time frame download tracking.
 * 11. Attach ScrollTrigger-driven Text & Divider Reveals (textReveal.js).
 * ============================================================================
 */

import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroller } from './src/core/scroller.js';
import { initPreloader, updatePreloaderPercent } from './src/core/preloader.js';
import { initThemeChange } from './src/core/theme.js';
import { initHeader } from './src/components/header.js';
import { HeroCanvasScroller } from './src/components/canvasScroller.js';
import { WebGLDitherScene } from './src/core/webglEffect.js';
import { SeasonSlider } from './src/components/seasonSlider.js';
import { initMapProximity } from './src/components/mapProximity.js';
import { AmbientAudioPlayer } from './src/components/audioPlayer.js';
import { animateTextH, animateTextP, animateLine } from './src/animations/textReveal.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  console.log(
    "%c[Son Daven Replica]%c Initializing Complete Architecture...",
    "color: #a89474; font-weight: bold; font-size: 12px;",
    "color: inherit; font-size: 12px;"
  );

  // Step 1: Initialize synchronized Lenis + GSAP Scroller
  const scroller = initScroller();

  // Step 2: Initialize sticky directional header
  initHeader();

  // Step 3: Initialize dynamic section theme inverter
  initThemeChange();

  // Step 4: Initialize 120-Frame 3D Hero Canvas Scroller
  const frameCounterEl = document.getElementById('hero-frame-num');
  const heroScroller = new HeroCanvasScroller({
    canvas: '#hero-canvas',
    container: '#hero-canvas-track',
    totalFrames: 120,
    onProgress: (loaded, total) => {
      const percent = Math.round((loaded / total) * 100);
      updatePreloaderPercent(percent);
    }
  });

  // Track active frame number in the overlay
  const originalRender = heroScroller.renderFrame.bind(heroScroller);
  heroScroller.renderFrame = (index) => {
    originalRender(index);
    if (frameCounterEl) {
      frameCounterEl.textContent = String(index).padStart(3, '0');
    }
  };

  // Step 5: Initialize WebGL Dither & Cross-Stitch Shader Scene
  initDitherScene();

  // Step 6: Initialize Curved SVG Season Slider (Milestone 4)
  initSeasonSwitcher();

  // Step 7: Initialize Proximity Map Pins (Milestone 4)
  initMapProximity('[data-map]', '[data-pin]');

  // Step 8: Initialize Ambient Audio Player (Milestone 4)
  new AmbientAudioPlayer({ toggle: '[data-sound-toggle]' });

  // Step 9: Bind ScrollTrigger-based reveal animations
  initScrollReveals();

  // Step 10: Start preloader lifecycle
  initPreloader(() => {
    console.log("%c[Preloader]%c Completed. Page active.", "color: #a89474; font-weight: bold;", "color: inherit;");
    ScrollTrigger.refresh();
  });
});

/**
 * Milestone 3: Initialize the WebGL Cross-Stitch Shader
 */
function initDitherScene() {
  const canvasEl = document.getElementById('dither-canvas');
  if (!canvasEl) return;

  const scene = new WebGLDitherScene({
    canvas: canvasEl,
    layers: [
      {
        type: 'video',
        src: 'https://assets.sondaven.com/scenes/hero_tree-c.mp4',
        config: {
          x: 0.15,
          y: 0.05,
          width: 0.7,
          height: 0.9,
          xSquares: 100,
          ySquares: 80,
          blackPoint: 35,
          whitePoint: 190,
          threshold: 255,
          fillColor: [0.658, 0.580, 0.455], // Bronze accent (#a89474)
          fillOpacity: 1.0
        }
      }
    ]
  });

  const layer = scene.layers[0];
  if (layer) {
    gsap.timeline({
      scrollTrigger: {
        trigger: canvasEl,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    })
    .to(layer.config, {
      blackPoint: 70,
      whitePoint: 160,
      xSquares: 140,
      ySquares: 100,
      ease: 'none'
    });
  }
}

/**
 * Milestone 4: Initialize the Curved SVG Season Switcher
 */
function initSeasonSwitcher() {
  const summerEl = document.getElementById('season-summer');
  const winterEl = document.getElementById('season-winter');
  const startBtn = document.querySelector('[data-start] span');
  const endBtn = document.querySelector('[data-end] span');

  new SeasonSlider({
    svg: '[data-line-animation]',
    onChange: (season) => {
      if (season === 'winter') {
        if (startBtn) { startBtn.className = 'p6 text-gray'; }
        if (endBtn) { endBtn.className = 'p6 text-accent'; }

        gsap.to(summerEl, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            summerEl.style.display = 'none';
            winterEl.style.display = 'block';
            gsap.to(winterEl, { opacity: 1, duration: 0.4 });
            ScrollTrigger.refresh();
          }
        });
      } else {
        if (startBtn) { startBtn.className = 'p6 text-accent'; }
        if (endBtn) { endBtn.className = 'p6 text-gray'; }

        gsap.to(winterEl, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            winterEl.style.display = 'none';
            summerEl.style.display = 'block';
            gsap.to(summerEl, { opacity: 1, duration: 0.4 });
            ScrollTrigger.refresh();
          }
        });
      }
    }
  });
}

/**
 * Setup ScrollTrigger observers for text and line reveals
 */
function initScrollReveals() {
  // Headings
  document.querySelectorAll('[data-scroll-reveal="h"]').forEach((el) => {
    animateTextH(el, 'initial');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => animateTextH(el, 'reveal', 0)
    });
  });

  // Paragraphs
  document.querySelectorAll('[data-scroll-reveal="p"]').forEach((el) => {
    animateTextP(el, 'initial');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => animateTextP(el, 'reveal', 0)
    });
  });

  // Dividers
  document.querySelectorAll('[data-scroll-reveal="line"]').forEach((el) => {
    animateLine(el, 'initial');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => animateLine(el, 'reveal')
    });
  });
}
