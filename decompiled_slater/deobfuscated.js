function initPreloader() {
  let e = false;
  try {
    e = sessionStorage.getItem("hasVisited");
  } catch (e) {}
  initLenis();
  if (e) {
    animatePreloaederShort();
  } else {
    animatePreloaederIntro();
  }
  try {
    sessionStorage.setItem("hasVisited", "true");
  } catch (e) {}
}
function animatePreloaederIntro() {
  function e() {
    if (d) {
      l.classList.add("d-none");
      d.appendChild(c);
      animateTextH(p, "initial");
      animateTextP(m, "initial");
      animateCtn(h, "initial");
      gsap.timeline().fromTo(g, {
        scale: 1.5
      }, {
        scale: 1,
        duration: durL * 2,
        ease: "Out"
      }).add(Flip.from(u, {
        duration: durL * 1.5,
        ease: "InOut"
      }), 0).add(() => {
        c.classList.remove("theme_on-dark");
        c.classList.add("theme_on-light");
        animateTextH(p, "reveal");
        animateTextP(m, "reveal");
        animateCtn(h, "reveal");
      }, durL).add(() => {
        gsap.set(t, {
          display: "none"
        });
        o.classList.remove("theme_on-dark");
        initPageTransitions();
        unlockScroll();
      });
    } else {
      gsap.timeline().to(c, {
        yPercent: 120,
        duration: durL,
        ease: "Out"
      }).add(() => {
        gsap.set(t, {
          display: "none"
        });
        o.classList.remove("theme_on-dark");
        initPageTransitions();
        unlockScroll();
      }, durS);
    }
  }
  const t = document.querySelector("[data-preloader]");
  const o = document.querySelector(".transition");
  const n = t.querySelectorAll("[data-preloader=\"p\"]");
  const i = t.querySelectorAll("[data-preloader=\"ctn\"]");
  const r = t.querySelector("[data-preloader=\"scene\"]");
  const a = t.querySelector("[data-preloader=\"bg\"]");
  const s = t.querySelector("[data-preloader-percent]");
  const c = t.querySelector("[data-preloader=\"logo\"]");
  const l = document.querySelector("[preloader=\"logo-static\"]");
  const d = document.querySelector("[preloader=\"logo-w-finish\"]");
  const u = Flip.getState(c);
  const g = document.querySelector("[data-intro=\"video\"]");
  const p = document.querySelectorAll("[data-intro=\"h\"]");
  const m = document.querySelectorAll("[data-intro=\"p\"]");
  const h = document.querySelectorAll("[data-intro=\"ctn\"]");
  const y = gsap.timeline().add(() => {
    lockScroll();
    o.classList.add("theme_on-dark");
    animateTransition("init");
    animateTextP(n, "reveal");
    animateCtn(i, "reveal");
  }).fromTo(r, {
    opacity: 0
  }, {
    opacity: 1,
    duration: durL,
    delay: delayReveal,
    ease: "Out"
  }).fromTo(c, {
    opacity: 0,
    yPercent: 25
  }, {
    opacity: 1,
    yPercent: 0,
    duration: durL,
    delay: delayReveal,
    ease: "Out"
  }, "<").to({}, {
    duration: durL
  }).add(() => {
    initAllScenes();
    if (s) {
      s.textContent = "0%";
    }
    globalSceneManager.progress((e, t) => {
      if (s) {
        s.textContent = Math.round(e / t * 100) + "%";
      }
    });
    Promise.all([framesPromise, globalSceneManager.ready(), document.fonts.ready]).then(() => {
      if (s) {
        s.textContent = "100%";
      }
      y.resume();
    });
    y.pause();
  }).add(() => {
    animateTextP(n, "hide");
    animateCtn(i, "hide");
  }).to(a, {
    opacity: 0,
    duration: durM,
    ease: "Out"
  }).add(() => {
    animateTransition("out");
  }).to({}, {
    duration: durS
  }).add(() => {
    e();
  });
  document.querySelector("[data-master-preloader]").remove();
}
function animatePreloaederShort() {
  const e = document.querySelector("[data-preloader]");
  const t = document.querySelector(".transition");
  gsap.set(e, {
    display: "none"
  });
  t.classList.add("theme_on-dark");
  initAllScenes();
  Promise.all([framesPromise, globalSceneManager.ready(), document.fonts.ready]).then(() => {
    animateTransition("out");
    initPageTransitions();
    setTimeout(() => {
      t.classList.remove("theme_on-dark");
    }, durL * 1000);
    document.querySelector("[data-master-preloader]").remove();
  });
}
function animateTransition(e) {
  const t = document.querySelector(".transition");
  const o = t.querySelectorAll(".transition_cell");
  const n = t.querySelectorAll(".transition_over");
  switch (e) {
    case "in":
      gsap.timeline().set(t, {
        display: "flex"
      }).fromTo(o, {
        scaleX: 0
      }, {
        scaleX: 1,
        duration: durS,
        ease: "InOut",
        stagger: {
          each: 0.03,
          from: "end",
          grid: [20, 12]
        }
      }).fromTo(n, {
        opacity: 0
      }, {
        opacity: 1,
        duration: durL,
        ease: "InOut"
      }, 0);
      break;
    case "out":
      gsap.timeline({
        onComplete: () => {
          gsap.set(t, {
            display: "none"
          });
        }
      }).set(t, {
        display: "flex"
      }).fromTo(o, {
        scaleX: 1
      }, {
        scaleX: 0,
        duration: durS,
        ease: "InOut",
        stagger: {
          each: 0.03,
          from: "end",
          grid: [20, 12]
        }
      }).fromTo(n, {
        opacity: 1
      }, {
        opacity: 0,
        duration: durL,
        ease: "InOut"
      }, 0);
      break;
    case "init":
      gsap.set(t, {
        display: "flex"
      });
      gsap.set(o, {
        scaleX: 1
      });
      gsap.set(n, {
        opacity: 1
      });
  }
}
function initPageTransitions() {
  async function e({
    current: e
  }) {
    if (!e || !e.container) {
      return;
    }
    const t = "scroll:" + new URL(e.url.href, location.origin).pathname;
    const o = lenis ? lenis.scroll : window.scrollY;
    sessionStorage.setItem(t, o);
    animateTransition("in");
    return gsap.to({}, {
      duration: durL
    });
  }
  async function t({
    current: e
  }) {
    if (e && e.container) {
      ScrollTrigger.getAll().forEach(e => e.kill());
      if (globalSceneManager) {
        globalSceneManager.destroy();
        globalSceneManager = null;
      }
      e.container.remove();
    }
  }
  async function o({
    next: e
  }) {
    if (e && e.container) {
      animateTransition("out");
      return gsap.to({}, {
        duration: durL
      });
    }
  }
  async function n({
    next: e
  }) {
    const t = "scroll:" + new URL(e.url.href, location.origin).pathname;
    const o = r ? sessionStorage.getItem(t) : null;
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.scrollTo(o ? parseFloat(o) : 0, {
          immediate: true
        });
      }
    });
    initScripts();
    initAllScenes();
    initAnchorNavigation();
    handleAnchorOnEnter();
    ScrollTrigger.refresh();
  }
  async function i(e) {
    r = false;
    initResetWebflow(e);
  }
  let r = false;
  window.addEventListener("popstate", () => {
    r = true;
  });
  barba.init({
    debug: false,
    transitions: [{
      name: "dither",
      sync: false,
      once(e) {
        initScripts();
      },
      async leave(o) {
        await e(o);
        await t(o);
      },
      async enter(e) {
        await o(e);
      },
      async beforeEnter(e) {
        await n(e);
      },
      async afterEnter(e) {
        await i(e);
      }
    }]
  });
}
function initScripts() {
  initThemeChange();
  initHeaderHide();
  initForm();
  initPlayPauseVideoScroll();
  initIndexCounter();
  initNextEntityCard();
  initOther();
  initAllParallax();
  initSectionTransition();
  initScrollElementsReveal();
  initHighlightText();
  initMagneticEffect();
  initMapPins();
  initNavItemHover();
  initMenuItemHover();
  initMarquee();
  initSoundToggle();
  initBenefitCard();
  initAccordion();
  initLoadMore();
  initSlider();
  initSliderText();
  initSliderFreemode();
  initTabs();
  initTabsHilight();
  initTabsText();
  initSummerWinterSwitcher();
  initModalCta();
  initModalMedia();
  initModalMenu();
  initFloatingTips();
  initScrollVideo();
  initModalVimVideo();
}
function initAllScenes() {
  if (globalSceneManager) {
    globalSceneManager.destroy();
  }
  globalSceneManager = initSceneManager();
  initSceneHeroOver();
  initSceneHeroBg();
  initSceneProlog();
  initSceneAbout();
  initSceneSeasons();
  initSceneBenefitsIntro();
  initSceneBenefitsOutro();
  initSceneFin();
  initSceneDevOver();
  initSceneDevBg();
  initSceneFactoid();
  initSceneFaq();
  initSceneFooter();
  initSceneArticleDark();
  initSceneArticleLight();
  initSceneError();
}
function initLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  lenis = new Lenis({
    wrapper: window,
    duration: 1.2,
    smoothWheel: true,
    touchMultiplier: 2,
    easing: e => Math.min(1, 1.001 - Math.pow(2, e * -10)),
    infinite: false
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(e => lenis.raf(e * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll("[data-lenis-scroll]").forEach(e => {
    function t(e) {
      o.raf(e);
      requestAnimationFrame(t);
    }
    const o = new Lenis({
      wrapper: e,
      duration: 0.6,
      smoothWheel: true,
      touchMultiplier: 2,
      easing: e => Math.min(1, 1.001 - Math.pow(2, e * -10)),
      infinite: false
    });
    requestAnimationFrame(t);
  });
}
function initThemeChange() {
  function e(e, o, n) {
    if (getComputedStyle(e).display !== "none") {
      t.forEach(t => {
        const i = t.offsetHeight;
        const r = t.getBoundingClientRect().top;
        ScrollTrigger.create({
          trigger: e,
          start: () => `top top+=${r + i / 2}`,
          end: () => `bottom top+=${r + i / 2}`,
          onEnter: () => {
            t.classList.add(o);
            t.classList.remove(...n);
          },
          onEnterBack: () => {
            t.classList.add(o);
            t.classList.remove(...n);
          }
        });
      });
    }
  }
  const t = document.querySelectorAll("[theme]");
  if (t.length) {
    document.querySelectorAll("[bg=\"color\"]").forEach(t => {
      e(t, "theme_on-dark", ["theme_on-light"]);
    });
    document.querySelectorAll("[bg=\"light\"]").forEach(t => {
      e(t, "theme_on-light", ["theme_on-dark"]);
    });
    document.querySelectorAll("[bg=\"dark\"]").forEach(t => {
      e(t, "theme_on-dark", ["theme_on-light"]);
    });
  }
}
function initHeaderHide() {
  const e = document.querySelector(".header");
  if (!e) {
    return;
  }
  const t = e.querySelector(".header_bg");
  let o = window.scrollY;
  let n = false;
  let i = window.scrollY > 1000;
  gsap.set(t, {
    opacity: i ? 1 : 0
  });
  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: r => {
      const a = r.scroll();
      const s = Math.abs(a - o);
      const c = document.documentElement.scrollHeight - (a + window.innerHeight);
      if (a > 1000) {
        i = true;
        gsap.to(t, {
          opacity: 1,
          duration: durS,
          ease: "Out"
        });
      } else {
        gsap.to(t, {
          opacity: 0,
          duration: durS,
          ease: "Out"
        });
      }
      if (!(s < 40)) {
        if (a > o && i && !n) {
          gsap.to(e, {
            yPercent: -100,
            duration: durM,
            ease: "Out",
            onComplete: () => n = true
          });
        } else if (a < o && n) {
          gsap.to(e, {
            yPercent: 0,
            duration: durM,
            ease: "Out",
            onComplete: () => n = false
          });
        }
        if (c <= 160) {
          gsap.to(e, {
            yPercent: 0,
            duration: durM,
            ease: "Out",
            onComplete: () => n = false
          });
          o = a;
          return;
        }
        o = a;
      }
    }
  });
}
function animateTextH(e, t, o) {
  const n = gsap.utils.toArray(e);
  if (n.length) {
    n.forEach((e, n) => {
      e._split ||= new SplitText(e, {
        type: "words",
        tag: "span",
        wordsClass: "split-word",
        smartWrap: true
      });
      const i = n * stagger * 0.5;
      switch (t) {
        case "reveal":
          gsap.fromTo(e._split.words, {
            yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
            scale: 0,
            opacity: 0
          }, {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: durL,
            delay: (o ?? delayReveal) + i,
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            ease: "Out",
            overwrite: true
          });
          break;
        case "hide":
          gsap.to(e._split.words, {
            yPercent: gsap.utils.wrap([75, -75, 75, -75]),
            scale: 0,
            opacity: 0,
            duration: durS,
            delay: o ?? 0,
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            ease: "In",
            overwrite: true
          });
          break;
        case "initial":
          gsap.set(e._split.words, {
            yPercent: gsap.utils.wrap([-150, 75, -75, 150]),
            scale: 0,
            opacity: 0
          });
      }
    });
  }
}
function animateTextP(e, t, o) {
  const n = gsap.utils.toArray(e);
  if (n.length) {
    n.forEach((e, n) => {
      if (!e._split) {
        e._split = new SplitText(e, {
          type: "lines",
          linesClass: "split-line",
          aria: "none"
        });
        document.querySelectorAll(".split-line").forEach(e => {
          if (e.textContent.trim() === "") {
            e.replaceWith(document.createElement("br"));
          }
        });
      }
      const i = n * stagger * 0.25;
      switch (t) {
        case "reveal":
          gsap.fromTo(e._split.lines, {
            yPercent: 250,
            opacity: 0
          }, {
            yPercent: 0,
            opacity: 1,
            duration: durL,
            delay: (o ?? delayReveal) + i,
            stagger: stagger * 0.5,
            ease: "Out",
            overwrite: true
          });
          break;
        case "hide":
          gsap.to(e._split.lines, {
            yPercent: 0,
            opacity: 0,
            duration: durS,
            delay: o ?? 0,
            stagger: stagger * 0.5,
            ease: "In",
            overwrite: true
          });
          break;
        case "initial":
          gsap.set(e._split.lines, {
            yPercent: 0,
            opacity: 0
          });
      }
    });
  }
}
function animateCtn(e, t, o) {
  const n = gsap.utils.toArray(e);
  if (n.length) {
    switch (t) {
      case "reveal":
        gsap.fromTo(n, {
          opacity: 0,
          yPercent: 100
        }, {
          opacity: 1,
          yPercent: 0,
          duration: durL,
          delay: o ?? delayReveal,
          stagger: stagger * 0.5,
          ease: "Out",
          overwrite: true
        });
        break;
      case "hide":
        gsap.to(n, {
          opacity: 0,
          yPercent: 0,
          duration: durS,
          delay: o ?? 0,
          stagger: stagger * 0.5,
          ease: "In",
          overwrite: true
        });
        break;
      case "initial":
        gsap.set(n, {
          opacity: 0,
          yPercent: 0
        });
    }
  }
}
function animateLine(e, t, o) {
  const n = gsap.utils.toArray(e);
  if (n.length) {
    switch (t) {
      case "reveal":
        gsap.fromTo(n, {
          clipPath: "inset(0% 100% -1px 0%)"
        }, {
          clipPath: "inset(0% 0% -1px 0%)",
          duration: durL,
          delay: o ?? delayReveal,
          stagger: stagger,
          ease: "Out",
          overwrite: true
        });
        break;
      case "hide":
        gsap.to(n, {
          clipPath: "inset(0% 0% -1px 100%)",
          duration: durS,
          delay: o ?? 0,
          stagger: stagger * 0.5,
          ease: "In",
          overwrite: true
        });
        break;
      case "initial":
        gsap.set(n, {
          clipPath: "inset(0% 0% -1px 100%)"
        });
    }
  }
}
function initForm() {
  document.querySelectorAll("[data-form-btn]").forEach(e => {
    e.addEventListener("click", t => {
      t.preventDefault();
      const o = e.closest("form");
      if (!o) {
        return;
      }
      const n = e.querySelectorAll("[hover=\"text\"]");
      const i = () => {
        n.forEach(e => {
          e.textContent = "Sending...";
        });
      };
      o.addEventListener("submit", i, {
        once: true
      });
      o.requestSubmit();
    });
  });
  const e = document.querySelector(".modal_cta-form_form");
  const t = document.querySelector(".modal_cta-form_success");
  if (!e || !t) {
    return;
  }
  const o = new MutationObserver(() => {
    const n = getComputedStyle(e).display === "none";
    const i = getComputedStyle(t).display !== "none";
    if (n && i) {
      o.disconnect();
      gsap.timeline({}).set([e, t], {
        display: "flex",
        position: "absolute",
        inset: "0% auto auto 0%",
        transformPerspective: 1000
      }).set(e, {
        zIndex: 1
      }).fromTo(e, {
        rotateY: 0
      }, {
        rotateY: -180,
        duration: durL,
        ease: "InOut"
      }).fromTo(t, {
        rotateY: 180
      }, {
        rotateY: 0,
        duration: durL,
        ease: "InOut"
      }, "<").set(t, {
        zIndex: 2
      }, "<50%");
    }
  });
  o.observe(e, {
    attributes: true,
    attributeFilter: ["style", "class"]
  });
  o.observe(t, {
    attributes: true,
    attributeFilter: ["style", "class"]
  });
  document.querySelectorAll(".input_field").forEach(e => {
    e.addEventListener("focusin", () => {
      const t = e.parentElement.querySelector(".input_label");
      if (t) {
        t.classList.add("focused");
      }
    });
    e.addEventListener("focusout", () => {
      if (e.value.trim() === "") {
        const t = e.parentElement.querySelector(".input_label");
        if (t) {
          t.classList.remove("focused");
        }
      }
    });
  });
  document.querySelectorAll("input[type=\"tel\"]").forEach(e => {
    e.addEventListener("input", () => {
      e.value = e.value.replace(/[^\d+\-]/g, "");
    });
  });
  document.querySelectorAll("input[name=\"Name\"]").forEach(e => {
    e.addEventListener("input", () => {
      e.value = e.value.replace(/[\d!@#$%^&*()_+=\[\]{};:'"\\|,.<>/?~`]/g, "");
    });
  });
}
function initPlayPauseVideoScroll() {
  gsap.utils.toArray("[data-video=\"playpause\"]").forEach(e => {
    const t = e.querySelector("video");
    if (t) {
      t.load();
      t.currentTime = 0;
      ScrollTrigger.create({
        trigger: e,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => t.play().catch(() => {}),
        onEnterBack: () => t.play().catch(() => {}),
        onLeave: () => t.pause(),
        onLeaveBack: () => t.pause()
      });
    }
  });
}
function initAnchorNavigation() {
  const e = document.querySelector("[data-nav]");
  if (!e) {
    return;
  }
  const t = location.pathname.split("/").filter(Boolean);
  const o = t.length <= 1;
  const n = t[0] || "";
  e.querySelectorAll(":scope > a[href^=\"#\"]").forEach(e => {
    e.addEventListener("click", t => {
      if (!o) {
        t.preventDefault();
        sessionStorage.setItem("scrollTo", e.getAttribute("href"));
        barba.go("/" + n);
      }
    });
  });
}
function handleAnchorOnEnter() {
  const e = sessionStorage.getItem("scrollTo");
  if (!e) {
    return;
  }
  sessionStorage.removeItem("scrollTo");
  const t = document.querySelector(e);
  if (t) {
    gsap.delayedCall(delayReveal, () => {
      lenis.scrollTo(t, {
        duration: durL
      });
    });
  }
}
function lockScroll() {
  const e = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--scrollbar-width", `${e}px`);
  document.body.style.paddingRight = "var(--scrollbar-width)";
  document.documentElement.style.overflow = "hidden";
  lenis.stop();
}
function unlockScroll() {
  document.documentElement.style.removeProperty("--scrollbar-width");
  document.body.style.paddingRight = "";
  document.documentElement.style.overflow = "";
  lenis.start();
}
function initResetWebflow(e) {
  let t = new DOMParser().parseFromString(e.next.html, "text/html").querySelector("html").getAttribute("data-wf-page");
  document.documentElement.setAttribute("data-wf-page", t);
  window.Webflow.destroy();
  window.Webflow.ready();
}
function initIndexCounter() {
  const e = document.querySelectorAll("[index-w]");
  if (e.length) {
    e.forEach(e => {
      const t = Array.from(e.children);
      let o = 0;
      t.forEach(e => {
        const t = e.querySelector("[index=\"text\"]");
        if (!t) {
          return;
        }
        o++;
        const n = String(o).padStart(2, "0");
        t.textContent = n;
      });
    });
  }
}
function initNextEntityCard() {
  document.querySelectorAll("[next-nav=\"w\"]").forEach(e => {
    const t = Array.from(e.querySelectorAll("[next-nav]"));
    const o = window.location.pathname.split("/").filter(Boolean).pop();
    const n = (t.findIndex(e => e.getAttribute("next-nav") === o) + 1) % t.length;
    if (t.length <= 1) {
      e.style.display = "none";
    } else {
      t.forEach(e => e.style.display = "none");
      if (t[n]) {
        t[n].style.display = "block";
        ScrollTrigger.refresh();
      }
    }
  });
}
function initOther() {
  const e = document.querySelectorAll(".year");
  if (e.length) {
    const t = new Date().getFullYear();
    e.forEach(e => {
      e.textContent = t;
    });
  }
  const t = document.querySelectorAll("[first-tag]");
  if (t.length) {
    t.forEach(e => {
      const t = e.getAttribute("first-tag");
      if (!t) {
        return;
      }
      const o = document.querySelector(`[tag-list="${t}"]`);
      if (o) {
        o.insertBefore(e, o.firstChild);
      }
    });
  }
  const o = document.querySelectorAll("[data-last-updated]");
  if (o.length) {
    o.forEach(e => {
      const t = e.querySelector("[data-source]");
      const o = e.querySelector("[data-target]");
      if (t && o) {
        o.textContent = t.textContent;
      }
    });
  }
  const n = document.querySelector("[data-btn-back]");
  if (n) {
    n.addEventListener("click", () => history.back());
  }
  const i = document.querySelector("[data-scroll-trigger=\"refresh\"]");
  if (i) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        ScrollTrigger.refresh();
      }
    }).observe(i);
  }
  const r = document.querySelectorAll("[data-view-all=\"w\"]");
  if (r.length) {
    r.forEach(e => {
      const t = e.querySelectorAll("[data-view-all=\"item\"]");
      const o = e.querySelectorAll("[data-view-all=\"btn\"]");
      if (o.length && t.length <= 1) {
        gsap.set(o, {
          display: "none"
        });
      }
    });
  }
  const a = document.querySelector(".news-slider-cms_list");
  if (a) {
    const e = document.querySelector("[floating-tip=\"drag\"]");
    const t = a.querySelectorAll(".news-slider-cms_list_item");
    if (e) {
      e.style.visibility = t.length <= 2 ? "hidden" : "visible";
    }
  }
}
function initAllParallax() {
  gsap.utils.toArray("[parallax=\"img\"]").forEach(e => {
    const t = e.closest("[parallax=\"w\"]");
    if (t) {
      gsap.fromTo(e, {
        yPercent: -20
      }, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: t,
          start: "top bottom",
          ease: "none",
          scrub: true
        }
      });
    }
  });
  gsap.utils.toArray("[parallax=\"img-out\"]").forEach(e => {
    const t = e.closest("[parallax=\"w\"]");
    if (t) {
      gsap.fromTo(e, {
        yPercent: -10
      }, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: t,
          start: "top 50%",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });
  gsap.utils.toArray("[parallax=\"ctn-down\"]").forEach(e => {
    if (!e) {
      return;
    }
    const t = e.getAttribute("mob") === "false";
    const o = window.innerWidth < breakPoint;
    if (!t || !o) {
      gsap.fromTo(e, {
        yPercent: -10
      }, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });
  gsap.utils.toArray("[parallax=\"ctn-up\"]").forEach(e => {
    if (!e) {
      return;
    }
    const t = e.getAttribute("mob") === "false";
    const o = window.innerWidth < breakPoint;
    if (!t || !o) {
      gsap.fromTo(e, {
        yPercent: 10
      }, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });
  gsap.utils.toArray("[parallax=\"h1\"]").forEach(e => {
    const t = Array.from(e.children);
    if (t.length !== 0) {
      gsap.fromTo(t, {
        xPercent: gsap.utils.wrap([5, -1, -5])
      }, {
        xPercent: gsap.utils.wrap([-5, 1, 5]),
        ease: "none",
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }
  });
}
function initSectionTransition() {
  const e = document.querySelector(".about-s_img");
  if (e) {
    const t = e.querySelector(".img-w");
    gsap.fromTo(t, {
      scale: 1,
      transformOrigin: "center bottom"
    }, {
      scale: 1.25,
      ease: "none",
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }
  const t = document.querySelector(".benefits-w");
  if (t) {
    const e = t.querySelector(".benefits-s_title-w");
    const o = t.querySelector(".benefits-s_title");
    const n = t.querySelector(".benefits-s_scene-intro");
    const i = t.querySelector(".benefits-s_scene-outro");
    const r = t.querySelector(".benefits-s_gap");
    if (e) {
      gsap.fromTo(e, {
        scale: 0
      }, {
        scale: 1,
        ease: "InOut",
        scrollTrigger: {
          trigger: r,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      });
    }
    gsap.fromTo([o, n], {
      opacity: 1
    }, {
      opacity: 0,
      ease: "Out",
      scrollTrigger: {
        trigger: i,
        start: "bottom top",
        end: "200% top",
        scrub: true
      }
    });
  }
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelector(".benefits-s_cms");
      if (e) {
        const t = e.querySelector(".benefits-cms_list");
        const o = t.querySelectorAll(".benefits-cms_list_item");
        const n = gsap.to(t, {
          xPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: e,
            scrub: true,
            start: "top top",
            end: "bottom bottom"
          }
        });
        o.forEach((e, t) => {
          const o = {
            x: (Math.random() * 10 + 20) * (Math.random() < 0.5 ? 1 : -1),
            y: (Math.random() * 0 + 5) * (Math.random() < 0.5 ? 1 : -1),
            rotation: (Math.random() * 5 + 5) * (Math.random() < 0.5 ? 1 : -1)
          };
          gsap.fromTo(e, {
            rotation: o.rotation,
            xPercent: o.x,
            yPercent: o.y + 75 + (t % 2 == 0 ? 15 : -15)
          }, {
            rotation: -o.rotation,
            xPercent: -o.x,
            yPercent: -o.y - 75 + (t % 2 == 0 ? -15 : 15),
            ease: "none",
            scrollTrigger: {
              trigger: e,
              containerAnimation: n,
              start: "left 120%",
              end: "right -20%",
              scrub: true
            }
          });
        });
      }
    }
  });
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelector(".footer");
      if (e) {
        const t = e.querySelector(".footer-w");
        const o = e.querySelector(".footer-w_bg");
        gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        }).fromTo(t, {
          scale: 2,
          translateZ: 10,
          transformOrigin: "center 10%"
        }, {
          scale: 1,
          ease: "none"
        }).fromTo(o, {
          scale: 0.75,
          translateZ: 10,
          transformOrigin: "center 10%"
        }, {
          scale: 1,
          ease: "none"
        }, "<");
      }
    }
  });
}
function initScrollElementsReveal() {
  const e = document.querySelectorAll("[data-scroll-reveal=\"h\"]");
  if (e.length) {
    e.forEach(e => {
      const t = e.closest("[data-scroll-reveal=\"w\"]");
      animateTextH(e, "initial");
      gsap.set(e, {
        visibility: "visible"
      });
      ScrollTrigger.create({
        trigger: t || e,
        start: "top bottom",
        once: true,
        onEnter: () => {
          animateTextH(e, "reveal", 0);
        }
      });
    });
  }
  const t = document.querySelectorAll("[data-scroll-reveal=\"p\"]");
  if (t.length) {
    t.forEach(e => {
      const t = e.closest("[data-scroll-reveal=\"w\"]");
      animateTextP(e, "initial");
      gsap.set(e, {
        visibility: "visible"
      });
      ScrollTrigger.create({
        trigger: t || e,
        start: "top bottom",
        once: true,
        onEnter: () => {
          animateTextP(e, "reveal", 0);
        }
      });
    });
  }
  const o = document.querySelectorAll("[data-scroll-reveal=\"ctn\"]");
  if (o.length) {
    o.forEach(e => {
      const t = e.closest("[data-scroll-reveal=\"w\"]");
      animateCtn(e, "initial");
      gsap.set(e, {
        visibility: "visible"
      });
      ScrollTrigger.create({
        trigger: t || e,
        start: "top bottom",
        once: true,
        onEnter: () => {
          animateCtn(e, "reveal", 0);
        }
      });
    });
  }
  const n = document.querySelectorAll("[data-scroll-reveal=\"line\"]");
  if (n.length) {
    n.forEach(e => {
      const t = e.closest("[data-scroll-reveal=\"w\"]");
      animateLine(e, "initial");
      gsap.set(e, {
        visibility: "visible"
      });
      ScrollTrigger.create({
        trigger: t || e,
        start: "top bottom",
        once: true,
        onEnter: () => {
          animateLine(e, "reveal", 0);
        }
      });
    });
  }
  const i = document.querySelectorAll("[data-scroll-reveal=\"card\"]");
  if (i.length) {
    i.forEach(e => {
      const t = e.closest("[data-scroll-reveal=\"w\"]");
      gsap.set(e, {
        transformPerspective: 1000,
        visibility: "visible"
      });
      gsap.timeline({
        scrollTrigger: {
          trigger: t || e,
          start: "top bottom",
          toggleActions: "play none none reset"
        }
      }).from(e, {
        scale: 0,
        rotateY: -90,
        rotate: -25,
        duration: durL,
        delay: delayReveal,
        ease: "Out"
      });
    });
  }
  document.querySelectorAll("[data-slider-reveal=\"true\"]").forEach(e => {
    const t = Array.from(e.children);
    if (t.length) {
      gsap.set(t, {
        visibility: "visible"
      });
      gsap.timeline({
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "top 80%",
          toggleActions: "play none none none"
        }
      }).from(t, {
        opacity: 0,
        xPercent: 50,
        duration: durL,
        delay: delayReveal,
        stagger: stagger,
        ease: "Out"
      });
      gsap.set(t, {
        visibility: "visible"
      });
    }
  });
  const r = document.querySelector("[header]");
  if (r) {
    gsap.timeline({}).from(r, {
      yPercent: -100,
      duration: durL,
      ease: "InOut"
    });
    gsap.set(r, {
      visibility: "visible"
    });
  }
  const a = document.querySelector("[cookies]");
  if (a) {
    gsap.timeline({}).from(a, {
      yPercent: 100,
      duration: durL,
      ease: "InOut"
    });
    gsap.set(a, {
      visibility: "visible"
    });
  }
  const s = document.querySelector(".sound-w");
  if (s) {
    gsap.from(s, {
      yPercent: 125,
      duration: durL,
      ease: "InOut"
    });
    gsap.set(s, {
      visibility: "visible"
    });
  }
}
function initHighlightText() {
  const e = Array.from(document.querySelectorAll("[data-highlight-text]"));
  if (e.length) {
    e.forEach(e => {
      const t = new SplitText(e, {
        type: "chars",
        smartWrap: true,
        charsClass: "split-char"
      }).chars;
      if (!t || !t.length) {
        return;
      }
      const o = e.closest("[data-highlight-wrapper]") || e;
      gsap.timeline({
        scrollTrigger: {
          trigger: o,
          start: "top 75%",
          end: "bottom 50%",
          scrub: true
        }
      }).from(t, {
        opacity: 0.1,
        duration: durS,
        ease: "Out",
        stagger: stagger
      });
    });
  }
}
function initMagneticEffect() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelectorAll("[data-magnetic-strength]");
      if (window.innerWidth <= 991) {
        return;
      }
      const t = (e, t) => {
        if (e) {
          gsap.killTweensOf(e);
          (t ? gsap.set : gsap.to)(e, {
            x: "0em",
            y: "0em",
            rotate: "0deg",
            clearProps: "all",
            ...(!t && {
              ease: "elastic.out(1, 0.3)",
              duration: 1.6
            })
          });
        }
      };
      const o = e => {
        const o = e.currentTarget;
        t(o, true);
        o.querySelectorAll("[data-magnetic-inner-target]").forEach(e => t(e, true));
      };
      const n = e => {
        const t = e.currentTarget;
        const o = t.getBoundingClientRect();
        const n = parseFloat(t.getAttribute("data-magnetic-strength")) || 25;
        const i = t.querySelectorAll("[data-magnetic-inner-target]");
        const r = parseFloat(t.getAttribute("data-magnetic-strength-inner")) || n;
        const a = ((e.clientX - o.left) / t.offsetWidth - 0.5) * (n / 16);
        const s = ((e.clientY - o.top) / t.offsetHeight - 0.5) * (n / 16);
        gsap.to(t, {
          x: a + "em",
          y: s + "em",
          rotate: "0.001deg",
          ease: "power4.out",
          duration: 1.6
        });
        if (i.length) {
          i.forEach(n => {
            const i = ((e.clientX - o.left) / t.offsetWidth - 0.5) * (r / 16);
            const a = ((e.clientY - o.top) / t.offsetHeight - 0.5) * (r / 16);
            gsap.to(n, {
              x: i + "em",
              y: a + "em",
              rotate: "0.001deg",
              ease: "power4.out",
              duration: 2
            });
          });
        }
      };
      const i = e => {
        const t = e.currentTarget;
        const o = t.querySelectorAll("[data-magnetic-inner-target]");
        gsap.to(t, {
          x: "0em",
          y: "0em",
          ease: "elastic.out(1, 0.3)",
          duration: 1.6,
          clearProps: "all"
        });
        if (o.length) {
          o.forEach(e => {
            gsap.to(e, {
              x: "0em",
              y: "0em",
              ease: "elastic.out(1, 0.3)",
              duration: 2,
              clearProps: "all"
            });
          });
        }
      };
      e.forEach(e => {
        e.addEventListener("mouseenter", o);
        e.addEventListener("mousemove", n);
        e.addEventListener("mouseleave", i);
      });
    }
  });
}
function initMapPins() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      function e(e, t, o, n) {
        return Math.sqrt(Math.pow(o - e, 2) + Math.pow(n - t, 2));
      }
      function t(t) {
        const o = t.clientX;
        const n = t.clientY;
        i.forEach(t => {
          const i = t.getBoundingClientRect();
          const s = i.left + i.width / 2;
          const c = i.top + i.height / 2;
          const l = e(o, n, s, c);
          const d = l < a ? r - l / a * (r - 1) : 1;
          gsap.to(t, {
            scale: d,
            duration: durL,
            ease: "Out"
          });
        });
      }
      function o() {
        i.forEach(e => {
          gsap.to(e, {
            scale: 1,
            duration: durL,
            ease: "Out"
          });
        });
      }
      const n = document.querySelector("[map]");
      const i = n?.querySelectorAll("[pin]");
      if (!n || i.length === 0) {
        return;
      }
      const r = 1.5;
      const a = 240;
      n.addEventListener("mousemove", t);
      n.addEventListener("mouseleave", o);
    }
  });
}
function initNavItemHover() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      document.querySelectorAll("[hover-nav-item]").forEach(e => {
        function t() {
          gsap.fromTo(i.chars, {
            opacity: 1,
            yPercent: 0,
            scale: 1
          }, {
            opacity: 0,
            yPercent: -75,
            scale: 0,
            duration: durM,
            ease: "Out",
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            overwrite: true
          });
          gsap.fromTo(r.chars, {
            opacity: 0,
            yPercent: 75,
            scale: 0
          }, {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: durM,
            delay: delayReveal,
            ease: "Out",
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            overwrite: true
          });
        }
        function o() {
          gsap.to(i.chars, {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            duration: durM,
            delay: delayReveal,
            ease: "Out",
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            overwrite: true
          });
          gsap.to(r.chars, {
            opacity: 0,
            yPercent: 75,
            scale: 0,
            duration: durM,
            ease: "Out",
            stagger: {
              each: stagger * 0.25,
              from: "random"
            },
            overwrite: true
          });
        }
        const n = e.querySelectorAll("[hover='text']");
        if (n.length < 2) {
          return;
        }
        const i = new SplitText(n[0], {
          type: "chars",
          tag: "span",
          charsClass: "split-char",
          smartWrap: true
        });
        const r = new SplitText(n[1], {
          type: "chars",
          tag: "span",
          charsClass: "split-char",
          smartWrap: true
        });
        gsap.set(r.chars, {
          yPercent: 75,
          opacity: 0,
          scale: 0
        });
        const a = e.closest("[hover-nav-item-trigger]") || e;
        a.addEventListener("mouseenter", t);
        a.addEventListener("mouseleave", o);
      });
    }
  });
}
function initMenuItemHover() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelectorAll("[hover-menu-item]");
      e.forEach(t => {
        t.addEventListener("mouseenter", () => {
          e.forEach(e => {
            if (e !== t) {
              gsap.to(e, {
                opacity: 0.2,
                duration: durM,
                ease: "Out",
                overwrite: true
              });
              gsap.to(t, {
                opacity: 1,
                duration: durS * 0.25,
                ease: "Out",
                overwrite: true
              });
            }
          });
        });
        t.addEventListener("mouseleave", () => {
          e.forEach(e => {
            gsap.to(e, {
              opacity: 1,
              duration: durS,
              ease: "Out",
              overwrite: true
            });
          });
        });
      });
    }
  });
}
function initMarquee() {
  document.querySelectorAll("[data-marquee]").forEach(e => {
    const t = e.querySelectorAll("[data-marquee=\"list\"]");
    if (!t.length) {
      return;
    }
    const o = gsap.timeline({
      repeat: -1
    }).to(t, {
      duration: 24,
      xPercent: -100,
      ease: "linear"
    });
    ScrollTrigger.create({
      trigger: e,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => o.play(),
      onLeave: () => o.pause(),
      onEnterBack: () => o.play(),
      onLeaveBack: () => o.pause(),
      onUpdate: e => {
        const t = e.getVelocity() * 0.01;
        o.timeScale(1 + t);
      }
    });
  });
}
function initSoundToggle() {
  function e(e) {
    const t = e.querySelector("[data-sound=\"list\"]");
    const o = t ? Array.from(t.children) : [];
    if (!o.length) {
      return;
    }
    const n = e.classList.contains("is-playing");
    gsap.killTweensOf(o);
    o.forEach((e, t) => {
      const i = (o.length - 1) / 2;
      const r = Math.abs(t - i);
      const a = n ? 100 - r * 15 : 25;
      const s = a * 0.6;
      const c = Math.random() * 0.5;
      gsap.timeline().to(e, {
        scaleY: a / 100,
        duration: durM,
        ease: "ease"
      }).to(e, {
        scaleY: s / 100,
        duration: 0.3 + Math.random() * 0.3,
        ease: "ease",
        delay: c,
        repeat: -1,
        yoyo: true,
        repeatDelay: Math.random() * 0.2
      }, durM);
    });
  }
  function t() {
    if (!window.siteAudioActive) {
      n.volume = 0;
      n.play();
      gsap.to(n, {
        volume: i,
        duration: durM
      });
      window.siteAudioActive = true;
      o.forEach(t => {
        t.classList.add("is-playing");
        e(t);
      });
    }
  }
  const o = document.querySelectorAll("[data-sound-toggle]");
  if (!o.length) {
    return;
  }
  if (!window.siteAudio) {
    window.siteAudio = new Audio("https://assets.sondaven.com/carpathian-whispers-hutsul-ambient.mp3");
    window.siteAudio.loop = true;
    window.siteAudio.volume = 0;
    window.siteAudio.preload = "none";
    window.siteAudioVolume = 0.25;
    window.siteAudioActive = false;
    window.siteAudioInitialized = false;
  }
  const n = window.siteAudio;
  const i = window.siteAudioVolume;
  o.forEach(t => {
    if (window.siteAudioActive) {
      t.classList.add("is-playing");
    }
    e(t);
  });
  o.forEach(i => {
    i.addEventListener("click", () => {
      if (window.siteAudioActive) {
        gsap.to(n, {
          volume: 0,
          duration: durM,
          onComplete: () => n.pause()
        });
        window.siteAudioActive = false;
        o.forEach(t => {
          t.classList.remove("is-playing");
          e(t);
        });
      } else {
        t();
      }
    });
  });
}
function initBenefitCard() {
  document.querySelectorAll("[hover-benefit-card]").forEach(e => {
    function t() {
      gsap.set(e, {
        zIndex: 16
      });
      i.classList.add("is-open", "theme_on-dark");
      gsap.fromTo(n, {
        display: "block",
        clipPath: "inset(0% 0% 100% 0%)",
        scale: 1.1
      }, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: durL,
        ease: "Out",
        overwrite: true
      });
      gsap.to(r, {
        rotate: 90,
        duration: durS,
        ease: "InOut",
        overwrite: true
      });
      animateTextH(a, "reveal");
      animateTextP(s, "reveal");
      animateLine(c, "reveal");
    }
    function o() {
      gsap.set(e, {
        zIndex: ""
      });
      i.classList.remove("is-open", "theme_on-dark");
      gsap.to(n, {
        clipPath: "inset(100% 0% 0% 0%)",
        scale: 0.75,
        duration: durM,
        delay: delayReveal,
        ease: "InOut",
        onComplete: () => gsap.set(n, {
          display: "none"
        }),
        overwrite: true
      });
      gsap.to(r, {
        rotate: 0,
        duration: durS,
        ease: "InOut",
        overwrite: true
      });
      animateTextH(a, "hide");
      animateTextP(s, "hide");
      animateLine(c, "hide");
    }
    const n = e.querySelector("[hover='info']");
    const i = e.querySelector("[hover='name']");
    const r = e.querySelector("[hover='ico-ver']");
    const a = e.querySelectorAll("[hover='h']");
    const s = e.querySelectorAll("[hover='p']");
    const c = e.querySelectorAll("[hover='line']");
    let l = false;
    gsap.set(n, {
      display: "none"
    });
    e.addEventListener("click", () => {
      if (l) {
        o();
        l = false;
      } else {
        t();
        l = true;
      }
    });
  });
}
function initAccordion() {
  let e = null;
  document.querySelectorAll("[accordion-btn]").forEach(t => {
    function o() {
      gsap.to(r, {
        height: "auto",
        duration: durL,
        ease: "Out",
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
      gsap.fromTo(a, {
        rotate: 0
      }, {
        rotate: 90,
        duration: durM,
        ease: "InOut",
        overwrite: true
      });
      animateTextP(s, "reveal");
    }
    function n() {
      gsap.to(r, {
        height: 0,
        duration: durL,
        ease: "Out",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
        overwrite: true
      });
      gsap.to(a, {
        rotate: 180,
        duration: durM,
        ease: "InOut",
        overwrite: true
      });
      animateTextP(s, "hide");
    }
    const i = t.getAttribute("accordion-btn");
    const r = document.querySelector(`[accordion-desc="${i}"]`);
    const a = document.querySelector(`[accordion-icon-ver="${i}"]`);
    const s = document.querySelectorAll(`[accordion-paragraph="${i}"]`);
    if (r) {
      gsap.set(r, {
        height: 0,
        overflow: "hidden"
      });
      t.addEventListener("click", () => {
        if (e && e !== t) {
          e.closeFunc();
        }
        if (e !== t) {
          o();
          e = t;
        } else {
          n();
          e = null;
        }
      });
      t.closeFunc = n;
    }
  });
}
function initLoadMore() {
  const e = document.querySelectorAll("[data-load-more]");
  if (e.length) {
    e.forEach(e => {
      function t() {
        d = Array.from(s.children);
        d.forEach((e, t) => {
          if (t >= c) {
            e.style.display = "none";
          }
        });
        l = c;
        n();
        ScrollTrigger.refresh();
      }
      function o() {
        d.slice(l, l + c).forEach(e => {
          e.style.display = "";
          gsap.fromTo(e, {
            opacity: 0,
            yPercent: 15
          }, {
            opacity: 1,
            yPercent: 0,
            duration: durM,
            ease: "Out"
          });
          ScrollTrigger.refresh();
        });
        l += c;
        n();
      }
      function n() {
        if (l >= d.length) {
          a.style.display = "none";
        }
      }
      const i = e.getAttribute("device");
      const r = window.innerWidth >= breakPoint;
      if (i === "desk" && !r) {
        return;
      }
      if (i === "mob" && r) {
        return;
      }
      const a = e.querySelector("[data-load-more=\"btn\"]");
      const s = e.querySelector("[data-load-more=\"list\"]");
      if (!a || !s) {
        return;
      }
      const c = 4;
      let l = 0;
      let d = [];
      a.addEventListener("click", o);
      t();
    });
  }
}
function initSlider() {
  const e = gsap.utils.toArray("[slider]");
  if (e.length) {
    e.forEach(e => {
      function t() {
        if (n.$current && n.$total) {
          n.$current.textContent = n.current + 1;
          n.$total.textContent = n.length;
        }
      }
      function o(e) {
        n.$slides[n.prev].style.zIndex = 1;
        n.$slides[n.current].style.zIndex = 2;
        gsap.timeline().fromTo(n.$imgs[n.prev], {
          scale: 1
        }, {
          duration: durL,
          scale: 1.5,
          ease: "Ease"
        }, "<");
        gsap.timeline().fromTo(n.$slides[n.current], {
          clipPath: e ? i : r
        }, {
          clipPath: a,
          duration: durL,
          ease: "Ease",
          onComplete: () => {
            n.$slides[n.prev].style.zIndex = "auto";
            n.$slides[n.current].style.zIndex = 1;
            n.animating = false;
          }
        }).fromTo(n.$imgs[n.current], {
          scale: 1.5
        }, {
          scale: 1,
          duration: durL,
          ease: "Ease"
        }, "<");
      }
      const n = {
        $slides: e.querySelectorAll("[slider=\"slide\"]"),
        $imgs: e.querySelectorAll("[slider=\"slide\"] [slider=\"img\"]"),
        $pag: e.querySelector("[slider=\"pag\"]"),
        $prev: e.querySelector("[slider=\"prev\"]"),
        $next: e.querySelector("[slider=\"next\"]"),
        $current: e.querySelector("[slider=\"current\"]"),
        $total: e.querySelector("[slider=\"total\"]"),
        current: 0,
        prev: null,
        animating: false
      };
      n.length = n.$slides.length;
      if (!n.length || !n.$prev || !n.$next) {
        return;
      }
      if (n.length === 1) {
        n.$pag.style.display = "none";
        return;
      }
      const i = "inset(0% 0% 0% 100%)";
      const r = "inset(0% 100% 0% 0%)";
      const a = "inset(0% 0% 0% 0%)";
      gsap.set(n.$slides, {
        clipPath: r
      });
      gsap.set(n.$slides[n.current], {
        clipPath: a
      });
      t();
      n.$prev.addEventListener("click", () => {
        if (!n.animating) {
          n.animating = true;
          n.prev = n.current;
          n.current = n.current === 0 ? n.length - 1 : n.current - 1;
          t();
          o(false);
        }
      });
      n.$next.addEventListener("click", () => {
        if (!n.animating) {
          n.animating = true;
          n.prev = n.current;
          n.current = n.current === n.length - 1 ? 0 : n.current + 1;
          t();
          o(true);
        }
      });
    });
  }
}
function initSliderText() {
  const e = gsap.utils.toArray("[slider-text]");
  if (e.length) {
    e.forEach(e => {
      function t() {
        a.$slides[a.prev].style.zIndex = 0;
        a.$slides[a.current].style.zIndex = 1;
        gsap.timeline({
          onComplete: () => {
            a.$slides[a.prev].style.zIndex = "auto";
            a.$slides[a.current].style.zIndex = 1;
            a.animating = false;
          }
        }).call(() => {
          animateTextH(a.$headlines[a.prev], "hide", 0);
          animateTextP(a.$paragraphs[a.prev], "hide", 0);
        }, 0).to(a.$circles[a.prev], {
          opacity: 0,
          scale: 1.25,
          duration: durS,
          ease: "In"
        }, 0).set(a.$slides[a.prev], {
          display: "none",
          position: "absolute",
          delay: 0.1
        }).set(a.$slides[a.current], {
          display: "block",
          position: "relative"
        }).call(() => {
          animateTextH(a.$headlines[a.current], "reveal", 0);
          animateTextP(a.$paragraphs[a.current], "reveal", 0);
        }).fromTo(a.$circles[a.current], {
          opacity: 0,
          scale: 0
        }, {
          opacity: 1,
          scale: 1,
          duration: durL,
          ease: "Out"
        }, "<");
      }
      function o() {
        if (a.$current && a.$total) {
          a.$current.textContent = a.current + 1;
          a.$total.textContent = a.length;
        }
      }
      function n() {
        if (!a.$progressLines.length) {
          return;
        }
        const e = a.$progressLines[a.current];
        const t = e.r.baseVal.value;
        const o = Math.PI * 2 * t;
        e.style.strokeDasharray = o;
        e.style.strokeDashoffset = o;
        gsap.fromTo(e, {
          strokeDashoffset: o
        }, {
          strokeDashoffset: 0,
          duration: a.autoplayDuration - durM,
          ease: "none",
          delay: durM
        });
      }
      function i() {
        if (a.isInViewport) {
          n();
          a.autoplayInterval = setInterval(() => {
            if (!a.animating) {
              a.animating = true;
              a.prev = a.current;
              a.current = a.current === a.length - 1 ? 0 : a.current + 1;
              o();
              t(true);
              n();
            }
          }, a.autoplayDuration * 1000);
        }
      }
      function r() {
        if (a.autoplayInterval) {
          clearInterval(a.autoplayInterval);
          a.autoplayInterval = null;
        }
        if (a.$progressLines.length) {
          gsap.killTweensOf(a.$progressLines[a.current]);
        }
      }
      const a = {
        $slides: e.querySelectorAll("[slider=\"slide\"]"),
        $headlines: e.querySelectorAll("[slider=\"slide\"] [slider=\"ctn\"]"),
        $paragraphs: e.querySelectorAll("[slider=\"slide\"] [slider=\"p\"]"),
        $circles: e.querySelectorAll("[slider=\"slide\"] [slider=\"circle\"]"),
        $progressLines: e.querySelectorAll("[slider=\"slide\"] [slider=\"progress-line\"]"),
        $pag: e.querySelector("[slider=\"pag\"]"),
        $prev: e.querySelector("[slider=\"prev\"]"),
        $next: e.querySelector("[slider=\"next\"]"),
        $current: e.querySelector("[slider=\"current\"]"),
        $total: e.querySelector("[slider=\"total\"]"),
        current: 0,
        prev: null,
        animating: false,
        autoplayDuration: 6,
        autoplayInterval: null,
        isInViewport: false
      };
      a.length = a.$slides.length;
      if (!a.length || !a.$prev || !a.$next) {
        return;
      }
      if (a.length === 1) {
        a.$pag.style.display = "none";
        return;
      }
      gsap.set(a.$slides, {
        display: "none",
        position: "absolute"
      });
      gsap.set(a.$slides[a.current], {
        display: "block",
        position: "relative"
      });
      new IntersectionObserver(e => {
        e.forEach(e => {
          if (e.isIntersecting) {
            a.isInViewport = true;
            i();
          } else {
            a.isInViewport = false;
            r();
          }
        });
      }, {
        threshold: 0
      }).observe(e);
      a.$prev.addEventListener("click", () => {
        if (!a.animating) {
          r();
          a.animating = true;
          a.prev = a.current;
          a.current = a.current === 0 ? a.length - 1 : a.current - 1;
          o();
          t(false);
          i();
        }
      });
      a.$next.addEventListener("click", () => {
        if (!a.animating) {
          r();
          a.animating = true;
          a.prev = a.current;
          a.current = a.current === a.length - 1 ? 0 : a.current + 1;
          o();
          t(true);
          i();
        }
      });
      o();
    });
  }
}
function initSliderFreemode() {
  document.querySelectorAll("[slider-id]").forEach(e => {
    const t = e.getAttribute("slider-id");
    const o = e.querySelector(".swiper");
    if (!o) {
      return;
    }
    new Swiper(o, {
      direction: "horizontal",
      freeMode: {
        enabled: true,
        momentum: true,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        sticky: false
      },
      a11y: {
        enabled: false
      },
      slidesPerView: "auto",
      grabCursor: true,
      mousewheel: {
        forceToAxis: true
      },
      navigation: {
        nextEl: `[slider-id="${t}"] [slider="next"]`,
        prevEl: `[slider-id="${t}"] [slider="prev"]`
      },
      speed: 800
    });
  });
}
function initTabs() {
  const e = document.querySelectorAll("[data-tabs]");
  if (e.length) {
    e.forEach(e => {
      const t = e.querySelectorAll("[data-tab-trigger]");
      e.querySelectorAll("[data-tab-content]");
      let o = t[0]?.getAttribute("data-tab-trigger");
      let n = false;
      if (t[0]) {
        t[0].classList.add("is-active");
      }
      t.forEach(t => {
        t.addEventListener("click", () => {
          const i = t.getAttribute("data-tab-trigger");
          if (i === o) {
            return;
          }
          const r = e.querySelector(`[data-tab-trigger="${o}"]`);
          const a = e.querySelector(`[data-tab-content="${o}"]`);
          const s = e.querySelector(`[data-tab-content="${i}"]`);
          gsap.killTweensOf([a, s]);
          n = true;
          gsap.set(a, {
            display: "block",
            position: "absolute",
            transformOrigin: "top bottom"
          });
          gsap.set(s, {
            display: "block",
            position: "relative",
            transformOrigin: "top bottom",
            xPercent: 125,
            rotate: -15
          });
          ScrollTrigger.refresh();
          gsap.to(a, {
            xPercent: -125,
            rotate: 15,
            duration: durL,
            ease: "InOut",
            onComplete: () => {
              if (n) {
                a.style.display = "none";
              }
            }
          });
          gsap.to(s, {
            xPercent: 0,
            rotate: 0,
            duration: durL,
            ease: "InOut",
            onComplete: () => {
              n = false;
            }
          });
          r.classList.remove("is-active");
          t.classList.add("is-active");
          o = i;
        });
      });
    });
  }
}
function initTabsHilight() {
  const e = document.querySelectorAll("[data-tabs-hilight]");
  if (e.length) {
    e.forEach(e => {
      function t() {
        const t = e.querySelector("[data-tab].is-active");
        if (t) {
          gsap.timeline().to(n, {
            x: t.offsetLeft,
            width: t.offsetWidth,
            duration: durM,
            ease: "InOut"
          }).add(() => {
            o.forEach(e => e.classList.remove("theme_on-light"));
            t.classList.add("theme_on-light");
          }, "<50%");
        }
      }
      const o = e.querySelectorAll("[data-tab]");
      const n = e.querySelector("[data-tab-hilight]");
      if (o.length && n) {
        t();
        o.forEach(e => {
          e.addEventListener("click", () => {
            o.forEach(e => e.classList.remove("is-active"));
            e.classList.add("is-active");
            t(e);
          });
        });
      }
    });
  }
}
function initTabsText() {
  const e = document.querySelectorAll("[data-tabs-text]");
  if (e.length) {
    e.forEach(e => {
      const t = e.querySelectorAll("[data-tab-trigger]");
      e.querySelectorAll("[data-tab-content]");
      let o = t[0]?.getAttribute("data-tab-trigger");
      let n = false;
      if (t[0]) {
        t[0].classList.add("is-active");
      }
      t.forEach(t => {
        t.addEventListener("click", () => {
          const i = t.getAttribute("data-tab-trigger");
          if (i === o) {
            return;
          }
          const r = e.querySelector(`[data-tab-trigger="${o}"]`);
          const a = e.querySelector(`[data-tab-content="${o}"]`);
          const s = a.querySelectorAll("[data-content=\"h\"]");
          const c = a.querySelectorAll("[data-content=\"ctn\"]");
          const l = e.querySelector(`[data-tab-content="${i}"]`);
          const d = l.querySelectorAll("[data-content=\"h\"]");
          const u = l.querySelectorAll("[data-content=\"ctn\"]");
          gsap.killTweensOf([a, l]);
          n = true;
          gsap.timeline({
            onComplete: () => {
              n = false;
              ScrollTrigger.refresh();
            }
          }).call(() => {
            animateTextH(s, "hide", 0);
            animateCtn(c, "hide", 0);
          }).set(a, {
            display: "none",
            position: "absolute",
            delay: durM
          }).set(l, {
            display: "block",
            position: "relative"
          }).call(() => {
            animateTextH(d, "reveal", 0);
            animateCtn(u, "reveal", 0);
          });
          r.classList.remove("is-active");
          t.classList.add("is-active");
          o = i;
        });
      });
    });
  }
}
function initSummerWinterSwitcher() {
  function e(e) {
    const t = l.getPointAtLength(e * v);
    return {
      x: t.x,
      y: t.y
    };
  }
  function t(e) {
    let t = null;
    if (e < 0.4) {
      t = "summer";
    } else if (e > 0.5) {
      t = "winter";
    }
    if (t !== f) {
      if (t === "summer" && g) {
        g.click();
      } else if (t === "winter" && p) {
        p.click();
      }
      f = t;
    }
  }
  function o(e) {
    gsap.to({
      progress: y
    }, {
      progress: e,
      duration: durM,
      ease: "Ease",
      onUpdate: function () {
        y = this.targets()[0].progress;
        a(y);
        t(y);
      }
    });
  }
  function n() {
    h = true;
    c.style.cursor = "grabbing";
  }
  function i(o) {
    if (!h) {
      return;
    }
    const n = o.clientX || o.touches?.[0]?.clientX;
    const i = o.clientY || o.touches?.[0]?.clientY;
    const r = s.getBoundingClientRect();
    const c = n - r.left;
    const l = i - r.top;
    let d = 0;
    let u = Infinity;
    for (let t = 0; t <= 100; t++) {
      const o = t / 100;
      const n = e(o);
      const i = Math.sqrt(Math.pow(n.x - c, 2) + Math.pow(n.y - l, 2));
      if (i < u) {
        u = i;
        d = o;
      }
    }
    y = d;
    a(y);
    t(y);
  }
  function r() {
    if (!h) {
      return;
    }
    h = false;
    c.style.cursor = "grab";
    o(y < 0.5 ? 0 : 1);
  }
  function a(t) {
    const o = e(t);
    gsap.set(c, {
      cx: o.x,
      cy: o.y
    });
  }
  const s = document.querySelector("[data-line-animation]");
  if (!s) {
    return;
  }
  const c = s.querySelector("[data-active]");
  const l = s.querySelector("[data-path]");
  const d = s.querySelector("[data-start]");
  const u = s.querySelector("[data-end]");
  const g = document.querySelector("[data-summer-btn]");
  const p = document.querySelector("[data-winter-btn]");
  const m = l.getPointAtLength(0);
  let h = false;
  let y = 0;
  let f = null;
  const v = l.getTotalLength();
  gsap.set(c, {
    cx: m.x,
    cy: m.y
  });
  d.addEventListener("click", () => {
    o(0);
  });
  u.addEventListener("click", () => {
    o(1);
  });
  c.style.cursor = "grab";
  d.style.cursor = "pointer";
  u.style.cursor = "pointer";
  c.addEventListener("mousedown", n);
  c.addEventListener("touchstart", n);
  document.addEventListener("mousemove", i);
  document.addEventListener("touchmove", i);
  document.addEventListener("mouseup", r);
  document.addEventListener("touchend", r);
}
function initModalCta() {
  document.querySelectorAll("[modal-cta-open]").forEach(e => {
    function t() {
      gsap.set([i, a], {
        display: "block"
      });
      gsap.fromTo(r, {
        scale: 0,
        rotateX: -90,
        yPercent: -100,
        rotate: -25
      }, {
        scale: 1,
        rotateX: 0,
        yPercent: 0,
        rotate: 0,
        duration: durL,
        ease: "Out",
        overwrite: true
      });
      gsap.fromTo(a, {
        opacity: 0
      }, {
        opacity: 1,
        duration: durL,
        ease: "Out",
        overwrite: true
      });
      animateTextH(s, "reveal");
      animateCtn(c, "reveal", 0.3);
      animateLine(l, "reveal", 0.3);
      lockScroll();
    }
    function o() {
      gsap.to(r, {
        scale: 1,
        rotateX: 90,
        yPercent: 200,
        rotate: 25,
        duration: durM,
        ease: "In",
        overwrite: true
      });
      gsap.to(a, {
        opacity: 0,
        duration: durM,
        ease: "In",
        onComplete: () => {
          gsap.set([i, a], {
            display: "none"
          });
        },
        overwrite: true
      });
      unlockScroll();
    }
    const n = e.getAttribute("modal-cta-open");
    const i = document.querySelector(`[modal-cta="${n}"]`);
    const r = document.querySelector(`[modal-cta-main="${n}"]`);
    const a = document.querySelector(`[modal-cta-over="${n}"]`);
    const s = document.querySelectorAll(`[modal-cta-headline="${n}"]`);
    const c = document.querySelectorAll(`[modal-cta-container="${n}"]`);
    const l = document.querySelectorAll(`[modal-cta-line="${n}"]`);
    const d = document.querySelectorAll(`[modal-cta-close="${n}"]`);
    if (!i) {
      return;
    }
    let u = false;
    gsap.set(i, {
      display: "none"
    });
    gsap.set(r, {
      transformPerspective: 1000
    });
    e.addEventListener("click", () => {
      if (!u) {
        t();
        u = true;
      }
    });
    d.forEach(e => {
      e.addEventListener("click", () => {
        if (u) {
          o();
          u = false;
        }
      });
    });
  });
}
function initModalMedia() {
  document.querySelectorAll("[modal-media-open]").forEach(e => {
    function t() {
      gsap.set(i, {
        display: "block",
        opacity: 1
      });
      if (r) {
        r.src = l;
        r.muted = false;
        r.controls = false;
        r.volume = 0.25;
        r.currentTime = 0;
        r.play().catch(() => {});
        gsap.fromTo(r, {
          scale: 2
        }, {
          scale: 1,
          duration: durL,
          ease: "Out",
          overwrite: true
        });
      }
      if (a) {
        gsap.fromTo(a, {
          scale: 2
        }, {
          scale: 1,
          duration: durL,
          ease: "Out",
          overwrite: true
        });
      }
      gsap.fromTo(i, {
        display: "block",
        "--mask-y": "200%",
        "--mask-size": "100% 400%",
        opacity: 1
      }, {
        "--mask-y": "0%",
        "--mask-size": "100% 400%",
        duration: durL * 1.5,
        ease: "Out",
        overwrite: true
      });
      lockScroll();
    }
    function o() {
      gsap.to(i, {
        opacity: 0,
        duration: durS,
        ease: "In",
        onComplete: () => {
          gsap.set(i, {
            display: "none"
          });
          if (r) {
            r.pause();
            r.removeAttribute("src");
            r.load();
          }
        },
        overwrite: true
      });
      if (r) {
        gsap.to(r, {
          scale: 1.25,
          duration: durS,
          ease: "In",
          overwrite: true
        });
      }
      if (a) {
        gsap.to(a, {
          scale: 1.25,
          duration: durS,
          ease: "In",
          overwrite: true
        });
      }
      unlockScroll();
    }
    const n = e.getAttribute("modal-media-open");
    const i = document.querySelector(`[modal-media="${n}"]`);
    const r = document.querySelector(`[modal-media-video="${n}"]`);
    const a = document.querySelector(`[modal-media-gallery="${n}"]`);
    const s = document.querySelectorAll(`[modal-media-close="${n}"]`);
    if (!i) {
      return;
    }
    let c = false;
    const l = "https://assets.sondaven.com/son-daven.MP4";
    if (r) {
      r.removeAttribute("src");
      r.load();
    }
    gsap.set(i, {
      display: "none"
    });
    e.addEventListener("click", () => {
      if (!c) {
        t();
        c = true;
      }
    });
    s.forEach(e => {
      e.addEventListener("click", () => {
        if (c) {
          o();
          c = false;
        }
      });
    });
  });
}
function initModalMenu() {
  document.querySelectorAll("[modal-menu-open]").forEach(e => {
    function t() {
      c.classList.add("theme_on-dark");
      u.forEach(e => e.classList.toggle("d-none"));
      gsap.fromTo(i, {
        display: "block",
        "--mask-y": "200%",
        "--mask-size": "100% 400%",
        opacity: 1
      }, {
        "--mask-y": "0%",
        "--mask-size": "100% 400%",
        duration: durL * 1.5,
        ease: "Out",
        overwrite: true
      });
      gsap.timeline({
        defaults: {
          duration: durM,
          ease: "InOut"
        }
      }).to(l, {
        rotate: 45,
        yPercent: 10,
        overwrite: true
      }).to(d, {
        rotate: -45,
        yPercent: -10,
        overwrite: true
      }, "<");
      gsap.timeline({
        defaults: {
          duration: durS,
          ease: "InOut"
        }
      }).to(g, {
        yPercent: 15,
        overwrite: true
      }).to(m, {
        yPercent: -15,
        overwrite: true
      }, "<").to(p, {
        scaleX: 0,
        overwrite: true
      }, "<").to(g, {
        rotate: 45
      }).to(m, {
        rotate: -45
      }, "<");
      animateTextH(a, "reveal", 0.4);
      animateCtn(s, "reveal", 0.4);
      lockScroll();
    }
    function o() {
      c.classList.remove("theme_on-dark");
      u.forEach(e => e.classList.toggle("d-none"));
      gsap.to(i, {
        opacity: 0,
        duration: durM,
        ease: "Out",
        delay: 0.4,
        onComplete: () => gsap.set(i, {
          display: "none"
        }),
        overwrite: true
      });
      gsap.timeline({
        defaults: {
          duration: durM,
          ease: "InOut"
        }
      }).to(l, {
        rotate: 0,
        yPercent: 0,
        overwrite: true
      }).to(d, {
        rotate: 0,
        yPercent: 0,
        overwrite: true
      }, "<");
      gsap.timeline({
        defaults: {
          duration: durS,
          ease: "InOut"
        }
      }).to(g, {
        rotate: 0,
        overwrite: true
      }).to(m, {
        rotate: 0,
        overwrite: true
      }, "<").to(g, {
        yPercent: 0
      }).to(p, {
        scaleX: 1,
        overwrite: true
      }, "<").to(m, {
        yPercent: 0
      }, "<");
      animateTextH(a, "hide");
      animateCtn(s, "hide");
      unlockScroll();
    }
    const n = e.getAttribute("modal-menu-open");
    const i = document.querySelector(`[modal-menu="${n}"]`);
    const r = document.querySelectorAll(`[modal-menu-close="${n}"]`);
    const a = document.querySelectorAll(`[modal-menu-headline="${n}"]`);
    const s = document.querySelectorAll(`[modal-menu-ctn="${n}"]`);
    const c = document.querySelector(".header");
    const l = document.querySelector(".menu-btn_ico_line.top");
    const d = document.querySelector(".menu-btn_ico_line.bot");
    const u = document.querySelectorAll(".menu-btn_label");
    const g = document.querySelector(".mob_menu-btn_ico_line.top");
    const p = document.querySelector(".mob_menu-btn_ico_line.center");
    const m = document.querySelector(".mob_menu-btn_ico_line.bot");
    if (!i) {
      return;
    }
    let h = false;
    gsap.set(i, {
      display: "none"
    });
    e.addEventListener("click", () => {
      if (h) {
        o();
        h = false;
      } else {
        t();
        h = true;
      }
    });
    r.forEach(e => {
      e.addEventListener("click", () => {
        if (h) {
          o();
          h = false;
        }
      });
    });
  });
}
function initModalVimVideo() {
  document.querySelectorAll("[data-modal-vim-video-btn]").forEach(e => {
    function t() {
      gsap.set([i, r], {
        display: "block"
      });
      if (s) {
        s.contentWindow.postMessage("{\"method\":\"play\"}", "*");
      }
      lockScroll();
    }
    function o() {
      if (s) {
        s.contentWindow.postMessage("{\"method\":\"pause\"}", "*");
      }
      gsap.set([i, r], {
        display: "none"
      });
      unlockScroll();
    }
    const n = e.getAttribute("data-modal-vim-video-btn");
    const i = document.querySelector(`[data-modal-vim-video="${n}"]`);
    if (!i) {
      return;
    }
    i.querySelector("[data-modal-container]");
    const r = i.querySelector("[data-modal-over]");
    const a = i.querySelectorAll("[data-modal-close]");
    const s = i.querySelector("iframe");
    let c = false;
    gsap.set(i, {
      display: "none"
    });
    e.addEventListener("click", () => {
      if (!c) {
        t();
        c = true;
      }
    });
    a.forEach(e => {
      e.addEventListener("click", () => {
        if (c) {
          o();
          c = false;
        }
      });
    });
  });
}
function initFloatingTips() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      function e(e) {
        return e * parseFloat(getComputedStyle(document.documentElement).fontSize);
      }
      function t(e, t, o) {
        gsap.killTweensOf(e);
        gsap.set(e, {
          display: "flex",
          scale: 2,
          opacity: 1,
          clipPath: "inset(0% 50% 0% 50% round var(--_units---u-24))",
          x: t + a,
          y: o + a
        });
        gsap.to(e, {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round var(--_units---u-24))",
          duration: durM,
          ease: "Out"
        });
      }
      function o(e) {
        gsap.killTweensOf(e);
        gsap.to(e, {
          scale: 0.5,
          opacity: 0,
          clipPath: "inset(0% 0% 0% 0% round var(--_units---u-24))",
          duration: durS,
          ease: "In",
          onComplete: () => {
            e.style.display = "none";
          }
        });
      }
      function n(e) {
        r.forEach(t => {
          gsap.to(t, {
            x: e.clientX + a,
            y: e.clientY + a,
            duration: durL,
            ease: "power3"
          });
        });
      }
      const i = {};
      const r = new Set();
      document.querySelectorAll("[floating-tip]").forEach(e => {
        const t = e.getAttribute("floating-tip");
        i[t] = e;
      });
      const a = e(1.388);
      document.addEventListener("mousemove", n);
      document.querySelectorAll("[floating-tip-btn]").forEach(e => {
        const n = e.getAttribute("floating-tip-btn");
        const a = i[n];
        if (a) {
          e.addEventListener("mouseenter", e => {
            r.add(a);
            t(a, e.clientX, e.clientY);
          });
          e.addEventListener("mouseleave", () => {
            r.delete(a);
            o(a);
          });
        }
      });
    }
  });
}
function initScrollVideo() {
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelector("[data-scroll-video-container]");
      if (!e) {
        return;
      }
      const t = e.querySelector("[data-scroll-video]");
      const o = t.getContext("2d");
      const n = [];
      const i = e => {
        t.width = t.offsetWidth;
        t.height = t.offsetHeight;
        const n = Math.max(t.width / e.width, t.height / e.height);
        const i = (t.width - e.width * n) / 2;
        const r = (t.height - e.height * n) / 2;
        o.drawImage(e, i, r, e.width * n, e.height * n);
      };
      framesPromise.then(t => {
        n.push(...t.filter(Boolean));
        i(n[0]);
        gsap.to({
          frame: 0
        }, {
          frame: n.length - 1,
          snap: "frame",
          ease: "none",
          scrollTrigger: {
            trigger: e,
            start: "top top",
            end: "75% bottom",
            scrub: 0.25
          },
          onUpdate() {
            i(n[Math.round(this.targets()[0].frame)]);
          }
        });
      });
    }
  });
  ScrollTrigger.matchMedia({
    [`(min-width: ${breakPoint}px)`]: function () {
      const e = document.querySelector(".hero-scroll-area");
      if (e) {
        const t = e.querySelector(".hero-w");
        const o = e.querySelector(".hero-s");
        const n = e.querySelector(".hero-s_t");
        gsap.to(n, {
          scrollTrigger: {
            trigger: e,
            start: "top top",
            end: "50% bottom",
            scrub: 0.25
          },
          yPercent: -100,
          scale: 0.5,
          opacity: 0,
          ease: "none"
        });
        gsap.timeline({
          scrollTrigger: {
            trigger: e,
            start: "70% bottom",
            end: "bottom bottom",
            scrub: 1
          }
        }).to(t, {
          scale: 0.3,
          ease: "Out",
          duration: 1
        }, 0).to(o, {
          opacity: 0,
          ease: "Out",
          duration: 0.33
        }, 0);
      }
    }
  });
}
function initCanvasEffect(e, t, o = {}) {
  const n = typeof e == "string" ? document.querySelectorAll(e) : [e];
  if (!n.length) {
    return;
  }
  const i = Array.from(n).map(e => createCanvasInstance(e, t, o)).filter(Boolean);
  return {
    destroy: () => i.forEach(e => e.destroy()),
    loaded: Promise.all(i.map(e => e.loaded))
  };
}
function createCanvasInstance(e, t, o = {}) {
  if (!e) {
    return null;
  }
  const n = 1.5;
  const i = 2;
  const r = 1000 / (o.fps || 60);
  const a = {
    ...{
      blur: 0,
      gamma: 1,
      blackPoint: 0,
      whitePoint: 255,
      threshold: 255,
      ySquares: 100,
      xSquares: 100,
      minSquareWidth: "-2%",
      maxSquareWidth: "102%",
      fps: 60,
      x: 0,
      y: 0,
      width: "100%",
      height: "100%",
      bgOpacity: 1,
      fillOpacity: 1
    },
    ...o
  };
  const s = {
    vertex: "\n      attribute vec2 a_position;\n      attribute vec2 a_texCoord;\n      varying vec2 v_texCoord;\n      void main() {\n        gl_Position = vec4(a_position, 0.0, 1.0);\n        v_texCoord = a_texCoord;\n      }\n    ",
    fragment: `\n      precision mediump float;\n      uniform sampler2D u_texture;\n      uniform vec2 u_resolution;\n      uniform vec2 u_texSize;\n      uniform vec2 u_gridSize;\n      uniform float u_minWidth;\n      uniform float u_maxWidth;\n      uniform float u_threshold;\n      uniform float u_gamma;\n      uniform float u_blackPoint;\n      uniform float u_whitePoint;\n      uniform vec3 u_bgColor;\n      uniform vec3 u_fillColor;\n      uniform float u_bgOpacity;\n      uniform float u_fillOpacity;\n      uniform vec4 u_bounds;\n      varying vec2 v_texCoord;\n\n      void main() {\n        vec2 p = gl_FragCoord.xy;\n        vec2 b0 = u_bounds.xy;\n        vec2 b1 = u_bounds.zw;\n\n        if (p.x < b0.x || p.x > b1.x || p.y < b0.y || p.y > b1.y) discard;\n\n        vec2 lc = (p - b0) / (b1 - b0);\n        vec2 cs = 1.0 / u_gridSize;\n        vec2 ci = floor(lc / cs);\n        vec2 cc = (ci + 0.5) * cs;\n\n        vec4 tc = texture2D(u_texture, cc);\n        if (tc.a < 0.01 || (tc.r < 0.01 && tc.g < 0.01 && tc.b < 0.01)) discard;\n\n        vec2 texelSize = 1.0 / u_texSize;\n        vec4 neighbor;\n        ${(e => {
      let t = "";
      for (let o = -e; o <= e; o++) {
        for (let n = -e; n <= e; n++) {
          if (o !== 0 || n !== 0) {
            t += `\n          neighbor = texture2D(u_texture, cc + vec2(${o.toFixed(1)}, ${n.toFixed(1)}) * texelSize);\n          if (neighbor.a < 0.01 || (neighbor.r < 0.01 && neighbor.g < 0.01 && neighbor.b < 0.01)) {\n            discard;\n          }\n        `;
          }
        }
      }
      return t;
    })(i)}\n\n        vec3 rgb = tc.rgb;\n        if (u_gamma != 1.0) rgb = pow(rgb, vec3(u_gamma));\n\n        float range = u_whitePoint - u_blackPoint;\n        if (range != 0.0) {\n          rgb = clamp((rgb * 255.0 - u_blackPoint) / range, 0.0, 1.0);\n        }\n\n        float br = dot(rgb, vec3(0.333)) * tc.a;\n        if (br > u_threshold / 255.0) {\n          gl_FragColor = vec4(u_bgColor, u_bgOpacity);\n          return;\n        }\n\n        vec2 cl = (lc - ci * cs) / cs;\n        float lw = ((1.0 - br) * (u_maxWidth - u_minWidth) + u_minWidth) \n          / (b1.x - b0.x) * u_gridSize.x;\n\n        gl_FragColor = abs(cl.x - 0.5) < lw * 0.5 \n          ? vec4(u_fillColor, u_fillOpacity) \n          : vec4(u_bgColor, u_bgOpacity);\n      }\n    `
  };
  const c = (e, t) => typeof e != "string" ? e : e.endsWith("%") ? parseFloat(e) / 100 * t : e.endsWith("vw") ? parseFloat(e) / 100 * k * Math.min(window.devicePixelRatio || 1, n) : parseFloat(e);
  const l = e => {
    if (!e) {
      return [0, 0, 0];
    }
    const t = e.replace("#", "").trim();
    const o = t.length === 3 ? t[0] + t[0] + t[1] + t[1] + t[2] + t[2] : t;
    return [parseInt(o.slice(0, 2), 16) / 255, parseInt(o.slice(2, 4), 16) / 255, parseInt(o.slice(4, 6), 16) / 255];
  };
  const d = () => {
    const e = getComputedStyle(document.documentElement);
    return {
      bg: l(e.getPropertyValue("--_colors---base-0--100").trim() || "#000000"),
      fill: l(e.getPropertyValue("--_colors---base-1000--100").trim() || "#ffffff")
    };
  };
  const u = e.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance"
  });
  if (!u) {
    return null;
  }
  const g = (e, t) => {
    const o = u.createShader(e);
    u.shaderSource(o, t);
    u.compileShader(o);
    return o;
  };
  const p = (e, t) => {
    const o = u.createProgram();
    u.attachShader(o, e);
    u.attachShader(o, t);
    u.linkProgram(o);
    return o;
  };
  const m = p(g(u.VERTEX_SHADER, s.vertex), g(u.FRAGMENT_SHADER, s.fragment));
  if (!m) {
    return null;
  }
  u.useProgram(m);
  const h = {
    aPos: u.getAttribLocation(m, "a_position"),
    aUV: u.getAttribLocation(m, "a_texCoord"),
    uTex: u.getUniformLocation(m, "u_texture"),
    uRes: u.getUniformLocation(m, "u_resolution"),
    uTexSize: u.getUniformLocation(m, "u_texSize"),
    uGrid: u.getUniformLocation(m, "u_gridSize"),
    uMinW: u.getUniformLocation(m, "u_minWidth"),
    uMaxW: u.getUniformLocation(m, "u_maxWidth"),
    uThr: u.getUniformLocation(m, "u_threshold"),
    uGam: u.getUniformLocation(m, "u_gamma"),
    uBP: u.getUniformLocation(m, "u_blackPoint"),
    uWP: u.getUniformLocation(m, "u_whitePoint"),
    uBg: u.getUniformLocation(m, "u_bgColor"),
    uFill: u.getUniformLocation(m, "u_fillColor"),
    uBgOpacity: u.getUniformLocation(m, "u_bgOpacity"),
    uFillOpacity: u.getUniformLocation(m, "u_fillOpacity"),
    uBounds: u.getUniformLocation(m, "u_bounds")
  };
  const y = e => {
    const t = u.createBuffer();
    u.bindBuffer(u.ARRAY_BUFFER, t);
    u.bufferData(u.ARRAY_BUFFER, e, u.STATIC_DRAW);
    return t;
  };
  const f = {
    position: y(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])),
    texCoord: y(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]))
  };
  u.bindBuffer(u.ARRAY_BUFFER, f.position);
  u.enableVertexAttribArray(h.aPos);
  u.vertexAttribPointer(h.aPos, 2, u.FLOAT, false, 0, 0);
  u.bindBuffer(u.ARRAY_BUFFER, f.texCoord);
  u.enableVertexAttribArray(h.aUV);
  u.vertexAttribPointer(h.aUV, 2, u.FLOAT, false, 0, 0);
  u.enable(u.BLEND);
  u.blendFunc(u.SRC_ALPHA, u.ONE_MINUS_SRC_ALPHA);
  u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL, true);
  u.pixelStorei(u.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  u.activeTexture(u.TEXTURE0);
  u.uniform1i(h.uTex, 0);
  const v = d();
  u.uniform3fv(h.uBg, v.bg);
  u.uniform3fv(h.uFill, v.fill);
  const b = new Float32Array(16);
  b.fill(NaN);
  let S = null;
  let w = 0;
  let x = false;
  let P = [];
  let E = 0;
  let T = 0;
  let k = e.offsetWidth;
  const q = new ResizeObserver(t => {
    const o = t[0];
    if (!o) {
      return;
    }
    const i = Math.min(window.devicePixelRatio || 1, n);
    const r = Math.round(o.contentRect.width * i);
    const a = Math.round(o.contentRect.height * i);
    if (e.width !== r || e.height !== a) {
      e.width = r;
      e.height = a;
      E = r;
      T = a;
      k = o.contentRect.width;
      u.viewport(0, 0, r, a);
      u.uniform2f(h.uRes, r, a);
      b.fill(NaN);
      if (x) {
        W();
      }
    }
  });
  q.observe(e);
  const A = Math.min(window.devicePixelRatio || 1, n);
  E = Math.round(e.offsetWidth * A);
  T = Math.round(e.offsetHeight * A);
  e.width = E;
  e.height = T;
  u.viewport(0, 0, E, T);
  u.uniform2f(h.uRes, E, T);
  const _ = new IntersectionObserver(e => {
    const t = x;
    x = e[0].isIntersecting;
    if (t !== x) {
      for (let e = 0; e < P.length; e++) {
        const t = P[e];
        if (t.type === "video") {
          if (x) {
            if (t.el.paused) {
              t.el.play().catch(() => {});
            }
          } else if (!t.el.paused) {
            t.el.pause();
          }
        }
      }
      if (x) {
        D();
      } else {
        if (S) {
          cancelAnimationFrame(S);
        }
        S = null;
      }
    }
  }, {
    threshold: 0.01,
    rootMargin: "20% 0px 20% 0px"
  });
  _.observe(e);
  const O = () => {
    const e = u.createTexture();
    u.bindTexture(u.TEXTURE_2D, e);
    u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_S, u.CLAMP_TO_EDGE);
    u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_T, u.CLAMP_TO_EDGE);
    u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MIN_FILTER, u.LINEAR);
    u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MAG_FILTER, u.LINEAR);
    return e;
  };
  const L = e => new Promise(t => {
    const o = new Image();
    o.crossOrigin = "anonymous";
    o.decoding = "async";
    let n = false;
    o.onload = () => {
      const n = O();
      u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, o);
      t({
        type: "image",
        el: o,
        tex: n,
        config: e.config || {},
        width: o.width,
        height: o.height
      });
    };
    o.onerror = () => {
      if (!n) {
        n = true;
        o.crossOrigin = null;
        o.src = e.src;
        return;
      }
      t(null);
    };
    o.src = e.src;
  });
  const M = () => Promise.all(t.map(e => e.type === "image" ? L(e) : I(e))).then(e => e.filter(Boolean));
  const $ = (e, t) => {
    const o = [];
    if (Array.isArray(t.sources)) {
      o.push(...t.sources.filter(e => e?.src).map(e => ({
        src: e.src,
        type: e.type || ""
      })));
    } else if (t.src) {
      const e = t.src.includes(".webm");
      const n = t.src.includes(".mp4") ? "video/mp4" : e ? "video/webm" : "";
      if (e) {
        const e = t.src.replace(/\.webm(\?.*)?$/i, ".mp4$1");
        if (e !== t.src) {
          o.push({
            src: e,
            type: "video/mp4"
          });
        }
      }
      o.push({
        src: t.src,
        type: n
      });
    }
    e.innerHTML = "";
    o.forEach(({
      src: t,
      type: o
    }) => {
      const n = document.createElement("source");
      n.src = t;
      if (o) {
        n.type = o;
      }
      e.appendChild(n);
    });
  };
  const I = e => new Promise(t => {
    const o = document.createElement("video");
    o.crossOrigin = "anonymous";
    o.muted = true;
    o.autoplay = false;
    o.loop = e.loop !== false;
    o.playsInline = true;
    o.preload = "auto";
    ["muted", "playsinline", "webkit-playsinline"].forEach(e => o.setAttribute(e, ""));
    $(o, e);
    const n = O();
    let i = false;
    const r = {
      type: "video",
      el: o,
      tex: n,
      config: e.config || {},
      isReady: () => i,
      width: 1920,
      height: 1080,
      lastVideoTime: -1
    };
    const a = () => {
      if (!i && o.readyState >= o.HAVE_CURRENT_DATA) {
        i = true;
        r.width = o.videoWidth || 1920;
        r.height = o.videoHeight || 1080;
        u.bindTexture(u.TEXTURE_2D, n);
        u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, o);
        if (x) {
          o.play().catch(() => {});
        }
        t(r);
      }
    };
    const s = () => {
      if (!i) {
        i = true;
        t(r);
      }
    };
    o.addEventListener("loadeddata", a);
    o.addEventListener("canplay", a);
    o.addEventListener("error", s);
    o.load();
    setTimeout(() => {
      if (!i) {
        i = true;
        t(r);
      }
    }, 5000);
  });
  const C = e => {
    if (!e.isReady() || e.el.readyState < e.el.HAVE_CURRENT_DATA) {
      return;
    }
    const t = e.el.currentTime;
    if (t !== e.lastVideoTime) {
      e.lastVideoTime = t;
      try {
        u.texSubImage2D(u.TEXTURE_2D, 0, 0, 0, u.RGBA, u.UNSIGNED_BYTE, e.el);
      } catch (t) {
        try {
          u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, e.el);
        } catch (e) {}
      }
    }
  };
  const R = e => {
    const t = e.config;
    u.bindTexture(u.TEXTURE_2D, e.tex);
    if (e.type === "video") {
      C(e);
    }
    const o = e.type === "video" ? e.el.videoWidth || 1920 : e.width;
    const n = e.type === "video" ? e.el.videoHeight || 1080 : e.height;
    if (b[0] !== o || b[1] !== n) {
      b[0] = o;
      b[1] = n;
      u.uniform2f(h.uTexSize, o, n);
    }
    const i = t.xSquares !== undefined ? t.xSquares : a.xSquares;
    const r = t.ySquares !== undefined ? t.ySquares : a.ySquares;
    if (b[2] !== i || b[3] !== r) {
      b[2] = i;
      b[3] = r;
      u.uniform2f(h.uGrid, i, r);
    }
    const s = c(t.x !== undefined ? t.x : a.x, E);
    const l = c(t.y !== undefined ? t.y : a.y, T);
    const d = c(t.width !== undefined ? t.width : a.width, E);
    const g = c(t.height !== undefined ? t.height : a.height, T);
    const p = d / i;
    const m = c(t.minSquareWidth !== undefined ? t.minSquareWidth : a.minSquareWidth, p);
    const y = c(t.maxSquareWidth !== undefined ? t.maxSquareWidth : a.maxSquareWidth, p);
    if (b[4] !== m || b[5] !== y) {
      b[4] = m;
      b[5] = y;
      u.uniform1f(h.uMinW, m);
      u.uniform1f(h.uMaxW, y);
    }
    const f = t.threshold !== undefined ? t.threshold : a.threshold;
    const v = t.gamma !== undefined ? t.gamma : a.gamma;
    const S = t.blackPoint !== undefined ? t.blackPoint : a.blackPoint;
    const w = t.whitePoint !== undefined ? t.whitePoint : a.whitePoint;
    const x = t.bgOpacity !== undefined ? t.bgOpacity : a.bgOpacity;
    const P = t.fillOpacity !== undefined ? t.fillOpacity : a.fillOpacity;
    if (b[6] !== f) {
      b[6] = f;
      u.uniform1f(h.uThr, f);
    }
    if (b[7] !== v) {
      b[7] = v;
      u.uniform1f(h.uGam, v);
    }
    if (b[8] !== S) {
      b[8] = S;
      u.uniform1f(h.uBP, S);
    }
    if (b[9] !== w) {
      b[9] = w;
      u.uniform1f(h.uWP, w);
    }
    if (b[10] !== x) {
      b[10] = x;
      u.uniform1f(h.uBgOpacity, x);
    }
    if (b[11] !== P) {
      b[11] = P;
      u.uniform1f(h.uFillOpacity, P);
    }
    const k = T - l - g;
    const q = s + d;
    const A = k + g;
    if (b[12] !== s || b[13] !== k || b[14] !== q || b[15] !== A) {
      b[12] = s;
      b[13] = k;
      b[14] = q;
      b[15] = A;
      u.uniform4f(h.uBounds, s, k, q, A);
    }
    u.drawArrays(u.TRIANGLE_STRIP, 0, 4);
  };
  const W = () => {
    if (P.length && x) {
      u.clearColor(0, 0, 0, 0);
      u.clear(u.COLOR_BUFFER_BIT);
      b.fill(NaN);
      for (let e = 0; e < P.length; e++) {
        const t = P[e];
        if (t.type !== "video" || t.isReady()) {
          R(t, e);
        }
      }
    }
  };
  const F = e => {
    if (e - w >= r) {
      w = e;
      if (x) {
        W();
      }
    }
    S = requestAnimationFrame(F);
  };
  const D = () => {
    if (S) {
      cancelAnimationFrame(S);
    }
    w = 0;
    S = requestAnimationFrame(F);
  };
  return {
    destroy: () => {
      if (S) {
        cancelAnimationFrame(S);
      }
      q.disconnect();
      _.disconnect();
      for (let e = 0; e < P.length; e++) {
        const t = P[e];
        if (t.tex) {
          u.deleteTexture(t.tex);
        }
        if (t.type === "video") {
          t.el.pause();
          t.el.removeAttribute("src");
          t.el.innerHTML = "";
          t.el.load();
        }
      }
      u.deleteBuffer(f.position);
      u.deleteBuffer(f.texCoord);
      u.deleteProgram(m);
      P = [];
    },
    loaded: M().then(e => {
      P = e;
      D();
    })
  };
}
function initSceneManager() {
  function e(e, t) {
    const o = document.querySelectorAll(e);
    if (o.length) {
      o.forEach((o, n) => {
        const a = o.dataset.sceneId || `${e}-${n}`;
        o.dataset.sceneId = a;
        const s = t(o);
        i.set(a, s);
        if (s?.loaded) {
          r.push(s.loaded);
        }
      });
    }
  }
  function t(e) {
    const t = r.length;
    if (!t) {
      return;
    }
    let o = 0;
    r.forEach(n => {
      n.then(() => e(++o, t));
    });
  }
  function o() {
    return Promise.all(r);
  }
  function n() {
    i.forEach(e => {
      if (e?.destroy) {
        e.destroy();
      }
    });
    i.clear();
  }
  const i = new Map();
  const r = [];
  return {
    init: e,
    destroy: n,
    ready: o,
    progress: t
  };
}
function initSceneHeroOver() {
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint;
  const o = t ? 33.33 : 66.66;
  e.init("[data-intro-over-scene]", e => {
    const n = [{
      type: "image",
      src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697bfe61104a60fa63e1f7b2_19804f2b1c9ceedd0cd04ed721b36ef6_intro_mauntain.avif",
      config: {
        x: "0%",
        y: "40%",
        width: "100%",
        height: "60%",
        blackPoint: 25,
        whitePoint: 200,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "image",
      src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697e2b5ea694ae5f751655ec_95efa55632b52e963bc2cbf7f0447122_hero_hay.avif",
      config: {
        x: "56%",
        y: "66%",
        width: "14%",
        height: "12%",
        blackPoint: 25,
        whitePoint: 200,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      skip: !t,
      sources: [{
        src: "https://assets.sondaven.com/scenes/hero_tree-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "70%",
        y: "42%",
        width: "43.5%",
        height: "52%",
        blackPoint: 55,
        whitePoint: 175,
        threshold: 255,
        ySquares: 100,
        xSquares: 150,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/hero_sheeps-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "0%",
        y: "72%",
        width: "72%",
        height: "32%",
        blackPoint: 15,
        whitePoint: 255,
        threshold: 255,
        ySquares: 150,
        xSquares: 200,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      skip: !t,
      sources: [{
        src: "https://assets.sondaven.com/scenes/claudes_02.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "5%",
        y: "25%",
        width: "65%",
        height: "45vw",
        blackPoint: 25,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_04.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: o * -1 + "%",
        y: "30%",
        width: `${o}%`,
        height: `${o}vw`,
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const i = initCanvasEffect(e, n.filter(e => !e.skip));
    const r = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "50% bottom",
        end: "bottom top",
        scrub: true
      }
    }).to(n[0].config, {
      blackPoint: 45,
      whitePoint: 175,
      ease: "none"
    }, 0).to(n[1].config, {
      blackPoint: 75,
      whitePoint: 150,
      ease: "none"
    }, 0);
    const a = t ? gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom 50%",
        scrub: true
      }
    }).to(n[4].config, {
      x: "-30%",
      ease: "none"
    }, 0) : null;
    const s = gsap.timeline({
      paused: true
    }).to(n[5].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      delay: 5,
      repeat: -1,
      repeatDelay: 5
    }, 0);
    const c = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (s.paused()) {
            s.play();
          }
        } else if (!s.paused()) {
          s.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    c.observe(e);
    return {
      destroy: () => {
        r.scrollTrigger?.kill();
        r.kill();
        a?.scrollTrigger?.kill();
        a?.kill();
        s.kill();
        c.disconnect();
        i?.destroy();
      },
      loaded: i?.loaded
    };
  });
}
function initSceneHeroBg() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-intro-bg-scene]", e => {
    const t = [{
      type: "image",
      src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697c00f3737120e569370c7a_98c738340828600251b32ef432d3de26_hero_mauntain-bg.avif",
      config: {
        x: "0%",
        y: "45%",
        width: "100%",
        height: "60%",
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/claudes_03.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "30%",
        y: "0%",
        width: "65%",
        height: "45vw",
        blackPoint: 25,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "-33.33%",
        y: "0%",
        width: "33.33%",
        height: "33.33vw",
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const o = initCanvasEffect(e, t);
    const n = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom 50%",
        scrub: true
      }
    }).to(t[1].config, {
      x: "60%",
      ease: "none"
    }, 0);
    const i = gsap.timeline({
      paused: true
    }).to(t[2].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5
    }, 0);
    const r = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (i.paused()) {
            i.play();
          }
        } else if (!i.paused()) {
          i.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    r.observe(e);
    return {
      destroy: () => {
        n.scrollTrigger?.kill();
        n.kill();
        i.kill();
        r.disconnect();
        o?.destroy();
      },
      loaded: o?.loaded
    };
  });
}
function initSceneProlog() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  const e = {
    desk: {
      width: 44,
      leftX: -14,
      rightX: 70
    },
    mob: {
      width: 88,
      leftX: -25.5,
      rightX: 37.5
    }
  };
  const t = () => window.innerWidth >= breakPoint;
  const o = () => t() ? e.desk.width : e.mob.width;
  const n = () => t() ? e.desk.leftX : e.mob.leftX;
  const i = () => t() ? e.desk.rightX : e.mob.rightX;
  globalSceneManager.init("[data-prolog-scene]", e => initCanvasEffect(e, [{
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/prolog-l-c.mp4",
      type: "video/mp4"
    }],
    loop: false,
    config: {
      x: `${n()}%`,
      y: "3%",
      width: `${o()}%`,
      height: "96%",
      blackPoint: 200,
      whitePoint: 25,
      threshold: 255,
      ySquares: 150,
      xSquares: 125,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }, {
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/prolog-r-c.mp4",
      type: "video/mp4"
    }],
    loop: false,
    config: {
      x: `${i()}%`,
      y: "3%",
      width: `${o()}%`,
      height: "96%",
      blackPoint: 200,
      whitePoint: 25,
      threshold: 255,
      ySquares: 150,
      xSquares: 125,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }]));
}
function initSceneAbout() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-about-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "10%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/about_stork-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "45%",
        y: "65%",
        width: "40%",
        height: "36vw",
        blackPoint: 160,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const n = gsap.timeline({
      paused: true
    }).to(o[0].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5
    }).to(o[1].config, {
      x: "-40%",
      y: "0%",
      duration: 6,
      ease: "none",
      delay: 4,
      repeat: -1,
      repeatDelay: 6
    }, "<");
    const i = initCanvasEffect(e, o);
    const r = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (n.paused()) {
            n.play();
          }
        } else if (!n.paused()) {
          n.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    r.observe(e);
    return {
      destroy: () => {
        n.kill();
        r.disconnect();
        i?.destroy();
      },
      loaded: i?.loaded
    };
  });
}
function initSceneSeasons() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-seasons-scene]", e => {
    const t = e.closest("[data-tabs-text]");
    if (!t) {
      return;
    }
    const o = t.querySelector("[data-tab-trigger=\"summer\"]");
    const n = t.querySelector("[data-tab-trigger=\"winter\"]");
    const i = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/seasons_summer.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "16%",
        y: "0%",
        width: "84%",
        height: "100%",
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 0
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/seasons_winter.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "4%",
        y: "-8%",
        width: "50%",
        height: "100%",
        blackPoint: 0,
        whitePoint: 1,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 0
      }
    }];
    const r = initCanvasEffect(e, i);
    const a = () => {
      gsap.to(i[0].config, {
        blackPoint: 0,
        whitePoint: 255,
        duration: durL
      });
      gsap.to(i[1].config, {
        blackPoint: 254,
        whitePoint: 255,
        duration: durL
      });
    };
    const s = () => {
      gsap.to(i[0].config, {
        blackPoint: 254,
        whitePoint: 255,
        duration: durL
      });
      gsap.to(i[1].config, {
        blackPoint: 25,
        whitePoint: 150,
        duration: durL
      });
    };
    const c = () => {
      if (o?.classList.contains("is-active")) {
        a();
      } else if (n?.classList.contains("is-active")) {
        s();
      }
    };
    o.addEventListener("click", a);
    n.addEventListener("click", s);
    c();
    return {
      destroy: () => {
        o.removeEventListener("click", a);
        n.removeEventListener("click", s);
        r?.destroy();
      },
      loaded: r?.loaded
    };
  });
}
function initSceneBenefitsIntro() {
  if (!globalSceneManager) {
    return;
  }
  const e = {
    desk: {
      initial: 128,
      final: 189.44
    },
    mob: {
      initial: 100,
      final: 156
    }
  };
  const t = {
    desk: {
      initial: 30,
      final: 230
    },
    mob: {
      initial: 15,
      final: 215
    }
  };
  const o = () => window.innerWidth >= breakPoint;
  const n = () => o() ? e.desk.initial : e.mob.initial;
  const i = () => o() ? e.desk.final : e.mob.final;
  const r = () => o() ? t.desk.initial : t.mob.initial;
  const a = () => o() ? t.desk.final : t.mob.final;
  globalSceneManager.init("[data-benefits-intro-scene]", e => {
    const t = [{
      type: "image",
      src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697656035b94c920c471d4de_ac179cd8d062e41260b178efc691b568_benefits-intro_hole.avif",
      config: {
        x: "0%",
        y: "0%",
        width: "100%",
        height: `${n()}%`,
        gamma: 1,
        blackPoint: 10,
        whitePoint: 225,
        threshold: 255,
        bgOpacity: 0,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/benefits-intro_persons-cc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: `${r()}%`,
        y: "10%",
        width: "81%",
        height: "116%",
        blackPoint: 25,
        whitePoint: 200,
        threshold: 255,
        ySquares: 136,
        xSquares: 136,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/benefits-intro_birds-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "-4%",
        y: "40%",
        width: "60%",
        height: "72%",
        blackPoint: 255,
        whitePoint: 75,
        threshold: 255,
        ySquares: 136,
        xSquares: 136,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const o = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "bottom bottom",
        end: "bottom -50%",
        scrub: true,
        onRefresh: e => {
          if (e.progress > 0) {
            o.progress(e.progress);
          }
        },
        invalidateOnRefresh: true
      }
    }).to(t[0].config, {
      x: "-25%",
      y: "-30%",
      width: "148%",
      height: `${i()}%`,
      blackPoint: 0,
      whitePoint: 1,
      ease: "InOut"
    }, 0).to(t[1].config, {
      x: `${a()}%`,
      y: "-50%",
      width: "324%",
      height: "464%",
      ease: "In"
    }, "<").to(t[2].config, {
      x: "-204%",
      y: "-20%",
      width: "240%",
      height: "288%",
      ease: "In"
    }, "<");
    const s = initCanvasEffect(e, t);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return {
      destroy: () => {
        o.scrollTrigger?.kill();
        o.kill();
        s?.destroy();
      },
      loaded: s?.loaded
    };
  });
}
function initSceneBenefitsOutro() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-benefits-outro-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/benefits-outro_sheeps.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "-8%",
        y: "55%",
        width: "68%",
        height: "50%",
        blackPoint: 256,
        whitePoint: 255,
        threshold: 255,
        xSquares: 150,
        ySquares: 50,
        bgOpacity: 0,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_05-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "-5%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 256,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 0,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/benefits-outro_tree-c.mp4",
        type: "video/mp4"
      }],
      loop: false,
      config: {
        x: "35%",
        y: "-25%",
        width: "76%",
        height: "96%",
        blackPoint: -1,
        whitePoint: 0,
        threshold: 255,
        xSquares: 150,
        ySquares: 100,
        bgOpacity: 0,
        fillOpacity: 1
      }
    }];
    const n = initCanvasEffect(e, o);
    const i = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    }).to(o[0].config, {
      blackPoint: 150,
      whitePoint: 0,
      ease: "none"
    }, 0).to(o[1].config, {
      blackPoint: 200,
      whitePoint: 55,
      ease: "none"
    }, 0).to(o[2].config, {
      blackPoint: 55,
      whitePoint: 200,
      ease: "none"
    }, 0);
    let r = null;
    const a = document.querySelector(".benefits-s_cms");
    if (a) {
      r = gsap.timeline({
        scrollTrigger: {
          trigger: a,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }).to(o[0].config, {
        x: "-18%",
        y: "30%",
        ease: "In"
      }, 0).to(o[2].config, {
        x: "50%",
        y: "-100%",
        ease: "In"
      }, 0);
    }
    const s = gsap.timeline({
      paused: true
    }).to(o[1].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5
    }, 0);
    const c = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (s.paused()) {
            s.play();
          }
        } else if (!s.paused()) {
          s.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    c.observe(e);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return {
      destroy: () => {
        i.scrollTrigger?.kill();
        i.kill();
        if (r) {
          r.scrollTrigger?.kill();
          r.kill();
        }
        s.kill();
        c.disconnect();
        n?.destroy();
      },
      loaded: n?.loaded
    };
  });
}
function initSceneFin() {
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-fin-scene]", e => initCanvasEffect(e, [{
    type: "image",
    src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/69ca6aa1e460a649ef2a7972_fin_mounain.avif",
    config: {
      x: "0%",
      y: "0%",
      width: "80%",
      height: "100%",
      blackPoint: 200,
      whitePoint: 75,
      threshold: 255,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }]));
}
function initSceneDevOver() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-dev-over-scene]", e => {
    const t = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/claudes_01.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "30%",
        y: "0%",
        width: "65%",
        height: "45vw",
        blackPoint: 25,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const o = initCanvasEffect(e, t);
    const n = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    }).to(t[0].config, {
      x: "60%",
      ease: "none"
    });
    return {
      destroy: () => {
        n.scrollTrigger?.kill();
        n.kill();
        o?.destroy();
      },
      loaded: o?.loaded
    };
  });
}
function initSceneDevBg() {
  if (window.innerWidth < breakPoint) {
    return;
  }
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-dev-bg-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/claudes_02.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "5%",
        y: "35%",
        width: "65%",
        height: "45vw",
        blackPoint: 25,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "5%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "50%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_04.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "80%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const n = initCanvasEffect(e, o);
    const i = gsap.timeline({
      scrollTrigger: {
        trigger: e,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    }).to(o[0].config, {
      x: "-30%",
      ease: "none"
    });
    const r = gsap.timeline({
      paused: true
    }).to(o[1].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5
    }, "<").to(o[3].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      repeat: -1,
      repeatDelay: 5
    }, "<").to(o[2].config, {
      x: "100%",
      duration: 5,
      ease: "none",
      delay: 5,
      repeat: -1,
      repeatDelay: 5
    }, "<");
    const a = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (r.paused()) {
            r.play();
          }
        } else if (!r.paused()) {
          r.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    a.observe(e);
    return {
      destroy: () => {
        i.scrollTrigger?.kill();
        i.kill();
        r.kill();
        a.disconnect();
        n?.destroy();
      },
      loaded: n?.loaded
    };
  });
}
function initSceneFactoid() {
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-factoid-scene]", e => initCanvasEffect(e, [{
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/factoids_river-c.mp4",
      type: "video/mp4"
    }],
    config: {
      x: "0%",
      y: "0%",
      width: "100%",
      height: "100%",
      blackPoint: 75,
      whitePoint: 175,
      threshold: 255,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }, {
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/factoids_sheeps-c.mp4",
      type: "video/mp4"
    }],
    config: {
      x: "15%",
      y: "15%",
      width: "60%",
      height: "40%",
      blackPoint: 25,
      whitePoint: 255,
      threshold: 255,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }, {
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/factoids_person-cc.mp4",
      type: "video/mp4"
    }],
    config: {
      x: "32.5%",
      y: "32.5%",
      width: "35%",
      height: "50%",
      blackPoint: 25,
      whitePoint: 225,
      threshold: 255,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }]));
}
function initSceneFaq() {
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-faq-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "0%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "55%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const n = initCanvasEffect(e, o);
    const i = gsap.timeline({
      paused: true,
      repeat: -1
    }).to(o[0].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to(o[1].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to({}, {
      duration: 5
    });
    const r = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (i.paused()) {
            i.play();
          }
        } else if (!i.paused()) {
          i.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    r.observe(e);
    return {
      destroy: () => {
        i.kill();
        r.disconnect();
        n?.destroy();
      },
      loaded: n?.loaded
    };
  });
}
function initSceneFooter() {
  if (!globalSceneManager) {
    return;
  }
  globalSceneManager.init("[data-footer-scene]", e => initCanvasEffect(e, [{
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/footer_mountain.hevc.mp4",
      type: "video/mp4"
    }],
    config: {
      x: "0%",
      y: "67.5%",
      width: "100%",
      height: "32.5%",
      blackPoint: 240,
      whitePoint: 50,
      threshold: 255,
      bgOpacity: 1,
      fillOpacity: 0
    }
  }, {
    type: "video",
    sources: [{
      src: "https://assets.sondaven.com/scenes/footer_sheeps-c.mp4",
      type: "video/mp4"
    }],
    config: {
      x: "30%",
      y: "5%",
      width: "40%",
      height: "95%",
      blackPoint: 0,
      whitePoint: 215,
      threshold: 255,
      ySquares: 125,
      xSquares: 150,
      bgOpacity: 1,
      fillOpacity: 1
    }
  }]));
}
function initSceneArticleDark() {
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-article-dark-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "0%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "55%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const n = initCanvasEffect(e, o);
    const i = gsap.timeline({
      paused: true,
      repeat: -1
    }).to(o[0].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to(o[1].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to({}, {
      duration: 10
    });
    const r = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (i.paused()) {
            i.play();
          }
        } else if (!i.paused()) {
          i.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    r.observe(e);
    return {
      destroy: () => {
        i.kill();
        r.disconnect();
        n?.destroy();
      },
      loaded: n?.loaded
    };
  });
}
function initSceneArticleLight() {
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint ? 33.33 : 100;
  e.init("[data-article-light-scene]", e => {
    const o = [{
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "0%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: t * -1 + "%",
        y: "55%",
        width: `${t}%`,
        height: `${t}vw`,
        blackPoint: 255,
        whitePoint: 0,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const n = initCanvasEffect(e, o);
    const i = gsap.timeline({
      paused: true,
      repeat: -1
    }).to(o[0].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to(o[1].config, {
      x: "100%",
      duration: window.innerWidth >= breakPoint ? 5 : 2.5,
      ease: "none"
    }).to({}, {
      duration: 10
    });
    const r = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (i.paused()) {
            i.play();
          }
        } else if (!i.paused()) {
          i.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    r.observe(e);
    return {
      destroy: () => {
        i.kill();
        r.disconnect();
        n?.destroy();
      },
      loaded: n?.loaded
    };
  });
}
function initSceneError() {
  if (!globalSceneManager) {
    return;
  }
  const e = globalSceneManager;
  const t = window.innerWidth >= breakPoint;
  const o = t ? 33.33 : 100;
  e.init("[data-error-scene]", e => {
    const n = [{
      type: "image",
      src: "https://cdn.prod.website-files.com/6940a0abd735a1e3a640d042/697eaab2cfc366a5bf4bd727_f73b5dcc1687f5e65745b9063965659a_error_bg.avif",
      config: {
        x: "-8.5%",
        y: "-22.5%",
        width: "120%",
        height: "125%",
        blackPoint: 75,
        whitePoint: 150,
        threshold: 255,
        bgOpacity: 0,
        fillOpacity: 1
      }
    }, {
      type: "video",
      skip: !t,
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_03.hevc.mp4",
        type: "video/mp4"
      }],
      config: {
        x: o * -1 + "%",
        y: "0%",
        width: `${o}%`,
        height: `${o}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 0
      }
    }, {
      type: "video",
      skip: !t,
      sources: [{
        src: "https://assets.sondaven.com/scenes/birds_02-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: o * -1 + "%",
        y: "25%",
        width: `${o}%`,
        height: `${o}vw`,
        blackPoint: 0,
        whitePoint: 255,
        threshold: 255,
        bgOpacity: 1,
        fillOpacity: 0
      }
    }, {
      type: "video",
      sources: [{
        src: "https://assets.sondaven.com/scenes/factoids_sheeps-c.mp4",
        type: "video/mp4"
      }],
      config: {
        x: "-5%",
        y: "40%",
        width: "100%",
        height: "75%",
        blackPoint: 225,
        whitePoint: 25,
        threshold: 255,
        xSquares: 150,
        ySquares: 100,
        bgOpacity: 1,
        fillOpacity: 1
      }
    }];
    const i = initCanvasEffect(e, n.filter(e => !e.skip));
    const r = gsap.timeline({
      paused: true
    }).to(n[0].config, {
      blackPoint: 55,
      whitePoint: 150,
      duration: 4,
      ease: "InOut",
      repeat: -1,
      yoyo: true
    }, 0);
    if (t) {
      r.to(n[1].config, {
        x: "100%",
        duration: 5,
        ease: "none",
        repeat: -1,
        repeatDelay: 5
      }, 0).to(n[2].config, {
        x: "100%",
        duration: 5,
        ease: "none",
        delay: 5,
        repeat: -1,
        repeatDelay: 5
      }, 0);
    }
    const a = new IntersectionObserver(e => {
      e.forEach(e => {
        if (e.isIntersecting) {
          if (r.paused()) {
            r.play();
          }
        } else if (!r.paused()) {
          r.pause();
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: "20% 0px 20% 0px"
    });
    a.observe(e);
    return {
      destroy: () => {
        r.kill();
        a.disconnect();
        i?.destroy();
      },
      loaded: i?.loaded
    };
  });
}
gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, Flip);
gsap.config({
  nullTargetWarn: false
});
let lenis = null;
let breakPoint = 992;
let resizeTimeout = null;
let globalSceneManager = null;
let durS = 0.4;
let durM = 0.8;
let durL = 1.2;
let stagger = 0.1;
let delayReveal = 0.2;
CustomEase.create("InOut", "0.76,0,0.24,1");
CustomEase.create("Out", "0.25,1,0.5,1");
CustomEase.create("In", "0.5,0,0.75,0");
CustomEase.create("Ease", "0.25,0.1,0.25,1");
CustomEase.create("Write", "0.333,0,0.667,1");
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh(true);
    initTabsHilight();
  }, 40);
});
const hour = new Date().getHours();
const isDayTime = hour >= 7 && hour < 24;
const canvas = document.querySelector("[data-scroll-video]");
const mobImg = document.querySelector("[data-hero-img]");
if (canvas) {
  canvas.classList.remove(isDayTime ? "dark" : "light");
  canvas.classList.add(isDayTime ? "light" : "dark");
}
if (mobImg) {
  mobImg.classList.remove(isDayTime ? "dark" : "light");
  mobImg.classList.add(isDayTime ? "light" : "dark");
}
const framesPromise = window.innerWidth >= breakPoint ? Promise.all(Array.from({
  length: 120
}, (e, t) => {
  const o = `https://assets.sondaven.com/hero-video-new/${String(t).padStart(3, "0")}.webp`;
  return new Promise(e => {
    const t = new Image();
    t.src = o;
    t.onload = () => e(t);
    t.onerror = () => e(null);
  });
})) : Promise.resolve(null);
initPreloader();