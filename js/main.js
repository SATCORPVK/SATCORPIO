/* ------- HOVER TO GUEST MODE (optional) ------- */
screen.orientation.lock('portrait-primary');

/* ------- HERO SLIDER ------- */
const slides = document.querySelectorAll('.slide');
let active = 0;
function cycle(){
    slides[active].classList.remove('active');
    active = (active+1) % slides.length;
    slides[active].classList.add('active');
}
setInterval(cycle, 7000); // 7 seconds per slide

/* ------- MOBILE MENU ------- */
const nav = document.querySelector('.primary-nav');
const menuLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

menuLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target.scrollIntoView({behavior:'smooth'});
    });
});

/* ------- Optional: GSAP Fade‑In on Scroll ------- */
import { gsap } from "./vendor/gsap/index.js";
import { ScrollTrigger } from "./vendor/gsap/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.card').forEach(element=>{
    gsap.from(element,{opacity:0, y:50, duration:.8, scrollTrigger:{trigger:element, start:"top 80%"}})
});

