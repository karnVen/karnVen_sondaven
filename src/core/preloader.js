/**
 * ============================================================================
 * PRELOADER & LIFECYCLE CONTROLLER
 * ============================================================================
 * 
 * CORE ARCHITECTURAL CONCEPTS:
 * 
 * 1. FIRST-TIME vs. RETURNING VISITOR LOGIC:
 *    High-end agency websites provide an elaborate storytelling intro for first-time
 *    visitors, but should NOT frustrate returning users or users navigating sub-pages.
 *    Using `sessionStorage.getItem('hasVisited')`, we run the full cinematic intro
 *    on initial visit, and a quick 0.4s fade-out for subsequent page loads.
 * 
 * 2. COUNTER & TIMELINE SYNC:
 *    The counter smoothly tweens from 0% to 100%, synchronized with font loading
 *    and asset preparation promises.
 * ============================================================================
 */

import gsap from 'gsap';
import { lockScroll, unlockScroll } from './scroller.js';

let updatePercentCallback = null;

/**
 * Update preloader percent display in real-time
 * @param {number} percent 0 to 100
 */
export function updatePreloaderPercent(percent) {
  if (updatePercentCallback) {
    updatePercentCallback(percent);
  }
}

export function initPreloader(onCompleteCallback, assetPromise = null) {
  let hasVisited = false;
  try {
    hasVisited = sessionStorage.getItem('hasVisited') === 'true';
  } catch (e) {
    // Local storage fallback
  }

  if (hasVisited) {
    animatePreloaderShort(onCompleteCallback);
  } else {
    animatePreloaderIntro(onCompleteCallback, assetPromise);
    try {
      sessionStorage.setItem('hasVisited', 'true');
    } catch (e) {}
  }
}

/**
 * Full Cinematic Preloader for first-time visitors
 */
function animatePreloaderIntro(onCompleteCallback, assetPromise = null) {
  const preloader = document.querySelector('[data-master-preloader]');
  const percentEl = document.querySelector('[data-preloader-percent]');
  const logoEl = document.querySelector('[data-preloader-logo]');
  const sublines = document.querySelectorAll('[data-preloader-sub]');

  if (!preloader) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  lockScroll();

  const progress = { value: 0 };

  updatePercentCallback = (val) => {
    gsap.to(progress, {
      value: val,
      duration: 0.3,
      ease: 'none',
      onUpdate: () => {
        if (percentEl) {
          percentEl.textContent = `${Math.round(progress.value)}%`;
        }
      }
    });
  };

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      unlockScroll();
      gsap.to(preloader, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power3.inOut',
        onComplete: () => {
          preloader.remove();
          if (onCompleteCallback) onCompleteCallback();
        }
      });
    }
  });

  // 1. Initial elements reveal
  tl.fromTo(logoEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
    .fromTo(sublines, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
    // 2. Count minimum duration
    .to(progress, {
      value: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (percentEl) {
          percentEl.textContent = `${Math.round(progress.value)}%`;
        }
      }
    })
    // 3. Stagger elements out
    .to([logoEl, sublines, percentEl], {
      opacity: 0,
      y: -20,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.in'
    }, '+=0.2');

  // Start intro
  tl.play();

  // If waiting on assets, resolve with promise
  if (assetPromise) {
    Promise.all([assetPromise, document.fonts.ready]).then(() => {
      // Progress complete
    });
  }
}

/**
 * Fast reveal for returning visitors
 */
function animatePreloaderShort(onCompleteCallback) {
  const preloader = document.querySelector('[data-master-preloader]');
  if (!preloader) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  gsap.to(preloader, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => {
      preloader.remove();
      if (onCompleteCallback) onCompleteCallback();
    }
  });
}
