/**
 * ============================================================================
 * INFRASTRUCTURE & BENEFITS SWIPER CAROUSEL
 * ============================================================================
 * 
 * FEATURES:
 * 1. Infinite loop / free-mode or smooth snap slides.
 * 2. Real-time active slide number formatting: "01", "02", etc.
 * 3. Animated progress line bar reflecting `swiper.progress`.
 * 4. Next/Prev button hooks.
 * ============================================================================
 */

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import gsap from 'gsap';

export function initBenefitsSlider() {
  const sliderContainer = document.querySelector('[slider-id="benefits"]');
  if (!sliderContainer) return null;

  const currentNumEl = sliderContainer.querySelector('[slider="current"]');
  const totalNumEl = sliderContainer.querySelector('[slider="total"]');
  const progressLineEl = sliderContainer.querySelector('[slider="progress-line"]');
  const prevBtn = sliderContainer.querySelector('[slider="prev"]');
  const nextBtn = sliderContainer.querySelector('[slider="next"]');

  // Find the swiper wrapper element
  const swiperEl = sliderContainer.querySelector('.swiper') || sliderContainer.querySelector('.benefits-slider') || sliderContainer;

  const swiper = new Swiper(swiperEl, {
    modules: [Navigation, Pagination],
    slidesPerView: 'auto',
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    on: {
      init: function () {
        const total = this.slides.length;
        if (totalNumEl) {
          totalNumEl.textContent = String(total).padStart(2, '0');
        }
        updateStatus(this);
      },
      slideChange: function () {
        updateStatus(this);
      },
      progress: function (s, progress) {
        if (progressLineEl) {
          gsap.to(progressLineEl, {
            scaleX: Math.max(0.1, progress),
            transformOrigin: 'left center',
            duration: 0.2,
            ease: 'none'
          });
        }
      }
    }
  });

  function updateStatus(sw) {
    if (currentNumEl) {
      const activeIdx = (sw.realIndex || sw.activeIndex || 0) + 1;
      currentNumEl.textContent = String(activeIdx).padStart(2, '0');
    }
  }

  return swiper;
}
