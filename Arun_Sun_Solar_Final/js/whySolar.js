document.addEventListener("DOMContentLoaded", () => {
    const panel = document.querySelector(".why-solar-cards-panel");
    const cards = Array.from(document.querySelectorAll(".why-solar-card"));

    if (!panel || !cards.length) return;

    const setActiveCard = (activeCard) => {
        cards.forEach((card) => {
            const isActive = card === activeCard;
            card.classList.toggle("is-active", isActive);

            const trigger = card.querySelector(".why-solar-card-trigger");
            const content = card.querySelector(".why-solar-card-content");

            if (trigger) trigger.setAttribute("aria-expanded", String(isActive));
            if (content) content.setAttribute("aria-hidden", String(!isActive));
        });
    };

    cards.forEach((card) => {
        const trigger = card.querySelector(".why-solar-card-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isActive = card.classList.contains("is-active");

            // Keep one card open at a time. Clicking the open card closes it;
            // clicking another card contracts all others and expands the new one.
            if (isActive) {
                cards.forEach((item) => {
                    item.classList.remove("is-active");
                    const itemTrigger = item.querySelector(".why-solar-card-trigger");
                    const itemContent = item.querySelector(".why-solar-card-content");
                    if (itemTrigger) itemTrigger.setAttribute("aria-expanded", "false");
                    if (itemContent) itemContent.setAttribute("aria-hidden", "true");
                });
            } else {
                setActiveCard(card);
            }
        });
    });

    // Start with the first card expanded so its real details are visible
    // immediately, while the other cards remain contracted.
    setActiveCard(cards[0]);
});
