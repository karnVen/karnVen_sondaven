/**
 * ============================================================================
 * PROXIMITY MAP PINS & GENERAL MAGNETIC ATTRACTION ENGINE (Level 4)
 * ============================================================================
 * 
 * MATHEMATICAL CONCEPTS:
 * 1. MAP PIN INVERSE DISTANCE SCALING:
 *    radius R = 240px, maxScale = 1.5
 *    dist = sqrt((mouseX - pinX)^2 + (mouseY - pinY)^2)
 *    scale = dist < R ? (maxScale - (dist / R) * (maxScale - 1.0)) : 1.0
 * 
 * 2. MAGNETIC ATTRACTION & ELASTIC DAMPING:
 *    When mouse hovers an element with [data-magnetic-strength]:
 *    deltaX = ((mouseX - left) / width - 0.5) * (strength / 16) in 'em'
 *    deltaY = ((mouseY - top) / height - 0.5) * (strength / 16) in 'em'
 *    Release triggers: gsap.to(el, { x: 0, y: 0, ease: 'elastic.out(1, 0.3)', duration: 1.6 })
 * ============================================================================
 */

import gsap from 'gsap';

/**
 * Initialize interactive map proximity pins
 */
export function initMapPins() {
  const mapEl = document.querySelector('[map]') || document.querySelector('[data-map]');
  if (!mapEl) return;

  const pins = Array.from(mapEl.querySelectorAll('[pin]') || mapEl.querySelectorAll('[data-pin]'));
  if (!pins.length) return;

  const RADIUS = 240;
  const MAX_SCALE = 1.5;

  const onMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pins.forEach((pin) => {
      const rect = pin.getBoundingClientRect();
      const pinX = rect.left + rect.width / 2;
      const pinY = rect.top + rect.height / 2;

      const dist = Math.sqrt(Math.pow(pinX - mouseX, 2) + Math.pow(pinY - mouseY, 2));

      if (dist < RADIUS) {
        const scale = MAX_SCALE - (dist / RADIUS) * (MAX_SCALE - 1.0);
        gsap.to(pin, {
          scale: scale,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(pin, {
          scale: 1.0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  const onMouseLeave = () => {
    pins.forEach((pin) => {
      gsap.to(pin, {
        scale: 1.0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  mapEl.addEventListener('mousemove', onMouseMove);
  mapEl.addEventListener('mouseleave', onMouseLeave);
}

/**
 * Initialize general magnetic attraction on buttons and badges
 */
export function initMagneticEffect() {
  const magneticElements = document.querySelectorAll('[data-magnetic-strength]');
  if (!magneticElements.length) return;

  magneticElements.forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 25;
    const innerTargets = el.querySelectorAll('[data-magnetic-inner-target]');
    const innerStrength = parseFloat(el.getAttribute('data-magnetic-strength-inner')) || strength;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const deltaX = ((e.clientX - rect.left) / el.offsetWidth - 0.5) * (strength / 16);
      const deltaY = ((e.clientY - rect.top) / el.offsetHeight - 0.5) * (strength / 16);

      gsap.to(el, {
        x: `${deltaX}em`,
        y: `${deltaY}em`,
        rotate: '0.001deg',
        duration: 1.2,
        ease: 'power4.out',
        overwrite: 'auto'
      });

      if (innerTargets.length) {
        innerTargets.forEach((inner) => {
          const innerX = ((e.clientX - rect.left) / el.offsetWidth - 0.5) * (innerStrength / 16);
          const innerY = ((e.clientY - rect.top) / el.offsetHeight - 0.5) * (innerStrength / 16);
          gsap.to(inner, {
            x: `${innerX}em`,
            y: `${innerY}em`,
            rotate: '0.001deg',
            duration: 1.4,
            ease: 'power4.out',
            overwrite: 'auto'
          });
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: '0em',
        y: '0em',
        duration: 1.6,
        ease: 'elastic.out(1, 0.3)',
        clearProps: 'transform'
      });

      if (innerTargets.length) {
        innerTargets.forEach((inner) => {
          gsap.to(inner, {
            x: '0em',
            y: '0em',
            duration: 1.8,
            ease: 'elastic.out(1, 0.3)',
            clearProps: 'transform'
          });
        });
      }
    });
  });
}
