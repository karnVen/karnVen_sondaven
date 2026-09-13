/**
 * ============================================================================
 * THEME CONTROLLER MODULE (Section-Aware Contrast Switching)
 * ============================================================================
 * 
 * CORE ARCHITECTURAL CONCEPTS:
 * 
 * HOW DOES DYNAMIC THEME INVERSION WORK?
 * In luxury websites like Son Daven, sticky controls (like the audio toggle, 
 * navigation links, and floating menu triggers) remain on screen while the user 
 * scrolls through alternating dark and light sections.
 * 
 * Instead of hardcoding background checks or polling on every pixel:
 * 1. Persistent floating UI elements receive the attribute `[theme]`.
 * 2. Sections receive background tokens: `bg="dark"`, `bg="light"`, or `bg="color"`.
 * 3. We calculate the exact vertical midpoint of each floating element:
 *    `midpoint = element.getBoundingClientRect().top + (element.offsetHeight / 2)`
 * 4. We bind a ScrollTrigger whose start/end points dynamically calculate when the 
 *    element's midpoint enters and leaves the section.
 * 5. On crossing, classes `.theme_on-dark` or `.theme_on-light` are toggled, 
 *    inverting CSS variables (--theme-text, --theme-border) via hardware-accelerated CSS transitions!
 * ============================================================================
 */

import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Initialize dynamic section-based theme switching
 */
export function initThemeChange() {
  const themedElements = document.querySelectorAll('[theme]');
  if (!themedElements.length) return;

  /**
   * Bind section triggers to an active theme class
   * @param {HTMLElement} section
   * @param {string} targetClass
   * @param {string[]} removeClasses
   */
  function bindSectionTrigger(section, targetClass, removeClasses) {
    if (getComputedStyle(section).display === 'none') return;

    themedElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: section,
        start: () => {
          const rect = el.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          return `top top+=${midY}`;
        },
        end: () => {
          const rect = el.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          return `bottom top+=${midY}`;
        },
        onEnter: () => {
          el.classList.add(targetClass);
          el.classList.remove(...removeClasses);
        },
        onEnterBack: () => {
          el.classList.add(targetClass);
          el.classList.remove(...removeClasses);
        }
      });
    });
  }

  // Dark sections -> theme_on-dark
  document.querySelectorAll('[bg="dark"]').forEach((sec) => {
    bindSectionTrigger(sec, 'theme_on-dark', ['theme_on-light']);
  });

  // Light sections -> theme_on-light
  document.querySelectorAll('[bg="light"]').forEach((sec) => {
    bindSectionTrigger(sec, 'theme_on-light', ['theme_on-dark']);
  });

  // Warm accent/color sections -> theme_on-dark
  document.querySelectorAll('[bg="color"]').forEach((sec) => {
    bindSectionTrigger(sec, 'theme_on-dark', ['theme_on-light']);
  });
}
