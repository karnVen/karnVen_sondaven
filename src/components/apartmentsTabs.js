/**
 * ============================================================================
 * APARTMENTS CATALOG & ROTATIONAL CARD-SHUFFLE TAB SWITCHER (Level 3)
 * ============================================================================
 * 
 * ARCHITECTURAL MECHANICS:
 * 
 * 1. ROTATIONAL CARD-SHUFFLE TRANSITION:
 *    When switching apartment types (e.g. Studio -> Deluxe -> Penthouse):
 *    - The outgoing floor plan tilts and flies left: { xPercent: -125, rotate: 15 }
 *    - The incoming floor plan enters from the right: from { xPercent: 125, rotate: -15 } to { xPercent: 0, rotate: 0 }
 * 
 * 2. INTEGRATED SWIPER GALLERIES PER APARTMENT:
 *    Each apartment category has an inner Swiper carousel for photo gallery browsing.
 * ============================================================================
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

gsap.registerPlugin(ScrollTrigger);

export function initApartmentTabs() {
  const tabsContainers = document.querySelectorAll('[data-tabs]');
  if (!tabsContainers.length) return;

  tabsContainers.forEach((container) => {
    const triggers = container.querySelectorAll('[data-tab-trigger]');
    const contents = container.querySelectorAll('[data-tab-content]');
    if (!triggers.length || !contents.length) return;

    let activeTabId = triggers[0]?.getAttribute('data-tab-trigger');
    triggers[0]?.classList.add('is-active');

    // Show initial tab and hide others
    contents.forEach((content) => {
      const tabId = content.getAttribute('data-tab-content');
      if (tabId === activeTabId) {
        content.style.display = 'block';
        content.style.position = 'relative';
      } else {
        content.style.display = 'none';
        content.style.position = 'absolute';
      }
    });

    // Initialize inner swiper galleries for all tabs
    contents.forEach((content) => {
      const sliderEl = content.querySelector('.swiper') || content.querySelector('[slider="gallery"]') || content.querySelector('.apartments-gallery');
      if (sliderEl) {
        new Swiper(sliderEl, {
          modules: [Navigation, Pagination],
          slidesPerView: 1,
          spaceBetween: 16,
          speed: 500,
          grabCursor: true,
          pagination: {
            el: content.querySelector('.swiper-pagination') || content.querySelector('[slider="pag"]'),
            clickable: true,
          }
        });
      }
    });

    // Handle Tab Click
    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab-trigger');
        if (targetTabId === activeTabId) return;

        const currentTrigger = container.querySelector(`[data-tab-trigger="${activeTabId}"]`);
        const currentContent = container.querySelector(`[data-tab-content="${activeTabId}"]`);
        const targetContent = container.querySelector(`[data-tab-content="${targetTabId}"]`);

        if (!currentContent || !targetContent) return;

        // Kill existing tweens to prevent collision on fast clicks
        gsap.killTweensOf([currentContent, targetContent]);

        currentTrigger?.classList.remove('is-active');
        btn.classList.add('is-active');

        // Setup layouts
        gsap.set(currentContent, { display: 'block', position: 'absolute', transformOrigin: 'top bottom' });
        gsap.set(targetContent, { display: 'block', position: 'relative', transformOrigin: 'top bottom', xPercent: 125, rotate: -15 });

        ScrollTrigger.refresh();

        // Animate out current
        gsap.to(currentContent, {
          xPercent: -125,
          rotate: 15,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            currentContent.style.display = 'none';
          }
        });

        // Animate in target
        gsap.to(targetContent, {
          xPercent: 0,
          rotate: 0,
          duration: 0.6,
          ease: 'power3.inOut'
        });

        activeTabId = targetTabId;
      });
    });
  });
}
