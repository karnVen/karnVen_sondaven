/**
 * ============================================================================
 * SYNCHRONIZED SCROLLER MODULE (Lenis + GSAP ScrollTrigger)
 * ============================================================================
 * 
 * CORE ARCHITECTURAL CONCEPTS:
 * 
 * 1. WHAT IS "TICKER SYNCHRONIZATION"?
 *    Standard websites run Lenis in its own requestAnimationFrame loop and GSAP in
 *    another. This causes two uncoordinated timers competing for frame renders, 
 *    producing micro-stutter during fast scrolls or pinned element scrub sequences.
 *    By driving Lenis inside `gsap.ticker.add()`, both engines share the exact same
 *    timestamp clock down to the sub-millisecond.
 * 
 * 2. WHY `gsap.ticker.lagSmoothing(0)`?
 *    GSAP has an automatic feature called "lagSmoothing". If CPU spikes cause a frame 
 *    to take longer than 33ms, GSAP throttles internal time forward to prevent animations
 *    from "falling behind". However, for scroll-driven animations, this time-warp causes
 *    ScrollTrigger to jump ahead and jitter. Turning lagSmoothing off (0) guarantees
 *    that scroll position and pinned canvas frame indices stay strictly 1:1.
 * 
 * 3. SCROLL LOCKING WITHOUT JUMP / SHIFT:
 *    When modals, preloader, or menus open, locking `overflow: hidden` removes the 
 *    system scrollbar, causing the entire layout to suddenly expand rightwards by 15-17px.
 *    `lockScroll()` dynamically measures `window.innerWidth - clientWidth`, stores it
 *    into `--scrollbar-width`, and pads the body so the layout never jumps a single pixel.
 * ============================================================================
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** @type {Lenis|null} */
export let lenis = null;

/**
 * Initialize Lenis Smooth Scrolling and bind with GSAP
 * @returns {Lenis}
 */
export function initScroller() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  // Exact easing formula from Son Daven bundle:
  // Math.min(1, 1.001 - Math.pow(2, -10 * t)) produces an exponential decay curve
  // that feels heavy, luxurious, and cinematic without feeling laggy or floaty.
  lenis = new Lenis({
    wrapper: window,
    duration: 1.2,
    smoothWheel: true,
    touchMultiplier: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    infinite: false,
  });

  // Step A: When Lenis calculates a new scroll offset, notify ScrollTrigger immediately
  lenis.on('scroll', ScrollTrigger.update);

  // Step B: Connect Lenis RAF step into GSAP's central ticker
  // gsap.ticker provides elapsed seconds, while Lenis expects milliseconds
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Step C: Disable lag smoothing to prevent scroll teleportation
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Lock scrolling for modals/preloader while preventing layout shift
 */
export function lockScroll() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  document.body.style.paddingRight = 'var(--scrollbar-width)';
  document.documentElement.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

/**
 * Unlock scrolling and restore layout
 */
export function unlockScroll() {
  document.documentElement.style.removeProperty('--scrollbar-width');
  document.body.style.paddingRight = '';
  document.documentElement.style.overflow = '';
  if (lenis) lenis.start();
}
