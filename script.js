/**
 * Devik - Personal Portfolio JavaScript
 * Pure Vanilla JS - zero dependencies, offline compatible, works with file://
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Current Year in Footer
     ------------------------------------------------------------------------ */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     2. Theme Toggle (Dark / Light)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Safe localStorage helper for file:// environments
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('devik_portfolio_theme');
    } catch {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem('devik_portfolio_theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  // Determine initial theme
  const savedTheme = getStoredTheme();
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else {
    // Respect OS preference if no manual theme stored
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlRoot.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      setStoredTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Menu Toggle
     ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    const isActive = navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Dynamic Typewriter Effect in Hero
     ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'scalable web apps',
    'clean UI architectures',
    'modern cloud tools',
    'responsive interfaces',
    'delightful user experiences'
  ];

  if (typewriterElement) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeWriterLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at full phrase
        isDeleting = true;
        typingSpeed = 1600;
      } else if (isDeleting && charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeWriterLoop, typingSpeed);
    };

    setTimeout(typeWriterLoop, 500);
  }

  /* ------------------------------------------------------------------------
     5. Scroll Spy & Active Navigation Highlighting
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ------------------------------------------------------------------------
     6. Project Filter Tabs
     ------------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active filter state
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     7. Floating Back to Top Button
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Resume Download Button Feedback
     ------------------------------------------------------------------------ */
  const cvBtn = document.getElementById('download-cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📄 Resume downloaded (Sample Profile)');
    });
  }

  /* ------------------------------------------------------------------------
     9. Interactive Contact Form Validation & Submission
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    // Email regex validation
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    const clearError = (inputEl, errorEl) => {
      inputEl.classList.remove('error');
      errorEl.textContent = '';
    };

    const setError = (inputEl, errorEl, msg) => {
      inputEl.classList.add('error');
      errorEl.textContent = msg;
    };

    // Live validation clearance on input
    [
      [nameInput, nameError],
      [emailInput, emailError],
      [subjectInput, subjectError],
      [messageInput, messageError]
    ].forEach(([input, error]) => {
      if (input && error) {
        input.addEventListener('input', () => clearError(input, error));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, nameError, 'Please enter your name.');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        setError(emailInput, emailError, 'Please enter your email address.');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setError(subjectInput, subjectError, 'Please enter a subject.');
        isValid = false;
      } else {
        clearError(subjectInput, subjectError);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setError(messageInput, messageError, 'Please write your message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        setError(messageInput, messageError, 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) return;

      // Simulate sending state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-text">Sending message...</span>
      `;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('🚀 Thank you! Your message has been sent successfully.');
      }, 750);
    });
  }
});

/* --------------------------------------------------------------------------
   10. Global Toast Notification Helper
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Global Demo Preview Trigger
function demoAlert(projectName) {
  showToast(`Previewing ${projectName} (Interactive Showcase)`);
}
