/**
 * ============================================================================
 * AMBIENT AUDIO & EQUALIZER CONTROLLER
 * ============================================================================
 * 
 * ARCHITECTURAL PRINCIPLES:
 * 1. VOLUME RAMPING (Anti-Clicking):
 *    Directly playing or pausing an audio track produces an abrasive audible "click"
 *    caused by an abrupt DC offset step in the waveform. We interpolate audio.volume
 *    smoothly using GSAP (0.0 <-> 0.3) over 0.8s, yielding a cinematic fade.
 * 
 * 2. USER INTERACTION POLICY:
 *    Modern browsers prevent autoplay with sound before user interaction.
 *    The audio starts strictly when the user clicks the sound toggle.
 * ============================================================================
 */

import gsap from 'gsap';

export class AmbientAudioPlayer {
  /**
   * @param {Object} options
   * @param {string} [options.src] - Audio source URL
   * @param {string|HTMLElement} [options.toggle] - Selector or element for toggle button
   * @param {number} [options.maxVolume=0.3] - Target volume level
   */
  constructor(options = {}) {
    this.src = options.src || 'https://assets.sondaven.com/carpathian-whispers-hutsul-ambient.mp3';
    this.toggleEl = typeof options.toggle === 'string' ? document.querySelector(options.toggle) : options.toggle;
    this.maxVolume = options.maxVolume || 0.3;

    this.audio = null;
    this.isPlaying = false;

    this.init();
  }

  init() {
    if (!this.toggleEl) return;

    this.audio = new Audio(this.src);
    this.audio.loop = true;
    this.audio.volume = 0;
    this.audio.preload = 'none';

    this.toggleEl.addEventListener('click', () => this.toggle());
  }

  toggle() {
    if (!this.isPlaying) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    if (!this.audio) return;

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.toggleEl.classList.add('is-playing');

      // Smooth volume fade-in
      gsap.to(this.audio, {
        volume: this.maxVolume,
        duration: 0.8,
        ease: 'power2.out'
      });
    }).catch((err) => {
      console.warn('[AudioPlayer] Playback prevented:', err.message);
    });
  }

  pause() {
    if (!this.audio || !this.isPlaying) return;

    this.isPlaying = false;
    this.toggleEl.classList.remove('is-playing');

    // Smooth volume fade-out before pausing
    gsap.to(this.audio, {
      volume: 0,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        this.audio.pause();
      }
    });
  }
}
