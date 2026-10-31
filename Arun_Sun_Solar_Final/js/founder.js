/* =========================================
   FOUNDER PHOTO SLIDER
========================================= */

const founderSliderImage = document.querySelector("#founder-slider-image");
const founderSliderDots = document.querySelectorAll(".founder-slider-indicator span");

const founderPhotos = [
    "images/founder/founder-1.jpg",
    "images/founder/founder-2.jpg"
];

let founderPhotoIndex = 0;

function showFounderPhoto(index) {
    if (!founderSliderImage) return;

    founderSliderImage.classList.add("is-changing");

    setTimeout(() => {
        founderSliderImage.src = founderPhotos[index];
        founderSliderImage.classList.remove("is-changing");

        founderSliderDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });
    }, 350);
}

if (founderSliderImage && founderPhotos.length > 1) {
    setInterval(() => {
        founderPhotoIndex = (founderPhotoIndex + 1) % founderPhotos.length;
        showFounderPhoto(founderPhotoIndex);
    }, 4500);
}
