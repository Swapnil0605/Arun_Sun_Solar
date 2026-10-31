document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll(".mobile-menu-toggle");

    toggles.forEach((toggle) => {
        const nav = toggle.closest(".nav-glass")?.querySelector(".nav-menu");
        if (!nav) return;

        nav.id = "mobileNavigation";

        const closeNav = () => {
            nav.classList.remove("mobile-nav-open");
            toggle.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
            nav.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
                dropdown.classList.remove("is-open");
                dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
            });
        };

        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("mobile-nav-open");
            toggle.classList.toggle("is-open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        nav.querySelectorAll(".nav-dropdown-trigger").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                const dropdown = trigger.closest(".nav-dropdown");
                if (!dropdown) return;

                const isOpen = dropdown.classList.toggle("is-open");
                trigger.setAttribute("aria-expanded", String(isOpen));
            });
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => closeNav());
        });

        document.addEventListener("click", (event) => {
            if (!nav.contains(event.target) && !toggle.contains(event.target)) {
                nav.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
                    dropdown.classList.remove("is-open");
                    dropdown.querySelector(".nav-dropdown-trigger")?.setAttribute("aria-expanded", "false");
                });
            }
        });
    });
});
