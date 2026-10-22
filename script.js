const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

hamburger.addEventListener("click" , () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click" , () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    });
});

document.addEventListener("mousemove" , (e) =>  {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) /100;
    const hero = document.querySelector('.hero');
    if(hero) {
    hero.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    }
});