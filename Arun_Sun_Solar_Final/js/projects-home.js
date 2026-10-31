document.addEventListener("DOMContentLoaded", () => {
    const viewport = document.querySelector(".home-projects-viewport");
    const track = document.querySelector(".home-projects-track");
    if (!viewport || !track) return;

    // Keep the original four cards as the first set, then duplicate them
    // so the marquee can move continuously from right to left.
    const originalCards = [...track.querySelectorAll(".home-project-card")];
    const projects = originalCards.map(card => ({
        title: card.querySelector("h3")?.textContent.trim() || "",
        image: card.querySelector("img")?.getAttribute("src") || "",
        alt: card.querySelector("img")?.getAttribute("alt") || ""
    }));

    const cloneFragment = document.createDocumentFragment();
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.removeAttribute("tabindex");
        clone.dataset.clone = "true";
        cloneFragment.appendChild(clone);
    });
    track.appendChild(cloneFragment);

    const modal = document.getElementById("home-project-modal");
    const modalImg = document.getElementById("home-project-modal-image");
    const modalTitle = document.getElementById("home-project-modal-title");
    const closeEls = modal?.querySelectorAll("[data-close-project]");
    const prev = modal?.querySelector(".home-project-modal-prev");
    const next = modal?.querySelector(".home-project-modal-next");

    let current = 0;
    let paused = false;
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let last = performance.now();

    function show(index) {
        current = (index + projects.length) % projects.length;
        const project = projects[current];
        if (modalImg) {
            modalImg.src = project.image;
            modalImg.alt = project.alt;
        }
        if (modalTitle) modalTitle.textContent = project.title;
    }

    function open(index) {
        show(index);
        modal?.classList.add("is-open");
        modal?.setAttribute("aria-hidden", "false");
        document.body.classList.add("home-project-modal-open");
        paused = true;
    }

    function close() {
        modal?.classList.remove("is-open");
        modal?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("home-project-modal-open");
        paused = false;
    }

    // Only original cards open the viewer; cloned cards are purely for the marquee.
    originalCards.forEach((card, index) => {
        card.querySelector(".home-project-view")?.addEventListener("click", event => {
            event.stopPropagation();
            if (!moved) open(index);
        });
        card.addEventListener("click", () => {
            if (!moved) open(index);
        });
    });

    closeEls?.forEach(element => element.addEventListener("click", close));
    prev?.addEventListener("click", () => show(current - 1));
    next?.addEventListener("click", () => show(current + 1));

    document.addEventListener("keydown", event => {
        if (!modal?.classList.contains("is-open")) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight") show(current + 1);
    });

    viewport.addEventListener("mouseenter", () => paused = true);
    viewport.addEventListener("mouseleave", () => {
        if (!dragging && !modal?.classList.contains("is-open")) paused = false;
    });

    viewport.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        dragging = true;
        moved = false;
        startX = event.clientX;
        startScroll = viewport.scrollLeft;
        paused = true;
        viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", event => {
        if (!dragging) return;
        const distance = event.clientX - startX;
        if (Math.abs(distance) > 6) moved = true;
        viewport.scrollLeft = startScroll - distance;
    });

    function endDrag() {
        dragging = false;
        if (!modal?.classList.contains("is-open") && !viewport.matches(":hover")) paused = false;
        setTimeout(() => moved = false, 120);
    }

    ["pointerup", "pointercancel", "lostpointercapture"].forEach(name => {
        viewport.addEventListener(name, endDrag);
    });

    function normalizeLoop() {
        const halfWidth = track.scrollWidth / 2;
        if (!halfWidth) return;
        if (viewport.scrollLeft >= halfWidth) {
            viewport.scrollLeft -= halfWidth;
        } else if (viewport.scrollLeft < 0) {
            viewport.scrollLeft += halfWidth;
        }
    }

    function animate(now) {
        const delta = Math.min(now - last, 50);
        last = now;

        if (!paused && !dragging) {
            // Smooth, clearly visible right-to-left movement.
            viewport.scrollLeft += delta * 0.055;
            normalizeLoop();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
