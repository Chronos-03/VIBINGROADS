const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

// Subtle pointer parallax on the hero image layer
document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) {
        heroBg.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    }
});

const hasGsap = typeof gsap !== "undefined";
const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

if (hasGsap) {
    gsap.registerPlugin(...[ScrollTrigger, typeof ScrollToPlugin !== "undefined" ? ScrollToPlugin : null].filter(Boolean));
}

// Only stack the opening shot when the cinematic engine is actually available.
// If the GSAP CDN fails, the hero and first scene stay in normal flow and the
// page remains fully readable and scrollable.
if (hasGsap && hasScrollTrigger) {
    document.documentElement.classList.add("cinematic");
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

// Keeps the story progress indicator in sync with the active scene
function setStoryStep(step) {
    document.querySelectorAll(".story-step").forEach((s) => {
        s.classList.toggle("active", s.getAttribute("data-step") === step);
    });
}

function setJourneyStep(step) {
    document.querySelectorAll(".s2-journey-step").forEach((s) => {
        s.classList.toggle("s2-current-step", s.getAttribute("data-journey-step") === step);
    });
}

// ==========================================
// VIBING ROADS — CINEMATIC SCROLL EXPERIENCE
// The hero and both street scenes are one pinned
// shot. Scrolling pushes the camera forward
// through the landing page into the first street,
// then dissolves into the next street. Neither
// transition releases into a separate travel step.
// ==========================================

if (hasGsap && hasScrollTrigger) {

    const mm = gsap.matchMedia();

    // The pinned cinematic journey is desktop/tablet only. On phones and
    // for reduced-motion visitors, the scenes stay in normal document flow.
    mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {

        // Which progress step the journey indicator should display.
        let activeStage = "notice";

        // ---------- initial states ----------
        gsap.set(".hero", { autoAlpha: 1 });
        gsap.set(".hero-bg", { scale: 1 });
        gsap.set(".scroll-one", { autoAlpha: 1 });
        gsap.set(".scroll-one-bg", { opacity: 1, scale: 1.28 });
        gsap.set(".scroll-two", { autoAlpha: 1 });

        gsap.set([
            ".scroll-one .scroll-header",
            ".scroll-one .story-nav",
            ".scroll-one .story-copy",
            ".scroll-one .detail-card",
            ".scroll-one .scroll-footer"
        ], { opacity: 0 });

        gsap.set(".scroll-one .scroll-header", { y: 36 });
        gsap.set(".scroll-one .story-nav", { x: -50 });
        gsap.set(".scroll-one .story-copy", { scale: 0.94 });
        gsap.set(".scroll-one .detail-card", { x: 50, filter: "blur(6px)" });
        gsap.set(".scroll-one .scroll-footer", { y: 32 });

        gsap.set(".scroll-two-bg", { opacity: 1, scale: 1.18 });

        gsap.set([
            ".scroll-two .s2-header",
            ".scroll-two .s2-journey",
            ".scroll-two .s2-intro",
            ".scroll-two .s2-panel",
            ".scroll-two .s2-mode-card",
            ".scroll-two .s2-location-pill",
            ".scroll-two .s2-sound-control"
        ], { opacity: 0 });

        gsap.set(".scroll-two .s2-header", { y: -25 });
        gsap.set(".scroll-two .s2-journey", { x: -25 });
        gsap.set(".scroll-two .s2-intro", { y: 30 });
        gsap.set(".scroll-two .s2-panel", { x: 35, filter: "blur(8px)" });
        gsap.set(".scroll-two .s2-mode-card", { y: 24 });
        gsap.set(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", { y: 15 });

        // ---------- ONE PIN: HERO -> STREET -> NEXT STREET ----------
        const openingTimeline = gsap.timeline({
            scrollTrigger: {
                id: "opening-pin",
                trigger: ".opening",
                start: "top top",
                end: "+=460%",
                pin: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const stage = self.progress >= 0.58 ? "explore" : "notice";
                    if (stage === activeStage) return;
                    activeStage = stage;
                    setStoryStep(stage);
                    setJourneyStep(stage);
                }
            }
        });

        // ---- LANDING -> FIRST STREET ----
        openingTimeline.to(".hero-bg", {
            scale: 1.34,
            ease: "none",
            duration: 0.3
        }, 0);

        openingTimeline.to(".hero .navbar", {
            autoAlpha: 0,
            y: -26,
            duration: 0.1,
            ease: "power2.out"
        }, 0.02);

        openingTimeline.to(".hero .hero-title", {
            autoAlpha: 0,
            y: -44,
            duration: 0.14,
            ease: "power2.out"
        }, 0.06);

        // Fade the whole landing shot away to reveal the street beneath it.
        openingTimeline.to(".hero", {
            autoAlpha: 0,
            duration: 0.16,
            ease: "none"
        }, 0.14);

        // The incoming background keeps moving, so the dissolve reads as one
        // continuous push forward rather than a crossfade between stills.
        openingTimeline.to(".scroll-one-bg", {
            scale: 1.46,
            ease: "none",
            duration: 0.5
        }, 0);

        openingTimeline.to(".scroll-one .scroll-header", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.14);

        openingTimeline.to(".scroll-one .story-nav", {
            opacity: 1,
            x: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.16);

        openingTimeline.to(".scroll-one .story-copy", {
            opacity: 1,
            scale: 1,
            duration: 0.1,
            ease: "power3.out"
        }, 0.16);

        openingTimeline.to(".scroll-one .detail-card", {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.12,
            ease: "power3.out"
        }, 0.18);

        openingTimeline.to(".scroll-one .scroll-footer", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.2);

        // ---- FIRST STREET -> NEXT STREET ----
        // The first street is pushed through and dissolved out while the next
        // background is already scaling up underneath it. No viewport of
        // travel or empty space separates the two pages.
        openingTimeline.to(".scroll-one .scroll-header", {
            autoAlpha: 0,
            y: -24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.44);

        openingTimeline.to(".scroll-one .story-nav", {
            autoAlpha: 0,
            x: -36,
            duration: 0.08,
            ease: "power2.in"
        }, 0.44);

        openingTimeline.to(".scroll-one .story-copy", {
            autoAlpha: 0,
            scale: 1.08,
            duration: 0.1,
            ease: "power2.in"
        }, 0.44);

        openingTimeline.to(".scroll-one .detail-card", {
            autoAlpha: 0,
            x: 36,
            filter: "blur(6px)",
            duration: 0.1,
            ease: "power2.in"
        }, 0.45);

        openingTimeline.to(".scroll-one .scroll-footer", {
            autoAlpha: 0,
            y: 24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.45);

        openingTimeline.to(".scroll-one-bg", {
            scale: 1.66,
            ease: "none",
            duration: 0.2
        }, 0.44);

        openingTimeline.to(".scroll-one", {
            autoAlpha: 0,
            duration: 0.16,
            ease: "none"
        }, 0.48);

        // The next background moves throughout, so the scene change is a
        // continuation of the same camera push.
        openingTimeline.to(".scroll-two-bg", {
            scale: 1.4,
            ease: "none",
            duration: 0.56
        }, 0.44);

        openingTimeline.to(".scroll-two .s2-header", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out"
        }, 0.56);

        openingTimeline.to(".scroll-two .s2-journey", {
            opacity: 1,
            x: 0,
            duration: 0.1,
            ease: "power2.out"
        }, 0.57);

        openingTimeline.to(".scroll-two .s2-intro", {
            opacity: 1,
            y: 0,
            duration: 0.12,
            ease: "power3.out"
        }, 0.58);

        openingTimeline.to(".scroll-two .s2-panel", {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.14,
            ease: "power3.out"
        }, 0.6);

        openingTimeline.to(".scroll-two .s2-mode-card", {
            opacity: 1,
            y: 0,
            duration: 0.08,
            stagger: 0.04,
            ease: "power2.out"
        }, 0.64);

        openingTimeline.to(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: "power2.out"
        }, 0.64);
    });

    // Recalculate pin ranges once fonts/images have settled.
    window.addEventListener("load", () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
}

// In-page labels jump to the matching point of the pinned journey, so the
// destination scene is fully composed instead of halfway through a dissolve.
const OPENING_STAGE_PROGRESS = {
    notice: 0.32,
    explore: 0.8
};

function getOpeningTrigger() {
    return hasScrollTrigger && typeof ScrollTrigger.getById === "function"
        ? ScrollTrigger.getById("opening-pin")
        : null;
}

function scrollToOpeningStage(progress, duration = 1.4) {
    const trigger = getOpeningTrigger();
    if (!trigger) return false;

    const targetY = trigger.start + (trigger.end - trigger.start) * progress;

    if (hasGsap && typeof ScrollToPlugin !== "undefined" && !reducedMotionQuery.matches) {
        gsap.to(window, {
            duration,
            scrollTo: { y: targetY, offsetY: 0 },
            ease: "power2.inOut"
        });
    } else {
        window.scrollTo({ top: targetY, behavior: "auto" });
    }

    return true;
}

// Hero Explore button — plays the push-in and settles on the first street.
const exploreBtn = document.getElementById("explore-btn");
if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.notice, 1.6)) {
            e.preventDefault();
            return;
        }

        const target = document.querySelector("#scroll-one");
        if (!target) return;

        e.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY,
            behavior: "auto"
        });
    });
}

// Story/nav labels that point at a scene inside the pinned journey.
[
    ['a[href="#notice"]', OPENING_STAGE_PROGRESS.notice],
    ['a[href="#next-section"]', OPENING_STAGE_PROGRESS.explore]
].forEach(([selector, progress]) => {
    document.querySelectorAll(selector).forEach((link) => {
        link.addEventListener("click", (e) => {
            if (scrollToOpeningStage(progress)) e.preventDefault();
        });
    });
});

// ==========================================
// VIBING ROADS — SECOND SCROLL SECTION
// ==========================================

const s2ModeCards = document.querySelectorAll(".s2-mode-card");
const s2StartButtons = document.querySelectorAll(".s2-start-button");

let s2SelectedMode = "walking";

s2ModeCards.forEach((card) => {
    card.addEventListener("click", () => {
        s2ModeCards.forEach((item) => {
            item.classList.remove("s2-mode-selected");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("s2-mode-selected");
        card.setAttribute("aria-pressed", "true");
        s2SelectedMode = card.dataset.mode;

        const panel = card.closest(".s2-panel");
        const label = panel ? panel.querySelector(".s2-button-label") : null;

        if (label) {
            if (s2SelectedMode === "driving") {
                label.textContent = "START DRIVING";
            } else {
                label.textContent = "START WALKING";
            }
        }
    });
});

s2StartButtons.forEach((s2StartButton) => {
    s2StartButton.addEventListener("click", () => {
        console.log("VIBING ROADS selected mode:", s2SelectedMode);
    });
});

// ==========================================
// Lisbon local clock
// ==========================================

function updateLocalClock() {
    const clocks = document.querySelectorAll("#s2-local-clock, #local-clock");
    if (!clocks.length) return;

    const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date());

    clocks.forEach((clock) => {
        clock.textContent = time;
    });
}

updateLocalClock();
setInterval(updateLocalClock, 60000);

// ==========================================
// Ambient sound toggle
// ==========================================

// Both pages use the same control, so they stay in sync.
function setupSoundControls() {
    const controls = document.querySelectorAll(".s2-sound-control");
    if (!controls.length) return;

    const setSoundState = (isActive) => {
        controls.forEach((control) => {
            control.classList.toggle("s2-sound-active", isActive);
            control.setAttribute("aria-pressed", String(isActive));

            const label = control.querySelector(".s2-sound-label");
            if (label) {
                label.textContent = isActive ? "AMBIENT SOUND ON" : "AMBIENT SOUND OFF";
            }
        });
    };

    controls.forEach((control) => {
        control.addEventListener("click", () => {
            setSoundState(!control.classList.contains("s2-sound-active"));
        });
    });
}

setupSoundControls();
