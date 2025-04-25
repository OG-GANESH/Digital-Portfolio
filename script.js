document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const header = document.getElementById('main-header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenuLinks = mobileMenu?.querySelectorAll("a") ?? []; // Use nullish coalescing
    const desktopNavLinks = document.querySelectorAll('header nav ul a.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const typingTarget = document.getElementById('typing-target');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYearSpan = document.getElementById('current-year');
    const modalTriggers = document.querySelectorAll('.modal-trigger'); // Select modal buttons
    const modals = document.querySelectorAll('.modal'); // Select all modal containers
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn'); // Select all modal close buttons

    // --- Initial Setup ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    mobileMenu?.classList.add('menu-hidden'); // Ensure hidden initially
    modals.forEach(modal => modal.classList.add('modal-hidden')); // Hide modals initially

    // --- Header Scroll Effect ---
    const handleHeaderScroll = () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // --- Mobile Menu Toggle ---
    const toggleMobileMenu = () => {
        if (!mobileMenu) return;
        const isHidden = mobileMenu.classList.contains('menu-hidden');
        if (isHidden) {
            mobileMenu.classList.remove('menu-hidden');
            mobileMenu.classList.add('menu-visible');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        } else {
            mobileMenu.classList.add('menu-hidden');
            mobileMenu.classList.remove('menu-visible');
            document.body.style.overflow = ''; // Restore body scroll
        }
    };

    hamburgerBtn?.addEventListener('click', toggleMobileMenu);
    closeMenuBtn?.addEventListener('click', toggleMobileMenu);
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu?.classList.contains('menu-visible')) {
                toggleMobileMenu();
            }
        });
    });
    mobileMenu?.addEventListener('click', (event) => {
        if (event.target === mobileMenu && mobileMenu.classList.contains('menu-visible')) {
            toggleMobileMenu();
        }
    });

    // --- Smooth Scrolling (using JS for reliability) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerOffset = header?.offsetHeight || 60;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                } else {
                    console.warn(`Smooth scroll target not found for href: ${href}`);
                }
            }
        });
    });

    // --- Active Navigation Link Highlighting ---
    const updateActiveNavLink = () => {
        let currentSectionId = 'home'; // Default to home
        const headerHeight = header?.offsetHeight || 60;
        const scrollThreshold = window.scrollY + headerHeight + 50; // Point to check against section top

        sections.forEach(section => {
            if (scrollThreshold >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

         // Adjust for very bottom of page if necessary
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) currentSectionId = lastSection.id;
        }

        desktopNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
        });
    };
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // --- JS Typing Animation (Single Line) ---
    const textToType = "Electronics Engineer | Web Developer | Cyber Security Enthusiast"; // Target string
    let charIndex = 0;

    function typeSingleLine() {
        if (!typingTarget) return; // Exit if target not found

        if (charIndex < textToType.length) {
            typingTarget.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeSingleLine, 70); // Adjust typing speed (milliseconds)
        } else {
            // Typing finished, cursor continues blinking via CSS
        }
    }

    // Start the typing effect after a delay
    if (typingTarget) {
         // Clear any initial content
        typingTarget.textContent = '';
        setTimeout(typeSingleLine, 1500); // Initial delay before starting
    }


    // --- Modal Handling ---
    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
         // Optional: Focus management for accessibility
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        firstFocusable?.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.add('modal-hidden');
        modal.classList.remove('modal-visible');
        document.body.style.overflow = ''; // Restore background scrolling
        // Optional: Return focus to the trigger button
        // const trigger = document.querySelector(`[data-modal-target="#${modal.id}"]`);
        // trigger?.focus();
    };

    // Event listeners for modal triggers
    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            openModal(modal);
        });
    });

    // Event listeners for close buttons
    modalCloseBtns.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal'); // Find the parent modal
            closeModal(modal);
        });
    });

    // Event listener for clicking outside the modal content (on the overlay)
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Check if the click is directly on the overlay
                closeModal(modal);
            }
        });
    });

    // Event listener for the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.modal-visible');
            if (visibleModal) {
                closeModal(visibleModal);
            }
        }
    });


    // --- Intersection Observer for Scroll Animations & Skills ---
    if ('IntersectionObserver' in window) {
        // Observer for general entrance animations
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });

        // Observer specifically for triggering skill bar animations
        const skillSectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const barsToAnimate = entry.target.querySelectorAll('.skill-bar-fill');
                    barsToAnimate.forEach(bar => {
                        const level = bar.getAttribute('data-skill-level') || '0';
                         // Add a small delay to ensure the bar element is rendered if needed
                         // requestAnimationFrame(() => {
                           bar.style.width = level + '%';
                         // });
                    });
                    observer.unobserve(entry.target); // Stop observing after triggering
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of skills section is visible

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillSectionObserver.observe(skillsSection);
        }

    } else {
        // Fallback for older browsers
        console.warn("Intersection Observer not supported. Animations disabled.");
        animatedElements.forEach(el => el.classList.add('is-visible'));
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-skill-level') || '0';
            bar.style.width = level + '%';
        });
    }


    // --- Contact Form Submission ---
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const endpoint = form.action;

            if (!endpoint) {
                console.error("Form action endpoint is missing!");
                formStatus.textContent = 'Form configuration error.';
                formStatus.className = 'text-sm mt-3 text-center h-4 text-red-600';
                return;
            }

            formStatus.textContent = 'Sending...';
            formStatus.className = 'text-sm mt-3 text-center h-4 text-gray-600';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST', body: formData, headers: {'Accept': 'application/json'}
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'text-sm mt-3 text-center h-4 text-green-600';
                    form.reset();
                } else {
                    const data = await response.json();
                    formStatus.textContent = data.errors?.map(e => e.message).join(", ") || 'Oops! Submission failed.';
                    formStatus.className = 'text-sm mt-3 text-center h-4 text-red-600';
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formStatus.textContent = 'Network error. Please try again.';
                formStatus.className = 'text-sm mt-3 text-center h-4 text-red-600';
            }

            setTimeout(() => { formStatus.textContent = ''; }, 7000);
        });
    } else {
        if (!contactForm) console.warn("Contact form element not found.");
        if (!formStatus) console.warn("Form status element not found.");
    }

}); // End DOMContentLoaded