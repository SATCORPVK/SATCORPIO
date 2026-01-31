// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const featuredLink = document.querySelector('.featured-link');
const linkCards = document.querySelectorAll('.link-card');
const subscribeBtn = document.querySelector('.subscribe-btn');
const emailInput = document.querySelector('.email-input');

// Theme Management
function initializeTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Featured Link Animation
function setupFeaturedLinkAnimation() {
    setInterval(() => {
        featuredLink.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.6)';
        setTimeout(() => {
            featuredLink.style.boxShadow = '0 5px 15px rgba(108, 99, 255, 0.3)';
        }, 1000);
    }, 3000);
}

// Link Card Interactions
function setupLinkCardInteractions() {
    linkCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Open links in new tab
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
}

// Form Submission Handling
function setupNewsletterForm() {
    const form = document.querySelector('.email-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate submission process
        subscribeBtn.textContent = 'Submitting...';
        subscribeBtn.disabled = true;
        
        setTimeout(() => {
            alert(`Thank you for subscribing with ${email}! You'll receive our next update.`);
            emailInput.value = '';
            subscribeBtn.textContent = 'Join';
            subscribeBtn.disabled = false;
        }, 1500);
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupFeaturedLinkAnimation();
    setupLinkCardInteractions();
    setupNewsletterForm();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add subtle entrance animations
    const profileCard = document.querySelector('.profile-card');
    const linksContainer = document.querySelector('.links-container');
    const newsletterSection = document.querySelector('.newsletter-section');
    
    // Simple fade-in animation
    setTimeout(() => {
        profileCard.style.opacity = '1';
        profileCard.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        linksContainer.style.opacity = '1';
        linksContainer.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        newsletterSection.style.opacity = '1';
        newsletterSection.style.transform = 'translateY(0)';
    }, 500);
});

// Prevent context menu on images (optional)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
