/**
 * Master JavaScript File - Puri City Website
 * Optimized, merged, and performance-enhanced code
 * Compatible with all modern browsers
 */

/* ===================================
   GLOBAL UTILITIES & HELPERS
   =================================== */

// Debounce utility for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get current page identifier
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('heritage')) return 'heritage';
    if (path.includes('culture')) return 'culture';
    if (path.includes('infrastructure')) return 'infrastructure';
    if (path.includes('economy')) return 'economy';
    if (path.includes('about')) return 'about';
    return 'home';
}

/* ===================================
   REUSABLE COMPONENTS
   =================================== */

// Universal Mobile Navigation Handler
class UniversalMobileNavigation {
    constructor() {
        this.initializeElements();
        if (this.navToggle && this.navMenu) {
            this.initializeEventListeners();
            this.setupAccessibility();
        }
    }

    initializeElements() {
        // Try different selector patterns used across pages
        this.navToggle = document.querySelector('.mobile-menu-btn') ||
            document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav') ||
            document.querySelector('.nav-menu');
    }

    initializeEventListeners() {
        // Toggle menu function
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close menu when clicking on nav links
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.navToggle.contains(event.target) &&
                !this.navMenu.contains(event.target) &&
                this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Handle escape key and other keyboard interactions
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
                this.navToggle.focus();
            }
        });

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && this.isMenuOpen()) {
                this.closeMenu();
            }
        }, 250));
    }

    setupAccessibility() {
        // Ensure ARIA attributes are set
        if (!this.navToggle.hasAttribute('aria-expanded')) {
            this.navToggle.setAttribute('aria-expanded', 'false');
        }
        if (!this.navToggle.hasAttribute('aria-controls')) {
            this.navToggle.setAttribute('aria-controls', 'navigation-menu');
        }
        if (!this.navMenu.hasAttribute('id')) {
            this.navMenu.setAttribute('id', 'navigation-menu');
        }
    }

    toggleMenu() {
        const isOpen = this.isMenuOpen();

        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        // Handle different class patterns
        if (this.navMenu.classList.contains('nav')) {
            this.navMenu.classList.add('mobile-menu-open');
        } else {
            this.navMenu.classList.add('active');
        }

        this.navToggle.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');

        // Trap focus within menu
        this.trapFocus();
    }

    closeMenu() {
        // Handle different class patterns
        this.navMenu.classList.remove('mobile-menu-open', 'active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }

    isMenuOpen() {
        return this.navMenu.classList.contains('mobile-menu-open') ||
            this.navMenu.classList.contains('active');
    }

    trapFocus() {
        const focusableElements = this.navMenu.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Universal Scroll Animations Handler
class UniversalScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        this.initializeAnimations();
    }

    initializeAnimations() {
        if (prefersReducedMotion()) return;

        // Universal selectors for different card types
        const animationSelectors = [
            '.site-card', '.culture-card', '.festival-card', '.sector-card',
            '.industry-card', '.infra-category', '.stat-card', '.indicator-item',
            '.art-item', '.aspect-item', '.pillar-item', '.initiative-item'
        ];

        animationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                this.prepareElement(element, index);
                this.observer.observe(element);
            });
        });

        // Handle special sections
        this.initializeSpecialSections();
    }

    prepareElement(element, index) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    initializeSpecialSections() {
        // Future development section
        const futureSection = document.querySelector('.future-development');
        if (futureSection) {
            this.observer.observe(futureSection);
        }

        // Smart city section
        const smartCitySection = document.querySelector('.smart-city');
        if (smartCitySection) {
            this.observer.observe(smartCitySection);
        }
    }
}

// Universal Counter Animation Handler
class UniversalCounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.stats = document.querySelectorAll('.stat-item h4');
        this.hasAnimated = new Set();
        this.initializeObserver();
    }

    initializeObserver() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                    if (entry.target.classList.contains('counter')) {
                        this.animateCounter(entry.target);
                    } else {
                        this.animateStatCounter(entry.target);
                    }
                    this.hasAnimated.add(entry.target);
                }
            });
        }, observerOptions);

        // Observe all counters and stats
        [...this.counters, ...this.stats].forEach(element => {
            observer.observe(element);
        });
    }

    animateCounter(counter) {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';

        this.runAnimation(counter, target, prefix, suffix);
    }

    animateStatCounter(statElement) {
        const finalValue = statElement.textContent;
        const isNumberOnly = /^\d+/.test(finalValue);

        if (isNumberOnly) {
            const target = parseInt(finalValue.replace(/[^\d]/g, ''));
            const suffix = finalValue.replace(/[\d.]/g, '');
            this.runAnimation(statElement, target, '', suffix);
        }
    }

    runAnimation(element, target, prefix = '', suffix = '') {
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (target < 100) {
                    element.textContent = prefix + current.toFixed(1) + suffix;
                } else {
                    element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target < 100) {
                    element.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                    element.textContent = prefix + target.toLocaleString() + suffix;
                }
            }
        };

        updateCounter();
    }
}

// Universal Progress Circle Animation
class UniversalProgressCircles {
    constructor() {
        this.circles = document.querySelectorAll('.progress-circle');
        this.hasAnimated = new Set();
        this.initializeObserver();
    }

    initializeObserver() {
        if (this.circles.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated.has(entry.target)) {
                    this.animateCircle(entry.target);
                    this.hasAnimated.add(entry.target);
                }
            });
        }, observerOptions);

        this.circles.forEach(circle => {
            observer.observe(circle);
        });
    }

    animateCircle(circle) {
        const percentage = parseInt(circle.getAttribute('data-percentage'));
        const progressRing = circle.querySelector('.progress-ring-circle');

        if (!progressRing) return;

        const circumference = 2 * Math.PI * 30;

        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;

        // Determine color based on parent class
        const sectorCard = circle.closest('.sector-card');
        let strokeColor = '#3498db';

        if (sectorCard) {
            if (sectorCard.classList.contains('tourism')) strokeColor = '#ff6b35';
            else if (sectorCard.classList.contains('fishing')) strokeColor = '#3498db';
            else if (sectorCard.classList.contains('handicrafts')) strokeColor = '#9b59b6';
            else if (sectorCard.classList.contains('services')) strokeColor = '#e74c3c';
        }

        progressRing.style.stroke = strokeColor;

        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }, 500);
    }
}

// Universal Form Handler
class UniversalFormHandler {
    constructor() {
        this.contactForm = document.querySelector('.contact-form');
        if (this.contactForm) {
            this.initializeFormHandling();
        }
    }

    initializeFormHandling() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Real-time validation
        ['name', 'email', 'message'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateField(fieldName, field.value);
                });
            }
        });
    }

    handleFormSubmission() {
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');

        let isValid = true;

        // Validate all fields
        if (!this.validateName(nameField.value)) {
            this.showError('name', 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        } else {
            this.clearError('name');
        }

        if (!this.validateEmail(emailField.value)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearError('email');
        }

        if (!this.validateMessage(messageField.value)) {
            this.showError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        } else {
            this.clearError('message');
        }

        if (isValid) {
            this.submitForm();
        }
    }

    validateField(fieldName, value) {
        if (!value) return;

        let isValid = false;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                isValid = this.validateName(value);
                errorMessage = 'Please enter a valid name (at least 2 characters)';
                break;
            case 'email':
                isValid = this.validateEmail(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'message':
                isValid = this.validateMessage(value);
                errorMessage = 'Please enter a message (at least 10 characters)';
                break;
        }

        if (isValid) {
            this.clearError(fieldName);
        } else {
            this.showError(fieldName, errorMessage);
        }
    }

    validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    validateMessage(message) {
        return message.trim().length >= 10;
    }

    showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');

        formGroup.classList.add('error');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', fieldName + '-error');
    }

    clearError(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');

        formGroup.classList.remove('error');
        errorDiv.classList.remove('show');

        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    submitForm() {
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Universal Interactive Elements Handler
class UniversalInteractiveElements {
    constructor() {
        this.initializeButtons();
        this.initializeTags();
        this.initializeClickableItems();
    }

    initializeButtons() {
        const buttons = document.querySelectorAll('.btn-read-more, .btn-gallery');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick(button, e);
            });
        });
    }

    initializeTags() {
        const tags = document.querySelectorAll('.activity-tag');
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.handleTagClick(tag);
            });

            // Keyboard support
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tag.click();
                }
            });
        });
    }

    initializeClickableItems() {
        const items = document.querySelectorAll('.pillar-item, .initiative-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.handleItemClick(item);
            });

            // Keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    handleButtonClick(button, event) {
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Handle specific button types
        if (button.classList.contains('btn-gallery')) {
            const siteCard = button.closest('.site-card');
            if (siteCard) {
                const siteId = siteCard.getAttribute('data-site');
                // Gallery functionality handled by Heritage page specific code
                console.log('Gallery button clicked for:', siteId);
            }
        }
    }

    handleTagClick(tag) {
        console.log('Activity tag clicked:', tag.textContent);

        tag.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tag.style.transform = '';
        }, 150);
    }

    handleItemClick(item) {
        const title = item.querySelector('h4') || item.querySelector('h3');
        console.log('Interactive item clicked:', title ? title.textContent : 'Unknown');

        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    }
}

// Universal Tooltip Manager
class UniversalTooltipManager {
    constructor() {
        this.tooltip = document.getElementById('tooltip') || this.createTooltip();
        this.initializeTooltips();
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e, element.getAttribute('data-tooltip'));
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            element.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });
        });
    }

    showTooltip(event, text) {
        this.tooltip.textContent = text;
        this.tooltip.style.opacity = '1';
        this.updateTooltipPosition(event);
    }

    hideTooltip() {
        this.tooltip.style.opacity = '0';
    }

    updateTooltipPosition(event) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const x = event.clientX - tooltipRect.width / 2;
        const y = event.clientY - tooltipRect.height - 10;

        this.tooltip.style.left = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10)) + 'px';
        this.tooltip.style.top = Math.max(10, y) + 'px';
    }
}

/* ===================================
   UNIVERSAL FUNCTIONALITY
   =================================== */

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effect for page headers (performance optimized)
function initializeParallax() {
    if (prefersReducedMotion()) return;

    const updateParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.page-header');
        if (header && scrolled < header.offsetHeight) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, 16);

    window.addEventListener('scroll', updateParallax, { passive: true });
}

// Enhanced keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function (event) {
        // Skip to main content on Tab key press from header
        if (event.key === 'Tab' && document.activeElement === document.querySelector('.logo')) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                event.preventDefault();
                mainContent.focus();
            }
        }
    });
}

// Lazy loading fallback for older browsers
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyVideos = document.querySelectorAll('video[loading="lazy"]');

        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.tagName === 'IMG') {
                        element.src = element.dataset.src || element.src;
                    }
                    if (element.tagName === 'VIDEO') {
                        element.load();
                    }
                    lazyLoadObserver.unobserve(element);
                }
            });
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));
        lazyVideos.forEach(video => lazyLoadObserver.observe(video));
    }
}

// Performance optimization: Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);

    // Preload critical images based on current page
    const currentPage = getCurrentPage();
    const criticalImages = {
        heritage: [
            'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg',
            'https://images.pexels.com/photos/2253897/pexels-photo-2253897.jpeg'
        ],
        culture: ['./Assets/images/pattachitra.jpg']
    };

    if (criticalImages[currentPage]) {
        criticalImages[currentPage].forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
}

// Error handling for media loading
function initializeMediaErrorHandling() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', function () {
            console.warn('Hero video failed to load');
            this.style.display = 'none';
        });
    }

    // Handle image loading errors
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.style.opacity = '0.5';
            this.alt = 'Image failed to load';
        });
    });
}

// Service Worker registration (for future PWA capabilities)
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            // Commented out for now - uncomment when you have a service worker
            // navigator.serviceWorker.register('/sw.js')
            //   .then(function(registration) {
            //     console.log('SW registered: ', registration);
            //   }).catch(function(registrationError) {
            //     console.log('SW registration failed: ', registrationError);
            //   });
        });
    }
}

/* ===================================
   PAGE-SPECIFIC FUNCTIONALITY
   =================================== */

// Home Page Scripts
function initializeHomePage() {
    console.log('Initializing Home page functionality');

    // Home-specific functionality can be added here
    // Currently using universal components
}

// Heritage Page Scripts
function initializeHeritagePage() {
    console.log('Initializing Heritage page functionality');

    // Gallery data for heritage sites
    const galleryData = {
        jagannath: {
            title: "Jagannath Temple Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/jagannath-temple/first-image.webp",
                    caption: "Jagannath Temple - Main entrance with towering spire"
                },
                {
                    src: "./Assets/gallery-image/jagannath-temple/second-image.webp",
                    caption: "Temple architecture showcasing ancient craftsmanship"
                },
                {
                    src: "./Assets/gallery-image/jagannath-temple/third.jpeg",
                    caption: "Sacred courtyard during evening prayers"
                },
                {
                    src: "./Assets/gallery-image/jagannath-temple/fourth.jpg",
                    caption: "Devotees gathering for daily rituals"
                },
                {
                    src: "./Assets/gallery-image/jagannath-temple/fifth.jpg",
                    caption: "Temple complex aerial view"
                }
            ]
        },
        rathyatra: {
            title: "Rath Yatra Festival Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/rathyatra/image1.jpg",
                    caption: "Massive chariots during Rath Yatra procession"
                },
                {
                    src: "./Assets/gallery-image/rathyatra/image2.jpg",
                    caption: "Millions of devotees participating in the festival"
                },
                {
                    src: "./Assets/gallery-image/rathyatra/image3.jpg",
                    caption: "Traditional chariot construction and decoration"
                }
            ]
        },
        gundicha: {
            title: "Gundicha Temple Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/gundicha-temple/image1.jpg",
                    caption: "Gundicha Temple - Garden house of Lord Jagannath"
                },
                {
                    src: "./Assets/gallery-image/gundicha-temple/image2.jpg",
                    caption: "Peaceful temple courtyard with lush gardens"
                },
                {
                    src: "./Assets/gallery-image/gundicha-temple/image3.jpg",
                    caption: "Temple architecture in serene surroundings"
                }
            ]
        },
        beach: {
            title: "Puri Beach & Swargadwar Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/beach/image1.jpg",
                    caption: "Golden sands of Puri Beach at sunrise"
                },
                {
                    src: "./Assets/gallery-image/beach/image2.jpg",
                    caption: "Pilgrims taking holy dips in sacred waters"
                },
                {
                    src: "./Assets/gallery-image/beach/image3.jpg",
                    caption: "Swargadwar - Gateway to heaven"
                },
                {
                    src: "./Assets/gallery-image/beach/image4.jpg",
                    caption: "Beach activities and local fishermen"
                }
            ]
        },
        konark: {
            title: "Konark Sun Temple Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/konark-temple/image1.jpg",
                    caption: "Konark Sun Temple – UNESCO World Heritage Site"
                },
                {
                    src: "./Assets/gallery-image/konark-temple/image2.jpg",
                    caption: "The iconic stone chariot with carved wheels"
                },
                {
                    src: "./Assets/gallery-image/konark-temple/image3.jpg",
                    caption: "Intricate sculptures depicting Kalinga architecture"
                }
            ]
        },
        chilika: {
            title: "Chilika Lake Region Gallery",
            images: [
                {
                    src: "./Assets/gallery-image/chilika/image1.jpg",
                    caption: "Chilika Lake - Asia's largest brackish water lagoon"
                },
                {
                    src: "./Assets/gallery-image/chilika/image2.jpg",
                    caption: "Migratory birds in their natural habitat"
                },
                {
                    src: "./Assets/gallery-image/chilika/image3.jpg",
                    caption: "Dolphin watching boat tours"
                }
            ]
        }
    };

    // Heritage Gallery functionality
    class HeritageGallery {
        constructor() {
            this.currentSite = null;
            this.currentImageIndex = 0;
            this.modal = document.getElementById('galleryModal');

            if (this.modal) {
                this.galleryImage = document.getElementById('gallery-image');
                this.galleryTitle = document.getElementById('gallery-title');
                this.galleryCaption = document.getElementById('gallery-caption');
                this.galleryThumbnails = document.getElementById('gallery-thumbnails');
                this.galleryCurrent = document.getElementById('gallery-current');
                this.galleryTotal = document.getElementById('gallery-total');

                this.initializeEventListeners();
            }
        }

        initializeEventListeners() {
            // Gallery button clicks
            document.querySelectorAll('.btn-gallery').forEach(button => {
                button.addEventListener('click', (e) => {
                    const siteCard = e.target.closest('.site-card');
                    const siteId = siteCard.getAttribute('data-site');
                    this.openGallery(siteId);
                });
            });

            // Modal close events
            const closeBtn = document.querySelector('.gallery-close');
            const overlay = document.querySelector('.gallery-overlay');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeGallery());
            if (overlay) overlay.addEventListener('click', () => this.closeGallery());

            // Navigation buttons
            const prevBtn = document.querySelector('.gallery-nav.prev');
            const nextBtn = document.querySelector('.gallery-nav.next');

            if (prevBtn) prevBtn.addEventListener('click', () => this.previousImage());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextImage());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.modal.classList.contains('active')) {
                    switch (e.key) {
                        case 'Escape':
                            this.closeGallery();
                            break;
                        case 'ArrowLeft':
                            this.previousImage();
                            break;
                        case 'ArrowRight':
                            this.nextImage();
                            break;
                    }
                }
            });
        }

        openGallery(siteId) {
            this.currentSite = siteId;
            this.currentImageIndex = 0;

            const siteData = galleryData[siteId];
            if (!siteData) return;

            this.galleryTitle.textContent = siteData.title;
            this.galleryTotal.textContent = siteData.images.length;
            this.createThumbnails(siteData.images);
            this.showImage(0);

            this.modal.classList.add('active');
            this.modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        closeGallery() {
            this.modal.classList.remove('active');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            this.currentSite = null;
            this.currentImageIndex = 0;
        }

        createThumbnails(images) {
            this.galleryThumbnails.innerHTML = '';

            images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'gallery-thumbnail';
                if (index === 0) thumbnail.classList.add('active');

                thumbnail.innerHTML = `<img src="${image.src}" alt="${image.caption}" loading="lazy">`;

                thumbnail.addEventListener('click', () => {
                    this.showImage(index);
                });

                this.galleryThumbnails.appendChild(thumbnail);
            });
        }

        showImage(index) {
            const siteData = galleryData[this.currentSite];
            if (!siteData || !siteData.images[index]) return;

            this.currentImageIndex = index;
            const image = siteData.images[index];

            this.galleryImage.src = image.src;
            this.galleryImage.alt = image.caption;
            this.galleryCaption.textContent = image.caption;
            this.galleryCurrent.textContent = index + 1;

            document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        }

        previousImage() {
            const siteData = galleryData[this.currentSite];
            if (!siteData) return;

            const newIndex = this.currentImageIndex > 0
                ? this.currentImageIndex - 1
                : siteData.images.length - 1;

            this.showImage(newIndex);
        }

        nextImage() {
            const siteData = galleryData[this.currentSite];
            if (!siteData) return;

            const newIndex = this.currentImageIndex < siteData.images.length - 1
                ? this.currentImageIndex + 1
                : 0;

            this.showImage(newIndex);
        }
    }

    // Initialize Heritage Gallery
    new HeritageGallery();
}

// Culture Page Scripts
function initializeCulturePage() {
    console.log('Initializing Culture page functionality');

    // Culture-specific functionality can be added here
    // Currently using universal components
}

// Infrastructure Page Scripts  
function initializeInfrastructurePage() {
    console.log('Initializing Infrastructure page functionality');

    // Infrastructure-specific functionality can be added here
    // Currently using universal components
}

// Economy Page Scripts
function initializeEconomyPage() {
    console.log('Initializing Economy page functionality');

    // Economy-specific functionality can be added here
    // Currently using universal components
}

// About Page Scripts
function initializeAboutPage() {
    console.log('Initializing About page functionality');

    // About-specific functionality can be added here
    // Currently using universal components
}

/* ===================================
   MAIN INITIALIZATION
   =================================== */

// Main initialization function
function initializeWebsite() {
    // Initialize universal components
    new UniversalMobileNavigation();
    new UniversalScrollAnimations();
    new UniversalCounterAnimation();
    new UniversalProgressCircles();
    new UniversalFormHandler();
    new UniversalInteractiveElements();
    new UniversalTooltipManager();

    // Initialize universal functionality
    initializeSmoothScroll();
    initializeParallax();
    initializeKeyboardNavigation();
    initializeLazyLoading();
    initializeMediaErrorHandling();
    initializeServiceWorker();
    preloadCriticalResources();

    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch (currentPage) {
        case 'heritage':
            initializeHeritagePage();
            break;
        case 'culture':
            initializeCulturePage();
            break;
        case 'infrastructure':
            initializeInfrastructurePage();
            break;
        case 'economy':
            initializeEconomyPage();
            break;
        case 'about':
            initializeAboutPage();
            break;
        default:
            initializeHomePage();
    }

    console.log(`${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} page initialized successfully`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}

// Handle visibility change for performance optimization
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden - pause unnecessary operations
        console.log('Page hidden - optimizing performance');
    } else {
        // Page is visible - resume operations
        console.log('Page visible - resuming operations');
    }
});

// Handle page unload for cleanup
window.addEventListener('beforeunload', function () {
    // Cleanup operations if needed
    console.log('Page unloading - performing cleanup');
});

// Performance monitoring (development only)
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('script-end');
    performance.measure('script-execution', 'script-start', 'script-end');
}