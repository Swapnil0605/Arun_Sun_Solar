/* =========================================
   Arun Sun Solar FINAL CTA
   Quote-page image sweep transition
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const ctaCard = document.querySelector(".final-cta-content");
    const quoteButton = document.querySelector("[data-quote-transition]");

    if (!ctaCard) return;

    /* Mouse-follow glow / subtle tilt */
    ctaCard.addEventListener("mousemove", function (event) {
        if (document.body.classList.contains("quote-transition-active")) return;

        const rect = ctaCard.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -1.2;
        const rotateY = ((x - centerX) / centerX) * 1.2;

        ctaCard.style.transform = `translateY(-4px) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    ctaCard.addEventListener("mouseleave", function () {
        if (document.body.classList.contains("quote-transition-active")) return;
        ctaCard.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });

    /* Click -> image sweeps right to left -> quote page */
    if (quoteButton) {
        quoteButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (document.body.classList.contains("quote-transition-active")) return;

            document.body.classList.add("quote-transition-active");
            sessionStorage.setItem("quoteTransitionArrival", "1");

            window.setTimeout(function () {
                window.location.href = quoteButton.getAttribute("href");
            }, 1120);
        });
    }
});
