# Milestone 1: Architectural Study Notes & Terminology Guide
**Dissecting and Rebuilding Son Daven (https://sondaven.com)**

This document serves as your complete conceptual reference for the core engineering principles powering **Son Daven** and our Milestone 1 codebase.

---

## 1. Core Concepts & Terminology Glossary

### A. Virtual Inertial Scrolling (Lenis)
* **What is it?**
  In native browser scrolling, when you scroll a mouse wheel, the browser immediately jumps by discrete notches (e.g. 100px). 
  In high-end luxury websites, this feels abrasive. **Lenis** intercepts wheel/touch events, translates them into virtual coordinates, and applies continuous mathematical easing toward the target position:
  $$\text{easing}(t) = \min(1, 1.001 - 2^{-10t})$$
  This specific exponential decay formula creates that signature heavy, luxurious, tactile glide.

### B. Ticker Synchronization
* **The Problem**:
  Normally, developers initialize Lenis in one `requestAnimationFrame` loop, while GSAP runs its own internal RAF loop.
  Because both timers trigger at slightly different moments within each 16.6ms screen refresh, **GSAP ScrollTrigger evaluates scroll positions that are already stale or ahead of Lenis**. The result is a noticeable visual jitter, especially on pinned elements or scrubbed video frames.
* **The Solution**:
  We kill the standalone Lenis RAF loop and plug Lenis directly into GSAP's master ticker:
  ```javascript
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  ```
  Now, GSAP and Lenis share the **exact same tick**, down to sub-millisecond precision.

### C. Why `gsap.ticker.lagSmoothing(0)` is Crucial
* **What is lag smoothing?**
  By default, GSAP has a fail-safe called `lagSmoothing(500, 33)`. If a heavy frame drops (e.g., while images load or textures render), GSAP artificially accelerates internal animation time so animations don't fall behind real-world clock time.
* **Why it breaks scroll sites**:
  For time-based tweens (like a 2-second button bounce), lag smoothing is great. But for **scroll-scrubbed animations**, time is strictly bound to physical pixel scroll offset. If GSAP suddenly time-warps ahead after a dropped frame, your pinned element jumps violently. Setting `gsap.ticker.lagSmoothing(0)` guarantees that frame count and scroll position stay strictly 1:1.

### D. Scrollbar-Lock Layout Shift Compensation
* When a full-screen menu, modal, or preloader opens, setting `overflow: hidden` on `<html>` removes the system scrollbar (usually 15–17px wide on Windows).
* This causes the entire page content behind the modal to instantly snap rightwards by 15px—a jarring defect known as **Cumulative Layout Shift (CLS)**.
* **Our Solution** (`src/core/scroller.js`):
  ```javascript
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  document.body.style.paddingRight = 'var(--scrollbar-width)';
  ```
  We measure the exact difference and pad the body by that exact amount before hiding overflow, making the lock completely invisible.

### E. The `1vw` Fluid Typography Architecture
* **The Philosophy**:
  Instead of writing hundreds of media queries with arbitrary pixel values (`font-size: 42px`, `padding: 24px`), Son Daven scales everything fluidly relative to the viewport:
  ```css
  html { font-size: 1vw; }
  :root { --_special-units---scale-ratio: 14.4; }
  ```
* **The Math**:
  At standard desktop width of 1440px, $1\text{vw} = 14.4\text{px}$.
  To calculate any target pixel size (for instance, an H1 of 144px):
  $$\text{size} = \frac{144\text{rem}}{14.4} = 10\text{rem}$$
  Because $1\text{rem} = 1\text{vw} = 14.4\text{px}$, $10 \times 14.4\text{px} = 144\text{px}$ exactly!
  When the browser is resized to 1800px or 1200px, every heading, paragraph, padding, and margin automatically scales proportionally without layout breakage.

### F. Dynamic Section Theme Inversion
* Persistent elements (like the navigation header or audio toggle) stay in fixed positions on screen.
* When the user scrolls from a dark section into a light sand section, the text and borders must invert without tedious manual scroll-tracking scripts.
* **The Technique** (`src/core/theme.js`):
  We calculate the vertical center of the floating element:
  $$\text{midY} = \text{top} + \frac{\text{height}}{2}$$
  We attach a `ScrollTrigger` to every section with `start: () => "top top+=" + midY` and `end: () => "bottom top+=" + midY`.
  When the trigger enters or leaves, it swaps `.theme_on-dark` and `.theme_on-light` classes. CSS custom properties (`--theme-text`, `--theme-border`) do the rest with smooth CSS transitions.

---

## 2. Directory Structure Implemented in Milestone 1

```
z:\var\www\karnVen_sondaven\
├── docs/
│   └── MILESTONE_1_ARCHITECTURE.md    <-- Detailed educational notes & theory
├── src/
│   ├── animations/
│   │   └── textReveal.js               <-- animateTextH, animateTextP, animateLine
│   ├── components/
│   │   └── header.js                   <-- Directional velocity-aware sticky header
│   ├── core/
│   │   ├── preloader.js                <-- First-visit vs returning visit lifecycle
│   │   ├── scroller.js                 <-- Lenis + GSAP ticker synchronization
│   │   └── theme.js                    <-- Dynamic section contrast inverter
│   └── utils/
│       └── splitText.js                <-- Line & word DOM splitter
├── index.html                          <-- Semantic markup with themed sections
├── main.js                             <-- Master bootstrap coordinator
├── package.json                        <-- Dependencies (GSAP, Lenis, Vite)
└── style.css                           <-- Complete Son Daven design tokens
```

---

## 3. What to Observe & Test in Milestone 1

1. **Preloader**:
   - First load: Observes 0% to 100% counter with smooth typography intro.
   - Refresh page: Recognizes `sessionStorage` and delivers instant entrance without keeping you waiting.
2. **Smooth Inertial Glide**:
   - Notice how scrolling feels fluid and heavy without any decoupling from the mouse wheel.
3. **Directional Header**:
   - Scroll down: The header quietly glides away to give maximum canvas space.
   - Scroll up just 30px: The header immediately slides back into view.
4. **Theme Inversion**:
   - Look at the floating **Sound Toggle** in the bottom-right and the header.
   - As you scroll over the light sand section (Section 2), notice the border and text invert to dark charcoal automatically!
5. **Text Reveals**:
   - Headings and paragraphs animate into view with staggered lines and masked reveals as they reach the viewport threshold.

---

## 4. Next Step: Milestone 2 Preview
In **Milestone 2**, we will tackle the core visual highlight of the site:
* The **120-Frame 3D Canvas Scrubber**, preloading WebP frames and scrubbing camera fly-throughs frame-by-frame with day/night detection.
