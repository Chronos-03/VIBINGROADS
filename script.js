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

document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    }
});

gsap.registerPlugin(ScrollTrigger);

gsap.to(".hero", {
    scale: 1.35,     
    opacity: 0.15,
    filter: "blur(2px)",
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2    
    }
});
gsap.to(".hero", {
    backgroundPosition: "50% 40%",
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});
const scrollOneTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-one",
        start: "top 75%",
        end: "top 30%",
        scrub: 1
    }
});

scrollOneTL.to(".scroll-one .scroll-header", {
    opacity: 1,
    y: 0,
    duration: 1
}, 0);

scrollOneTL.to(".scroll-one .story-nav", {
    opacity: 1,
    x: 0,
    duration: 1.1
}, 0.15);

scrollOneTL.to(".scroll-one .story-copy", {
    opacity: 1,
    scale: 1,
    duration: 1.2
}, 0.25);

scrollOneTL.to(".scroll-one .detail-card", {
    opacity: 1,
    x: 0,
    duration: 1.1
}, 0.35);

scrollOneTL.to(".scroll-one .scroll-footer", {
    opacity: 1,
    y: 0,
    duration: 1
}, 0.5);
const exploreBtn = document.getElementById("explore-btn");
if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.to(window, {
            duration: 1.4,
            scrollTo: { y: "#scroll-one", offsetY: 0 },
            ease: "power2.inOut"
        });
    });
}