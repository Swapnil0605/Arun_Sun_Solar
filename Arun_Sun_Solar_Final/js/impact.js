/* =========================================
   Arun Sun Solar IMPACT ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const impactSection = document.querySelector(".impact");
    const impactNumbers = document.querySelectorAll(".impact-stat h3");
    const impactStats = document.querySelectorAll(".impact-stat");

    if (!impactSection || impactNumbers.length === 0) {
        return;
    }


    /* =========================================
       COUNT UP ANIMATION
    ========================================= */

    let hasAnimated = false;

    const observer = new IntersectionObserver(
        function (entries) {

            if (entries[0].isIntersecting && !hasAnimated) {

                hasAnimated = true;

                impactNumbers.forEach(function (element) {

                    const finalText = element.textContent.trim();

                    animateNumber(element, finalText);

                });

                observer.disconnect();
            }

        },
        {
            threshold: 0.3
        }
    );


    observer.observe(impactSection);


    /* =========================================
       ANIMATE NUMBER
    ========================================= */

    function animateNumber(element, finalText) {

        const numberMatch = finalText.match(/[\d.]+/);

        if (!numberMatch) {
            return;
        }

        const targetNumber = parseFloat(numberMatch[0]);

        const suffix = finalText
            .replace(numberMatch[0], "")
            .trim();

        const duration = 1500;

        let startTime = null;


        function update(currentTime) {

            if (!startTime) {
                startTime = currentTime;
            }

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );


            /* Smooth animation */

            const easedProgress =
                1 - Math.pow(1 - progress, 3);


            const currentNumber =
                targetNumber * easedProgress;


            if (targetNumber % 1 !== 0) {

                element.textContent =
                    currentNumber.toFixed(1) +
                    (suffix ? " " + suffix : "");

            } else {

                element.textContent =
                    Math.floor(currentNumber) +
                    suffix;
            }


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent = finalText;
            }
        }


        requestAnimationFrame(update);
    }


    /* =========================================
       STAT HOVER EFFECT
    ========================================= */

    impactStats.forEach(function (stat) {

        stat.addEventListener("mouseenter", function () {

            impactStats.forEach(function (otherStat) {
                otherStat.classList.remove("impact-active");
            });

            stat.classList.add("impact-active");

        });


        stat.addEventListener("mouseleave", function () {

            stat.classList.remove("impact-active");

        });

    });

});