/* =========================================
   SCROLL REVEAL TRANSITIONS
   Reference behavior: content rises into place
   as the user scrolls down the page.
   Services are intentionally excluded.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const selectors = [
        ".about .about-content",
        ".about .about-details",

        ".founder .founder-image-wrapper",
        ".founder .founder-content",

        ".why-solar .why-solar-intro",
        ".why-solar .why-solar-cards-panel",
        ".why-solar .why-solar-person",

        ".home-projects-section .home-projects-header",
        ".home-projects-section .home-project-card",
        ".home-projects-section .home-projects-more",

        ".reviews .reviews-header",
        ".reviews .reviews-slider",
        ".reviews .reviews-dots",

        ".footer .footer-brand",
        ".footer .footer-column",
        ".footer .footer-bottom"
    ];

    const elements = selectors
        .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
        .filter((element, index, list) => list.indexOf(element) === index);

    if (!elements.length) return;

    /* Services are deliberately never selected above. */
    elements.forEach((element) => element.classList.add("scroll-reveal"));

    /* Respect reduced-motion preferences. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -7% 0px"
    });

    elements.forEach((element) => observer.observe(element));
});


/* =========================================
   HERO STATS
   Preserve the exact existing values while
   revealing their numbers smoothly on first view.
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const stats = document.querySelectorAll(".hero-reference-stat strong");
    if (!stats.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateStat = (element) => {
        if (reduceMotion || element.dataset.counted === "true") return;

        const original = element.textContent.trim();
        const match = original.match(/^([^\d]*)([\d,.]+)(.*)$/);
        if (!match) return;

        const prefix = match[1];
        const numericText = match[2];
        const suffix = match[3];
        const target = Number(numericText.replace(/,/g, ""));
        if (!Number.isFinite(target)) return;

        element.dataset.counted = "true";

        const start = performance.now();
        const duration = 1200;

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = `${prefix}${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                /* Restore the exact source value, including formatting. */
                element.textContent = original;
            }
        };

        requestAnimationFrame(tick);
    };

    const statsWrap = document.querySelector(".hero-reference-stats");
    if (!statsWrap || !("IntersectionObserver" in window)) {
        stats.forEach(animateStat);
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        stats.forEach(animateStat);
        revealObserver.disconnect();
    }, { threshold: 0.2 });

    observer.observe(statsWrap);
});
