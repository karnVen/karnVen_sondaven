/**
 * ============================================================================
 * TEXT & ELEMENT REVEAL ANIMATIONS
 * Faithfully recreating Son Daven's animated text pipelines:
 * - animateTextH: Headings split by words, scattered randomly, scaled & rotated in
 * - animateTextP: Paragraphs split by lines, sliding upwards from masked bounds
 * - animateLine: Dividers revealing horizontally via clipPath
 * ============================================================================
 */

import gsap from 'gsap';
import { TextSplitter } from '../utils/splitText.js';

const DUR_L = 1.2;
const DUR_M = 0.8;
const DUR_S = 0.4;
const STAGGER = 0.08;

/**
 * Animate Headings with random word scatter & scale
 * @param {HTMLElement|string} target
 * @param {'initial'|'reveal'|'hide'} state
 * @param {number} [delay=0]
 */
export function animateTextH(target, state = 'reveal', delay = 0) {
  const elements = gsap.utils.toArray(target);
  if (!elements.length) return;

  elements.forEach((el, index) => {
    if (!el._splitter) {
      el._splitter = new TextSplitter(el, { type: 'words' });
    }
    const words = el._splitter.words;
    if (!words.length) return;

    switch (state) {
      case 'initial':
        gsap.set(words, {
          yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
          scale: 0,
          opacity: 0
        });
        break;

      case 'reveal':
        gsap.fromTo(
          words,
          {
            yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
            scale: 0,
            opacity: 0
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: DUR_L,
            delay: delay + index * STAGGER * 0.5,
            stagger: {
              each: 0.25 * STAGGER,
              from: 'random'
            },
            ease: 'power3.out',
            overwrite: true
          }
        );
        break;

      case 'hide':
        gsap.to(words, {
          yPercent: gsap.utils.wrap([75, -75, 75, -75]),
          scale: 0,
          opacity: 0,
          duration: DUR_S,
          delay: delay,
          stagger: {
            each: 0.25 * STAGGER,
            from: 'random'
          },
          ease: 'power2.in',
          overwrite: true
        });
        break;
    }
  });
}

/**
 * Animate Paragraphs with line-by-line masked reveal
 * @param {HTMLElement|string} target
 * @param {'initial'|'reveal'|'hide'} state
 * @param {number} [delay=0]
 */
export function animateTextP(target, state = 'reveal', delay = 0) {
  const elements = gsap.utils.toArray(target);
  if (!elements.length) return;

  elements.forEach((el, index) => {
    if (!el._splitter) {
      el._splitter = new TextSplitter(el, { type: 'lines' });
    }
    const lines = el._splitter.lines;
    if (!lines.length) return;

    switch (state) {
      case 'initial':
        gsap.set(lines, { yPercent: 200, opacity: 0 });
        break;

      case 'reveal':
        gsap.fromTo(
          lines,
          { yPercent: 200, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: DUR_L,
            delay: delay + index * STAGGER * 0.25,
            stagger: 0.5 * STAGGER,
            ease: 'power3.out',
            overwrite: true
          }
        );
        break;

      case 'hide':
        gsap.to(lines, {
          yPercent: 0,
          opacity: 0,
          duration: DUR_S,
          delay: delay,
          stagger: 0.5 * STAGGER,
          ease: 'power2.in',
          overwrite: true
        });
        break;
    }
  });
}

/**
 * Animate Horizontal Line Dividers using CSS clipPath
 * @param {HTMLElement|string} target
 * @param {'initial'|'reveal'|'hide'} state
 */
export function animateLine(target, state = 'reveal') {
  const elements = gsap.utils.toArray(target);
  if (!elements.length) return;

  switch (state) {
    case 'initial':
      gsap.set(elements, { clipPath: 'inset(0% 100% -1px 0%)' });
      break;

    case 'reveal':
      gsap.fromTo(
        elements,
        { clipPath: 'inset(0% 100% -1px 0%)' },
        {
          clipPath: 'inset(0% 0% -1px 0%)',
          duration: DUR_L,
          stagger: STAGGER,
          ease: 'power3.out',
          overwrite: true
        }
      );
      break;

    case 'hide':
      gsap.to(elements, {
        clipPath: 'inset(0% 0% -1px 100%)',
        duration: DUR_S,
        stagger: 0.5 * STAGGER,
        ease: 'power2.in',
        overwrite: true
      });
      break;
  }
}
