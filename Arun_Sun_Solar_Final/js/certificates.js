document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".certificates-track");
    const modal = document.getElementById("certificate-modal");
    const modalImage = document.getElementById("certificate-modal-image");
    const modalTitle = document.getElementById("certificate-modal-title");
    const prevButton = document.querySelector(".certificate-modal-prev");
    const nextButton = document.querySelector(".certificate-modal-next");
    const closeButtons = document.querySelectorAll("[data-close-certificate]");

    if (!track || !modal || !modalImage || !modalTitle) return;

    // Keep the viewer above every section/stacking context.
    document.body.appendChild(modal);

    const cards = Array.from(track.querySelectorAll(".certificate-card"));
    if (!cards.length) return;

    const certificates = cards.map((card) => {
        const image = card.querySelector("img");
        const title = card.querySelector("h3");
        return {
            src: image ? image.getAttribute("src") : "",
            alt: image ? (image.getAttribute("alt") || "Arun Sun Solar certificate") : "Arun Sun Solar certificate",
            title: title ? title.textContent.trim() : "Certificate"
        };
    });

    let currentIndex = 0;

    function showCertificate(index) {
        currentIndex = (index + certificates.length) % certificates.length;
        const certificate = certificates[currentIndex];

        modalImage.src = certificate.src;
        modalImage.alt = certificate.alt;
        modalTitle.textContent = certificate.title;
    }

    function openModal(index) {
        showCertificate(index);
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("certificate-modal-open");
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("certificate-modal-open");
    }

    cards.forEach((card) => {
        const index = Number(card.dataset.certificate || 0);
        const button = card.querySelector(".certificate-view-button");

        if (button) {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                openModal(index);
            });
        }

        card.addEventListener("click", (event) => {
            if (event.target.closest(".certificate-view-button")) return;
            openModal(index);
        });

        card.addEventListener("keydown", (event) => {
            if (event.target.closest(".certificate-view-button")) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(index);
            }
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeModal);
    });

    prevButton?.addEventListener("click", (event) => {
        event.preventDefault();
        showCertificate(currentIndex - 1);
    });

    nextButton?.addEventListener("click", (event) => {
        event.preventDefault();
        showCertificate(currentIndex + 1);
    });

    document.addEventListener("keydown", (event) => {
        if (!modal.classList.contains("is-open")) return;

        if (event.key === "Escape") closeModal();
        if (event.key === "ArrowLeft") showCertificate(currentIndex - 1);
        if (event.key === "ArrowRight") showCertificate(currentIndex + 1);
    });
});
