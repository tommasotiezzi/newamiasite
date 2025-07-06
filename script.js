// HAMBURGER MENU
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// NAVBAR LIQUID GLASS EFFECT - SIMPLIFIED
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    let isScrolled = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50 && !isScrolled) {
            header.classList.add('scrolled');
            isScrolled = true;
        } else if (scrollY <= 50 && isScrolled) {
            header.classList.remove('scrolled');
            isScrolled = false;
        }
    }

    // Simple throttle - much lighter than RAF
    let timeout;
    function handleScroll() {
        if (!timeout) {
            timeout = setTimeout(function() {
                updateHeader();
                timeout = null;
            }, 16); // ~60fps
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    updateHeader();
});

// TIMELINE CAROUSEL - BACK TO ORIGINAL
document.addEventListener('DOMContentLoaded', function() {
    
    // SIMPLE VARIABLES
    let currentIndex = 0;
    const items = document.querySelectorAll('.timeline-item');
    const totalItems = items.length;
    const progressBar = document.querySelector('.timeline-progress');
    const indicators = document.querySelector('.timeline-indicators');
    
    console.log('Found', totalItems, 'timeline items');
    
    // CREATE DOTS
    function createDots() {
        if (!indicators) return;
        
        indicators.innerHTML = '';
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'timeline-indicator';
            dot.onclick = () => goTo(i);
            indicators.appendChild(dot);
        }
    }
    
    // UPDATE DISPLAY - SIMPLE!
    function updateDisplay() {
        console.log('Showing item', currentIndex + 1, 'of', totalItems);
        
        // Hide all items
        items.forEach(item => item.classList.remove('active'));
        
        // Show current item
        if (items[currentIndex]) {
            items[currentIndex].classList.add('active');
        }
        
        // Update progress
        if (progressBar) {
            const progress = (currentIndex / (totalItems - 1)) * 100;
            progressBar.style.width = progress + '%';
        }
        
        // Update dots
        document.querySelectorAll('.timeline-indicator').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update buttons
        const prevBtn = document.querySelector('.timeline-nav.prev');
        const nextBtn = document.querySelector('.timeline-nav.next');
        
        if (prevBtn) {
            prevBtn.disabled = (currentIndex === 0);
        }
        
        if (nextBtn) {
            nextBtn.disabled = (currentIndex === totalItems - 1);
        }
    }
    
    // NAVIGATION FUNCTIONS
    function next() {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateDisplay();
        }
    }
    
    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateDisplay();
        }
    }
    
    function goTo(index) {
        if (index >= 0 && index < totalItems) {
            currentIndex = index;
            updateDisplay();
        }
    }
    
    // BUTTON EVENTS
    const nextButton = document.querySelector('.timeline-nav.next');
    const prevButton = document.querySelector('.timeline-nav.prev');
    
    if (nextButton) {
        nextButton.onclick = next;
    }
    
    if (prevButton) {
        prevButton.onclick = prev;
    }
    
    // KEYBOARD NAVIGATION
    document.addEventListener('keydown', function(e) {
        // Only trigger if timeline is visible
        const timelineContainer = document.querySelector('.timeline-carousel-container');
        if (!timelineContainer) return;
        
        const rect = timelineContainer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                next();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            }
        }
    });
    
    // TOUCH SWIPE SUPPORT
    let startX = 0;
    let startY = 0;
    const container = document.querySelector('.timeline-carousel-container');
    
    if (container) {
        container.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        container.addEventListener('touchend', function(e) {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more prominent than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    next(); // Swipe left = next
                } else {
                    prev(); // Swipe right = previous
                }
            }
        }, { passive: true });
    }
    
    // INITIALIZE EVERYTHING
    if (totalItems > 0) {
        createDots();
        updateDisplay();
    }
    
    // GLOBAL FUNCTIONS FOR HTML ONCLICK ATTRIBUTES
    window.nextSlide = next;
    window.previousSlide = prev;
    window.goToSlide = goTo;
});

// BOOTCAMP INFINITE CAROUSEL - SIMPLIFIED
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.infinite-carousel');
    const wrapper = document.querySelector('.infinite-carousel-wrapper');
    
    if (!carousel || !wrapper) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    
    // PAUSE/RESUME ANIMATION
    function pauseAnimation() {
        carousel.classList.add('paused');
    }
    
    function resumeAnimation() {
        carousel.classList.remove('paused');
    }
    
    // MOUSE EVENTS (DESKTOP) - BACK TO ORIGINAL
    carousel.addEventListener('mousedown', function(e) {
        isDown = true;
        isDragging = false;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        pauseAnimation();
    });
    
    carousel.addEventListener('mouseleave', function() {
        isDown = false;
        carousel.style.cursor = 'grab';
        resumeAnimation();
    });
    
    carousel.addEventListener('mouseup', function() {
        isDown = false;
        carousel.style.cursor = 'grab';
        resumeAnimation();
        
        // Small delay to distinguish between click and drag
        setTimeout(() => {
            isDragging = false;
        }, 100);
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiply for faster scroll
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // TOUCH EVENTS (MOBILE)
    let touchStartX = 0;
    let touchStartTime = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        startX = touchStartX;
        scrollLeft = carousel.scrollLeft;
        pauseAnimation();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        
        const touchX = e.touches[0].clientX;
        const walk = (touchStartX - touchX) * 1.2; // Multiply for faster scroll
        carousel.scrollLeft = scrollLeft + walk;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        
        // If it's a quick swipe, add momentum
        if (touchDuration < 300) {
            const touchEndX = e.changedTouches[0].clientX;
            const distance = touchStartX - touchEndX;
            const velocity = distance / touchDuration;
            
            // Add momentum scrolling
            const momentum = velocity * 50;
            carousel.scrollLeft += momentum;
        }
        
        touchStartX = 0;
        resumeAnimation();
    }, { passive: true });
    
    // PREVENT CLICK EVENTS DURING DRAG
    carousel.addEventListener('click', function(e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    // INFINITE SCROLL LOGIC - SIMPLIFIED
    function handleInfiniteScroll() {
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;
        const scrollLeft = carousel.scrollLeft;
        
        // Reset position when reaching end (seamless loop)
        if (scrollLeft >= scrollWidth - clientWidth - 50) {
            carousel.scrollLeft = 0;
        }
        
        // Reset position when reaching beginning (reverse scroll)
        if (scrollLeft <= 0) {
            carousel.scrollLeft = scrollWidth - clientWidth - 50;
        }
    }
    
    // Simple scroll event
    carousel.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    
    // PAUSE ON HOVER (DESKTOP)
    carousel.addEventListener('mouseenter', pauseAnimation);
    carousel.addEventListener('mouseleave', resumeAnimation);
    
    // KEYBOARD NAVIGATION
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            carousel.scrollLeft -= 320;
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            carousel.scrollLeft += 320;
        }
    });
    
    // Make carousel focusable for keyboard navigation
    carousel.setAttribute('tabindex', '0');
    
    // INTERSECTION OBSERVER - PAUSE WHEN NOT VISIBLE
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resumeAnimation();
            } else {
                pauseAnimation();
            }
        });
    }, {
        threshold: 0.1
    });
    
    observer.observe(carousel);
    
    console.log('Bootcamp carousel initialized');
});

// SCROLL ARROW ANIMATION + CLICK FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const scrollArrow = document.querySelector('.scroll-content svg');
    const scrollContent = document.querySelector('.scroll-content');
    
    if (scrollArrow && scrollContent) {
        // Smooth bounce animation: big jump -> medium bounce -> tiny bounce
        function animateArrow() {
            // First big jump
            scrollArrow.style.transform = 'translateY(-12px)';
            
            setTimeout(() => {
                // Back to ground
                scrollArrow.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    // Medium bounce
                    scrollArrow.style.transform = 'translateY(-6px)';
                    
                    setTimeout(() => {
                        // Back to ground
                        scrollArrow.style.transform = 'translateY(0)';
                        
                        setTimeout(() => {
                            // Tiny final bounce (barely visible)
                            scrollArrow.style.transform = 'translateY(-2px)';
                            
                            setTimeout(() => {
                                // Final rest
                                scrollArrow.style.transform = 'translateY(0)';
                            }, 150);
                        }, 100);
                    }, 200);
                }, 100);
            }, 300);
        }
        
        // Smooth easing for natural bounce
        scrollArrow.style.transition = 'transform 0.25s ease-out';
        
        // Start animation loop every 3 seconds
        let animationInterval = setInterval(animateArrow, 3000);
        
        // Pause on hover
        scrollContent.addEventListener('mouseenter', () => {
            clearInterval(animationInterval);
            scrollArrow.style.transform = 'translateY(0)';
        });
        
        scrollContent.addEventListener('mouseleave', () => {
            animationInterval = setInterval(animateArrow, 3000);
        });
        
        // CLICK FUNCTIONALITY - Scroll to Values Section
        scrollContent.addEventListener('click', function() {
            const valuesSection = document.querySelector('.values');
            
            if (valuesSection) {
                const headerHeight = document.querySelector('header').offsetHeight || 80;
                const targetPosition = valuesSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Add cursor pointer to show it's clickable
        scrollContent.style.cursor = 'pointer';
    }
});