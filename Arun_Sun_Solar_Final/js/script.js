/* Hero interactions: static image + animated achievement counters. */

(function () {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animateCounter = (element) => {
        const target = Number(element.dataset.target || 0);
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = `${prefix}${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const stats = document.querySelector('.hero-stats');
    if (!stats || !('IntersectionObserver' in window)) {
        counters.forEach(animateCounter);
        return;
    }

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        if (hasAnimated) return;
        if (entries.some((entry) => entry.isIntersecting)) {
            hasAnimated = true;
            counters.forEach(animateCounter);
            observer.disconnect();
        }
    }, { threshold: 0.25 });

    observer.observe(stats);
})();

/* Continuous Hero Slideshow */
(function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .hero-slide');
    if (!slides || slides.length <= 1) return;

    let currentIndex = 0;
    const intervalTime = 4500; // changes slide every 4.5 seconds
    let timer = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        currentIndex = index;
    }

    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
    }

    function startTimer() {
        if (!timer) {
            timer = setInterval(nextSlide, intervalTime);
        }
    }

    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    startTimer();
})();

