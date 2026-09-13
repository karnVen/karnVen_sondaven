/**
 * ============================================================================
 * DIRECTIONAL STICKY HEADER
 * ============================================================================
 * 
 * BEHAVIOR SPECIFICATION:
 * 1. Threshold Backdrop Blur:
 *    When scrolled past 100px, the frosted-glass background (.header_bg) fades in.
 * 2. Directional Velocity Response:
 *    - Scrolling Down: Header slides up and out of view (yPercent: -100) to clear
 *      screen space for immersive reading / viewing.
 *    - Scrolling Up: Header instantly returns (yPercent: 0).
 * 3. Bottom Buffer:
 *    When within 160px of the footer/page bottom, the header is forced visible.
 * 4. Micro-Jitter Filter:
 *    Scroll differences less than 30px (s < 30) are ignored to prevent erratic 
 *    flickering when users pause or nudge the trackpad.
 * ============================================================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const headerBg = header.querySelector('.header_bg');
  let lastScrollY = window.scrollY;
  let isHidden = false;
  let pastThreshold = window.scrollY > 100;

  if (headerBg) {
    gsap.set(headerBg, { opacity: pastThreshold ? 1 : 0 });
  }

  ScrollTrigger.create({
    start: 'top top',
    end: 'max',
    onUpdate: (self) => {
      const currentY = self.scroll();
      const delta = Math.abs(currentY - lastScrollY);
      const distFromBottom = document.documentElement.scrollHeight - (currentY + window.innerHeight);

      // Toggle background blur past 100px
      if (currentY > 100) {
        if (!pastThreshold && headerBg) {
          pastThreshold = true;
          gsap.to(headerBg, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        }
      } else {
        if (pastThreshold && headerBg) {
          pastThreshold = false;
          gsap.to(headerBg, { opacity: 0, duration: 0.4, ease: 'power2.out' });
        }
      }

      // Ignore tiny scroll increments to prevent micro-jitter
      if (delta < 30) return;

      // Force header open when approaching page bottom
      if (distFromBottom <= 160) {
        gsap.to(header, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => { isHidden = false; }
        });
        lastScrollY = currentY;
        return;
      }

      // Hide when scrolling DOWN past threshold
      if (currentY > lastScrollY && pastThreshold && !isHidden) {
        gsap.to(header, {
          yPercent: -100,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => { isHidden = true; }
        });
      }
      // Reveal when scrolling UP
      else if (currentY < lastScrollY && isHidden) {
        gsap.to(header, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power3.out',
          onComplete: () => { isHidden = false; }
        });
      }

      lastScrollY = currentY;
    }
  });
}
