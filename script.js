// script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function() {
    this.classList.add('pulse');
    setTimeout(() => this.classList.remove('pulse'), 300);
  });
});
