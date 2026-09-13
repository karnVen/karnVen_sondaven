/**
 * ============================================================================
 * PROXIMITY-SENSITIVE MAP PINS & MAGNETIC PULL
 * ============================================================================
 * 
 * MATHEMATICAL CONCEPTS:
 * 1. CONTINUOUS PROXIMITY RADIUS:
 *    Instead of waiting for cursor collision (hover), each map pin radiates an
 *    influence field of radius R = 240px.
 * 
 * 2. PROPORTIONAL SCALING:
 *    scale = max(1.0, maxScale - (dist / R) * (maxScale - 1.0))
 *    As the cursor approaches, the pin smoothly magnifies from 1.0 up to 1.6x.
 * 
 * 3. MAGNETIC PULL VECTOR:
 *    On hover, the pin experiences an elastic spring force pulling its center
 *    towards the mouse:
 *    deltaX = (mouseX - pinCenterX) * magneticStrength
 *    deltaY = (mouseY - pinCenterY) * magneticStrength
 *    Using GSAP 'elastic.out(1, 0.3)' produces a tactile physical response.
 * ============================================================================
 */

import gsap from 'gsap';

export function initMapProximity(mapSelector = '[data-map]', pinSelector = '[data-pin]') {
  const mapEl = document.querySelector(mapSelector);
  if (!mapEl) return;

  const pins = Array.from(mapEl.querySelectorAll(pinSelector));
  if (!pins.length) return;

  const RADIUS = 220; // Proximity field radius in pixels
  const MAX_SCALE = 1.45;

  const onMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pins.forEach((pin) => {
      const rect = pin.getBoundingClientRect();
      const pinX = rect.left + rect.width / 2;
      const pinY = rect.top + rect.height / 2;

      const dist = Math.sqrt(Math.pow(mouseX - pinX, 2) + Math.pow(mouseY - pinY, 2));

      if (dist < RADIUS) {
        // Proximity scale
        const scale = MAX_SCALE - (dist / RADIUS) * (MAX_SCALE - 1.0);

        // Subtle magnetic pull
        const pullFactor = (1.0 - dist / RADIUS) * 12; // Max 12px pull
        const angle = Math.atan2(mouseY - pinY, mouseX - pinX);
        const offsetX = Math.cos(angle) * pullFactor;
        const offsetY = Math.sin(angle) * pullFactor;

        gsap.to(pin, {
          scale: scale,
          x: offsetX,
          y: offsetY,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(pin, {
          scale: 1.0,
          x: 0,
          y: 0,
          duration: 0.6,
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
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto'
      });
    });
  };

  mapEl.addEventListener('mousemove', onMouseMove);
  mapEl.addEventListener('mouseleave', onMouseLeave);
}
