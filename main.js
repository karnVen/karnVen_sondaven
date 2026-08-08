import './style.css'
import gsap from 'gsap'
import Lenis from 'lenis'

// Initialize smooth scrolling (Lenis)
const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ==========================================
// PRELOADER ANIMATION
// ==========================================
const preloader = document.getElementById('preloader');
const loadingPercent = document.getElementById('loading-percent');
const mainContent = document.getElementById('app');

// Simulate a loading sequence
let progress = { value: 0 };

gsap.to(progress, {
  value: 100,
  duration: 2.5, // Fake loading duration
  ease: "power2.inOut",
  onUpdate: () => {
    // Update the text to show percentage
    loadingPercent.textContent = Math.round(progress.value) + "%";
  },
  onComplete: () => {
    // When loading hits 100%, animate out the preloader
    const tl = gsap.timeline();
    
    // 1. Slide up the preloader content
    tl.to(".preloader-content", {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut"
    }, 0)
    
    // 2. Fade out the background video
    .to(".preloader-bg", {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 0.2)
    
    // 3. Move the whole preloader up and out of the way
    .to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut"
    }, 0.5)
    
    // 4. Fade in the main content
    .to(mainContent, {
      opacity: 1,
      visibility: "visible",
      duration: 1,
      ease: "power2.out"
    }, 1);
  }
});
