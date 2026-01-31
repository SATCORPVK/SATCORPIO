// Set initial layout mode dynamically if needed
document.addEventListener('DOMContentLoaded', () => {
  const layout = document.querySelector('.layout');

  // Example: Switch layout mode (can be extended with URL param or UI toggle)
  function switchLayout(mode) {
    layout.className = 'layout layout-' + mode;
  }

  // Optionally expose globally for dev/test/demo purposes
  window.HYPRSwitchLayout = switchLayout;

  // Optional scroll reveal effect (subtle fade in on scroll)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = '0.1s';
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.layout > *').forEach(el => {
    observer.observe(el);
  });
});
