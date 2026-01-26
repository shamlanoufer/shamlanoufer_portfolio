// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or use light theme as default
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change menu icon
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== STICKY NAVIGATION =====
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            
            if (body.classList.contains('dark-theme')) {
                navbar.style.background = 'rgba(17, 17, 17, 0.98)';
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            
            if (body.classList.contains('dark-theme')) {
                navbar.style.background = 'rgba(17, 17, 17, 0.95)';
            }
        }
    });
    
    // ===== FORM SUBMISSION (Netlify Forms) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Collect form data
                const formData = new FormData(this);
                
                // Add form-name for Netlify Forms
                formData.append('form-name', 'contact');
                
                // Send to Netlify
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });
                
                if (response.ok) {
                    // Success - show notification
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Something went wrong. Please try again or email me directly at shamlanoufer@gmail.com', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    // ===== SKILLS ANIMATION =====
function animateSkillsOnScroll() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.style.animationPlayState = 'running';
                });
                
                // Add hover effect class
                entry.target.classList.add('animated');
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Initially pause animations
    document.querySelectorAll('.skill-item').forEach(item => {
        item.style.animationPlayState = 'paused';
    });
    
    // Observe each skill category
    skillCategories.forEach(category => {
        observer.observe(category);
    });
}

// Call when DOM is loaded
document.addEventListener('DOMContentLoaded', animateSkillsOnScroll);
    
    // ===== PROJECT IMAGE LAZY LOADING =====
    const projectImages = document.querySelectorAll('.project-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        projectImages.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
            } else {
                img.classList.add('lazy-load');
                imageObserver.observe(img);
            }
        });
    }
    
    // ===== HERO IMAGE LOADING =====
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('load', function() {
            this.style.opacity = '1';
            document.querySelector('.svg-placeholder').style.opacity = '0';
            
            // Fade out placeholder after image loads
            setTimeout(() => {
                document.querySelector('.svg-placeholder').style.display = 'none';
            }, 500);
        });
        
        // If image fails to load, keep the SVG placeholder
        profileImage.addEventListener('error', function() {
            console.log('Hero image failed to load, using SVG placeholder');
            this.style.display = 'none';
        });
        
        // Force load if already cached
        if (profileImage.complete) {
            profileImage.dispatchEvent(new Event('load'));
        }
    }
    
    // ===== SET CURRENT YEAR IN FOOTER =====
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // ===== SCROLL ANIMATIONS =====
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .skill-category, .timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };
    
    // Initialize scroll animations
    setTimeout(animateOnScroll, 500);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .project-card.animate,
        .skill-category.animate,
        .timeline-item.animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .lazy-load {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lazy-load.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add active class styling
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--primary) !important;
            font-weight: 600;
        }
        
        .nav-link.active .nav-number {
            color: var(--accent);
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(navStyle);
    
    // ===== INITIALIZE =====
    console.log('Portfolio website initialized successfully!');
});

// Notification function for form messages
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.querySelector('.contact-form').prepend(notification);
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

