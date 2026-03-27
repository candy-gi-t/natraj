/* ========================================
   WellnessCare - JavaScript Interactions
   Mobile Menu, Slider, Form Validation,
   Scroll Animations, and More
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------
    // 1. Loading Animation
    // ----------------------------------------
    const loader = document.getElementById('loader');
    
    // Hide loader after page fully loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1500);
    });
    
    // Fallback: hide loader after max time
    setTimeout(function() {
        loader.classList.add('hidden');
    }, 3000);
    
    // ----------------------------------------
    // 2. Back to Top Button
    // ----------------------------------------
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ----------------------------------------
    // 3. Navbar Scroll Effect
    // ----------------------------------------
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    });
    
    // ----------------------------------------
    // 4. Active Navigation Link
    // ----------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.scrollY;
        const offset = 150; // Offset for navbar height
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Run once on load
    
    // ----------------------------------------
    // 5. Mobile Menu Toggle
    // ----------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ----------------------------------------
    // 6. Smooth Scroll for Anchor Links
    // ----------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ----------------------------------------
    // 7. Scroll Animations (Intersection Observer)
    // ----------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animation for child elements
                const delay = entry.target.dataset.delay || 0;
                setTimeout(function() {
                    entry.target.style.transitionDelay = '0ms';
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(function(el) {
        observer.observe(el);
    });
    
    // ----------------------------------------
    // 8. Testimonial Slider
    // ----------------------------------------
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalSlides = cards.length;
    let autoSlideInterval;
    let isPaused = false;
    
    // Create dots
    cards.forEach(function(_, index) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    // Update slider position
    function updateSlider() {
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        
        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Auto-advance slider
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            if (!isPaused) {
                nextSlide();
            }
        }, 5000);
    }
    
    // Reset auto slide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Event listeners
    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoSlide();
    });
    
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoSlide();
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', function() {
        isPaused = true;
    });
    
    track.addEventListener('mouseleave', function() {
        isPaused = false;
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        }
    });
    
    // Start auto-sliding
    startAutoSlide();
    
    // ----------------------------------------
    // 9. Contact Form Validation
    // ----------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(function(el) {
            el.textContent = '';
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(function(el) {
            el.style.borderColor = '';
        });
        
        // Validate Name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            document.getElementById('nameError').textContent = 'Please enter your name';
            name.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (name.value.trim().length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
            name.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Validate Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            document.getElementById('emailError').textContent = 'Please enter your email';
            email.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            email.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Validate Phone
        const phone = document.getElementById('phone');
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phone.value.trim()) {
            document.getElementById('phoneError').textContent = 'Please enter your phone number';
            phone.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number (min 10 digits)';
            phone.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        // Validate Message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            document.getElementById('messageError').textContent = 'Please enter your message';
            message.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (message.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
            message.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            formSuccess.classList.add('show');
            contactForm.reset();
            
            // Hide success message after 6 seconds
            setTimeout(function() {
                formSuccess.classList.remove('show');
            }, 6000);
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Focus on first error field
            const firstError = contactForm.querySelector('input[style*="border-color"], textarea[style*="border-color"]');
            if (firstError) {
                firstError.focus();
            }
        }
    });
    
    // Real-time validation (remove errors as user types)
    ['name', 'email', 'phone', 'message'].forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                    const errorEl = document.getElementById(fieldId + 'Error');
                    if (errorEl) errorEl.textContent = '';
                }
            });
        }
    });
    
    // ----------------------------------------
    // 10. Newsletter Form
    // ----------------------------------------
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            
            if (input.value.trim()) {
                // Show success feedback
                const btn = this.querySelector('button');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.background = '#28a745';
                
                setTimeout(function() {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    input.value = '';
                }, 2000);
            }
        });
    }
    
    // ----------------------------------------
    // 11. Parallax Effect on Hero
    // ----------------------------------------
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        if (hero) {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                // Subtle parallax on hero background
                hero.style.backgroundPositionY = scrolled * 0.4 + 'px';
            }
        }
    });
    
    // ----------------------------------------
    // 12. Counter Animation (Optional)
    // ----------------------------------------
    // Uncomment if you want animated counters
    
    /*
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }
        
        update();
    }
    */
    
    // ----------------------------------------
    // 13. Escape Key to Close Mobile Menu
    // ----------------------------------------
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ----------------------------------------
    // 14. Performance: Debounce Scroll Events
    // ----------------------------------------
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Apply debounce to heavy scroll handlers if needed
    // const debouncedScrollHandler = debounce(handleScroll, 10);
    
});

// ----------------------------------------
// Helper Functions
// ----------------------------------------

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset
    );
}

/**
 * Format phone number as user types
 */
function formatPhoneNumber(value) {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length < 4) {
        return phoneNumber;
    } else if (phoneNumber.length < 7) {
        return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
    } else {
        return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6, 10);
    }
}

/**
 * Lazy load images when they come into view
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);
