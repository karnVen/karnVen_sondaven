/**
 * ============================================================================
 * MODALS & FAQ ACCORDION CONTROLLER (Levels 3 & 5)
 * ============================================================================
 */

import gsap from 'gsap';
import { lockScroll, unlockScroll } from '../core/scroller.js';

export function initAccordion() {
  const accordionItems = document.querySelectorAll('[data-accordion-item]');
  if (!accordionItems.length) return;

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('[data-accordion-trigger]');
    const content = item.querySelector('[data-accordion-content]');
    if (!trigger || !content) return;

    let isOpen = false;

    trigger.addEventListener('click', () => {
      isOpen = !isOpen;
      item.classList.toggle('is-open', isOpen);

      if (isOpen) {
        gsap.set(content, { display: 'block', height: 'auto' });
        const height = content.offsetHeight;
        gsap.fromTo(content, { height: 0, opacity: 0 }, { height: height, opacity: 1, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            content.style.display = 'none';
          }
        });
      }
    });
  });
}

export function initModals() {
  // 1. Menu Modal
  const menuOpenBtns = document.querySelectorAll('[data-modal-menu-open], .header_burger, [modal-menu-open]');
  const menuCloseBtns = document.querySelectorAll('[data-modal-menu-close], [modal-menu-close]');
  const menuModal = document.querySelector('[data-modal-menu], [modal-menu]');

  if (menuModal) {
    const openMenu = () => {
      lockScroll();
      menuModal.classList.add('is-open');
      gsap.fromTo(menuModal, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    };

    const closeMenu = () => {
      gsap.to(menuModal, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          menuModal.classList.remove('is-open');
          unlockScroll();
        }
      });
    };

    menuOpenBtns.forEach(btn => btn.addEventListener('click', openMenu));
    menuCloseBtns.forEach(btn => btn.addEventListener('click', closeMenu));
  }

  // 2. CTA / Consultation Modal
  const ctaOpenBtns = document.querySelectorAll('[data-modal-cta-open], [modal-cta-open], .btn-primary');
  const ctaCloseBtns = document.querySelectorAll('[data-modal-cta-close], [modal-cta-close]');
  const ctaModal = document.querySelector('[data-modal-cta], [modal-cta]');

  if (ctaModal) {
    const openCta = (e) => {
      if (e.target.closest('a[href^="#"]')) return; // Allow smooth anchor scroll
      lockScroll();
      ctaModal.classList.add('is-open');
      gsap.fromTo(ctaModal, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    };

    const closeCta = () => {
      gsap.to(ctaModal, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          ctaModal.classList.remove('is-open');
          unlockScroll();
        }
      });
    };

    ctaOpenBtns.forEach(btn => btn.addEventListener('click', openCta));
    ctaCloseBtns.forEach(btn => btn.addEventListener('click', closeCta));
  }
}
