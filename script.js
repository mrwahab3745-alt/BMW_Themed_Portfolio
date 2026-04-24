/*
  BMW-inspired portfolio interactions:
  - Mobile menu toggle
  - Smooth section link behavior
  - Scroll reveal (IntersectionObserver)
  - Progress bar fill when visible
  - Contact form UX (client-side only)
*/

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (!toggle || !mobileNav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav.hidden = !open;
  };

  setOpen(false);

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!expanded);
  });

  mobileNav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initSmoothAnchors() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initReveal() {
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealEls.length === 0) return;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    initBars(true);
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");

        // Trigger bar animation when any bar enters view.
        if (entry.target.querySelector?.(".bar-fill")) initBars(false);

        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => obs.observe(el));
}

function initBars(force) {
  const fills = Array.from(document.querySelectorAll(".bar-fill"));
  if (fills.length === 0) return;

  fills.forEach((fill) => {
    const raw = fill.getAttribute("data-level");
    const level = clamp(Number(raw ?? 0), 0, 100);

    if (force) {
      fill.style.transition = "none";
      fill.style.width = `${level}%`;
      // Re-enable transitions for future recalcs.
      requestAnimationFrame(() => {
        fill.style.transition = "";
      });
      return;
    }

    // Only animate once.
    if (fill.dataset.animated === "true") return;
    fill.dataset.animated = "true";

    requestAnimationFrame(() => {
      fill.style.width = `${level}%`;
    });
  });
}

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const note = form.querySelector(".form-note");
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (note) note.textContent = "Ignition on… message prepared. (Wire this to your backend/email next.)";
    if (button) {
      button.disabled = true;
      button.textContent = "Sent";
      setTimeout(() => {
        button.disabled = false;
        button.textContent = "Send Message";
      }, 1600);
    }

    form.reset();
  });
}

initYear();
initMobileNav();
initSmoothAnchors();
initReveal();
initContactForm();

