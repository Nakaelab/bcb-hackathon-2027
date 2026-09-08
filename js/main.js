/**
 * Behavior Change Biology Hackathon 2027
 * Interactive Behaviors & Modular UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScheduleTabs();
  initFaqAccordion();
  initEntryModal();
  initImageLightbox();
  initScrollAnimations();
});

/**
 * 1. Global Navigation & Mobile Menu
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile Menu Toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.classList.toggle('active');
    });

    // Close when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
      });
    });
  }

  // Header background elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 4px 20px -2px rgba(27, 35, 51, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Smooth Active Nav Highlighting
  const sections = document.querySelectorAll('section[id]');
  const highlightCurrentNav = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightCurrentNav, { passive: true });
}


/**
 * 3. Schedule Tab Switching
 */
function initScheduleTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('hidden', 'true');
      });

      // Activate clicked tab
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.removeAttribute('hidden');
      }
    });
  });
}

/**
 * 4. FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Optional: Close other FAQs for cleaner reading
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 5. Entry Modal & Registration Form Handling
 */
function initEntryModal() {
  const modal = document.getElementById('entry-modal');
  const openButtons = document.querySelectorAll('[data-open-modal="entry"]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const entryForm = document.getElementById('entry-form');
  const toast = document.getElementById('toast-msg');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (entryForm) {
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(entryForm);
      const data = Object.fromEntries(formData.entries());

      // Save locally to simulate registration state
      try {
        const registrations = JSON.parse(localStorage.getItem('hackathon2027_entries') || '[]');
        registrations.push({ ...data, date: new Date().toISOString() });
        localStorage.setItem('hackathon2027_entries', JSON.stringify(registrations));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      closeModal();
      entryForm.reset();

      // Show toast confirmation
      showToast('参加事前登録を受け付けました。ご案内メールをお送りします。');
    });
  }

  function showToast(message) {
    if (!toast) return;
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

/**
 * 6. Subtle Scroll Reveal Animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.tech-card, .pillar-card, .guide-box, .step-card, .member-card, .host-box'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }
}

/**
 * 7. Photo Lightbox (Hero & Venue photos)
 */
function initImageLightbox() {
  const triggers = document.querySelectorAll('.hero-image-wrap, .venue-photo-wrap');
  const lightbox = document.getElementById('image-lightbox');
  if (!triggers.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

