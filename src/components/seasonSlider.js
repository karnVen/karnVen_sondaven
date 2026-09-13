/**
 * ============================================================================
 * CURVED SVG PATH SEASON SLIDER (Summer / Winter Switcher)
 * ============================================================================
 * 
 * MATHEMATICAL CONCEPTS:
 * 1. ARC LENGTH PARAMETERIZATION:
 *    The slider path is an arbitrary cubic/quadratic bezier curve. To move a handle
 *    smoothly along this curve, we use `path.getTotalLength()` and sample points
 *    with `path.getPointAtLength(t * totalLength)`.
 * 
 * 2. EUCLIDEAN DISTANCE PROJECTION:
 *    When dragging with a mouse or finger, the cursor position (mx, my) is anywhere
 *    in 2D space. To project this cursor onto the closest point along the curve:
 *    dist(t) = sqrt((pt.x - mx)^2 + (pt.y - my)^2)
 *    We test 100 equidistant steps and locate the minimum distance point.
 * 
 * 3. MAGNETIC SNAP:
 *    On drag release, if progress < 0.5, it snaps smoothly to Summer (t = 0.0).
 *    If progress >= 0.5, it snaps smoothly to Winter (t = 1.0).
 * ============================================================================
 */

import gsap from 'gsap';

export class SeasonSlider {
  /**
   * @param {Object} options
   * @param {string|SVGElement} options.svg - SVG element container [data-line-animation]
   * @param {Function} [options.onChange] - Callback when season toggles ('summer' | 'winter')
   */
  constructor(options = {}) {
    this.svg = typeof options.svg === 'string' ? document.querySelector(options.svg) : options.svg;
    this.onChange = options.onChange || null;
    if (!this.svg) return;

    this.path = this.svg.querySelector('[data-path]');
    this.handle = this.svg.querySelector('[data-active]');
    this.startBtn = document.querySelector('[data-start]');
    this.endBtn = document.querySelector('[data-end]');

    if (!this.path || !this.handle) return;

    this.totalLength = this.path.getTotalLength();
    this.isDragging = false;
    this.progress = 0; // 0 = Summer, 1 = Winter
    this.currentSeason = 'summer';

    this.init();
  }

  init() {
    // Position handle at t = 0 (Summer)
    const initialPt = this.getPointAt(0);
    gsap.set(this.handle, { cx: initialPt.x, cy: initialPt.y });

    // Drag events
    const onStart = (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.handle.style.cursor = 'grabbing';
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const clientY = e.clientY || e.touches?.[0]?.clientY;
      if (clientX === undefined) return;

      const rect = this.svg.getBoundingClientRect();
      // SVG local coordinates
      const svgX = (clientX - rect.left) * (300 / rect.width);
      const svgY = (clientY - rect.top) * (100 / rect.height);

      // Find closest point along path
      let bestT = 0;
      let minDistance = Infinity;

      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const pt = this.getPointAt(t);
        const dist = Math.sqrt(Math.pow(pt.x - svgX, 2) + Math.pow(pt.y - svgY, 2));
        if (dist < minDistance) {
          minDistance = dist;
          bestT = t;
        }
      }

      this.progress = bestT;
      const closestPt = this.getPointAt(this.progress);
      gsap.set(this.handle, { cx: closestPt.x, cy: closestPt.y });
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.handle.style.cursor = 'grab';

      // Snap to Summer (0) or Winter (1)
      const targetT = this.progress < 0.5 ? 0 : 1;
      this.snapTo(targetT);
    };

    this.handle.addEventListener('mousedown', onStart);
    this.handle.addEventListener('touchstart', onStart);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    // Click on labels
    if (this.startBtn) this.startBtn.addEventListener('click', () => this.snapTo(0));
    if (this.endBtn) this.endBtn.addEventListener('click', () => this.snapTo(1));
  }

  getPointAt(t) {
    return this.path.getPointAtLength(t * this.totalLength);
  }

  snapTo(targetT) {
    const startProgress = this.progress;
    const proxy = { p: startProgress };

    gsap.to(proxy, {
      p: targetT,
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: () => {
        this.progress = proxy.p;
        const pt = this.getPointAt(this.progress);
        gsap.set(this.handle, { cx: pt.x, cy: pt.y });
      },
      onComplete: () => {
        const newSeason = targetT === 0 ? 'summer' : 'winter';
        if (newSeason !== this.currentSeason) {
          this.currentSeason = newSeason;
          if (this.onChange) this.onChange(newSeason);
        }
      }
    });

    // Update active label styling immediately
    if (this.startBtn) this.startBtn.classList.toggle('is-active', targetT === 0);
    if (this.endBtn) this.endBtn.classList.toggle('is-active', targetT === 1);
  }
}
