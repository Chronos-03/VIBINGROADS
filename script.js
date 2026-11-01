const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const heroBg = document.querySelector(".hero-bg");
const canParallax = heroBg &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !reducedMotionQuery.matches;

if (canParallax) {
    let pointerX = 0;
    let pointerY = 0;
    let parallaxFrame = 0;

    const renderParallax = () => {
        parallaxFrame = 0;
        heroBg.style.backgroundPosition = `calc(50% + ${pointerX}px) calc(50% + ${pointerY}px)`;
    };

    window.addEventListener("mousemove", (e) => {
        if (window.scrollY > window.innerHeight) return;

        pointerX = (window.innerWidth - e.clientX * 2) / 100;
        pointerY = (window.innerHeight - e.clientY * 2) / 100;

        if (!parallaxFrame) {
            parallaxFrame = requestAnimationFrame(renderParallax);
        }
    }, { passive: true });
}

// trailing cursor (activates on the first mouse move)
if (window.PointerEvent) {
    const cursorEl = document.createElement("div");
    const cursorShape = document.createElement("div");
    const cursorLabel = document.createElement("span");

    cursorEl.className = "cursor-follower";
    cursorShape.className = "cursor-follower-shape";
    cursorLabel.className = "cursor-follower-label";
    cursorEl.setAttribute("aria-hidden", "true");
    cursorLabel.textContent = "OPEN";
    cursorEl.append(cursorShape, cursorLabel);
    document.body.appendChild(cursorEl);
    document.documentElement.classList.add("has-custom-cursor");
    document.documentElement.classList.add("has-custom-cursor");

    const hoverTargets = 'a, button, input, textarea, select, [role="button"], .s3-city-card, .s2-mode-card';
    const CURSOR_EASE = 0.18;

    let targetX = -100;
    let targetY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let lastTime = 0;
    let cursorFrame = 0;
    let cursorVisible = false;

    const drawCursor = (time) => {
        cursorFrame = 0;

        const elapsed = Math.min(48, time - lastTime || 16.7);
        lastTime = time;

        const factor = reducedMotionQuery.matches
            ? 1
            : 1 - Math.pow(1 - CURSOR_EASE, elapsed / 16.7);

        cursorX += (targetX - cursorX) * factor;
        cursorY += (targetY - cursorY) * factor;
        cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        if (Math.abs(targetX - cursorX) > 0.15 || Math.abs(targetY - cursorY) > 0.15) {
            cursorFrame = requestAnimationFrame(drawCursor);
        }
    };

    const showCursor = () => {
        if (cursorVisible) return;
        cursorVisible = true;
        cursorEl.classList.add("is-visible");
    };

    const hideCursor = () => {
        cursorVisible = false;
        cursorEl.classList.remove("is-visible", "is-hover", "is-down");
    };

    window.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;

        if (!cursorVisible) {
            targetX = cursorX = e.clientX;
            targetY = cursorY = e.clientY;
            document.documentElement.classList.add("has-custom-cursor");
            showCursor();
        }

        targetX = e.clientX;
        targetY = e.clientY;

        if (!cursorFrame) {
            cursorFrame = requestAnimationFrame(drawCursor);
        }
    }, { passive: true });

    document.addEventListener("pointerover", (e) => {
        if (e.pointerType === "touch") return;
        if (!(e.target instanceof Element)) return;

        const target = e.target.closest(hoverTargets);
        if (!target) return;

        cursorLabel.textContent = target.dataset.cursorLabel || "OPEN";
        cursorEl.classList.add("is-hover");
    });

    document.addEventListener("pointerout", (e) => {
        if (e.pointerType === "touch") return;
        if (!(e.target instanceof Element)) return;

        const from = e.target.closest(hoverTargets);
        if (!from) return;

        const to = e.relatedTarget instanceof Element ? e.relatedTarget.closest(hoverTargets) : null;
        if (to !== from) {
            cursorEl.classList.remove("is-hover", "is-down");
        }
    });

    document.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") {
            document.documentElement.classList.remove("has-custom-cursor");
            hideCursor();
            return;
        }
        cursorEl.classList.add("is-down");
    });

    const releaseCursor = () => {
        cursorEl.classList.remove("is-down");
    };

    document.addEventListener("pointerup", releaseCursor);
    document.addEventListener("pointercancel", releaseCursor);
    document.addEventListener("mouseleave", hideCursor);
    window.addEventListener("blur", hideCursor);
}

const hasGsap = typeof gsap !== "undefined";
const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

if (hasGsap) {
    gsap.registerPlugin(...[ScrollTrigger, typeof ScrollToPlugin !== "undefined" ? ScrollToPlugin : null].filter(Boolean));
}

if (hasGsap && hasScrollTrigger) {
    document.documentElement.classList.add("cinematic");
} else {
    document.documentElement.classList.remove("cinematic");
}

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

if (hasGsap && hasScrollTrigger) {

    const mm = gsap.matchMedia();

    mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {

        let activeStage = "notice";

        gsap.set(".hero", { autoAlpha: 1 });
        gsap.set(".hero-bg", { scale: 1 });
        gsap.set(".scroll-one", { autoAlpha: 1 });
        gsap.set(".scroll-one-bg", { opacity: 1, scale: 1.28 });
        gsap.set(".scroll-two", { autoAlpha: 1 });

        gsap.set([
            ".scroll-one .scroll-two-header",
            ".scroll-one .story-nav",
            ".scroll-one .story-copy",
            ".scroll-one .detail-card",
            ".scroll-one .scroll-footer"
        ], { opacity: 0 });

        gsap.set(".scroll-one .scroll-two-header", { y: -25 });
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

        gsap.set(".scroll-three-bg", { scale: 1.18 });

        gsap.set([
            ".scroll-three .s3-header",
            ".scroll-three .s3-intro",
            ".scroll-three .s3-city-grid",
            ".scroll-three .s3-footer"
        ], { autoAlpha: 0 });

        gsap.set(".scroll-three .s3-header", { y: -22 });
        gsap.set(".scroll-three .s3-intro", { y: 28 });
        gsap.set(".scroll-three .s3-city-grid", { y: 22, scale: 1.04 });
        gsap.set(".scroll-three .s3-city-copy", { y: 10 });
        gsap.set(".scroll-three .s3-footer", { y: 18 });

        const openingTimeline = gsap.timeline({
            scrollTrigger: {
                id: "opening-pin",
                trigger: ".opening",
                start: "top top",
                end: "+=620%",
                pin: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const stage = self.progress >= 0.84
                        ? "feel"
                        : self.progress >= 0.58
                            ? "explore"
                            : "notice";
                    if (stage === activeStage) return;
                    activeStage = stage;
                    setStoryStep(stage);
                    setJourneyStep(stage);
                }
            }
        });

        openingTimeline.to(".hero-bg", {
            scale: 1.34,
            ease: "none",
            duration: 0.3
        }, 0);

        openingTimeline.to(".hero .hero-header", {
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

        openingTimeline.to(".hero", {
            autoAlpha: 0,
            duration: 0.16,
            ease: "none"
        }, 0.14);
        openingTimeline.to(".scroll-one-bg", {
            scale: 1.46,
            ease: "none",
            duration: 0.5
        }, 0);

        openingTimeline.to(".scroll-one .scroll-two-header", {
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

        openingTimeline.to(".scroll-one .scroll-two-header", {
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

        openingTimeline.to(".scroll-two-bg", {
            scale: 1.55,
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

        openingTimeline.to(".scroll-two .s2-header", {
            autoAlpha: 0,
            y: -24,
            duration: 0.08,
            ease: "power2.in"
        }, 0.74);

        openingTimeline.to(".scroll-two .s2-journey", {
            autoAlpha: 0,
            x: -30,
            duration: 0.08,
            ease: "power2.in"
        }, 0.74);

        openingTimeline.to(".scroll-two .s2-intro", {
            autoAlpha: 0,
            y: -22,
            duration: 0.08,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-panel", {
            autoAlpha: 0,
            x: 34,
            filter: "blur(7px)",
            duration: 0.09,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-mode-card", {
            autoAlpha: 0,
            y: 18,
            duration: 0.07,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two .s2-location-pill, .scroll-two .s2-sound-control", {
            autoAlpha: 0,
            y: 16,
            duration: 0.08,
            ease: "power2.in"
        }, 0.75);

        openingTimeline.to(".scroll-two", {
            autoAlpha: 0,
            duration: 0.12,
            ease: "none"
        }, 0.78);

        openingTimeline.to(".scroll-three-bg", {
            scale: 1.4,
            ease: "none",
            duration: 0.26
        }, 0.74);

        openingTimeline.to(".scroll-three .s3-header", {
            autoAlpha: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out"
        }, 0.78);

        openingTimeline.to(".scroll-three .s3-intro", {
            autoAlpha: 1,
            y: 0,
            duration: 0.08,
            ease: "power3.out"
        }, 0.79);

        openingTimeline.to(".scroll-three .s3-city-grid", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.1,
            ease: "power2.out"
        }, 0.8);

        openingTimeline.to(".scroll-three .s3-city-copy", {
            y: 0,
            duration: 0.06,
            stagger: 0.015,
            ease: "power2.out"
        }, 0.82);

        openingTimeline.to(".scroll-three .s3-footer", {
            autoAlpha: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out"
        }, 0.83);
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
}

const OPENING_STAGE_PROGRESS = {
    notice: 0.32,
    explore: 0.8,
    feel: 0.96,
    choose: 0.96
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

[
    ['a[href="#cities"]', OPENING_STAGE_PROGRESS.feel]
].forEach(([selector, progress]) => {
    document.querySelectorAll(selector).forEach((link) => {
        link.addEventListener("click", (e) => {
            if (scrollToOpeningStage(progress)) e.preventDefault();
        });
    });
});

if (location.hash === "#cities") {
    window.addEventListener("load", () => {
        window.setTimeout(() => {
            scrollToOpeningStage(OPENING_STAGE_PROGRESS.choose);
        }, 60);
    });
}

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
        if (scrollToOpeningStage(OPENING_STAGE_PROGRESS.choose)) return;

        const cities = document.querySelector("#cities");
        if (!cities) return;

        const targetY = cities.getBoundingClientRect().top + window.scrollY;

        if (hasGsap && typeof ScrollToPlugin !== "undefined" && !reducedMotionQuery.matches) {
            gsap.to(window, {
                duration: 1.4,
                scrollTo: { y: targetY, offsetY: 0 },
                ease: "power2.inOut"
            });
        } else {
            window.scrollTo({ top: targetY, behavior: "auto" });
        }
    });
});

const cityData = {
    tokyo: {
        name: "Tokyo",
        coords: [139.6917, 35.6895],
        endZoom: 15.5,
        endPitch: 62,
        endBearing: 28,
        videoFile: "videos/tokyo.mp4",
        poster: "city-tokyo.webp",
        country: "Japan",
        tagline: "Shinjuku & Shibuya Neon Corridors"
    },
    paris: {
        name: "Paris",
        coords: [2.3522, 48.8566],
        endZoom: 15.4,
        endPitch: 62,
        endBearing: -22,
        videoFile: "videos/paris.mp4",
        poster: "city-paris.webp",
        country: "France",
        tagline: "Haussmann Boulevards & Seine Glow"
    },
    newyork: {
        name: "New York",
        coords: [-74.0060, 40.7128],
        endZoom: 15.6,
        endPitch: 63,
        endBearing: -36,
        videoFile: "videos/newyork.mp4",
        poster: "city-newyork.webp",
        country: "United States",
        tagline: "Manhattan Canyons & 5th Avenue"
    },
    istanbul: {
        name: "Istanbul",
        coords: [28.9784, 41.0082],
        endZoom: 15.2,
        endPitch: 58,
        endBearing: 16,
        videoFile: "videos/istanbul.mp4",
        poster: "city-istanbul.webp",
        country: "Turkey",
        tagline: "Bosphorus Crossings & Historic Old City"
    },
    mumbai: {
        name: "Mumbai",
        coords: [72.8777, 19.0760],
        endZoom: 15.3,
        endPitch: 60,
        endBearing: -14,
        videoFile: "videos/mumbai.mp4",
        poster: "city-mumbai.webp",
        country: "India",
        tagline: "Colonial Grandeur & Coastal Roads"
    },
    lisbon: {
        name: "Lisbon",
        coords: [-9.1393, 38.7223],
        endZoom: 15.3,
        endPitch: 58,
        endBearing: 24,
        videoFile: "videos/lisbon.mp4",
        country: "Portugal",
        tagline: "Cobblestone Hills & Pastel Quarters"
    }
};

// mapbox public token
const MAPBOX_DEFAULT_TOKEN = "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2xxeTBib3pyMGsxcTJpbXQ3bmo4YXU0ZiJ9.wvqlBMQSxTHgvAh6l9OXXw";

const MAPBOX_CSS_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
const MAPBOX_JS_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
let mapboxLoadPromise = null;

// loaded on demand
function loadMapbox() {
    if (typeof mapboxgl !== "undefined") return Promise.resolve();

    if (mapboxLoadPromise) return mapboxLoadPromise;

    mapboxLoadPromise = new Promise((resolve, reject) => {
        if (!document.querySelector(`link[href="${MAPBOX_CSS_URL}"]`)) {
            const stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.href = MAPBOX_CSS_URL;
            document.head.appendChild(stylesheet);
        }

        const script = document.createElement("script");
        script.src = MAPBOX_JS_URL;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
            mapboxLoadPromise = null;
            reject(new Error("Unable to load the Mapbox engine."));
        };
        document.head.appendChild(script);
    });

    return mapboxLoadPromise;
}

function getActiveMapboxToken() {
    return window.MAPBOX_ACCESS_TOKEN || localStorage.getItem("MAPBOX_ACCESS_TOKEN") || MAPBOX_DEFAULT_TOKEN;
}

// modal state
let activeMap = null;
let isModalOpen = false;
let isTransitioningToVideo = false;
let mapFlightTimeout = null;
let wasAmbientPlaying = false;
let currentCityData = null;
let lastFocusedElement = null;

const cityModal = document.getElementById("city-modal");
const cityModalBackdrop = document.getElementById("city-modal-backdrop");
const cityModalDialog = cityModal ? cityModal.querySelector(".city-modal-dialog") : null;
const cityModalCloseBtn = document.getElementById("city-modal-close");
const cityModalFsBtn = document.getElementById("city-modal-fs-btn");
const cityModalSkipBtn = document.getElementById("city-modal-skip-btn");
const cityModalTitle = document.getElementById("city-modal-title");
const cityModalCountry = document.getElementById("city-modal-country");
const cityModalCoords = document.getElementById("city-modal-coords");
const cityModalStatusText = document.getElementById("city-modal-status-text");

const cityMapStage = document.getElementById("city-modal-map-stage");
const cityMapContainer = document.getElementById("city-mapbox-container");
const cityMapFallback = document.getElementById("city-map-fallback");
const fallbackActionBtn = document.getElementById("fallback-action-btn");
const hudAltitudeLabel = document.getElementById("hud-altitude-label");
const hudTargetName = document.getElementById("hud-target-name");
const hudCameraZoom = document.getElementById("hud-camera-zoom");

const cityVideoStage = document.getElementById("city-modal-video-stage");
const cityVideoFrame = document.getElementById("city-video-frame");
const cityVideo = document.getElementById("city-video");
const cityVideoAudioBtn = document.getElementById("city-video-audio-btn");
const cityVideoAudioLabel = document.getElementById("city-video-audio-label");
const cityVideoPlayOverlay = document.getElementById("city-video-play-overlay");
const cityVideoBigPlay = document.getElementById("city-video-big-play");
const videoModeBadge = document.getElementById("video-mode-badge");
const videoCityTag = document.getElementById("video-city-tag");

function getMapboxStyle() {
    const customToken = window.MAPBOX_ACCESS_TOKEN || localStorage.getItem("MAPBOX_ACCESS_TOKEN");
    if (customToken && customToken.startsWith("pk.") && customToken !== MAPBOX_DEFAULT_TOKEN) {
        return "mapbox://styles/mapbox/dark-v11";
    }

    return {
        version: 8,
        name: "Cinematic 3D Satellite",
        sources: {
            "esri-satellite": {
                type: "raster",
                tiles: [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                ],
                tileSize: 256,
                maxzoom: 19
            },
            "openmaptiles": {
                type: "vector",
                url: "https://tiles.openfreemap.org/planet"
            }
        },
        layers: [
            {
                id: "satellite-layer",
                type: "raster",
                source: "esri-satellite",
                paint: {
                    "raster-saturation": -0.05,
                    "raster-contrast": 0.18,
                    "raster-brightness-min": 0.05
                }
            },
            {
                id: "night-ambience",
                type: "background",
                paint: {
                    "background-color": "#060913",
                    "background-opacity": 0.22
                }
            },
            {
                id: "highways-glow",
                type: "line",
                source: "openmaptiles",
                "source-layer": "transportation",
                filter: ["in", "class", "motorway", "trunk", "primary"],
                paint: {
                    "line-color": "#f59e0b",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        6, 1.0,
                        11, 2.0,
                        15, 3.8
                    ],
                    "line-opacity": 0.85
                }
            },
            {
                id: "add-3d-buildings",
                source: "openmaptiles",
                "source-layer": "building",
                type: "fill-extrusion",
                minzoom: 13,
                paint: {
                    "fill-extrusion-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "render_height"],
                        0, "#1c2538",    
                        25, "#2b3952",   
                        60, "#485b7e",   
                        120, "#c59a48",  
                        220, "#dfbd82",  
                        340, "#ffe59e"    
                    ],
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        13, 0,
                        14.05, ["get", "render_height"]
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        13, 0,
                        14.05, ["get", "render_min_height"]
                    ],
                    "fill-extrusion-opacity": 0.95
                }
            }
        ]
    };
}

function showMapError(title, desc) {
    if (cityMapFallback) {
        cityMapFallback.style.display = "flex";
        const titleEl = document.getElementById("fallback-title");
        const descEl = document.getElementById("fallback-desc");
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
    }
    updateModalStatus("SATELLITE OFFLINE");
}

function updateModalStatus(text) {
    if (cityModalStatusText) {
        cityModalStatusText.textContent = text;
    }
}

function openCityModal(cityKey) {
    const city = cityData[cityKey];
    if (!city || isModalOpen) return;

    isModalOpen = true;
    isTransitioningToVideo = false;
    currentCityData = city;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const ambientAudio = document.getElementById("ambient-audio");
    if (ambientAudio) {
        wasAmbientPlaying = !ambientAudio.paused;
        if (wasAmbientPlaying) {
            ambientAudio.pause();
        }
    }

    if (cityModalTitle) cityModalTitle.textContent = city.name;
    if (cityModalCountry) cityModalCountry.textContent = city.country || "";
    if (cityModalCoords && city.coords) {
        const [lng, lat] = city.coords;
        const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
        const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
        cityModalCoords.textContent = `${latStr}, ${lngStr}`;
    }

    if (hudTargetName) hudTargetName.textContent = `TARGET: ${city.name.toUpperCase()}`;
    if (hudCameraZoom) hudCameraZoom.textContent = "ZOOM: 2.0";
    if (hudAltitudeLabel) hudAltitudeLabel.textContent = "STRATOSPHERE (50 KM)";

    updateModalStatus("LOCATING SATELLITE...");

    const isWalking = (typeof s2SelectedMode !== "undefined" && s2SelectedMode === "walking");
    if (videoModeBadge) {
        videoModeBadge.textContent = isWalking ? "WALKING TOUR" : "DRIVING TOUR";
    }
    if (videoCityTag) {
        videoCityTag.textContent = `${city.name}, ${city.country || ""}`;
    }

    if (cityMapStage) {
        cityMapStage.style.display = "block";
        cityMapStage.style.opacity = "1";
    }
    if (cityVideoStage) {
        cityVideoStage.style.display = "none";
        cityVideoStage.style.opacity = "0";
    }
    if (cityMapFallback) cityMapFallback.style.display = "none";
    if (cityVideoPlayOverlay) cityVideoPlayOverlay.style.display = "none";
    if (cityModalSkipBtn) cityModalSkipBtn.style.display = "inline-flex";

    cityModal.classList.remove("is-video-active", "controls-hidden");
    cityModal.classList.add("is-active");
    cityModal.setAttribute("aria-hidden", "false");
    cityModal.style.opacity = "1";
    document.body.classList.add("city-modal-open");
    if (cityModalCloseBtn) cityModalCloseBtn.focus({ preventScroll: true });

    // Preload video in the background for instant transition
    if (cityVideo) {
        const videoSrc = city.videoFile || `videos/${(city.name || "").toLowerCase().replace(/\s+/g, "")}.mp4`;
        if (cityVideo.getAttribute("src") !== videoSrc) {
            cityVideo.src = videoSrc;
            cityVideo.load();
        }
    }

    // Launch the 3D map animation in fullground!
    initCityMap(city);
}

async function initCityMap(city) {
    if (!cityModal || !cityModal.classList.contains("is-active")) return;

    try {
        await loadMapbox();
    } catch (error) {
        console.warn("Mapbox failed to load:", error);
        if (currentCityData !== city) return;
        showMapError(
            "Satellite Engine Offline",
            "The 3D map could not be loaded. You can still continue to the street tour."
        );
        return;
    }

    if (!cityModal || !cityModal.classList.contains("is-active")) return;
    if (currentCityData !== city) return;

    const token = getActiveMapboxToken();
    const isMapboxAvailable = typeof mapboxgl !== "undefined" && (typeof mapboxgl.supported === "function" ? mapboxgl.supported() : true);

    if (!isMapboxAvailable) {
        showMapError("WebGL Unsupported", "Hardware acceleration / WebGL is required for 3D satellite visualization.");
        return;
    }

    if (!token || !token.startsWith("pk.")) {
        showMapError("Mapbox Access Token Missing", "Please provide a valid Mapbox Public Access Token (starts with 'pk.') to initialize 3D cities.");
        return;
    }

    try {
        mapboxgl.accessToken = token;
        const style = getMapboxStyle();
        const startZoom = 2.0;
        const targetZoom = city.endZoom || 15.4;
        const targetPitch = city.endPitch || 62;
        const targetBearing = city.endBearing || -25;

        if (cityMapContainer) {
            cityMapContainer.innerHTML = "";
        }

        const map = new mapboxgl.Map({
            container: "city-mapbox-container",
            style: style,
            center: city.coords,
            zoom: startZoom,
            pitch: 0,
            bearing: 0,
            antialias: true,
            renderWorldCopies: false,
            attributionControl: false
        });

        activeMap = map;

        let hasFlightStarted = false;
        let isFlightCompleted = false;

        const onMapReady = () => {
            if (!activeMap) return;

            // fog
            if (typeof map.setFog === "function") {
                map.setFog({
                    range: [0.5, 10],
                    color: "#121d30",
                    "horizon-blend": 0.3,
                    "high-color": "#091425",
                    "space-color": "#01040b",
                    "star-intensity": 0.9
                });
            }

            // map colors
            try {
                if (map.getLayer("background")) {
                    map.setPaintProperty("background", "background-color", "#0c111d");
                }
                if (map.getLayer("water")) {
                    map.setPaintProperty("water", "fill-color", "#0f3254");
                    map.setPaintProperty("water", "fill-opacity", 0.95);
                }
                if (map.getLayer("waterway")) {
                    map.setPaintProperty("waterway", "line-color", "#1a4f7e");
                    map.setPaintProperty("waterway", "line-width", 2);
                }
                if (map.getLayer("landuse_park")) {
                    map.setPaintProperty("landuse_park", "fill-color", "#0f2e21");
                    map.setPaintProperty("landuse_park", "fill-opacity", 0.85);
                }
                if (map.getLayer("landcover_wood")) {
                    map.setPaintProperty("landcover_wood", "fill-color", "#0c2419");
                    map.setPaintProperty("landcover_wood", "fill-opacity", 0.8);
                }
                if (map.getLayer("highway_motorway_inner")) {
                    map.setPaintProperty("highway_motorway_inner", "line-color", "#dfbd82");
                    map.setPaintProperty("highway_motorway_inner", "line-width", 2.4);
                }
                if (map.getLayer("highway_major_inner")) {
                    map.setPaintProperty("highway_major_inner", "line-color", "#f59e0b");
                    map.setPaintProperty("highway_major_inner", "line-width", 1.8);
                }
                if (map.getLayer("highway_minor")) {
                    map.setPaintProperty("highway_minor", "line-color", "#28394e");
                }
            } catch (err) {}

            // 3d buildings
            const currentStyle = map.getStyle();
            if (currentStyle && currentStyle.layers) {
                let labelLayerId;
                for (let i = 0; i < currentStyle.layers.length; i++) {
                    if (currentStyle.layers[i].type === "symbol" && currentStyle.layers[i].layout && currentStyle.layers[i].layout["text-field"]) {
                        labelLayerId = currentStyle.layers[i].id;
                        break;
                    }
                }

                const isMapboxComposite = !!(currentStyle.sources && currentStyle.sources["composite"]);
                const buildingSource = isMapboxComposite ? "composite" : "openmaptiles";
                const heightProp = isMapboxComposite ? "height" : "render_height";
                const minHeightProp = isMapboxComposite ? "min_height" : "render_min_height";
                const filterExpr = isMapboxComposite ? ["==", "extrude", "true"] : ["has", "render_height"];

                if (!map.getLayer("add-3d-buildings")) {
                    map.addLayer(
                        {
                            id: "add-3d-buildings",
                            source: buildingSource,
                            "source-layer": "building",
                            filter: filterExpr,
                            type: "fill-extrusion",
                            minzoom: 13,
                            paint: {
                                "fill-extrusion-color": [
                                    "interpolate",
                                    ["linear"],
                                    ["get", heightProp],
                                    0, "#1c2538",
                                    25, "#2b3952",
                                    60, "#485b7e",
                                    120, "#c59a48",
                                    220, "#dfbd82",
                                    340, "#ffe59e"
                                ],
                                "fill-extrusion-height": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    13, 0,
                                    14.05, ["get", heightProp]
                                ],
                                "fill-extrusion-base": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    13, 0,
                                    14.05, ["get", minHeightProp]
                                ],
                                "fill-extrusion-opacity": 0.95
                            }
                        },
                        labelLayerId
                    );
                }
            }

            startCinematicFlight();
        };

        const startCinematicFlight = () => {
            if (hasFlightStarted || !activeMap) return;
            hasFlightStarted = true;

            map.resize();
            updateModalStatus("DESCENDING TO CITY...");
            if (hudAltitudeLabel) hudAltitudeLabel.textContent = "STRATOSPHERE (50 KM)";

            // fly down to street level
            map.flyTo({
                center: city.coords,
                zoom: targetZoom,
                pitch: targetPitch,
                bearing: targetBearing,
                duration: 5200,
                speed: 0.85,
                curve: 1.4,
                essential: true,
                easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            });
        };

        if (map.isStyleLoaded()) {
            onMapReady();
        } else {
            map.once("style.load", onMapReady);
        }

        // readout while the camera moves
        const updateTelemetry = () => {
            if (!activeMap) return;
            const z = map.getZoom();
            if (hudCameraZoom) hudCameraZoom.textContent = `ZOOM: ${z.toFixed(1)}`;

            const progress = Math.min(1, Math.max(0, (z - 2.0) / (targetZoom - 2.0)));
            const altKm = 50 * Math.pow(0.005, progress);

            let altText = "";
            let phase = "STRATOSPHERE";
            if (progress >= 0.92) {
                phase = "CITY LEVEL";
                altText = `${Math.round(altKm * 1000)} M`;
            } else if (progress >= 0.65) {
                phase = "APPROACH";
                altText = `${altKm.toFixed(1)} KM`;
            } else if (progress >= 0.3) {
                phase = "DESCENT";
                altText = `${altKm.toFixed(1)} KM`;
            } else {
                phase = "STRATOSPHERE";
                altText = `${altKm.toFixed(1)} KM`;
            }

            if (hudAltitudeLabel && !isFlightCompleted) {
                hudAltitudeLabel.textContent = `${phase} (${altText})`;
            }
        };

        map.on("move", updateTelemetry);

        // flight done
        map.once("moveend", () => {
            if (!hasFlightStarted) return;
            isFlightCompleted = true;

            map.off("move", updateTelemetry);

            if (mapFlightTimeout) {
                clearTimeout(mapFlightTimeout);
                mapFlightTimeout = null;
            }

            updateModalStatus("3D SKYLINE ACTIVE • ENTERING STREET LEVEL");
            if (hudAltitudeLabel) hudAltitudeLabel.textContent = "CITY LEVEL (GROUND)";

            // short pause to absorb the skyline, then glide into street video
            setTimeout(() => {
                if (!isTransitioningToVideo && isModalOpen) {
                    transitionToVideo(city);
                }
            }, 1200);
        });

        map.on("error", (e) => {
            console.warn("Mapbox error:", e);
            if (e && e.error && (e.error.status === 401 || e.error.status === 403)) {
                showMapError("Mapbox Authorization Failed", "The provided Mapbox Access Token is invalid or unauthorized.");
            }
        });

        // fallback if moveend never fires
        mapFlightTimeout = setTimeout(() => {
            if (!isTransitioningToVideo && isModalOpen) {
                transitionToVideo(city);
            }
        }, 7500);

    } catch (err) {
        console.error("Map initialization failed:", err);
        showMapError("Mapbox Initialization Error", err.message || "Failed to load 3D map engine.");
    }
}

function transitionToVideo(city) {
    if (isTransitioningToVideo) return;
    isTransitioningToVideo = true;

    if (activeMap) {
        try { activeMap.stop(); } catch (e) {}
    }

    if (mapFlightTimeout) {
        clearTimeout(mapFlightTimeout);
        mapFlightTimeout = null;
    }

    cityModal.classList.add("is-video-active");

    if (cityModalSkipBtn) {
        cityModalSkipBtn.style.display = "none";
    }

    updateModalStatus("STREET IMMERSION ACTIVE");

    // Seamless map to video transition
    if (typeof gsap !== "undefined") {
        gsap.killTweensOf([cityMapStage, cityVideoStage]);
        const tl = gsap.timeline();
        tl.to(cityMapStage, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                if (cityMapStage) cityMapStage.style.display = "none";
            }
        });

        tl.fromTo(cityVideoStage, 
            { opacity: 0 }, 
            {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                onStart: () => {
                    if (cityVideoStage) {
                        cityVideoStage.style.display = "block";
                        cityVideoStage.style.opacity = "1";
                    }
                    startCityVideo(city);
                }
            },
            "-=0.2"
        );
    } else {
        if (cityMapStage) cityMapStage.style.display = "none";
        if (cityVideoStage) {
            cityVideoStage.style.display = "block";
            cityVideoStage.style.opacity = "1";
        }
        startCityVideo(city);
    }
}

function startCityVideo(city) {
    if (!cityVideo) return;

    const isWalking = (typeof s2SelectedMode !== "undefined" && s2SelectedMode === "walking");
    if (videoModeBadge) {
        videoModeBadge.textContent = isWalking ? "WALKING TOUR" : "DRIVING TOUR";
    }
    if (videoCityTag) {
        videoCityTag.textContent = `${city.name}, ${city.country || ""}`;
    }

    // poster while buffering
    if (city.poster) {
        cityVideo.setAttribute("poster", city.poster);
    } else {
        cityVideo.removeAttribute("poster");
    }

    const videoSrc = city.videoFile || `videos/${(city.name || "").toLowerCase().replace(/\s+/g, "")}.mp4`;

    const currentSrc = cityVideo.getAttribute("src") || "";
    if (currentSrc !== videoSrc) {
        cityVideo.src = videoSrc;
    }

    // Ensure audio & autoplay compatibility attributes
    cityVideo.muted = true;
    cityVideo.defaultMuted = true;
    cityVideo.playsInline = true;
    cityVideo.setAttribute("playsinline", "");
    updateAudioButtonUI(false);

    try {
        cityVideo.currentTime = 0;
    } catch (e) {}

    const playPromise = cityVideo.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            hidePlayOverlay();
            resetControlsTimer();
        }).catch((err) => {
            console.warn("Autoplay blocked by browser policy, showing play overlay:", err);
            showPlayOverlay();
        });
    }
}

function toggleCityVideoAudio() {
    if (!cityVideo) return;
    cityVideo.muted = !cityVideo.muted;
    updateAudioButtonUI(!cityVideo.muted);
}

function updateAudioButtonUI(isUnmuted) {
    if (!cityVideoAudioBtn) return;
    const mutedIcon = cityVideoAudioBtn.querySelector(".audio-muted-icon");
    const unmutedIcon = cityVideoAudioBtn.querySelector(".audio-unmuted-icon");

    cityVideoAudioBtn.classList.toggle("is-unmuted", isUnmuted);
    if (mutedIcon) mutedIcon.style.display = isUnmuted ? "none" : "block";
    if (unmutedIcon) unmutedIcon.style.display = isUnmuted ? "block" : "none";
    if (cityVideoAudioLabel) {
        cityVideoAudioLabel.textContent = isUnmuted ? "MUTE AUDIO" : "UNMUTE AUDIO";
    }
}

if (cityVideoAudioBtn) {
    cityVideoAudioBtn.addEventListener("click", toggleCityVideoAudio);
}

if (cityVideoBigPlay) {
    cityVideoBigPlay.addEventListener("click", () => {
        if (cityVideo) {
            cityVideo.play().then(() => {
                hidePlayOverlay();
                resetControlsTimer();
            }).catch(() => {});
        }
    });
}

if (cityVideo) {
    cityVideo.addEventListener("click", () => {
        if (cityVideo.paused) {
            cityVideo.play().then(() => {
                hidePlayOverlay();
                resetControlsTimer();
            }).catch(() => {});
        } else {
            cityVideo.pause();
            showPlayOverlay();
            if (cityModal) cityModal.classList.remove("controls-hidden");
        }
    });
}

function showPlayOverlay() {
    if (cityVideoPlayOverlay) {
        cityVideoPlayOverlay.style.display = "flex";
        if (typeof gsap !== "undefined") {
            gsap.fromTo(cityVideoPlayOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
    }
}

function hidePlayOverlay() {
    if (cityVideoPlayOverlay) {
        cityVideoPlayOverlay.style.display = "none";
    }
}

let controlsTimeout = null;

function resetControlsTimer() {
    if (!cityModal) return;
    cityModal.classList.remove("controls-hidden");
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (isModalOpen && cityVideo && !cityVideo.paused) {
        controlsTimeout = setTimeout(() => {
            if (isModalOpen && cityVideo && !cityVideo.paused) {
                cityModal.classList.add("controls-hidden");
            }
        }, 3200);
    }
}

if (cityModal) {
    cityModal.addEventListener("mousemove", resetControlsTimer);
    cityModal.addEventListener("touchstart", resetControlsTimer, { passive: true });
}

function toggleBrowserFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const target = cityModal || document.documentElement;
        if (target.requestFullscreen) {
            target.requestFullscreen().catch(() => {});
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function updateFullscreenUI() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (cityModalFsBtn) {
        const expandIcon = cityModalFsBtn.querySelector(".fs-expand-icon");
        const compressIcon = cityModalFsBtn.querySelector(".fs-compress-icon");
        const label = document.getElementById("city-modal-fs-label");
        if (expandIcon) expandIcon.style.display = isFs ? "none" : "inline-block";
        if (compressIcon) compressIcon.style.display = isFs ? "inline-block" : "none";
        if (label) label.textContent = isFs ? "EXIT" : "FULLSCREEN";
    }
}

document.addEventListener("fullscreenchange", updateFullscreenUI);
document.addEventListener("webkitfullscreenchange", updateFullscreenUI);

if (cityModalFsBtn) {
    cityModalFsBtn.addEventListener("click", toggleBrowserFullscreen);
}

function restoreModalFocus() {
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus({ preventScroll: true });
    }
    lastFocusedElement = null;
}

function closeCityModal() {
    if (!isModalOpen) return;
    isModalOpen = false;
    isTransitioningToVideo = false;
    currentCityData = null;

    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }

    if (document.fullscreenElement || document.webkitFullscreenElement) {
        try {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } catch (e) {}
    }

    if (mapFlightTimeout) {
        clearTimeout(mapFlightTimeout);
        mapFlightTimeout = null;
    }

    // stop video
    if (cityVideo) {
        cityVideo.pause();
        cityVideo.removeAttribute("src");
        cityVideo.load();
    }
    hidePlayOverlay();

    // drop map
    if (activeMap) {
        try {
            activeMap.remove();
        } catch (e) {}
        activeMap = null;
    }
    if (cityMapContainer) {
        cityMapContainer.innerHTML = "";
    }

    // close animation
    if (typeof gsap !== "undefined") {
        gsap.killTweensOf([cityModal]);
        gsap.to(cityModal, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
                cityModal.classList.remove("is-active", "is-video-active", "controls-hidden");
                cityModal.setAttribute("aria-hidden", "true");
                document.body.classList.remove("city-modal-open");

                if (cityMapStage) {
                    cityMapStage.style.display = "block";
                    cityMapStage.style.opacity = "1";
                }
                if (cityVideoStage) {
                    cityVideoStage.style.display = "none";
                    cityVideoStage.style.opacity = "0";
                }
                hidePlayOverlay();
                restoreModalFocus();
            }
        });
    } else {
        cityModal.classList.remove("is-active", "is-video-active", "controls-hidden");
        cityModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("city-modal-open");
        if (cityMapStage) {
            cityMapStage.style.display = "block";
            cityMapStage.style.opacity = "1";
        }
        if (cityVideoStage) {
            cityVideoStage.style.display = "none";
            cityVideoStage.style.opacity = "0";
        }
        hidePlayOverlay();
        restoreModalFocus();
    }

    // resume ambient audio
    const ambientAudio = document.getElementById("ambient-audio");
    if (ambientAudio && wasAmbientPlaying) {
        ambientAudio.play().catch(() => {});
        wasAmbientPlaying = false;
    }
}

// events
if (cityModalCloseBtn) {
    cityModalCloseBtn.addEventListener("click", closeCityModal);
}

if (cityModalBackdrop) {
    cityModalBackdrop.addEventListener("click", closeCityModal);
}

if (cityModalSkipBtn) {
    cityModalSkipBtn.addEventListener("click", () => {
        if (currentCityData) {
            transitionToVideo(currentCityData);
        }
    });
}

if (fallbackActionBtn) {
    fallbackActionBtn.addEventListener("click", () => {
        if (currentCityData) {
            transitionToVideo(currentCityData);
        }
    });
}

const fallbackSaveBtn = document.getElementById("fallback-save-btn");
const mapboxTokenInput = document.getElementById("mapbox-token-input");
if (fallbackSaveBtn && mapboxTokenInput) {
    fallbackSaveBtn.addEventListener("click", () => {
        const val = mapboxTokenInput.value.trim();
        if (val.startsWith("pk.")) {
            localStorage.setItem("MAPBOX_ACCESS_TOKEN", val);
            window.MAPBOX_ACCESS_TOKEN = val;
            if (cityMapFallback) cityMapFallback.style.display = "none";
            if (currentCityData) {
                initCityMap(currentCityData);
            }
        } else {
            alert("Please enter a valid Mapbox public token starting with 'pk.'");
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (!isModalOpen) return;

    if (e.key === "Escape") {
        closeCityModal();
        return;
    }

    if (e.code === "Space" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (cityVideo) {
            if (cityVideo.paused) {
                cityVideo.play().then(() => {
                    hidePlayOverlay();
                    resetControlsTimer();
                }).catch(() => {});
            } else {
                cityVideo.pause();
                showPlayOverlay();
                if (cityModal) cityModal.classList.remove("controls-hidden");
            }
        }
        return;
    }

    if ((e.key === "m" || e.key === "M") && e.target.tagName !== "INPUT") {
        e.preventDefault();
        toggleCityVideoAudio();
        resetControlsTimer();
        return;
    }

    if ((e.key === "f" || e.key === "F") && e.target.tagName !== "INPUT") {
        e.preventDefault();
        toggleBrowserFullscreen();
        resetControlsTimer();
        return;
    }

    // focus trap
    if (e.key === "Tab" && cityModalDialog) {
        const focusable = Array.from(
            cityModalDialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        ).filter((element) => !element.disabled && element.offsetParent !== null);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// city cards
const s3CityCards = document.querySelectorAll(".s3-city-card");

s3CityCards.forEach((card) => {
    card.addEventListener("click", (e) => {
        e.preventDefault();

        s3CityCards.forEach((item) => {
            item.classList.remove("s3-city-selected");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("s3-city-selected");
        card.setAttribute("aria-pressed", "true");

        const rawCity = card.getAttribute("data-city") || "";
        const cityKey = rawCity.toLowerCase().replace(/\s+/g, "");

        openCityModal(cityKey);
    });
});

// open a city from ?openCity=paris
const searchParams = new URLSearchParams(window.location.search);
const queryCity = searchParams.get("openCity");
if (queryCity && cityData[queryCity.toLowerCase()]) {
    const triggerAutoOpen = () => {
        setTimeout(() => {
            openCityModal(queryCity.toLowerCase());
        }, 100);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        triggerAutoOpen();
    } else {
        window.addEventListener("DOMContentLoaded", triggerAutoOpen);
        window.addEventListener("load", triggerAutoOpen);
    }
}

function updateLocalClock() {
    const clocks = document.querySelectorAll("#s2-local-clock, #s3-local-clock, #local-clock");
    if (!clocks.length) return;

    const time = new Intl.DateTimeFormat("en-GB", {
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

function setupSoundControls() {
    const controls = document.querySelectorAll(".s2-sound-control");
    const ambientAudio = document.getElementById("ambient-audio");
    if (!controls.length) return;

    if (ambientAudio) {
        ambientAudio.volume = 0.25;
    }

    const setSoundState = (isActive) => {
        controls.forEach((control) => {
            control.classList.toggle("s2-sound-active", isActive);
            control.setAttribute("aria-pressed", String(isActive));

            const label = control.querySelector(".s2-sound-label");
            if (label) {
                label.textContent = isActive ? "AMBIENT SOUND ON" : "AMBIENT SOUND OFF";
            }
        });

        if (ambientAudio) {
            if (isActive) {
                const playPromise = ambientAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                    });
                }
            } else {
                ambientAudio.pause();
            }
        }
    };

    controls.forEach((control) => {
        control.addEventListener("click", () => {
            const currentlyActive = control.classList.contains("s2-sound-active");
            setSoundState(!currentlyActive);
        });
    });
}

setupSoundControls();
