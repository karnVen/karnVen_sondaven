/**
 * ============================================================================
 * BARBA.JS PJAX TRANSITIONS & AMBIENT LIFECYCLE CONTROLLER (Level 5)
 * ============================================================================
 * 
 * CORE PRINCIPLES:
 * 1. PERSISTENT AUDIO & WEBGL CONTEXTS:
 *    PJAX allows replacing only the inner <main data-barba="container">,
 *    keeping background music, header state, and audio nodes playing continuously.
 * 
 * 2. GSAP SCROLLTRIGGER LIFECYCLE REFRESH:
 *    On every page transition, we must kill old ScrollTriggers and re-initialize
 *    coordinates via ScrollTrigger.refresh().
 * ============================================================================
 */

import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from './scroller.js';

gsap.registerPlugin(ScrollTrigger);

export function initPageTransitions() {
  const wrapper = document.querySelector('[data-barba="wrapper"]');
  if (!wrapper) return;

  barba.init({
    transitions: [
      {
        name: 'fade-and-slide',
        async leave(data) {
          const done = this.async();

          // Smooth fade & slide out
          gsap.to(data.current.container, {
            opacity: 0,
            y: -30,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: done
          });
        },
        async enter(data) {
          // Reset scroll offset smoothly
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }

          // Kill stale triggers and recalculate geometry
          ScrollTrigger.getAll().forEach(t => t.kill());
          ScrollTrigger.refresh();

          // Animate new view in
          gsap.fromTo(data.next.container,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        }
      }
    ]
  });
}
