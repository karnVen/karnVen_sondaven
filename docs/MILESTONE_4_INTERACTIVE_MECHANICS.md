# Milestone 4: Interactive Mechanics & Audio Architecture
**Dissecting and Rebuilding Son Daven's Advanced Micro-Interactions**

This guide covers the mathematics, SVG vector projection, magnetic physics, and audio interpolation built in **Milestone 4**.

---

## 1. Mathematical Curved SVG Path Projection (Season Switcher)

### Why not a standard HTML `<input type="range">`?
A standard slider is strictly linear (horizontal or vertical). High-end editorial websites design expressive curves that mimic organic natural hills and slopes.

### The Algorithm:
1. **Total Arc Length**:
   We measure the exact pixel length along the bezier curve:
   ```javascript
   const totalLength = path.getTotalLength();
   ```
2. **Equidistant Sampling along Arc**:
   When the user drags with a mouse or finger anywhere in the viewport, the cursor coordinate is $(x_m, y_m)$. We project this cursor onto the closest point along the curve by evaluating:
   $$\text{dist}(t) = \sqrt{(x(t) - x_m)^2 + (y(t) - y_m)^2}$$
   We sample $100$ increments ($t = 0.00, 0.01, \dots, 1.00$) to locate the minimal distance parameter $t^*$.
3. **Handle Positioning**:
   ```javascript
   const point = path.getPointAtLength(t * totalLength);
   gsap.set(handle, { cx: point.x, cy: point.y });
   ```
4. **Magnetic Snap**:
   On `mouseup` / `touchend`:
   * If $t^* < 0.50 \implies$ snaps to Summer ($0.0$).
   * If $t^* \ge 0.50 \implies$ snaps to Winter ($1.0$).

---

## 2. Proximity-Sensitive Magnetic Map Pins

### Continuous Field vs. Hover:
Standard websites only scale elements on direct `:hover`. But when zooming across a map, finding a tiny 10px pin with a cursor is cumbersome.

### The Radius Influence Formula:
Each pin radiates a spherical influence zone of radius $R = 220\text{px}$.
1. Calculate distance from cursor to pin center:
   $$\text{dist} = \sqrt{(x_{\text{mouse}} - x_{\text{pin}})^2 + (y_{\text{mouse}} - y_{\text{pin}})^2}$$
2. If $\text{dist} < R$:
   $$\text{scale} = \text{maxScale} - \left(\frac{\text{dist}}{R}\right) \times (\text{maxScale} - 1.0)$$
3. **Magnetic Pull Vector**:
   We calculate the direction vector from the pin to the mouse:
   $$\theta = \text{atan2}(y_{\text{mouse}} - y_{\text{pin}}, x_{\text{mouse}} - x_{\text{pin}})$$
   $$\vec{\Delta} = \left(\cos\theta \cdot F, \sin\theta \cdot F\right)$$
   Where $F = (1.0 - \text{dist} / R) \times 12\text{px}$.
   The pin physically stretches and pulls toward your cursor with GSAP elastic damping.

---

## 3. Ambient Audio Architecture & Equalizer

### The "Anti-Click" Volume Ramping:
Directly invoking `audio.play()` or `audio.pause()` creates sudden amplitude discontinuities, causing audible clicking artifacts through speakers.
Instead:
* On Play: Starts at `volume = 0` and tweens to `0.3` over `0.8s`.
* On Pause: Tweens volume down to `0` over `0.8s`, pausing only after silence is achieved.

---

## 4. Summary of Files in Milestone 4:
* **[`src/components/seasonSlider.js`](file:///z:/var/www/karnVen_sondaven/src/components/seasonSlider.js)**: Curved SVG slider with Euclidean distance projection.
* **[`src/components/mapProximity.js`](file:///z:/var/www/karnVen_sondaven/src/components/mapProximity.js)**: Continuous proximity radius scaling and elastic magnetics.
* **[`src/components/audioPlayer.js`](file:///z:/var/www/karnVen_sondaven/src/components/audioPlayer.js)**: Ramped audio player with animated equalizer bars.
* **[`index.html`](file:///z:/var/www/karnVen_sondaven/index.html)**: Seasons and Location sections.
* **[`main.js`](file:///z:/var/www/karnVen_sondaven/main.js)**: Integrated controller.
