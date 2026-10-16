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
 *    on initial visit, and an instant dismiss for subsequent page loads.
 * 
 * 2. SAFE SELECTOR MATCHING & TIMEOUT FALLBACK:
 *    Matches both Webflow DOM attributes (`[data-preloader]`, `[data-preloader="logo"]`,
 *    `[data-preloader-percent]`, `[data-preloader="p"]`) and standard fallback hooks.
 *    Guarantees page unlock after a maximum timeout so the user is never blocked.
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
  const masterPreloader = document.querySelector('[data-master-preloader]');
  if (masterPreloader) masterPreloader.remove();

  const preloader = document.querySelector('[data-preloader]') || document.querySelector('.master-preloader');
  const percentEl = document.querySelector('[data-preloader-percent]');
  const logoEl = document.querySelector('[data-preloader="logo"]') || document.querySelector('.preloader_logo');
  const sublines = document.querySelectorAll('[data-preloader="p"]');

  if (!preloader) {
    unlockScroll();
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

  let isDismissed = false;
  const dismiss = () => {
    if (isDismissed) return;
    isDismissed = true;
    unlockScroll();

    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        if (onCompleteCallback) onCompleteCallback();
      }
    });
  };

  const tl = gsap.timeline({
    paused: true,
    onComplete: dismiss
  });

  // 1. Initial elements reveal if present
  if (logoEl) {
    tl.fromTo(logoEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  }
  if (sublines.length) {
    tl.fromTo(sublines, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
  }

  // 2. Count minimum duration
  tl.to(progress, {
    value: 100,
    duration: 1.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (percentEl) {
        percentEl.textContent = `${Math.round(progress.value)}%`;
      }
    }
  });

  // 3. Stagger elements out before sliding
  const exitElements = [logoEl, percentEl, ...sublines].filter(Boolean);
  if (exitElements.length) {
    tl.to(exitElements, {
      opacity: 0,
      y: -15,
      duration: 0.4,
      stagger: 0.04,
      ease: 'power2.in'
    }, '+=0.1');
  }

  tl.play();

  // Safety fallback: if anything stalls, force dismiss after 3 seconds
  setTimeout(dismiss, 3000);
}

/**
 * Fast reveal for returning visitors
 */
function animatePreloaderShort(onCompleteCallback) {
  const masterPreloader = document.querySelector('[data-master-preloader]');
  if (masterPreloader) masterPreloader.remove();

  const preloader = document.querySelector('[data-preloader]') || document.querySelector('.master-preloader');
  if (!preloader) {
    unlockScroll();
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  gsap.to(preloader, {
    opacity: 0,
    duration: 0.35,
    ease: 'power2.out',
    onComplete: () => {
      preloader.style.display = 'none';
      unlockScroll();
      if (onCompleteCallback) onCompleteCallback();
    }
  });
}
