/* ==============================
   EL ESPEJO AFRICANO — JavaScript
   Interactions & Animations
   ============================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        navbar.classList.toggle('menu-open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll reveal ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Hero particles ---
    const particlesContainer = document.getElementById('particles');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (1 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = 0.1 + Math.random() * 0.4;
        particlesContainer.appendChild(particle);
    }

    // --- Smooth scroll for anchor links ---
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

    // --- Active nav link highlight ---
    const sections = document.querySelectorAll('.section, .hero');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // --- Parallax effect on hero mirror ---
    const heroMirror = document.querySelector('.hero-mirror');
    if (heroMirror) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroMirror.style.transform = `translateY(${scrolled * 0.3}px) rotate(${scrolled * 0.02}deg)`;
            }
        }, { passive: true });
    }

    // --- Counter animation for awards section ---
    const premioCards = document.querySelectorAll('.premio-card');
    const premioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.3 });

    premioCards.forEach(card => premioObserver.observe(card));

    // --- Gallery Slider ---
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderItems = document.querySelectorAll('.slider-item');
    const thumbItems = document.querySelectorAll('.thumb-item');
    const sliderPrev = document.getElementById('sliderPrev');
    const sliderNext = document.getElementById('sliderNext');
    let sliderIndex = 0;

    function updateSlider(index) {
        if (!sliderTrack) return;

        sliderIndex = index;
        const offset = -sliderIndex * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;

        // Update active classes in slider
        sliderItems.forEach((item, i) => {
            if (i === sliderIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update active classes in thumbnails
        thumbItems.forEach((thumb, i) => {
            if (i === sliderIndex) {
                thumb.classList.add('active');
                // Scroll thumbnail into view if needed
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    if (sliderTrack && sliderItems.length > 0) {
        // Initialize
        updateSlider(0);

        if (sliderPrev) {
            sliderPrev.addEventListener('click', () => {
                const nextIndex = (sliderIndex - 1 + sliderItems.length) % sliderItems.length;
                updateSlider(nextIndex);
            });
        }

        if (sliderNext) {
            sliderNext.addEventListener('click', () => {
                const nextIndex = (sliderIndex + 1) % sliderItems.length;
                updateSlider(nextIndex);
            });
        }

        thumbItems.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                updateSlider(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only if gallery is in viewport? For now, always if keys are pressed
            const gallerySection = document.getElementById('galeria');
            const rect = gallerySection.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInViewport) {
                if (e.key === 'ArrowLeft') sliderPrev.click();
                if (e.key === 'ArrowRight') sliderNext.click();
            }
        });

        // Touch support (simple)
        let touchStartX = 0;
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                sliderNext.click();
            } else if (touchEndX - touchStartX > 50) {
                sliderPrev.click();
            }
        }, { passive: true });
    }

});
